import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { hammerheadHarpoonCannon } from "../weapons/hammerhead-harpoon-cannon.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shallowWaterSharkHarpoonYellow } from "./shallow-water-shark-harpoon.ts";

/**
 * Shallow Water Shark Harpoon (PEN166) — Pirate Ranger Arrow Attack.
 * Printed: If you've activated a cannon this turn, this gets “When this hits
 * a hero, destroy a card in their arsenal. If you do, create a Gold token.”
 */

describe("Shallow Water Shark Harpoon (PEN166) AAA", () => {
  it("happy: after activating a cannon, a hit destroys their arsenal and creates Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [{ card: shallowWaterSharkHarpoonYellow, state: { faceDown: false } }],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.activate(hammerheadHarpoonCannon);
    game.helpers.resolveUntilIdle();
    Azalea.playAttack(shallowWaterSharkHarpoonYellow, { from: "arsenal" });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 1);
  });

  it("boundary: without a cannon activation this turn, a hit does not destroy arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: shallowWaterSharkHarpoonYellow, state: { faceDown: false } }],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(shallowWaterSharkHarpoonYellow, { from: "arsenal" });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Azalea).toHaveTokenCount("gold", 0);
  });
});
