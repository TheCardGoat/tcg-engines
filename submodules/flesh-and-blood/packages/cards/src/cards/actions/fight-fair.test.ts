import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { insultToInjuryBlue } from "./insult-to-injury.ts";
import { snatchRed } from "./snatch.ts";
import { fightFairRed } from "./fight-fair.ts";

describe("Fight Fair (SUP033) AAA", () => {
  it("happy: defended by a Reviled action gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [fightFairRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [insultToInjuryBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(fightFairRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(insultToInjuryBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic action defender does not add {p}", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [fightFairRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.playAttack(fightFairRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: undefended this stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [fightFairRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(tuffnut).playAttack(fightFairRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
