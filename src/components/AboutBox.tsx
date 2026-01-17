import { useState, useMemo } from "react";
import type React from "react";

type BrowserType = "safari" | "chrome" | "other";

function getBrowserType(): BrowserType {
  if (typeof window === "undefined") return "other";

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isSafari =
    /safari/.test(ua) && !/chrome|chromium|edge/.test(ua) && isIOS;
  const isChrome = /chrome/.test(ua) && !/edge|edg/.test(ua);
  const isEdge = /edge|edg/.test(ua);

  if (isSafari) return "safari";
  if (isChrome || isEdge) return "chrome";
  return "other";
}

const safariInstruction = (
  <>
    Tap the Share button <span aria-label="share icon">📤</span> at the bottom
    of the screen, then scroll down and tap "Add to Home Screen". Give it a name
    and tap "Add".
  </>
);

const chromeInstruction = (
  <>
    Tap the menu button <span aria-label="menu icon">☰</span> (three dots) in
    the top right, then tap "Add to Home screen" or "Install app". Confirm by
    tapping "Add" or "Install".
  </>
);

const homeScreenInstructions: Record<
  BrowserType,
  Array<{ label?: string; text: React.ReactNode }>
> = {
  safari: [{ text: safariInstruction }],
  chrome: [{ text: chromeInstruction }],
  other: [
    { label: "iPhone/iPad (Safari):", text: safariInstruction },
    { label: "Android (Chrome/Edge):", text: chromeInstruction },
  ],
};

export function AboutBox() {
  const [isOpen, setIsOpen] = useState(false);
  const browserType = useMemo(() => getBrowserType(), []);

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
            <strong>Foretoken</strong> is a free parkrun finish token generator
            for when events run out of physical tokens. This mobile-optimized
            tool generates P#### barcodes and QR codes for parkrun events,
            making it easy for volunteers and event organizers to support
            finishers when physical tokens are unavailable.
          </p>
          <p>
            Have you ever been at a parkrun event that has been <em>so</em>{" "}
            popular that the event team has run out of tokens? Folks scramble to
            resort the used tokens so that the barcode scanners can rescan them
            for finishers using the parkrun Virtual Volunteer app. It's all a
            bit stressful.
          </p>
          <p>
            Foretoken solves this by generating finish token barcodes on your
            smartphone. At a popular event that has run out of finish tokens,
            instead of handing out physical tokens at the end of the finish
            funnel, volunteers can write each finisher's position number on the
            back of their hand with a pen. Then, when they get to the barcode
            scanner, a Finish Token Support volunteer can use this app to
            display the correct generated finish tokens alongside a Barcode
            Scanner.
          </p>
          <h3>How to use</h3>
          <ul>
            <li>
              <strong>Navigate:</strong> Use the{" "}
              <span className="nav-indicator">&lt;</span> and{" "}
              <span className="nav-indicator">&gt;</span> buttons, swipe
              left/right, or use arrow keys (← decreases, → increases)
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
              <strong>Print tokens:</strong> Use the 🖨️ button to print a sheet
              of replacement finish tokens (A4 or Letter format, automatically
              detected based on your locale). This feature is ideal for
              preparing tokens in advance when large attendance is anticipated
            </li>
            <li>
              <strong>Personal barcode:</strong> Store your parkrun barcode and
              ICE details for easy sharing as a credit-card sized image
            </li>
            <li>
              <strong>Share:</strong> Add <code>?position=308</code> to the URL
              to share a specific position
            </li>
          </ul>
          <h3>Add to Home Screen</h3>
          <p>
            For quick access during parkrun events, you can add Foretoken to
            your device's home screen:
          </p>
          <ul>
            {homeScreenInstructions[browserType].map((instruction, index) => (
              <li key={index}>
                {instruction.label && <strong>{instruction.label} </strong>}
                {instruction.text}
              </li>
            ))}
          </ul>
          <p>
            Once added, Foretoken will appear on your home screen like a regular
            app for easy access during events.
          </p>
          <p className="about-note">
            <strong>Note:</strong> This app is not officially associated with
            parkrun. It is written by parkrun volunteers for parkrun volunteers.
          </p>
        </div>
      )}
    </div>
  );
}
