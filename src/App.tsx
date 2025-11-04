import { useState, useEffect } from "react";
import { TokenDisplay } from "./components/TokenDisplay";
import { PersonalBarcode } from "./components/PersonalBarcode";
import { AboutBox } from "./components/AboutBox";
import { isValidPosition } from "./utils/tokenGenerator";
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

  const updateUrl = (newPosition: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("position", String(newPosition));
    window.history.replaceState({}, "", url.toString());
  };

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Foretoken</h1>
            <p>parkrun finish token generator</p>
          </div>
          <PersonalBarcode />
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
      <footer className="app-footer">
        <p>
          <strong>Foretoken</strong> by{" "}
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
