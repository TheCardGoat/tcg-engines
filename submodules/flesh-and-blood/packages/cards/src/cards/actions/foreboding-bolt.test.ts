import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "./nimblism.ts";
import { forebodingBoltRed } from "./foreboding-bolt.ts";

// Not migrated to the intent verbs (playAttack/closeCombat/untilIdle): the Opt
// mechanic surfaces a `partition` decision ("Opt 1": top or bottom) that
// FabDrainPolicy cannot auto-answer (no partition policy), so the legacy
// resolveUntilIdle auto-partition is still required here. Tracked as a
// follow-up once the intent API gains a partition/opt policy.
describe("Foreboding Bolt (CRU168) AAA", () => {
  it("happy: deals 3 damage, Opt 1, and Blaze gains 1 energy for the look", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [forebodingBoltRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(forebodingBoltRed, { optBottom: 1, target: game.as(dash).id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Blaze, forebodingBoltRed).toBeIn("graveyard");
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(1, "energy");
    expect(Blaze.zone("deck")).toHaveLength(6);
  });

  it("boundary: a vanilla action without Opt deals no damage and gives Blaze no energy", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [nimblismBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(0, "energy");
  });

  it("synergy: Blaze may target himself for the 3 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [forebodingBoltRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 17,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(forebodingBoltRed, { optBottom: 1, target: Blaze.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Blaze).toHaveLife(14);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
