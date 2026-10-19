import { AnimationScope } from "./animation-scope";
import { useEffect, useRef } from "react";
import type { DamageStrike } from "./effect-types";
import "./damage-strike-overlay.css";

/** Deal-damage motion: bolts fly from the acting card to every damaged target,
 * landing with an impact flash, the dealt amount, and the impact cue.
 * Sequencing is driven by Web Animations promises — no timers. */
export const LOCAL_DAMAGE_READ_MS = 1200;

export function DamageStrikeOverlay({
  strike,
  reduced,
  onImpact,
  onDone,
}: {
  strike: DamageStrike | null;
  reduced: boolean;
  onImpact?: () => void;
  onDone?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const onImpactRef = useRef(onImpact);
  const onDoneRef = useRef(onDone);
  onImpactRef.current = onImpact;
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!strike) return;
    const root = rootRef.current;
    if (!root) return;
    const scope = new AnimationScope();

    const fly = async (el: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = scope.animate(el, keyframes, { fill: "both", ...options });
      await animation.finished;
    };

    void scope
      .run(async () => {
        if (reduced) {
          onImpactRef.current?.();
          const done = scope.animate(root, [{ opacity: 1 }, { opacity: 0 }], {
            duration: 260,
            delay: 160,
            fill: "both",
          });
          await done.finished;
          if (scope.active) onDoneRef.current?.();
          return;
        }
        const flights: Promise<unknown>[] = [];
        strike.targets.forEach((target, index) => {
          const dx = target.x - strike.fromX;
          const dy = target.y - strike.fromY;
          const delay = strike.localImpacts ? 160 : 250 + index * 140;
          const trail = root.querySelector<HTMLSpanElement>(
            `.tcg-damage-trail[data-index="${index}"]`,
          );
          const bolt = root.querySelector<HTMLSpanElement>(
            `.tcg-damage-bolt[data-index="${index}"]`,
          );
          const impact = root.querySelector<HTMLSpanElement>(
            `.tcg-damage-impact[data-index="${index}"]`,
          );
          const number = root.querySelector<HTMLSpanElement>(
            `.tcg-damage-number[data-index="${index}"]`,
          );
          if (trail && !strike.localImpacts)
            flights.push(
              scope.animate(
                trail,
                [
                  { scale: "0 1", opacity: 0.85 },
                  { scale: "1 1", opacity: 0.85, offset: 0.9 },
                  { scale: "1 1", opacity: 0 },
                ],
                { duration: 420, delay, easing: "cubic-bezier(0.5, 0, 0.9, 0.6)", fill: "both" },
              ).finished,
            );
          if (bolt)
            flights.push(
              fly(
                bolt,
                [
                  { transform: "translate(0, 0) scale(0.7)", opacity: 1 },
                  { transform: `translate(${dx}px, ${dy}px) scale(1.15)`, opacity: 0 },
                ],
                {
                  duration: strike.localImpacts ? 1 : 420,
                  delay,
                  easing: "cubic-bezier(0.5, 0, 0.9, 0.6)",
                },
              ).then(() => {
                if (!scope.active) return;
                if (!strike.localImpacts || index === 0) onImpactRef.current?.();
                const batch: Promise<unknown>[] = [];
                if (impact)
                  batch.push(
                    fly(
                      impact,
                      [
                        { opacity: 0, transform: "scale(0.35)" },
                        { opacity: 1, transform: "scale(1)", offset: 0.3 },
                        { opacity: 0, transform: "scale(1.9)" },
                      ],
                      { duration: 520, easing: "ease-out" },
                    ),
                  );
                if (number)
                  batch.push(
                    fly(
                      number,
                      [
                        { opacity: 0, transform: "translateY(10px) scale(0.8)" },
                        { opacity: 1, transform: "translateY(0) scale(1.12)", offset: 0.18 },
                        { opacity: 1, transform: "translateY(-5px) scale(1)", offset: 0.7 },
                        { opacity: 0, transform: "translateY(-26px) scale(1)" },
                      ],
                      {
                        duration: strike.localImpacts ? LOCAL_DAMAGE_READ_MS - 160 : 760,
                        easing: "ease-out",
                      },
                    ),
                  );
                return Promise.all(batch);
              }),
            );
        });
        await Promise.all(flights);
        if (scope.active) onDoneRef.current?.();
      })
      .catch((error: unknown) => {
        console.error("Presentation animation failed", error);
        onDoneRef.current?.();
      });

    return () => {
      scope.cancel();
    };
  }, [strike, reduced]);

  if (!strike) return null;
  return (
    <div
      className="tcg-damage-strike"
      ref={rootRef}
      data-reduced={reduced || undefined}
      aria-hidden
    >
      {strike.targets.map((target, index) => (
        <span key={`${strike.key}:${index}`}>
          <span
            className="tcg-damage-trail"
            data-index={index}
            style={{
              left: strike.localImpacts ? target.x : strike.fromX,
              top: strike.localImpacts ? target.y : strike.fromY,
              width: strike.localImpacts
                ? 0
                : Math.hypot(target.x - strike.fromX, target.y - strike.fromY),
              transform: `rotate(${(Math.atan2(target.y - strike.fromY, target.x - strike.fromX) * 180) / Math.PI}deg)`,
            }}
          />
          <span
            className="tcg-damage-bolt"
            data-index={index}
            style={{
              left: strike.localImpacts ? target.x : strike.fromX,
              top: strike.localImpacts ? target.y : strike.fromY,
              visibility: strike.localImpacts ? "hidden" : undefined,
            }}
          />
          <span
            className="tcg-damage-impact"
            data-index={index}
            style={{ left: target.x, top: target.y }}
          />
          <span
            className="tcg-damage-number"
            data-index={index}
            style={{ left: target.x, top: target.y }}
          >
            {`−${target.amount}`}
          </span>
        </span>
      ))}
    </div>
  );
}
