import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boulderDropRed } from "./boulder-drop.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { biggerThanBigRed } from "./bigger-than-big.ts";

describe("Bigger Than Big (BET016) AAA", () => {
  it("happy: next Guardian attack gets +5{p} and may wager Might", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [biggerThanBigRed],
        hand: [boulderDropRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Bravo, biggerThanBigRed).toBeIn("graveyard");

    Bravo.playAttack(boulderDropRed, { pitch: [nimblismBlue], stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(12);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(8);
  });

  it("boundary: a Generic attack stays at printed {p} and does not wager", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [biggerThanBigRed],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [biggerThanBigRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).endTurn();
    game.untilIdle();
    expectFabCard(game.as(bravo), biggerThanBigRed).toBeIn("arena");
  });
});
