import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

export function createResourcePaymentFixture() {
  const game = nativeFixtureState({
    id: "resource-payment",
    // Four resources require at least four own Resource Steps (rule 502.1c).
    turnNumber: 9,
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: 30,
      hand: [
        getCard("ac-ac4-146"),
        getCard("ac-ac1-028"),
        getCard("ac-ac1-030"),
        // Conquest, the Destroyer costs 6 and is unpayable with 3 ready resources.
        getCard("ac-ac2-055"),
      ],
      resource: [
        getCard("ac-ac4-146"),
        getCard("ac-ac1-028"),
        getCard("ac-ac4-146"),
        { card: getCard("ac-ac1-028"), ready: false },
      ],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      deck: 30,
      hand: [getCard("ac-ac1-027")],
      resource: [getCard("ac-ac1-027")],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
