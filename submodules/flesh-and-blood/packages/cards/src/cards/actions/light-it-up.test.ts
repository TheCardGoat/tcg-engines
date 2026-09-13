import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { grimoireOfFellingsong } from "../equipment/grimoire-of-fellingsong.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { lexi } from "../heroes/lexi.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { lightItUpYellow } from "./light-it-up.ts";

/**
 * Light it Up, Yellow (ELE036) — Elemental Ranger Arrow Attack, cost 1, 4{p}/3{d}.
 * Printed (Lexi specialization):
 * 'Lightning Fusion.\nIf Light it Up was fused, it gains "If this hits a hero,
 * deal 1 damage to them for each equipment they control."\nIf Light it Up
 * deals damage to a hero equal to or greater than the number of equipment
 * they control, equipment they control lose and can't gain activated
 * abilities until the end of their next turn.'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 8.3.17 (fusion optional cost — reveal a Lightning card),
 *     CR 8.2.6a (arrows fire only from arsenal with a bow), CR 5.3
 *     (resolution ability), CR 1.11.3b (pronoun resolution).
 *   behaviorConstraints:
 *     - a2 arms the arrow with the per-equipment hit rider only when fused.
 *     - a3 compares damage this dealt to a hero vs that hero's equipped
 *       objects and silences those equipments until end of their next turn.
 */

describe("Light it Up (ELE036) AAA", () => {
  it("happy: unfused 4 damage vs 1 equipment silences the defender's activated equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [lightItUpYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        weapon1: [grimoireOfFellingsong],
        resourcePoints: 1,
        hand: [],
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(lightItUpYellow, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    Dash.expectActivationRejected(grimoireOfFellingsong);
  });

  it("happy: fused hit still silences equipment and deals the extra equipment damage", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [lightItUpYellow],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        weapon1: [grimoireOfFellingsong],
        resourcePoints: 1,
        hand: [],
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(lightItUpYellow, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveLightningRed],
    });
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    Dash.expectActivationRejected(grimoireOfFellingsong);
  });

  it("boundary: a full block deals no damage and leaves the equipment activatable", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [lightItUpYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        weapon1: [grimoireOfFellingsong],
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 1,
        life: 20,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(lightItUpYellow, { from: "arsenal" });
    game.advanceCombatTo("defend");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    Lexi.pass();
    Dash.activate(grimoireOfFellingsong);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 1);
  });
});
