import { createInitialState, type MatchState } from "@tcg/alpha-clash-engine";

/** Validate the complete card ledger, not only whether each ID is official.
 * This checks construction through the native validator. It cannot prove that
 * counters, temporary modifiers, or zone positions have a legal history.
 */
export function auditNativeFixtureLegality(state: MatchState) {
  // Necessary chronology bound for normal alternating turns, not a replay.
  // The active seat has the extra turn when the global counter is odd. Its
  // current Resource Step is not yet available in an Expansion arrangement.
  // Extra turns/resources or control changes need explicit effect provenance.
  const resourceHistoryGaps = (["player-one", "player-two"] as const).flatMap((seat) => {
    const active = seat === state.activePlayer;
    const turns = active ? Math.ceil(state.turnNumber / 2) : Math.floor(state.turnNumber / 2);
    const ordinaryResourceOpportunities =
      state.phase.name === "setup"
        ? 0
        : Math.max(0, turns - (active && state.phase.name === "expansion" ? 1 : 0));
    const count = Object.values(state.cards).filter(
      (card) => card.controller === seat && card.zone === "resource",
    ).length;
    return count > ordinaryResourceOpportunities
      ? [
          `${seat}: ${count} resources exceed ${ordinaryResourceOpportunities} ordinary Resource Steps; effect provenance required.`,
        ]
      : [];
  });
  const players = Object.fromEntries(
    (["player-one", "player-two"] as const).map((seat) => {
      const cards = Object.values(state.cards).filter((card) => card.owner === seat);
      const contender = cards.find((card) => card.zone === "contender");
      return [
        seat,
        {
          name: seat,
          deck: {
            contenderId: contender?.definitionId ?? "",
            deckIds: cards
              .filter((card) => card.zone !== "contender")
              .map((card) => card.definitionId),
          },
        },
      ];
    }),
  );
  try {
    const first = players["player-one"];
    const second = players["player-two"];
    createInitialState({
      id: "fixture-legality-audit",
      seed: 17,
      validateDeck: true,
      players: { "player-one": first, "player-two": second },
    });
    return {
      construction: "valid" as const,
      resourceHistoryGaps,
      reason: [
        "Native deck construction passed; historical reachability is not proved.",
        ...resourceHistoryGaps,
      ].join(" "),
    };
  } catch (error) {
    return {
      construction: "invalid" as const,
      resourceHistoryGaps,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
}
