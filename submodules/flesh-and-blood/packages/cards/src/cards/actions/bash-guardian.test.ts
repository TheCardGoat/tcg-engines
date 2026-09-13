import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { cripplingCrushRed } from "./crippling-crush.ts";
import { snatchRed } from "./snatch.ts";
import { bashGuardianRed } from "./bash-guardian.ts";

describe("Bash Guardian (SUP141) AAA", () => {
  it("happy: defended by a Guardian action gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [bashGuardianRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [cripplingCrushRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(bashGuardianRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(cripplingCrushRed);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic action defender does not add {p}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [bashGuardianRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(bashGuardianRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
  });
});
