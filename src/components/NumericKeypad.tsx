interface NumericKeypadProps {
  onNumberInput: (digit: string) => void;
  onClear: () => void;
  onEnter: () => void;
}

export function NumericKeypad({
  onNumberInput,
  onClear,
  onEnter,
}: NumericKeypadProps) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="keypad-container">
      <div className="keypad-grid">
        {digits.map((digit) => (
          <button
            key={digit}
            className="keypad-button"
            onClick={() => onNumberInput(digit)}
            type="button"
            aria-label={`Enter digit ${digit}`}
          >
            {digit}
          </button>
        ))}
        <button
          className="keypad-button keypad-button-clear"
          onClick={onClear}
          type="button"
          aria-label="Clear input"
        >
          Clear
        </button>
        <button
          className="keypad-button keypad-button-enter"
          onClick={onEnter}
          type="button"
          aria-label="Enter position"
        >
          Enter
        </button>
      </div>
    </div>
  );
}
