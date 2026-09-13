import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { smackOfRealityRed } from "./smack-of-reality.ts";

describe("Smack of Reality (TCC036) AAA", () => {
  it("boundary: at printed 9{p} a hit does not destroy aura tokens", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smackOfRealityRed], resourcePoints: 5, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(smackOfRealityRed);
    expectCombat(game).toHaveAttackPower(9);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });

  it("happy: printed 9{p} attack resolves", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smackOfRealityRed], resourcePoints: 5, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(smackOfRealityRed);
    expectCombat(game).toHaveAttackPower(9);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(11);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smackOfRealityRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([smackOfRealityRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
