import { useState, useEffect } from "react";
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

function App() {
  const [position, setPosition] = useState(getInitialPosition);
  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);

  const updateUrl = (newPosition: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("position", String(newPosition));
    window.history.replaceState({}, "", url.toString());
  };

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
      setPosition(newPosition);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
            <PersonalBarcode />
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
        />
      </main>
      <PrintSheet
        startPosition={position}
        isOpen={isPrintSheetOpen}
        onClose={() => setIsPrintSheetOpen(false)}
        onPrintComplete={handlePrintComplete}
      />
      <footer className="app-footer">
        <p>
          <strong>Foretoken</strong> {" "}
          
          <a
            href="https://github.com/johnsyweb/foretoken/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            v{packageJson.version}
          </a> by{" "}
          <a
            href="https://johnsy.com"
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
