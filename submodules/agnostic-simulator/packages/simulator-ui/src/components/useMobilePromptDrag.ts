import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, RefObject } from "react";

/** Keep manual positioning local to the prompt; never change game state. */
export function useMobilePromptDrag(
  root: RefObject<HTMLElement | null>,
  enabled: boolean,
  placement: "top" | "bottom",
) {
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const renderedOffsetRef = useRef(0);
  useLayoutEffect(() => {
    renderedOffsetRef.current = offset;
  }, [offset]);
  const gesture = useRef<{ pointerId: number; y: number; offset: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const move = useCallback(
    (next: number) => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.visualViewport;
      const top = (viewport?.offsetTop ?? 0) + 8;
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 8;
      const baseline = rect.top - renderedOffsetRef.current;
      const min = top - baseline;
      const max = Math.max(min, bottom - baseline - rect.height);
      offsetRef.current = Math.min(max, Math.max(min, next));
      setOffset(offsetRef.current);
    },
    [root],
  );
  useEffect(() => {
    offsetRef.current = 0;
    setOffset(0);
    gesture.current = null;
    setDragging(false);
  }, [placement, enabled]);
  useEffect(() => {
    if (!enabled) return;
    const fit = () => {
      if (window.matchMedia("(max-width: 640px)").matches && offsetRef.current !== 0)
        move(offsetRef.current);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    if (root.current) observer?.observe(root.current);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, [enabled, root, move]);
  const finish = (event: PointerEvent<HTMLButtonElement>) => {
    if (gesture.current?.pointerId !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return {
    offset,
    dragging,
    handleProps: {
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        if (!enabled || !event.isPrimary || event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        gesture.current = {
          pointerId: event.pointerId,
          y: event.clientY,
          offset: offsetRef.current,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      },
      onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
        const start = gesture.current;
        if (!start || start.pointerId !== event.pointerId) return;
        event.preventDefault();
        event.stopPropagation();
        move(start.offset + event.clientY - start.y);
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture: finish,
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown" && event.key !== "Home") return;
        event.preventDefault();
        event.stopPropagation();
        move(event.key === "Home" ? 0 : offsetRef.current + (event.key === "ArrowUp" ? -32 : 32));
      },
    },
  };
}
