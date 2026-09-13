import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromaiAshArtist } from "../heroes/dromai-ash-artist.ts";
import { deathTouchRed } from "./death-touch.ts";

/**
 * Death Touch, Red (OUT162) — Assassin Ranger Action - Attack.
 *
 * Printed: Death Touch can't be played from hand.
 * When this hits a hero, create a Frailty, Inertia, or Bloodrot Pox token
 * under their control.
 */

describe("death-touch family AAA", () => {
  it("boundary: the hand play-bar rejects the attack outright", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        hand: [deathTouchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    expectFabUnplayable(
      () => Dromai.must.playAttack(deathTouchRed),
      /play condition is not satisfied|can't be played from hand|not legal/i,
    );
    expectFabCard(Dromai, deathTouchRed).toBeIn("hand");
  });

  it("happy: played from arsenal, the attacker's chosen token seats under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dromaiAshArtist,
        arsenal: [deathTouchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromaiAshArtist);
    const Dash = game.as(dash);

    Dromai.playAttack(deathTouchRed, { from: "arsenal" });
    game.advanceToDecision(Dromai, "effect-resolution");
    // The public player handle can answer only its own decision. This pins
    // chooser ownership to the attacker, while the token seats under the hit hero.
    Dromai.choose("frailty");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expectFabPlayer(Dash).toHaveTokenCount("frailty", 1);
  });
});
