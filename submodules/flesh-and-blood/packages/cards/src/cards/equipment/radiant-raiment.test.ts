import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { serBoltynBreakerOfDawn } from "../heroes/ser-boltyn-breaker-of-dawn.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { radiantRaiment } from "./radiant-raiment.ts";

/**
 * Radiant Raiment (DTD076) — Light Equipment Chest.
 *
 * Printed: Instant - Banish this and a card from your hero's soul: Prevent
 * the next 2 damage that would be dealt to your hero this turn.
 */

describe("Radiant Raiment (DTD076) AAA", () => {
  it("happy: banish this and a soul card to prevent the next 2 of Snatch's 4", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: serBoltynBreakerOfDawn,
        life: 20,
        chest: [radiantRaiment],
        soul: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Boltyn.activate(radiantRaiment);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, radiantRaiment).toBeBanished();
    expectFabCard(Boltyn, nimblismBlue).toBeBanished();
  });

  it("boundary: without activating, Snatch deals the full 4 and this stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: serBoltynBreakerOfDawn,
        life: 20,
        chest: [radiantRaiment],
        soul: [nimblismBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Boltyn).toHaveLife(16);
    expectFabCard(Boltyn, radiantRaiment).toBeIn("chest");
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("timing: empty soul cannot pay the Instant cost", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: serBoltynBreakerOfDawn,
        life: 20,
        chest: [radiantRaiment],
        soul: [],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Boltyn.expectActivationRejected(radiantRaiment);

    expectFabCard(Boltyn, radiantRaiment).toBeIn("chest");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(16);
  });
});
