import { AnimationScope } from "./animation-scope";
import { useEffect, useRef } from "react";
import type { CardDeparture } from "./effect-types";
import "./defeat-overlay.css";

/** Card departure: the struck card holds a beat under a red defeat ring, tips
 * flat and desaturates away, then a ghost arcs into the destination pile.
 * Sequencing is driven by Web Animations promises — no timers. */
export function CardDepartureOverlay({
  departures,
  reduced,
  onDone,
  onLaunch,
  label,
}: {
  onLaunch?: () => void;
  label: string;
  departures: readonly CardDeparture[];
  reduced: boolean;
  onDone?: (key: number) => void;
}) {
  return (
    <div className="tcg-defeat-layer" aria-hidden>
      {departures.map((defeat) => (
        <DepartureMotion
          key={defeat.key}
          move={defeat}
          reduced={reduced}
          onLaunch={onLaunch}
          label={label}
          onDone={onDone}
        />
      ))}
    </div>
  );
}

function DepartureMotion({
  move,
  reduced,
  onLaunch,
  label,
  onDone,
}: {
  onLaunch?: () => void;
  label: string;
  move: CardDeparture;
  reduced: boolean;
  onDone?: (key: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const launchRef = useRef(onLaunch);
  launchRef.current = onLaunch;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scope = new AnimationScope();
    launchRef.current?.();

    void scope
      .run(async () => {
        const card = root.querySelector<HTMLDivElement>(".tcg-defeat-card");
        const ring = root.querySelector<HTMLDivElement>(".tcg-defeat-ring");
        const tag = root.querySelector<HTMLDivElement>(".tcg-defeat-tag");
        const ghost = root.querySelector<HTMLDivElement>(".tcg-defeat-ghost");
        const hold = card?.animate
          ? (frames: Keyframe[], options: KeyframeAnimationOptions) =>
              scope.animate(card, frames, options)
          : undefined;
        if (!card || !hold) {
          if (scope.active) onDoneRef.current?.(move.key);
          return;
        }
        if (reduced) {
          const fade = hold([{ opacity: 1 }, { opacity: 0 }], {
            duration: 160,
            delay: 140,
            easing: "ease-out",
            fill: "both",
          });
          await fade.finished;
          if (scope.active) onDoneRef.current?.(move.key);
          return;
        }
        // Beat 1: the kill hit-stop — the board already froze on the strike;
        // the red ring and tag land while the card is still readable.
        if (ring)
          void scope.animate(
            ring,
            [
              { opacity: 0, scale: "0.7" },
              { opacity: 1, scale: "1" },
            ],
            { duration: 140, fill: "both" },
          );
        if (tag)
          void scope.animate(
            tag,
            [
              { opacity: 0, transform: "translate(-50%, 5px)" },
              { opacity: 1, transform: "translate(-50%, 0)" },
            ],
            { duration: 150, fill: "both" },
          );
        const beat = hold([{ opacity: 1 }, { opacity: 1 }], { duration: 230, fill: "both" });
        await beat.finished;
        // Beat 2: tip flat, desaturate, sink away.
        const collapse = scope.animate(
          card,
          [
            {
              transform: "translate(-50%, -50%) perspective(640px) rotateX(0deg) scale(1)",
              filter: "grayscale(0) brightness(1)",
              opacity: 1,
            },
            {
              transform: "translate(-50%, -38%) perspective(640px) rotateX(68deg) scale(0.94)",
              filter: "grayscale(1) brightness(0.45)",
              opacity: 0,
            },
          ],
          { duration: 430, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "both" },
        );
        if (tag)
          void scope.animate(tag, [{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            delay: 120,
            fill: "both",
          });
        await collapse.finished;
        // Beat 3: a ghost arcs into the destination pile.
        if (ghost) {
          const dx = move.toX - move.fromX;
          const dy = move.toY - move.fromY;
          const arc = scope.animate(
            ghost,
            [
              { transform: "translate(-50%, -50%) scale(0.55)", opacity: 0.95 },
              {
                transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 64}px)) scale(0.4)`,
                opacity: 0.95,
                offset: 0.55,
              },
              {
                transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`,
                opacity: 0.1,
              },
            ],
            { duration: 640, easing: "cubic-bezier(0.45, 0, 0.55, 1)", fill: "both" },
          );
          await arc.finished;
        }
        if (scope.active) onDoneRef.current?.(move.key);
      })
      .catch((error: unknown) => {
        console.error("Presentation animation failed", error);
        onDoneRef.current?.(move.key);
      });
    return () => {
      scope.cancel();
    };
  }, [move, reduced]);

  return (
    <div
      className="tcg-defeat"
      ref={rootRef}
      style={{ left: move.fromX, top: move.fromY, width: move.fromWidth, height: move.fromHeight }}
    >
      <div className="tcg-defeat-ring" />
      <div className="tcg-defeat-card">
        {move.artUrl ? <img src={move.artUrl} alt="" draggable={false} /> : null}
      </div>
      <div className="tcg-defeat-tag">{label}</div>
      <div className="tcg-defeat-ghost">
        {move.artUrl ? <img src={move.artUrl} alt="" draggable={false} /> : null}
      </div>
    </div>
  );
}
