import { AnimationScope } from "@tcg/simulator-presentation/animation-scope";
import { useEffect, useRef } from "react";
import "./seat-pass-overlay.css";

export interface SeatPass {
  readonly key: number;
  readonly from: "player-one" | "player-two";
  readonly to: "player-one" | "player-two";
  readonly turn: number;
  readonly caption: string;
}

/** Hot-seat hand-off: blink the table dark while the presentation flips.
 * Deliberately wordless — priority passes already speak through board cues
 * (the flipped view, the lit half, the turn strip), and stacked text banners
 * read as flicker. onFlipped fires once the table is fully veiled so the page
 * can swap the presentation mid-transition. */
export function SeatPassOverlay({
  pass,
  reduced,
  onFlipped,
  onDone,
}: {
  pass: SeatPass | null;
  reduced: boolean;
  onFlipped?: (pass: SeatPass) => void;
  onDone?: (pass: SeatPass) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const onFlippedRef = useRef(onFlipped);
  const onDoneRef = useRef(onDone);
  onFlippedRef.current = onFlipped;
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!pass) return;
    const root = rootRef.current;
    if (!root) return;
    const scope = new AnimationScope();

    void scope
      .run(async () => {
        if (reduced) {
          onFlippedRef.current?.(pass);
          await new Promise((resolve) => setTimeout(resolve, 120));
          if (scope.active) onDoneRef.current?.(pass);
          return;
        }
        const veilIn = scope.animate(root, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 200,
          easing: "ease",
          fill: "both",
        });

        await veilIn.finished;
        if (!scope.active) return;
        // Table fully veiled: the page swaps the presented seat now.
        onFlippedRef.current?.(pass);
        // Hold the veil while the page swaps the presentation.
        await new Promise((resolve) => setTimeout(resolve, 180));
        if (!scope.active) return;
        const veilOut = scope.animate(root, [{ opacity: 1 }, { opacity: 0 }], {
          duration: 260,
          easing: "ease",
          fill: "both",
        });

        await veilOut.finished;
        if (scope.active) onDoneRef.current?.(pass);
      })
      .catch((error: unknown) => {
        console.error("Seat transition failed", error);
        onFlippedRef.current?.(pass);
        onDoneRef.current?.(pass);
      });

    return () => scope.cancel();
  }, [pass, reduced]);

  if (!pass) return null;
  return <div className="tcg-seat-pass" ref={rootRef} aria-hidden="true" />;
}
