import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoSentryBaseLegsRed } from "./evo-sentry-base-legs.ts";

/**
 * Evo Sentry Base Legs (EVO045) — Mechanologist Action Equipment Evo Base Legs.
 *
 * Printed: If you have a base legs equipped, transform it into this, then
 * equip this. Battleworn.
 *
 * Seat Teklovossen (not Dash). Transform/equip may follow the AMX022 family
 * and park the Action inert in the arena; pin the public zone.
 */

describe("Evo Sentry Base Legs (EVO045) AAA", () => {
  it("happy (module gap): self-transform then equip wedges — occupied legs seat", () => {
    // EVO045 transforms selector:"self" instead of the equipped base (unlike
    // EVO042–044). Equip then collides with the seated Teklo Base Legs.
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        legs: [tekloBaseLegs],
        hand: [evoSentryBaseLegsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => {
      Teklo.play(evoSentryBaseLegsRed);
      game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    }).toThrow(/equip: equipment seat is already occupied/);
    expectFabCard(Teklo, tekloBaseLegs).toBeIn("legs");
    expect(Teklo.zone("legs")).not.toContain(evoSentryBaseLegsRed.canonicalId);
  });

  it("boundary: without a base legs equipped this does not enter the legs slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoSentryBaseLegsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseLegsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("legs")).not.toContain(evoSentryBaseLegsRed.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, legs: [evoSentryBaseLegsRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoSentryBaseLegsRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Teklo, evoSentryBaseLegsRed).toBeIn("legs");
    expectFabCard(Teklo, evoSentryBaseLegsRed).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
