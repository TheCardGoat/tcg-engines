import { useCallback, useLayoutEffect, useState, type RefObject } from "react";

export type FloatingMenuSide = "top" | "bottom";

interface FloatingPoint {
  x: number;
  y: number;
}

interface UseFloatingPointMenuOptions extends FloatingPoint {
  align?: "start" | "center";
  offset?: number;
  padding?: number;
}

interface FloatingMenuPosition {
  left: number;
  top: number;
  side: FloatingMenuSide;
  arrowLeft: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useFloatingPointMenu<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { x, y, align = "start", offset = 8, padding = 8 }: UseFloatingPointMenuOptions,
) {
  const [position, setPosition] = useState<FloatingMenuPosition>({
    left: x,
    top: y + offset,
    side: "bottom",
    arrowLeft: 12,
  });

  const updatePosition = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxLeft = Math.max(padding, viewportWidth - rect.width - padding);
    const desiredLeft = align === "center" ? x - rect.width / 2 : x;
    const left = clamp(desiredLeft, padding, maxLeft);

    const bottomTop = y + offset;
    const topTop = y - rect.height - offset;
    const fitsBelow = bottomTop + rect.height <= viewportHeight - padding;
    const fitsAbove = topTop >= padding;
    const side: FloatingMenuSide = fitsBelow || !fitsAbove ? "bottom" : "top";
    const rawTop = side === "bottom" ? bottomTop : topTop;
    const top = clamp(rawTop, padding, Math.max(padding, viewportHeight - rect.height - padding));
    const arrowLeft = clamp(x - left, 12, Math.max(12, rect.width - 12));

    setPosition({ left, top, side, arrowLeft });
  }, [align, offset, padding, ref, x, y]);

  useLayoutEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  return position;
}
