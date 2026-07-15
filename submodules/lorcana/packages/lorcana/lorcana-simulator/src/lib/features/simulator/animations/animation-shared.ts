import type {
  BoardAnchorRect,
  BoardAnchorSnapshot,
  BoardLocalRect,
} from "@/features/simulator/animations/board-move-animations.js";

export type AnchorReference = {
  primaryId: string;
  fallbackId?: string;
};

export function resolveAnchorRect(
  snapshot: BoardAnchorSnapshot | null,
  reference: AnchorReference,
): BoardAnchorRect | null {
  if (!snapshot) {
    return null;
  }

  const primary = snapshot.anchors[reference.primaryId];
  if (primary) {
    return primary;
  }

  if (reference.fallbackId) {
    return snapshot.anchors[reference.fallbackId] ?? null;
  }

  return null;
}

export function toLocalRect(rect: BoardAnchorRect, boardRect: BoardAnchorRect): BoardLocalRect {
  return {
    x: rect.left - boardRect.left,
    y: rect.top - boardRect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.centerX - boardRect.left,
    centerY: rect.centerY - boardRect.top,
  };
}

/**
 * Svelte action that detects when a CSS animation on an element completes
 * using the Web Animations API. Calls `onFinished` when every CSS animation
 * owned by the node reaches its end state.
 *
 * If no CSS animation is found (e.g., `prefers-reduced-motion: reduce` disables
 * animations), `onFinished` is not called — a safety timeout in the game context
 * handles that case.
 */
export function watchCssAnimation(
  node: HTMLElement,
  params: { id: string; onFinished: (id: string) => void },
): { destroy: () => void } {
  let cancelled = false;
  const frameId = requestAnimationFrame(() => {
    const animations = node.getAnimations().filter((animation) => {
      const effect = animation.effect;
      return effect instanceof KeyframeEffect && effect.target === node;
    });
    if (animations.length > 0) {
      Promise.allSettled(animations.map((animation) => animation.finished))
        .then(() => {
          if (!cancelled) {
            params.onFinished(params.id);
          }
        })
        .catch(() => {
          // Animation was cancelled (element removed, or .cancel() called) — no-op.
        });
    }
  });

  return {
    destroy() {
      cancelled = true;
      cancelAnimationFrame(frameId);
    },
  };
}
