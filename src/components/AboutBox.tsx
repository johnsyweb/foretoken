import { useState } from "react";

export function AboutBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="about-box">
      <button
        className="about-toggle"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide app information" : "Show app information"}
      >
        <span className="about-toggle-text">
          {isOpen ? "Hide" : "What is this?"}
        </span>
        <span className="about-toggle-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="about-content">
          <h2>About Foretoken</h2>
          <p>
            Have you ever been at a parkrun event that has been <em>so</em>{" "}
            popular that the event team has run out of tokens? Folks scramble to
            resort the used tokens so that the barcode scanners can rescan them
            for finishers using the parkrun Virtual Volunteer app. It's all a
            bit stressful.
          </p>
          <p>
            Foretoken solves this by generating finish token barcodes on your
            smartphone. At a popular event that has run out of finish tokens, a
            Finish Token Support volunteer can use this app to display the
            correct generated finish tokens alongside a Barcode Scanner.
          </p>
          <h3>How to use</h3>
          <ul>
            <li>
              <strong>Navigate:</strong> Use the{" "}
              <span className="nav-indicator">&lt;</span> and{" "}
              <span className="nav-indicator">&gt;</span> buttons, swipe
              left/right, or use arrow keys
            </li>
            <li>
              <strong>Enter position:</strong> Tap the number below the barcode
              to edit it directly
            </li>
            <li>
              <strong>Barcode types:</strong> Toggle between 1D barcode and QR
              code formats
            </li>
            <li>
              <strong>Share:</strong> Add <code>?position=308</code> to the URL
              to share a specific position
            </li>
          </ul>
          <p className="about-note">
            <strong>Note:</strong> This app is not officially associated with
            parkrun. It is written by parkrun volunteers for parkrun volunteers.
          </p>
        </div>
      )}
    </div>
  );
}
