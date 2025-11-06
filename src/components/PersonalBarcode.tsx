import { useState, useRef, useEffect, useCallback } from "react";
import Barcode from "react-barcode";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import {
  saveWalletData,
  loadWalletData,
  clearWalletData,
} from "../utils/wallet";

function getInitialWalletData() {
  const data = loadWalletData();
  return {
    parkrunBarcode: data.parkrunBarcode || "",
    parkrunnerName: data.parkrunnerName || "",
    iceName: data.iceName || "",
    icePhone: data.icePhone || "",
  };
}

export function PersonalBarcode() {
  const initialData = getInitialWalletData();
  const [isOpen, setIsOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isQRCode, setIsQRCode] = useState(false);
  const [parkrunBarcode, setParkrunBarcode] = useState(
    initialData.parkrunBarcode
  );
  const [parkrunnerName, setParkrunnerName] = useState(
    initialData.parkrunnerName
  );
  const [iceName, setIceName] = useState(initialData.iceName);
  const [icePhone, setIcePhone] = useState(initialData.icePhone);
  const walletCardRef = useRef<HTMLDivElement>(null);
  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);
  const editCloseButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Calculate hasWalletData for keyboard navigation
  const walletData = loadWalletData();
  const hasWalletData =
    walletData.parkrunBarcode ||
    walletData.parkrunnerName ||
    walletData.iceName ||
    walletData.icePhone;

  const downloadImage = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parkrun-barcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleAddToWallet = useCallback(async () => {
    const data = loadWalletData();
    if (!data.parkrunBarcode) {
      alert("Please save your parkrun barcode first");
      return;
    }

    if (!walletCardRef.current) return;

    try {
      const canvas = await html2canvas(walletCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], "parkrun-barcode.png", {
            type: "image/png",
          });
          if (navigator.canShare({ files: [file] })) {
            const detailsLines: Array<string> = [];
            if (data.parkrunnerName)
              detailsLines.push(`${data.parkrunnerName}`);
            if (data.parkrunBarcode)
              detailsLines.push(`${data.parkrunBarcode}`);
            if (data.iceName || data.icePhone) {
              const iceParts: Array<string> = [];
              if (data.iceName) iceParts.push(data.iceName);
              if (data.icePhone) iceParts.push(`(${data.icePhone})`);
              detailsLines.push(`ICE: ${iceParts.join(" ")}`);
            }
            detailsLines.push("");
            detailsLines.push(
              "Shared from Foretoken — https://johnsy.com/foretoken/"
            );
            const shareText = detailsLines.join("\n");
            navigator
              .share({
                title: "Personal barcode",
                text: shareText,
                files: [file],
              })
              .catch(() => {
                downloadImage(blob);
              });
            return;
          }
        }

        downloadImage(blob);
      }, "image/png");
    } catch (error) {
      console.error("Failed to generate barcode card:", error);
      alert("Failed to generate barcode card. Please try again.");
    }
  }, [downloadImage]);

  // Keyboard navigation for viewing modal
  useEffect(() => {
    if (!isViewing || !hasWalletData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsViewing(false);
      } else if (e.key === "Tab") {
        // Allow normal tab navigation
        return;
      } else if (e.key === "Enter" || e.key === " ") {
        // Handle Enter/Space on focused button
        const activeElement = document.activeElement;
        if (activeElement === shareButtonRef.current) {
          e.preventDefault();
          handleAddToWallet();
        } else if (activeElement === editButtonRef.current) {
          e.preventDefault();
          setIsViewing(false);
          setIsOpen(true);
        } else if (activeElement === closeButtonRef.current) {
          e.preventDefault();
          setIsViewing(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus first button when modal opens
    setTimeout(() => {
      shareButtonRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewing, hasWalletData, handleAddToWallet]);

  // Keyboard navigation for edit modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        if (hasWalletData) {
          setIsViewing(true);
        }
      }
      // Form submission on Enter is handled by the form's onSubmit
      // Tab navigation works naturally with form elements
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus first input when modal opens
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, hasWalletData]);

  const handleSave = () => {
    saveWalletData({
      parkrunBarcode: parkrunBarcode.trim() || undefined,
      parkrunnerName: parkrunnerName.trim() || undefined,
      iceName: iceName.trim() || undefined,
      icePhone: icePhone.trim() || undefined,
    });
    setIsOpen(false);
    setIsViewing(true);
  };

  const handleClear = () => {
    clearWalletData();
    setParkrunBarcode("");
    setParkrunnerName("");
    setIceName("");
    setIcePhone("");
    setIsOpen(false);
    setIsViewing(false);
  };

  const data = walletData;

  if (!isOpen && !isViewing) {
    return (
      <button
        className="personal-barcode-toggle"
        onClick={() => (hasWalletData ? setIsViewing(true) : setIsOpen(true))}
        type="button"
        aria-label="Open personal barcode"
      >
        My Personal Barcode
      </button>
    );
  }

  if (isViewing && hasWalletData) {
    return (
      <div className="personal-barcode-modal">
        <div className="personal-barcode-card">
          <div className="personal-barcode-card-canvas" ref={walletCardRef}>
            <div className="personal-barcode-canvas-title">parkrun</div>

            {data.parkrunBarcode && (
              <div className="personal-barcode-canvas-barcode">
                {isQRCode ? (
                  <QRCodeSVG value={data.parkrunBarcode} size={96} level="H" />
                ) : (
                  <Barcode
                    value={data.parkrunBarcode}
                    format="CODE128"
                    width={1.5}
                    height={40}
                    displayValue={false}
                    background="#ffffff"
                    lineColor="#000000"
                  />
                )}
              </div>
            )}

            <div className="personal-barcode-canvas-content">
              {data.parkrunBarcode && (
                <div className="personal-barcode-canvas-line">
                  <span className="personal-barcode-canvas-value personal-barcode-canvas-barcode-id">
                    {data.parkrunBarcode}
                  </span>
                </div>
              )}

              {data.parkrunnerName && (
                <div className="personal-barcode-canvas-line">
                  <span className="personal-barcode-canvas-value">
                    {data.parkrunnerName}
                  </span>
                </div>
              )}

              {(data.iceName || data.icePhone) && (
                <div className="personal-barcode-canvas-line">
                  <span className="personal-barcode-canvas-value">
                    ICE: {data.iceName || ""}
                    {data.iceName && data.icePhone && " "}
                    {data.icePhone && `(${data.icePhone})`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="personal-barcode-card-actions">
            <div
              className="barcode-toggle-container"
              style={{ marginRight: "auto" }}
            >
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
            <button
              ref={shareButtonRef}
              className="personal-barcode-button personal-barcode-button-primary"
              onClick={handleAddToWallet}
              type="button"
              aria-label="Share barcode"
            >
              Share
            </button>
            <button
              ref={editButtonRef}
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => {
                setIsViewing(false);
                setIsOpen(true);
              }}
              type="button"
              aria-label="Edit barcode details"
            >
              Edit
            </button>
            <button
              ref={closeButtonRef}
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => setIsViewing(false)}
              type="button"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-barcode-modal">
      <div className="personal-barcode-content">
        <h2>My Personal Barcode</h2>
        <p>Store your parkrun barcode and ICE details for easy access</p>

        <form
          className="personal-barcode-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label htmlFor="parkrun-barcode">
            parkrun Barcode Number
            <input
              ref={firstInputRef}
              id="parkrun-barcode"
              type="text"
              value={parkrunBarcode}
              onChange={(e) => setParkrunBarcode(e.target.value)}
              placeholder="A00000000"
              aria-label="parkrun barcode number"
            />
          </label>

          <label htmlFor="parkrunner-name">
            Parkrunner Name
            <input
              id="parkrunner-name"
              type="text"
              value={parkrunnerName}
              onChange={(e) => setParkrunnerName(e.target.value)}
              placeholder="Donald FISHER"
              aria-label="parkrunner name"
            />
          </label>

          <label htmlFor="ice-name">
            ICE Contact Name
            <input
              id="ice-name"
              type="text"
              value={iceName}
              onChange={(e) => setIceName(e.target.value)}
              placeholder="Marilyn"
              aria-label="ICE contact name"
            />
          </label>

          <label htmlFor="ice-phone">
            ICE Contact Phone
            <input
              id="ice-phone"
              type="tel"
              value={icePhone}
              onChange={(e) => setIcePhone(e.target.value)}
              placeholder="+61 400 000 000"
              aria-label="ICE contact phone"
            />
          </label>

          <div className="personal-barcode-actions">
            <button
              ref={saveButtonRef}
              className="personal-barcode-button personal-barcode-button-primary"
              type="submit"
              aria-label="Save barcode details"
            >
              Save
            </button>
            <button
              ref={clearButtonRef}
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={handleClear}
              type="button"
              aria-label="Clear all fields"
            >
              Clear
            </button>
            <button
              ref={editCloseButtonRef}
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => {
                setIsOpen(false);
                if (hasWalletData) {
                  setIsViewing(true);
                }
              }}
              type="button"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
