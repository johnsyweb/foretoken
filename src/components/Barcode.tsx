import { useState } from "react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import { positionToToken } from "../utils/tokenGenerator";

interface BarcodeProps {
  position: number;
  onPositionChange: (position: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function BarcodeDisplay({
  position,
  onPositionChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: BarcodeProps) {
  const [isQRCode, setIsQRCode] = useState(false);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const token = positionToToken(position);
  const numericPart = String(position).padStart(4, "0");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (value === "" || (numValue >= 1 && Number.isSafeInteger(numValue))) {
        setEditingValue(value);
      }
    }
  };

  const handleBlur = () => {
    if (editingValue !== null) {
      const numValue = parseInt(editingValue, 10);
      if (editingValue && numValue >= 1 && Number.isSafeInteger(numValue)) {
        onPositionChange(numValue);
      }
      setEditingValue(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditingValue(null);
      e.currentTarget.blur();
    }
  };

  const handleFocus = () => {
    setEditingValue("");
  };

  const displayValue = editingValue !== null ? editingValue : numericPart;

  return (
    <div className="barcode-section">
      <div className="barcode-toggle-container">
        <button
          className={`barcode-toggle ${!isQRCode ? "active" : ""}`}
          onClick={() => setIsQRCode(false)}
          type="button"
          aria-label="Switch to 1D barcode"
        >
          1D Barcode
        </button>
        <button
          className={`barcode-toggle ${isQRCode ? "active" : ""}`}
          onClick={() => setIsQRCode(true)}
          type="button"
          aria-label="Switch to QR code"
        >
          QR Code
        </button>
      </div>
      <div className="barcode-container-wrapper">
        <button
          className="barcode-nav-button barcode-nav-previous"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          type="button"
          aria-label="Previous position"
        >
          &lt;
        </button>
        <div className="barcode-container">
          {isQRCode ? (
            <QRCodeSVG value={token} size={300} level="H" />
          ) : (
            <Barcode
              value={token}
              format="CODE128"
              width={2}
              height={100}
              displayValue={false}
              background="#ffffff"
              lineColor="#000000"
            />
          )}
        </div>
        <button
          className="barcode-nav-button barcode-nav-next"
          onClick={onNext}
          disabled={!canGoNext}
          type="button"
          aria-label="Next position"
        >
          &gt;
        </button>
      </div>
      <div className="token-label">
        <span className="token-prefix">P</span>
        <input
          className="token-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          aria-label="Edit finish token number"
        />
      </div>
    </div>
  );
}
