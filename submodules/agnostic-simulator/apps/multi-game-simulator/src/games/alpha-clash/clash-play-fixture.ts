import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

/** Two affordable Clash cards, an expensive Clash and a different card type. */
export function createClashPlayFixture() {
  const game = nativeFixtureState({
    id: "clash-play-qa",
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: 7,
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: 30,
      hand: ["ac-ac1-027", "ac-ac1-028", "ac-ac2-055", "ac-tp1-031"].map(getCard),
      resource: [
        getCard("ac-ac1-027"),
        getCard("ac-ac1-028"),
        { card: getCard("ac-ac1-027"), ready: false },
      ],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      deck: 30,
      clash: [getCard("ac-ac1-027")],
      hand: [getCard("ac-ac1-027")],
      resource: [getCard("ac-ac1-027")],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
