import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { seepingShadowsYellow } from "./seeping-shadows.ts";
import { snatchRed } from "./snatch.ts";
import { blisteringAssaultRed } from "./blistering-assault.ts";

/**
 * Blistering Assault, Red (DTD091) — Light Action - Attack, cost 2, 5{p}, 2{d}.
 * Printed: "If you have a yellow card in your pitch zone, this gets go again."
 */

describe("Blistering Assault (DTD091) AAA", () => {
  it("happy: a yellow card in the pitch zone grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blisteringAssaultRed],
        pitch: [seepingShadowsYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    Boltyn.attackWith(blisteringAssaultRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(1);
  });

  it("boundary: empty pitch zone does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blisteringAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    Boltyn.attackWith(blisteringAssaultRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveAP(0);
  });

  it("timing: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blisteringAssaultRed],
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
    Boltyn.defendWith([blisteringAssaultRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, blisteringAssaultRed).toBeIn("graveyard");
  });
});
