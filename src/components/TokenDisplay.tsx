import { useSwipe } from "../hooks/useSwipe";
import { BarcodeDisplay } from "./Barcode";

interface TokenDisplayProps {
  position: number;
  onNext: () => void;
  onPrevious: () => void;
  onPositionChange: (position: number) => void;
  isQRCode: boolean;
  onCodeTypeChange: (isQRCode: boolean) => void;
}

export function TokenDisplay({
  position,
  onNext,
  onPrevious,
  onPositionChange,
  isQRCode,
  onCodeTypeChange,
}: TokenDisplayProps) {
  const swipeRef = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });

  return (
    <div className="token-display" ref={swipeRef}>
      <BarcodeDisplay
        position={position}
        onPositionChange={onPositionChange}
        onNext={onNext}
        onPrevious={onPrevious}
        canGoNext={true}
        canGoPrevious={position > 1}
        isQRCode={isQRCode}
        onCodeTypeChange={onCodeTypeChange}
      />
      <div className="swipe-hint">
        Tap number to edit • Swipe left for next • Swipe right for previous
      </div>
    </div>
  );
}
