import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

import { batteringBoltRed } from "./battering-bolt.ts";

/**
 * Battering Bolt (EVR088) — Ranger Arrow. Red cost 2, 6{p}/3{d}.
 * If this hits a hero, they reveal their hand and discard all non-action cards, then lose 1{h} per discarded.
 */

describe("Battering Bolt (EVR088) AAA", () => {
  it("happy: hit discards non-action cards from their hand and they lose 1{h} each", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: batteringBoltRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nullruneHood, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(batteringBoltRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, nullruneHood).toBeIn("graveyard");
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("boundary: a blocked miss does not discard or tax life", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: batteringBoltRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nullruneHood],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(batteringBoltRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("hand")).toContain(nullruneHood.canonicalId);
  });

  it("timing: action cards in hand are kept after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: batteringBoltRed, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(batteringBoltRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
  });
});
