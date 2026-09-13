import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { aetherArcBlue } from "./aether-arc.ts";

/**
 * Aether Arc (HVY252) — deal 1 arcane to each opposing hero, then Ponder
 * for each hero dealt damage this way.
 */

describe("Aether Arc (HVY252) AAA", () => {
  it("happy: dealing 1 to the opposing hero creates 1 Ponder", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [aetherArcBlue], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherArcBlue);
    game.passBoth();

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Blaze).toHaveTokenCount("ponder", 1);
    expectFabCard(Blaze, aetherArcBlue).toBeIn("graveyard");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherArcBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Blaze.defendWith([aetherArcBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Blaze).toHaveLife(19);
  });

  it("timing: playing the Action spends the action point", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [aetherArcBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherArcBlue);
    game.passBoth();
    expectFabPlayer(Blaze).toHaveAP(0);
  });
});
