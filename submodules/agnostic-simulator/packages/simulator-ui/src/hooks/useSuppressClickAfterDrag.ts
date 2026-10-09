import { useCallback, useEffect, useRef, type MouseEvent } from "react";

/**
 * Prevent the synthetic click that browsers dispatch after a completed drag.
 *
 * A new pointer gesture always clears stale drag state, so an ordinary click
 * remains available even when the preceding drag did not emit a click.
 */
export function useSuppressClickAfterDrag(isDragging: boolean) {
  const draggedSincePointerDown = useRef(false);

  useEffect(() => {
    if (isDragging) {
      draggedSincePointerDown.current = true;
    }
  }, [isDragging]);

  const resetOnPointerDown = useCallback(() => {
    draggedSincePointerDown.current = false;
  }, []);

  const suppressOnClick = useCallback((event: MouseEvent<HTMLElement>): boolean => {
    if (!draggedSincePointerDown.current) {
      return false;
    }
    draggedSincePointerDown.current = false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  }, []);

  return { resetOnPointerDown, suppressOnClick } as const;
}
