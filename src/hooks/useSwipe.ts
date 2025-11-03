import { useEffect, useRef } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe<T extends HTMLElement = HTMLDivElement>({
  onSwipeLeft,
  onSwipeRight,
}: SwipeHandlers) {
  const ref = useRef<T | null>(null);
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const handlersRef = useRef({ onSwipeLeft, onSwipeRight });

  useEffect(() => {
    handlersRef.current = { onSwipeLeft, onSwipeRight };
  }, [onSwipeLeft, onSwipeRight]);

  const minSwipeDistance = 50;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onTouchStart = (e: TouchEvent) => {
      touchEndRef.current = null;
      touchStartRef.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      touchEndRef.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return;

      const distance = touchStartRef.current - touchEndRef.current;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && handlersRef.current.onSwipeLeft) {
        handlersRef.current.onSwipeLeft();
      }

      if (isRightSwipe && handlersRef.current.onSwipeRight) {
        handlersRef.current.onSwipeRight();
      }
    };

    element.addEventListener("touchstart", onTouchStart);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return ref;
}
