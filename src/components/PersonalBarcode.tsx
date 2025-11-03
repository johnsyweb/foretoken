import { useState, useEffect, useRef } from "react";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import {
  saveWalletData,
  loadWalletData,
  clearWalletData,
} from "../utils/wallet";

export function PersonalBarcode() {
  const [isOpen, setIsOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [parkrunBarcode, setParkrunBarcode] = useState("");
  const [parkrunnerName, setParkrunnerName] = useState("");
  const [iceName, setIceName] = useState("");
  const [icePhone, setIcePhone] = useState("");
  const walletCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = loadWalletData();
    setParkrunBarcode(data.parkrunBarcode || "");
    setParkrunnerName(data.parkrunnerName || "");
    setIceName(data.iceName || "");
    setIcePhone(data.icePhone || "");
  }, []);

  const handleSave = () => {
    saveWalletData({
      parkrunBarcode: parkrunBarcode.trim() || undefined,
      parkrunnerName: parkrunnerName.trim() || undefined,
      iceName: iceName.trim() || undefined,
      icePhone: icePhone.trim() || undefined,
    });
    setIsOpen(false);
    setIsViewing(false);
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

  const handleAddToWallet = async () => {
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
            navigator
              .share({
                title: "parkrun Barcode",
                text: "My parkrun barcode",
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
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parkrun-barcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const data = loadWalletData();
  const hasWalletData =
    data.parkrunBarcode || data.parkrunnerName || data.iceName || data.icePhone;

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
          <div className="personal-barcode-card-header">
            <h2 className="personal-barcode-card-title">parkrun</h2>
            <button
              className="personal-barcode-card-close"
              onClick={() => {
                setIsViewing(false);
                setIsOpen(true);
              }}
              type="button"
              aria-label="Edit personal barcode"
            >
              Edit
            </button>
          </div>

          <div className="personal-barcode-card-canvas" ref={walletCardRef}>
            <div className="personal-barcode-canvas-title">parkrun</div>

            {data.parkrunBarcode && (
              <div className="personal-barcode-canvas-barcode">
                <Barcode
                  value={data.parkrunBarcode}
                  format="CODE128"
                  width={2}
                  height={80}
                  displayValue={false}
                  background="#ffffff"
                  lineColor="#000000"
                />
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
            <button
              className="personal-barcode-button personal-barcode-button-primary"
              onClick={handleAddToWallet}
              type="button"
            >
              Share
            </button>
            <button
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => {
                setIsViewing(false);
                setIsOpen(true);
              }}
              type="button"
            >
              Edit
            </button>
            <button
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => setIsViewing(false)}
              type="button"
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

        <div className="personal-barcode-form">
          <label htmlFor="parkrun-barcode">
            parkrun Barcode Number
            <input
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
              className="personal-barcode-button personal-barcode-button-primary"
              onClick={handleSave}
              type="button"
            >
              Save
            </button>
            <button
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>
            <button
              className="personal-barcode-button personal-barcode-button-secondary"
              onClick={() => {
                setIsOpen(false);
                if (hasWalletData) {
                  setIsViewing(true);
                }
              }}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
