import { nativeFixtureState } from "./native-fixture-state";
import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";

/** Real card abilities open native choices; no injected choices or simulated resolution. */
export function createSimultaneousOrderFixture(kind: "effects" | "oblivion", bothOwners = false) {
  const zephyrion = getCard("ac-vtd2-012-p-white");
  const sonoro = getCard("ac-ac1-027");
  const aster = getCard("ac-ac1-122");
  const game = nativeFixtureState({
    id: `simultaneous-${kind}`,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: kind === "oblivion" ? 29 : 5,
    playerOne: {
      contender: getCard("ac-st-001"),
      deck: Array.from({ length: 8 }, () => sonoro),
      hand: kind === "oblivion" ? [aster] : [sonoro],
      clash:
        kind === "effects"
          ? [
              { card: zephyrion, ready: false },
              { card: zephyrion, ready: false },
              { card: zephyrion, ready: false },
            ]
          : [sonoro, getCard("ac-ac1-028"), getCard("ac-ac1-029")],
      resource: kind === "oblivion" ? Array.from({ length: 14 }, () => aster) : [],
      oblivion: [getCard("ac-ac1-032")],
    },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      clash: bothOwners ? [sonoro, getCard("ac-ac1-028")] : [],
      deck: Array.from({ length: 8 }, () => sonoro),
      hand: [aster],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
