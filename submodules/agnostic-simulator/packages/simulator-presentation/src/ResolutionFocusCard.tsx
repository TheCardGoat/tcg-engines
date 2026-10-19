import { useLayoutEffect, useRef, type ReactNode } from "react";
import { resolutionFocusPose } from "./targeted-resolution";
import { AnimationScope } from "./animation-scope";
import { useSyncExternalStore } from "react";
const subscribeViewport = (listener: () => void) => {
  window.addEventListener("resize", listener);
  return () => window.removeEventListener("resize", listener);
};
const viewportSnapshot = () => `${window.innerWidth}:${window.innerHeight}`;
const serverViewport = () => "1280:650";
import "./resolution-focus.css";

/** Elevated card and DOM controls. Captions and layout policy belong to the game. */
export function ResolutionFocusCard({
  caption,
  pose,
  art,
  name,
  ready = false,
  rejected = false,
  panelSide = "below",
  flightFrom,
  reducedMotion = false,
  children,
  sceneOwnsCard = false,
}: {
  /** Keep controls and caption only when the scene owns the moving card. */
  sceneOwnsCard?: boolean;
  caption: string;
  pose?: ReturnType<typeof resolutionFocusPose>;
  art?: string;
  name?: string;
  ready?: boolean;
  rejected?: boolean;
  /** Where the control panel sits; "left" keeps lower board rows tappable. */
  panelSide?: "below" | "left";
  /** Viewport rect the card flies in from (its last hand/board position). */
  flightFrom?: { left: number; top: number; width: number; height: number };
  reducedMotion?: boolean;
  children: ReactNode;
}) {
  const viewport = useSyncExternalStore(subscribeViewport, viewportSnapshot, serverViewport);
  const [width, height] = viewport.split(":").map(Number);
  const focusRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = focusRef.current;
    if (sceneOwnsCard || !element || !flightFrom || reducedMotion || !element.animate) return;
    const rect = element.getBoundingClientRect();
    const dx = flightFrom.left + flightFrom.width / 2 - (rect.left + rect.width / 2);
    const dy = flightFrom.top + flightFrom.height / 2 - (rect.top + rect.height / 2);
    const scale = Math.min(1.6, Math.max(0.4, flightFrom.width / rect.width));
    const scope = new AnimationScope();
    scope.animate(
      element,
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: "translate(0, 0) scale(1)" },
      ],
      { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
    return () => scope.cancel();
  }, [flightFrom, reducedMotion, sceneOwnsCard]);
  const focus = pose ?? resolutionFocusPose(width, height);
  // "below" centers the panel under the card; "left" sets it beside the card
  // so lower board rows (e.g. the resource zone) stay tappable.
  const panelStyle =
    panelSide === "left"
      ? {
          left: Math.max(focus.left - 14, 420),
          top: focus.top + focus.height / 2,
        }
      : {
          left: Math.min(Math.max(focus.left + focus.width / 2, 230), width - 230),
          top: focus.top + focus.height,
        };
  return (
    <>
      <div
        ref={focusRef}
        className="tcg-resolution-focus"

        data-scene-card={sceneOwnsCard || undefined}
        data-ready={ready || undefined}
        style={{ left: focus.left, top: focus.top, width: focus.width, height: focus.height }}
      >
        {sceneOwnsCard ? null : art ? (
          <img src={art} alt="" draggable={false} />
        ) : (
          <span className="tcg-resolution-focus-fallback">{name ?? "Card"}</span>
        )}
        <span className="tcg-resolution-focus-tag">{caption}</span>
      </div>
      <section
        className="tcg-resolution-focus-panel"
        data-side={panelSide}

        data-ready={ready || undefined}
        data-rejected={rejected || undefined}
        style={{ ...panelStyle }}
      >
        {children}
      </section>
    </>
  );
}
