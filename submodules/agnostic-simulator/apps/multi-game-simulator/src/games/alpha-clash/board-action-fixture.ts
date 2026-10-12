import { getCard } from "@tcg/alpha-clash-cards";
import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { nativeFixtureState } from "./native-fixture-state";

/** One resettable board covers Portal, set, attachments, and public-zone actions. */
export function createBoardActionFixture(
  variant: "standard" | "portal-reduced" | "portal-increased" = "standard",
) {
  const card = getCard;
  const game = nativeFixtureState({
    id: variant === "standard" ? "board-actions" : variant,
    // Allow ordinary Resource Steps for the arranged resources (502.1c).
    turnNumber: 19,
    playerOne: {
      contender: card("ac-ac1-047"),
      hand: [card("ac-ac5-082"), card("ac-ac1-051"), card("ac-ac1-097")],
      clash: [card("ac-ac1-027"), card("ac-ac1-028")],
      clashground: variant === "portal-reduced" ? [card("ac-ac2-025")] : [],
      accessory: [card("ac-st2-010"), card("ac-ac5-028")],
      oblivion: [card("ac-ac6-175"), card("ac-ac3-013")],
      resource: [
        "ac-ac3-013",
        "ac-ac3-013",
        "ac-ac5-028",
        "ac-ac5-028",
        "ac-st2-010",
        "ac-st2-010",
        "ac-ac1-027",
        "ac-ac1-028",
        "ac-ac1-051",
      ].map(card),
    },
    playerTwo: {
      contender: card("ac-ac1-096"),
      hand: [card("ac-ac1-076"), card("ac-ac1-027")],
      clash: [card("ac-ac1-027")],
      clashground: variant === "portal-increased" ? [card("ac-ac3-003")] : [],
    },
  });
  return new AlphaClashServerEngine(game.state, { human: "player-one", bot: "player-two" });
}
