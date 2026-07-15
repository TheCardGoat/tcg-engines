import { useCallback, useRef, type PointerEvent } from "react";

interface HandCardTapHandlers {
  handleHandCardPointerDown: (
    cardId: string | undefined,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
  handleHandCardPointerUp: (
    cardId: string | undefined,
    event: PointerEvent<HTMLDivElement>,
  ) => void;
}

export function useHandCardTap(input: {
  faceDown: boolean;
  selectCard: (cardId: string) => void;
}): HandCardTapHandlers {
  const { faceDown, selectCard } = input;
  const pointerDownRef = useRef<{ cardId: string; x: number; y: number } | null>(null);

  const handleHandCardPointerDown = useCallback(
    (cardId: string | undefined, event: PointerEvent<HTMLDivElement>) => {
      if (!cardId || faceDown || event.button > 0) {
        pointerDownRef.current = null;
        return;
      }
      pointerDownRef.current = { cardId, x: event.clientX, y: event.clientY };
    },
    [faceDown],
  );

  const handleHandCardPointerUp = useCallback(
    (cardId: string | undefined, event: PointerEvent<HTMLDivElement>) => {
      const start = pointerDownRef.current;
      pointerDownRef.current = null;
      if (!cardId || !start || start.cardId !== cardId || faceDown) {
        return;
      }
      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      if (dx > 4 || dy > 4) {
        return;
      }
      selectCard(cardId);
    },
    [faceDown, selectCard],
  );

  return { handleHandCardPointerDown, handleHandCardPointerUp };
}
