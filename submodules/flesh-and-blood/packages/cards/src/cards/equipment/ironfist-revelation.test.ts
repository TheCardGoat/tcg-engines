import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spinalCrushRed } from "../actions/spinal-crush.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironfistRevelation } from "./ironfist-revelation.ts";

describe("Ironfist Revelation (SUP168) AAA", () => {
  it("happy: defending and turning a face-down Crush arsenal card face-up puts a +1{p} counter on it", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [ironfistRevelation],
        arsenal: [spinalCrushRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, spinalCrushRed).toBeFaceDown();

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironfistRevelation);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Bravo, spinalCrushRed).toHavePower(10);
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: no Crush card in arsenal adds no +1{p} counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [ironfistRevelation],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironfistRevelation);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("timing: declining the optional leaves the Crush card face-down with no counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [ironfistRevelation],
        arsenal: [spinalCrushRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironfistRevelation);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, spinalCrushRed).toBeFaceDown().toHavePower(9);
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
