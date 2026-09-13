import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { kissOfDeathRed } from "./kiss-of-death.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { poisonedBladeRed } from "./poisoned-blade.ts";

/**
 * Poisoned Blade, Red (CIN017) — dagger-hit rider.
 *
 * Printed: Whenever a dagger you own hits a hero this combat chain, they lose
 * 1{h}.
 */

// Printed "this combat chain" spans every link of the combat, so the blade's
// own go-again attack is what opens a chain a later dagger link rides.
describe("Poisoned Blade family AAA", () => {
  it("happy: a later dagger link in the same chain drains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [poisonedBladeRed, kissOfDeathRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.play(poisonedBladeRed); // link 1: power + printed go again keeps the combat open
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dromai.playAttack(kissOfDeathRed); // link 2: the dagger
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    // Link1 3 + link2 dagger 3 + rider 1. No prior same-combat
    expect(Dash.life()).toBe(20 - 3 - 3 - 1);
  });

  it("boundary: a non-dagger second link drains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        weapon1: [cintariSaber],
        hand: [poisonedBladeRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.play(poisonedBladeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dromai.activate(cintariSaber);
    game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

    expect(Dash.life()).toBe(20 - 3 - 2);
  });
});
