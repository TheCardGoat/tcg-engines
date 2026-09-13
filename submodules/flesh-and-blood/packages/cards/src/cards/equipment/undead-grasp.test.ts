import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { restlessQuartermasterRed } from "../actions/restless-quartermaster.ts";
import { voxNecropolis } from "../weapons/vox-necropolis.ts";
import { undeadGrasp } from "./undead-grasp.ts";

/**
 * Undead Grasp (AMA005) — Shadow Necromancer Equipment - Arms.
 *
 * Printed: Action - {r}, discard a zombie, destroy this: Your next zombie
 * attack this turn gets +3{p} and "When this hits, destroy this zombie."
 * Go again. Battleworn.
 */

describe("Undead Grasp (AMA005) AAA", () => {
  it("happy: the next zombie attack gets +3{p}, destroys itself on hit, and goes again", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arms: [undeadGrasp],
        arena: [corruptedCorpse],
        hand: [restlessQuartermasterRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(undeadGrasp);
    game.untilIdle();

    // Go again refunded the action point; the grasp is destroyed as a cost.
    expectFabPlayer(Malice).toHaveAP(1);
    expectFabCard(Malice, undeadGrasp).toBeIn("graveyard");

    // The Vox-granted zombie attack is the next zombie attack this turn.
    Malice.activate(corruptedCorpse);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);

    game.helpers.resolveRestOfCombat();
    // 6 damage unblocked, and the on-hit destroy removes the zombie (Malice's
    // own trigger then banishes it and creates a fresh Corpse in banished).
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expect(Malice.zone("arena")).not.toContain(corruptedCorpse.canonicalId);
  });

  it("boundary: with no zombie in hand the activation cost is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arms: [undeadGrasp],
        arena: [corruptedCorpse],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.expectActivationRejected(undeadGrasp);

    expectFabCard(Malice, undeadGrasp).toBeIn("arms");
    expectFabPlayer(Malice).toHaveAP(1);
  });
});
