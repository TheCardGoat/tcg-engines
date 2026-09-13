import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { trenchOfSunkenTreasure } from "./trench-of-sunken-treasure.ts";
import { searingShotRed } from "../actions/searing-shot.ts";

/**
 * Trench of Sunken Treasure (OUT094) — Ranger Equipment - Chest, Arcane
 * Barrier 1, Blade Break.
 *
 * Printed: "Once per Turn Instant - Put a face down card from your arsenal on
 * the bottom of your deck: Gain {r}"
 */
describe("Trench of Sunken Treasure (OUT094) AAA", () => {
  it("happy: burying the face-down arsenal card gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        chest: [trenchOfSunkenTreasure],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(trenchOfSunkenTreasure);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Azalea).toHaveResourceCount(1);
    expect(Azalea.zone("arsenal")).toHaveLength(0);
    expect(Azalea.cardsIn("deck", searingShotRed)).toHaveLength(1);
  });

  it("boundary: with no face-down card in the arsenal the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        chest: [trenchOfSunkenTreasure],
        arsenal: [{ card: searingShotRed, state: { faceUp: true } }],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(trenchOfSunkenTreasure);
    expectFabCard(Azalea, trenchOfSunkenTreasure).toBeIn("chest");
    expectFabPlayer(Azalea).toHaveResourceCount(0);
  });

  it("timing: the second activation in one turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        chest: [trenchOfSunkenTreasure],
        arsenal: [
          { card: searingShotRed, state: { faceDown: true } },
          { card: searingShotRed, state: { faceDown: true } },
        ],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(trenchOfSunkenTreasure);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });
    expectFabPlayer(Azalea).toHaveResourceCount(1);

    Azalea.expectActivationRejected(trenchOfSunkenTreasure);
    expectFabPlayer(Azalea).toHaveResourceCount(1);
  });
});
