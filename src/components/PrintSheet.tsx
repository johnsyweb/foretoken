import React, { useRef } from "react";
import Barcode from "react-barcode";
import { createRoot } from "react-dom/client";
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

const generatePrintHTML = (
  tokens: Array<{ position: number; token: string }>
): Promise<string> => {
  // Create a temporary container to render React components
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.visibility = "hidden";
  document.body.appendChild(tempContainer);

  // Render barcodes to get their SVG markup
  const barcodeContainers: Array<{
    position: number;
    token: string;
    container: HTMLDivElement;
    root: ReturnType<typeof createRoot>;
  }> = [];

  tokens.forEach(({ token, position }) => {
    const barcodeContainer = document.createElement("div");
    tempContainer.appendChild(barcodeContainer);
    const barcodeRoot = createRoot(barcodeContainer);
    barcodeRoot.render(
      React.createElement(Barcode, {
        value: token,
        format: "CODE128",
        width: 1.5,
        height: 30,
        displayValue: false,
        background: "#ffffff",
        lineColor: "#000000",
        margin: 0,
      })
    );
    barcodeContainers.push({
      position,
      token,
      container: barcodeContainer,
      root: barcodeRoot,
    });
  });

  // Wait for barcodes to render, then extract SVG markup
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const svgMarkups = barcodeContainers.map(({ container, token }) => {
        const svg = container.querySelector("svg");
        return {
          svgHTML: svg ? svg.outerHTML : "",
          token,
        };
      });

      // Clean up
      barcodeContainers.forEach(({ root }) => {
        root.unmount();
      });
      document.body.removeChild(tempContainer);

      // Generate the HTML document
      const tokensHTML = svgMarkups
        .map(
          ({ svgHTML, token }) => `
        <div class="print-token">
          <div class="print-token-barcode">${svgHTML}</div>
          <div class="print-token-label">${token}</div>
        </div>
      `
        )
        .join("");

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Finish Tokens</title>
  <style>
    @page {
      size: A4;
      margin: 4mm 10mm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: "Atkinson Hyperlegible Mono", "Courier New", Courier, monospace;
      background: white;
    }
    .print-sheet-grid {
      display: grid;
      grid-template-columns: repeat(4, 40mm);
      grid-auto-rows: 20mm;
      gap: 0;
      width: 160mm;
      margin: 0 auto;
      padding: 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .print-token {
      width: 40mm;
      height: 20mm;
      border: 0.5pt solid black;
      padding: 1mm;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
      page-break-inside: avoid;
      break-inside: avoid;
      box-sizing: border-box;
    }
    .print-token-barcode {
      height: 12mm;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .print-token-barcode svg {
      height: 12mm;
      max-width: 100%;
    }
    .print-token-label {
      font-size: 12pt;
      margin-top: 0.25mm;
      color: black;
      text-align: center;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="print-sheet-grid">
    ${tokensHTML}
  </div>
  <script>
    window.onload = function() {
      window.print();
      window.onafterprint = function() {
        window.close();
      };
    };
  </script>
</body>
</html>`;

      resolve(html);
    }, 100);
  });
};

export function PrintSheet({
  startPosition,
  isOpen,
  onClose,
  onPrintComplete,
}: PrintSheetProps) {
  const printWindowRef = useRef<Window | null>(null);

  const handlePrint = async () => {
    const tokensPerPage = getTokensPerPage();
    const tokens: Array<{ position: number; token: string }> = [];
    for (let i = 0; i < tokensPerPage; i++) {
      const position = startPosition + i;
      tokens.push({
        position,
        token: positionToToken(position),
      });
    }

    try {
      const html = await generatePrintHTML(tokens);

      // Open new window and write HTML
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to print");
        return;
      }

      printWindowRef.current = printWindow;
      printWindow.document.write(html);
      printWindow.document.close();

      // Handle print completion
      printWindow.addEventListener("afterprint", () => {
        const lastPosition = startPosition + tokensPerPage - 1;
        onPrintComplete(lastPosition);
        onClose();
        if (printWindow) {
          printWindow.close();
        }
      });

      // Fallback: if window closes without printing
      const checkClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkClosed);
          const lastPosition = startPosition + tokensPerPage - 1;
          onPrintComplete(lastPosition);
          onClose();
        }
      }, 500);
    } catch (error) {
      console.error("Error generating print:", error);
      alert("Error generating print. Please try again.");
    }
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
        <div className="print-sheet-preview">
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
