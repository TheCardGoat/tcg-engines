import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

export function createCostRouteFixture(id: string) {
  const discount = id === "prompt-discount-cost";
  const game = nativeFixtureState({
    id,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: discount ? 14 : 13,
    activePlayer: discount ? "player-two" : "player-one",
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: Array.from({ length: 30 }, () => getCard("ac-ac1-027")),
      hand: [
        getCard(
          id === "prompt-additional-cost" ? "ac-ac7-186" : discount ? "ac-ac2-022" : "ac-ac2-014",
        ),
        getCard("ac-ac1-027"),
        getCard("ac-ac1-028"),
      ],
      clash: [getCard("ac-ac1-052"), getCard("ac-st2-003")],
      resource: [
        "ac-ac1-052",
        "ac-ac1-052",
        "ac-ac1-027",
        "ac-ac1-028",
        "ac-ac1-027",
        "ac-ac1-052",
      ].map(getCard),
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      deck: Array.from({ length: 30 }, () => getCard("ac-ac1-027")),
      hand: [getCard("ac-ac1-108")],
      clash: [getCard("ac-ac1-027"), getCard("ac-ac1-052")],
      resource: [getCard("ac-ac1-027")],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
