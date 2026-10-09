import { useRef, useState } from "react";
import type { InteractionSubmission } from "@tcg/protocol";
import type { OpeningBeat } from "@tcg/simulator-presentation/opening";
import { alphaClashOpening } from "../../opening-fixture";

const ready: OpeningBeat = {
  id: "ready",
  title: "A new game awaits",
  detail: "Reveal the contenders and draw your opening hands.",
  leaders: "hidden",
  hand: "deck",
  localCount: 0,
  rivalCount: 0,
};
const review: OpeningBeat = {
  id: "hand",
  title: "Your opening hand",
  detail: "Select cards to replace, or keep your hand.",
  leaders: "field",
  hand: "review",
  localCount: 8,
  rivalCount: 8,
  action: "hand",
};
const settle: OpeningBeat = {
  ...review,
  id: "settle",
  title: "Player 1 starts",
  detail: "Expansion · Resource step",
  hand: "table",
  action: undefined,
  duration: 1000,
  cue: "turn.change",
};
export interface ArenaOpening {
  beat: OpeningBeat;
  begin: () => void;
  advance: (id: string) => void;
  redraw: (cardIds: readonly string[], handIds: readonly string[]) => void;
  retainedIds: ReadonlySet<string>;
  handOrder: readonly string[];
  keep: () => void;
  cancel: () => void;
}

/** Choreography only. Every game action still crosses the native interaction boundary. */
export function useArenaOpening(
  enabled: boolean,
  execute: (id: string, values?: InteractionSubmission["values"]) => boolean,
): ArenaOpening | undefined {
  const [queue, setQueue] = useState<readonly OpeningBeat[]>([ready]);
  const current = useRef(queue);
  const command = useRef<readonly string[] | null>(null);
  const handOrder = useRef<readonly string[]>([]);
  const retainedIds = useRef<ReadonlySet<string>>(new Set());
  const replace = (next: readonly OpeningBeat[]) => {
    current.current = next;
    setQueue(next);
  };
  const beat = queue[0];
  if (!enabled || !beat) return undefined;
  return {
    beat,
    retainedIds: retainedIds.current,
    handOrder: handOrder.current,
    cancel: () => {
      command.current = null;
      replace([]);
    },
    begin: () => {
      if (current.current[0]?.id !== "ready") return;
      replace([
        ...alphaClashOpening.initial
          .filter((step) => step.id === "contenders" || step.id === "dock")
          .map((step) =>
            step.id === "contenders"
              ? { ...step, detail: "Both contenders are revealed. Player 1 starts this fixture." }
              : step,
          ),
        ...alphaClashOpening
          .afterOrder(true)
          .filter((step) => step.id === "shuffle" || step.id === "deal"),
        review,
      ]);
    },
    advance: (id) => {
      if (current.current[0]?.id !== id || !current.current[0]?.duration) return;
      if (id === "reshuffle" && command.current) {
        const cardIds = [...command.current];
        command.current = null;
        if (!execute("mulligan", { cardIds })) {
          replace([review]);
          return;
        }
      }
      replace(current.current.slice(1));
    },
    redraw: (cardIds, handIds) => {
      if (current.current[0]?.id !== "hand" || !cardIds.length) return;
      command.current = [...cardIds];
      handOrder.current = [...handIds];
      retainedIds.current = new Set(handIds.filter((id) => !cardIds.includes(id)));
      replace([
        ...alphaClashOpening
          .afterHand(true, cardIds.length)
          .filter((step) => ["return", "reshuffle", "redraw"].includes(step.id))
          .map((step) =>
            step.id === "return"
              ? { ...step, detail: "Return the selected cards to the deck." }
              : step,
          ),
        review,
      ]);
    },
    keep: () => {
      if (current.current[0]?.id !== "hand") return;
      // Lock before dispatch so a double activation cannot submit twice.
      replace([settle]);
      if (!execute("startGame")) replace([review]);
    },
  };
}
