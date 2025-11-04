import { useRef, useEffect } from "react";
import Barcode from "react-barcode";
import { positionToToken } from "../utils/tokenGenerator";

interface PrintSheetProps {
  startPosition: number;
  isOpen: boolean;
  onClose: () => void;
  onPrintComplete: (lastPrintedPosition: number) => void;
}

// Calculate tokens per page based on page size
// A4: 210mm × 297mm, Letter: 216mm × 279mm
// After 10mm margins: A4 = 190mm × 277mm, Letter = 196mm × 259mm
// Token size: 40mm × 20mm
// A4: 4 cols × 13 rows = 52 tokens
// Letter: 4 cols × 12 rows = 48 tokens
const TOKENS_PER_PAGE_A4 = 52;
const TOKENS_PER_PAGE_LETTER = 48;

// Try to detect page size preference (default to A4 for Australia, Letter for US)
const getTokensPerPage = (): number => {
  // Check if we're in a US locale (basic detection)
  const locale = navigator.language || navigator.languages?.[0] || "";
  if (locale.startsWith("en-US")) {
    return TOKENS_PER_PAGE_LETTER;
  }
  // Default to A4 for other locales (including Australia)
  return TOKENS_PER_PAGE_A4;
};

export function PrintSheet({
  startPosition,
  isOpen,
  onClose,
  onPrintComplete,
}: PrintSheetProps) {
  const printContentRef = useRef<HTMLDivElement>(null);
  const hasPrintedRef = useRef(false);

  useEffect(() => {
    const handleAfterPrint = () => {
      if (!hasPrintedRef.current && isOpen) {
        hasPrintedRef.current = true;
        const tokensPerPage = getTokensPerPage();
        const lastPosition = startPosition + tokensPerPage - 1;
        onPrintComplete(lastPosition);
        onClose();
      }
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      hasPrintedRef.current = false;
    };
  }, [startPosition, isOpen, onClose, onPrintComplete]);

  const handlePrint = () => {
    hasPrintedRef.current = false;
    window.print();
  };

  if (!isOpen) {
    return null;
  }

  const tokensPerPage = getTokensPerPage();
  const tokens: number[] = [];
  for (let i = 0; i < tokensPerPage; i++) {
    tokens.push(startPosition + i);
  }

  return (
    <div className="print-sheet-modal">
      <div className="print-sheet-modal-content">
        <div className="print-sheet-header">
          <h2>Print Finish Tokens</h2>
          <button
            className="print-sheet-close"
            onClick={onClose}
            type="button"
            aria-label="Close print sheet"
          >
            ×
          </button>
        </div>
        <div className="print-sheet-info">
          <p>
            Ready to print {tokensPerPage} tokens from P
            {String(startPosition).padStart(4, "0")} to P
            {String(startPosition + tokensPerPage - 1).padStart(4, "0")}
          </p>
        </div>
        <div className="print-sheet-preview" ref={printContentRef}>
          <div className="print-sheet-grid">
            {tokens.map((position) => {
              const token = positionToToken(position);
              return (
                <div key={position} className="print-token">
                  <div className="print-token-barcode">
                    <Barcode
                      value={token}
                      format="CODE128"
                      width={1}
                      height={30}
                      displayValue={false}
                      background="#ffffff"
                      lineColor="#000000"
                    />
                  </div>
                  <div className="print-token-label">{token}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="print-sheet-actions">
          <button
            className="print-sheet-button print-sheet-button-primary"
            onClick={handlePrint}
            type="button"
          >
            🖨️ Print
          </button>
          <button
            className="print-sheet-button print-sheet-button-secondary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
