import type React from "react";

interface AboutBoxProps {
  isOpen: boolean;
  onToggle: () => void;
  ariaLabel: string;
  toggleText: string;
  children: React.ReactNode;
}

export function AboutBox({ isOpen, onToggle, ariaLabel, toggleText, children }: AboutBoxProps) {
  return (
    <div className="about-box">
      <button
        className="about-toggle"
        onClick={onToggle}
        type="button"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        <span className="about-toggle-text">{toggleText}</span>
        <span className="about-toggle-icon">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="about-content">{children}</div>}
    </div>
  );
}
