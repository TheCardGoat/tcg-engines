import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { seepingShadowsYellow } from "./seeping-shadows.ts";
import { snatchRed } from "./snatch.ts";
import { searingRayRed } from "./searing-ray.ts";

/**
 * Searing Ray, Red (DTD097) — Light Action - Attack, cost 1, 4{p}, 2{d}.
 *
 * Printed: "If you have a yellow card in your pitch zone, this gets +2{p}."
 *
 */

describe("Searing Ray (DTD097) AAA", () => {
  it("happy: empty pitch zone attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [searingRayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(boltyn).attackWith(searingRayRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: a yellow card in the pitch zone grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [searingRayRed],
        pitch: [seepingShadowsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(game.as(boltyn).zone("pitch")).toContain(seepingShadowsYellow.canonicalId);
    game.as(boltyn).attackWith(searingRayRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [searingRayRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([searingRayRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, searingRayRed).toBeIn("graveyard");
  });
});
