import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { frontlineScoutRed } from "./frontline-scout.ts";

describe("Frontline Scout family AAA", () => {
  it("happy: an arsenal play grants go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, arsenal: [frontlineScoutRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(frontlineScoutRed, { from: "arsenal", optionals: "decline" });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);
  });
  it("boundary: a hand play does not grant go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [frontlineScoutRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(frontlineScoutRed, { optionals: "decline" });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
  it("timing: the printed attack is playable with no target hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [frontlineScoutRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(frontlineScoutRed, { optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
