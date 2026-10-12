import type { CSSProperties } from "react";
import styles from "./arena3d.module.css";

export interface PickExitFlight {
  id: number;
  kind: "return" | "resolve" | "chosen";
  from: { left: number; top: number; width: number; height: number };
  to: { left: number; top: number; width: number; height: number };
  imageUrl?: string;
  /** Returning copies flip face-down mid-flight; revealed cards stay face-up. */
  flipToBack?: boolean;
  backImageUrl?: string;
  /** Scale at arrival so the clone lands at the destination's real footprint. */
  endScale: number;
  label: string;
  delayMs: number;
  durationMs: number;
  reducedMotion?: boolean;
}

/**
 * Staged exit of the search picker: unpicked stacks return to their pile, the
 * resolving card returns to its board spot, and the chosen card travels to its
 * destination zone last. Viewport-fixed clones; the dialog fades underneath.
 */
export function PickExitFlights({
  flights,
  onDone,
}: {
  flights: readonly PickExitFlight[];
  onDone: (id: number) => void;
}) {
  return (
    <>
      {flights.map((flight) => {
        const dx =
          flight.to.left + flight.to.width / 2 - (flight.from.left + flight.from.width / 2);
        const dy =
          flight.to.top + flight.to.height / 2 - (flight.from.top + flight.from.height / 2);
        return (
          <div
            key={flight.id}
            aria-hidden="true"
            data-card-return={flight.kind}
            data-reduced-motion={flight.reducedMotion || undefined}
            className={styles.pickExitFlight}
            style={
              {
                left: flight.from.left,
                top: flight.from.top,
                width: flight.from.width,
                height: flight.from.height,
                "--pick-dx": `${dx}px`,
                "--pick-dy": `${dy}px`,
                "--pick-dur": `${flight.durationMs}ms`,
                "--pick-end-scale": `${flight.endScale}`,
                animationDelay: `${flight.delayMs}ms`,
              } as CSSProperties
            }
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) onDone(flight.id);
            }}
          >
            {flight.flipToBack ? (
              <span className={styles.pickExitFlip}>
                <img
                  className={styles.pickExitFace}
                  src={flight.imageUrl}
                  alt=""
                  draggable={false}
                />
                <img
                  className={styles.pickExitBack}
                  src={flight.backImageUrl}
                  alt=""
                  draggable={false}
                />
              </span>
            ) : flight.imageUrl ? (
              <img src={flight.imageUrl} alt="" draggable={false} />
            ) : (
              <span>{flight.label}</span>
            )}
          </div>
        );
      })}
    </>
  );
}
