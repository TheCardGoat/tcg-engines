import { createContext, useContext, useCallback, useRef } from "react";

import {
  readElementRect,
  flipAnimate,
  cancelFlipAnimation,
  type Rect,
  type FlipOptions,
} from "./useFlipAnimation";

export const MotionContext = createContext<{
  enabled: boolean;
  captureFirst: (selector?: string) => void;
  animateToLast: (selector?: string, options?: FlipOptions) => void;
  cancelAnimations: (selector?: string) => void;
}>({
  enabled: true,
  captureFirst: () => {},
  animateToLast: () => {},
  cancelAnimations: () => {},
});

export function useMotion() {
  return useContext(MotionContext);
}

export function useMotionProvider() {
  const previousRectsRef = useRef<Map<string, Rect>>(new Map());

  const captureFirst = useCallback((selector = "[data-entity-id]") => {
    const map = new Map<string, Rect>();
    const elements = document.querySelectorAll<HTMLElement>(selector);
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]!;
      const id = el.getAttribute("data-entity-id");
      if (id) {
        map.set(id, readElementRect(el));
      }
    }
    previousRectsRef.current = map;
  }, []);

  const animateToLast = useCallback((selector = "[data-entity-id]", options?: FlipOptions) => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    // Batch reads first to avoid layout thrashing.
    const lastRects = new Map<string, { el: HTMLElement; rect: Rect }>();
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]!;
      const id = el.getAttribute("data-entity-id");
      if (!id) continue;
      const first = previousRectsRef.current.get(id);
      if (!first) continue;
      lastRects.set(id, { el, rect: readElementRect(el) });
    }
    // Then write animations.
    for (const [entityId, { el, rect: last }] of lastRects) {
      const first = previousRectsRef.current.get(entityId)!;
      flipAnimate(el, first, last, options);
    }
  }, []);

  const cancelAnimations = useCallback((selector = "[data-entity-id]") => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]!;
      cancelFlipAnimation(el);
    }
  }, []);

  return { enabled: true, captureFirst, animateToLast, cancelAnimations };
}
