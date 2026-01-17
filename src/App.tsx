import { useState, useEffect, useCallback } from "react";
import { TokenDisplay } from "./components/TokenDisplay";
import { PersonalBarcode } from "./components/PersonalBarcode";
import { AboutBox } from "./components/AboutBox";
import { PrintSheet } from "./components/PrintSheet";
import { isValidPosition } from "./utils/tokenGenerator";
import packageJson from "../package.json";
import "./App.css";

const DEFAULT_POSITION = 1;

function getInitialPosition(): number {
  const params = new URLSearchParams(window.location.search);
  const positionParam = params.get("position");
  if (positionParam) {
    const position = parseInt(positionParam, 10);
    if (isValidPosition(position)) {
      return position;
    }
  }
  return DEFAULT_POSITION;
}

function getInitialIsQRCode(): boolean {
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get("code");
  return codeParam === "qr";
}

function App() {
  const [position, setPosition] = useState(getInitialPosition);
  const [isQRCode, setIsQRCode] = useState(getInitialIsQRCode);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);

  const updateUrl = useCallback(
    (newPosition: number, nextIsQRCode: boolean = isQRCode) => {
      const url = new URL(window.location.href);
      url.searchParams.set("position", String(newPosition));
      url.searchParams.set("code", nextIsQRCode ? "qr" : "1d");
      window.history.replaceState({}, "", url.toString());
    },
    [isQRCode]
  );

  useEffect(() => {
    // Set page size data attribute based on locale for print styling
    const locale = navigator.language || navigator.languages?.[0] || "";
    if (locale.startsWith("en-US")) {
      document.documentElement.setAttribute("data-page-size", "letter");
    } else {
      document.documentElement.setAttribute("data-page-size", "a4");
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPosition((prev) => {
          if (prev > 1) {
            const newPosition = prev - 1;
            updateUrl(newPosition);
            return newPosition;
          }
          return prev;
        });
      } else if (e.key === "ArrowRight") {
        setPosition((prev) => {
          const newPosition = prev + 1;
          updateUrl(newPosition);
          return newPosition;
        });
      }
    };

    const handlePopState = () => {
      const newPosition = getInitialPosition();
      const nextIsQR = getInitialIsQRCode();
      setPosition(newPosition);
      setIsQRCode(nextIsQR);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [updateUrl]);

  const handleNext = () => {
    const newPosition = position + 1;
    setPosition(newPosition);
    updateUrl(newPosition);
  };

  const handlePrevious = () => {
    if (position > 1) {
      const newPosition = position - 1;
      setPosition(newPosition);
      updateUrl(newPosition);
    }
  };

  const handlePositionChange = (newPosition: number) => {
    setPosition(newPosition);
    updateUrl(newPosition);
  };

  const handleCodeTypeChange = (nextIsQRCode: boolean) => {
    setIsQRCode(nextIsQRCode);
    updateUrl(position, nextIsQRCode);
  };

  const handlePrintComplete = (lastPrintedPosition: number) => {
    const nextPosition = lastPrintedPosition + 1;
    setPosition(nextPosition);
    updateUrl(nextPosition);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Foretoken</h1>
            <p>parkrun finish token generator</p>
          </div>
          <div className="header-actions">
            <button
              className="print-button"
              onClick={() => setIsPrintSheetOpen(true)}
              type="button"
              aria-label="Print finish tokens"
            >
              🖨️
            </button>
            <PersonalBarcode
              isQRCode={isQRCode}
              onCodeTypeChange={handleCodeTypeChange}
            />
          </div>
        </div>
      </header>
      <main className="app-main">
        <AboutBox />
        <TokenDisplay
          position={position}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPositionChange={handlePositionChange}
          isQRCode={isQRCode}
          onCodeTypeChange={handleCodeTypeChange}
        />
      </main>
      <PrintSheet
        startPosition={position}
        isOpen={isPrintSheetOpen}
        onClose={() => setIsPrintSheetOpen(false)}
        onPrintComplete={handlePrintComplete}
        isQRCode={isQRCode}
      />
      <footer className="app-footer">
        <p>
          <strong>Foretoken</strong>{" "}
          <a
            href="https://github.com/johnsyweb/foretoken/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            v{packageJson.version}
          </a>{" "}
          by{" "}
          <a
            href="https://www.johnsy.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pete Johns
          </a>{" "}
          (
          <a
            href="https://github.com/johnsyweb"
            target="_blank"
            rel="noopener noreferrer"
          >
            @johnsyweb
          </a>
          )
        </p>
        <p>
          Licensed under MIT. Not officially associated with parkrun. Written by
          parkrun volunteers for parkrun volunteers.
        </p>
      </footer>
    </div>
  );
}

export default App;
