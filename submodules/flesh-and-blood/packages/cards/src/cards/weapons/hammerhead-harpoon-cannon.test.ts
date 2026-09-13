import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { searingShotRed } from "../shared/test-recipients.ts";
import { goldfinHarpoonYellow } from "../actions/goldfin-harpoon.ts";
import { hammerheadHarpoonCannon } from "./hammerhead-harpoon-cannon.ts";

/**
 * Hammerhead Harpoon Cannon (SEA084) — Pirate Ranger Weapon Bow Cannon 2H.
 *
 * Printed: Action - {r}{r}{r}{r}, {t}: Your next arrow attack this turn gets
 * +4{p}. If it has harpoon in its name, it gets overpower. Go again.
 */

describe("Hammerhead Harpoon Cannon (SEA084) AAA", () => {
  it("happy: tap and pay {r}{r}{r}{r} so the next Harpoon arrow is +4{p} with overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [{ card: goldfinHarpoonYellow, state: { faceDown: false } }],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(hammerheadHarpoonCannon);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.playAttack(goldfinHarpoonYellow, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-Harpoon arrow still gets +4{p} but not overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [{ card: searingShotRed, state: { faceDown: false } }],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(hammerheadHarpoonCannon);
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: unpayable {r}{r}{r}{r} cost is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [hammerheadHarpoonCannon],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(azalea).activate(hammerheadHarpoonCannon);
  });
});
