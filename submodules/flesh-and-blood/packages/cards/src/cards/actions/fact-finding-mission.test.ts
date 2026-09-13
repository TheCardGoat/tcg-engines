import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { factFindingMissionRed } from "./fact-finding-mission.ts";

describe("Fact-Finding Mission family AAA", () => {
  it("happy: a hit can inspect a face-down arsenal card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [factFindingMissionRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arsenal: [{ card: factFindingMissionRed, state: { faceDown: true } }],
        deck: 6,
      },
    );
    game.as(dash).playAttack(factFindingMissionRed);
    game.closeCombat({ optionals: "accept" });
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
  });
  it("boundary: an attack that misses cannot inspect", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [factFindingMissionRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    game.as(dash).playAttack(factFindingMissionRed);
    game.as(bravo).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "accept" });
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });
  it("timing: the card has printed 6 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [factFindingMissionRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).playAttack(factFindingMissionRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
