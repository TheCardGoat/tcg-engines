import { useCallback, useRef } from "react";

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FlipOptions {
  duration?: number;
  easing?: string;
  onComplete?: () => void;
}

const DEFAULT_DURATION = 300;
const DEFAULT_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Read the current position and size of an element.
 */
export function readElementRect(el: HTMLElement): Rect {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

// WeakMap to track active animations per element for cancellation.
const activeAnimations = new WeakMap<HTMLElement, Animation>();

/**
 * Cancel any running animation on an element.
 */
export function cancelFlipAnimation(el: HTMLElement): void {
  const existing = activeAnimations.get(el);
  if (existing) {
    existing.cancel();
    activeAnimations.delete(el);
  }
}

/**
 * Perform a FLIP animation using WAAPI.
 *
 * Best practices (per CSS-Tricks FLIP + React):
 * - Use WAAPI keyframes directly; no manual style manipulation.
 * - Use fill: "none" because the element naturally sits at the "last" position.
 * - Cancel any existing animation before starting a new one.
 */
export function flipAnimate(
  el: HTMLElement,
  from: Rect,
  to: Rect,
  options: FlipOptions = {},
): Animation | undefined {
  const { duration = DEFAULT_DURATION, easing = DEFAULT_EASING, onComplete } = options;

  const dx = from.left - to.left;
  const dy = from.top - to.top;
  const dw = from.width / to.width;
  const dh = from.height / to.height;

  // Skip animation if the change is negligible.
  if (
    Math.abs(dx) < 0.5 &&
    Math.abs(dy) < 0.5 &&
    Math.abs(dw - 1) < 0.01 &&
    Math.abs(dh - 1) < 0.01
  ) {
    onComplete?.();
    return undefined;
  }

  // Cancel existing animation to avoid glitches.
  cancelFlipAnimation(el);

  const animation = el.animate(
    [{ transform: `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})` }, { transform: "none" }],
    { duration, easing, fill: "none" },
  );

  activeAnimations.set(el, animation);

  animation.onfinish = () => {
    activeAnimations.delete(el);
    onComplete?.();
  };

  animation.oncancel = () => {
    activeAnimations.delete(el);
  };

  return animation;
}

/**
 * Spawn animation for newly appearing elements.
 *
 * Uses fill: "both" so the 0% keyframe is applied immediately,
 * preventing a flash of the fully-visible element.
 */
export function spawnAnimate(
  el: HTMLElement,
  kind: "fade" | "slide-up" | "flip" = "fade",
  options: FlipOptions = {},
): Animation {
  const { duration = DEFAULT_DURATION, easing = DEFAULT_EASING, onComplete } = options;

  const keyframes: Keyframe[] =
    kind === "slide-up"
      ? [
          { opacity: 0, transform: "translateY(16px) scale(0.96)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ]
      : kind === "flip"
        ? [
            { opacity: 0, transform: "rotateY(-90deg)" },
            { opacity: 1, transform: "rotateY(0deg)" },
          ]
        : [
            { opacity: 0, transform: "scale(0.92)" },
            { opacity: 1, transform: "scale(1)" },
          ];

  cancelFlipAnimation(el);

  const animation = el.animate(keyframes, { duration, easing, fill: "both" });

  activeAnimations.set(el, animation);

  animation.onfinish = () => {
    activeAnimations.delete(el);
    onComplete?.();
  };

  animation.oncancel = () => {
    activeAnimations.delete(el);
  };

  return animation;
}

/**
 * React hook for FLIP animations.
 *
 * Follows the two-render lifecycle:
 * 1. Call `captureFirst()` in useEffect to cache positions.
 * 2. Trigger a state change that moves elements.
 * 3. Call `animateToLast()` in useLayoutEffect to run FLIP.
 *
 * This matches the pattern recommended by CSS-Tricks:
 * "useLayoutEffect is a great place to set up a FLIP!"
 */
export function useFlipAnimation() {
  const firstRectsRef = useRef<Map<string, Rect>>(new Map());

  const captureFirst = useCallback((selector = "[data-entity-id]") => {
    const map = new Map<string, Rect>();
    const elements = document.querySelectorAll<HTMLElement>(selector);
    // Batch reads to avoid layout thrashing.
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]!;
      const id = el.getAttribute("data-entity-id");
      if (id) {
        map.set(id, readElementRect(el));
      }
    }
    firstRectsRef.current = map;
  }, []);

  const animateToLast = useCallback((selector = "[data-entity-id]", options?: FlipOptions) => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    // Batch reads: capture all "last" rects first.
    const lastRects = new Map<string, { el: HTMLElement; rect: Rect }>();
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]!;
      const id = el.getAttribute("data-entity-id");
      if (!id) continue;
      const first = firstRectsRef.current.get(id);
      if (!first) continue;
      lastRects.set(id, { el, rect: readElementRect(el) });
    }
    // Then animate (writes).
    for (const [entityId, { el, rect: last }] of lastRects) {
      const first = firstRectsRef.current.get(entityId)!;
      flipAnimate(el, first, last, options);
    }
  }, []);

  const animateSpawn = useCallback(
    (el: HTMLElement, kind: "fade" | "slide-up" | "flip" = "fade", options?: FlipOptions) => {
      return spawnAnimate(el, kind, options);
    },
    [],
  );

  return { captureFirst, animateToLast, animateSpawn };
}
