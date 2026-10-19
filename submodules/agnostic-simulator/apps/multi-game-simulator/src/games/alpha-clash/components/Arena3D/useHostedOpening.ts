import { useEffect, useRef, useState } from "react";
import { finishMatchIntro } from "@tcg/shared/match-intro";
import type { OpeningBeat } from "@tcg/simulator-presentation/opening";
import type { AcSeat, LiveBoardState } from "../board-types";
import type { ArenaOpening } from "./useArenaOpening";
import { cardArtwork } from "./card-artwork";

const covered: OpeningBeat = {
  id: "ready",
  title: "Meet your contenders",
  detail: "",
  leaders: "showcase",
  hand: "deck",
  localCount: 0,
  rivalCount: 0,
};
/** Hold the native opening controller until the cross-document cover reveals the board. */
export function useHostedOpening(
  board: Pick<LiveBoardState, "cards" | "players" | "phaseName">,
  viewer: AcSeat,
  ready: boolean,
  opening: ArenaOpening | undefined,
  names?: { p1?: string; p2?: string },
): ArenaOpening | undefined {
  const [coveredByIntro, setCoveredByIntro] = useState(() =>
    Boolean(document.documentElement.dataset.tcgMatchIntro),
  );
  const openingRef = useRef(opening);
  openingRef.current = opening;
  const started = useRef(false);
  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    const rival = viewer === "player-one" ? "player-two" : "player-one";
    const identity = (seat: AcSeat) => {
      const contender = board.cards.find(
        (card) => card.zone === "contender" && card.controller === seat && !card.faceDown,
      );
      return {
        name:
          (seat === "player-one" ? names?.p1 : names?.p2) ?? (seat === viewer ? "You" : "Opponent"),
        artwork: contender ? cardArtwork(contender) : undefined,
      };
    };
    finishMatchIntro({
      players: [identity(viewer), identity(rival)],
      onReveal: (animate) => {
        if (coveredByIntro && !animate) openingRef.current?.cancel();
        setCoveredByIntro(false);
      },
    });
  }, [ready, coveredByIntro, board, viewer, names]);
  if (!opening || !coveredByIntro) return opening;
  return {
    ...opening,
    beat: covered,
    pending: true,
    advance: () => {},
  };
}
