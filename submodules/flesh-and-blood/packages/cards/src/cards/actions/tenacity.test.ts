import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tenacityYellow } from "./tenacity.ts";

describe("Tenacity (HVY211) AAA", () => {
  it("happy: +1{p} for one defending card on the combat chain", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenacityYellow], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).play(tenacityYellow);
    game.passBoth();
    game.advanceCombatTo("defend");
    game.as(azalea).defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: no defenders leaves printed 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenacityYellow], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(tenacityYellow);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a second defender adds another +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tenacityYellow], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(tenacityYellow);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(2);
    game.as(azalea).defendWith([nimblismBlue, snatchRed]);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Dash, tenacityYellow).toBeIn("graveyard");
  });
});
