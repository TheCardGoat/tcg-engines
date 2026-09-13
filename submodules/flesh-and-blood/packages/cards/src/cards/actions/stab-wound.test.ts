import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { stabWoundBlue } from "./stab-wound.ts";

/**
 * Stab Wound (OUT142) — Ninja Action - Attack, blue. Power 2.
 *
 * Printed: When this hits a hero, they lose X{h}, where X is the number of
 * times a dagger has hit this combat chain.
 */

describe("Stab Wound (OUT142) AAA", () => {
  it("boundary: with no prior dagger hits the count reads zero and only power lands", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [stabWoundBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.playAttack(stabWoundBlue);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dromai, stabWoundBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18); // power 2; X counted zero daggers
  });

  it("happy: a prior dagger hit on this chain arms the X life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [nerveScalpel],
        hand: [stabWoundBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.activateAttack(nerveScalpel);
    Dash.defendWith();
    game.advanceCombatTo("resolution");

    Fang.playAttack(stabWoundBlue);
    game.helpers.resolveRestOfCombat();

    // 1{p} scalpel + 2{p} stab + 1{h} from X = one dagger hit this chain.
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
