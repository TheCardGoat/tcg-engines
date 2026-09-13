import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { jarlVetreiI } from "./jarl-vetrei-i.ts";
import { summitTheUnforgiving } from "../weapons/summit-the-unforgiving.ts";
import { pulseOfVolthavenRed } from "../instants/pulse-of-volthaven.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

/**
 * Hero behavior acceptance test — Jarl Vetrei I (AJV001).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: Ice play → Frostbite in exposed head/chest/arms/legs
 * - Core interaction: non-Ice play → no Frostbite
 * - Boundaries: successive Ice plays fill distinct exposed zones
 * - Signature weapon: Summit the Unforgiving (AJV002)
 *
 * Jarl Vetrei I (AJV001) — Elemental Guardian — 40hp Adult
 * Printed: "Whenever you play an Ice card, create a Frostbite token in an
 * opponent's exposed head, chest, arms, or legs zone."
 */

const opponentHero = dash;

describe("jarl-vetrei-i (AJV001)", () => {
  it("core mechanic: playing an Ice card creates a Frostbite in opponent's exposed head", () => {
    // AJV001-a1: static triggered on Ice play → create Frostbite among exposed
    // equipment zones. With all zones empty, head is the first exposed seat.
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [pulseOfVolthavenRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Jarl = game.as(jarlVetreiI);
    const Opp = game.as(opponentHero);

    // Act — play the Ice Instant (cost 0, no payment needed).
    Jarl.must.playInstant(pulseOfVolthavenRed);
    game.passBoth();

    // Assert — Frostbite lands in opponent's exposed head, not arena or Jarl.
    expect(Opp.zone("head")).toContain("token:frostbite");
    expect(Opp.zone("arena")).not.toContain("token:frostbite");
    expect(Jarl.zone("head")).not.toContain("token:frostbite");
  });

  it("core interaction: non-Ice play does NOT create Frostbite", () => {
    // AJV001-a1 filters on Ice supertype. A Generic Action (nimblism-blue)
    // must not fire the trigger.
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [nimblismBlue], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Jarl = game.as(jarlVetreiI);
    const Opp = game.as(opponentHero);

    // Act — play a non-Ice card (Generic Action, cost 0).
    Jarl.must.play(nimblismBlue);
    game.passBoth();

    // Assert — no Frostbite anywhere on opponent.
    expect(Opp.zone("head")).not.toContain("token:frostbite");
    expect(Opp.zone("chest")).not.toContain("token:frostbite");
    expect(Opp.zone("arms")).not.toContain("token:frostbite");
    expect(Opp.zone("legs")).not.toContain("token:frostbite");
    expect(Opp.zone("arena")).not.toContain("token:frostbite");
  });

  it("boundaries: successive Ice plays fill distinct exposed zones", () => {
    // Each Ice play creates one Frostbite in the first empty zone among
    // head/chest/arms/legs. Two plays → head then chest.
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [pulseOfVolthavenRed, pulseOfVolthavenRed],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Jarl = game.as(jarlVetreiI);
    const Opp = game.as(opponentHero);

    // Capture distinct instance refs for the two same-print Ice cards.
    const [first, second] = Jarl.cardsIn("hand", pulseOfVolthavenRed);
    expect(first).toBeDefined();
    expect(second).toBeDefined();

    // First Ice play → Frostbite in head.
    Jarl.must.playInstant(first!);
    game.passBoth();
    expect(Opp.zone("head")).toContain("token:frostbite");

    // Second Ice play → Frostbite in chest (head already occupied).
    Jarl.must.playInstant(second!);
    game.passBoth();
    expect(Opp.zone("head").filter((id) => id === "token:frostbite")).toHaveLength(1);
    expect(Opp.zone("chest")).toContain("token:frostbite");
  });

  it("signature weapon: Summit the Unforgiving attacks for 6 power when only weapon", () => {
    // Summit the Unforgiving (AJV002) — Earth Ice Guardian Weapon Polearm 1H.
    // Base 4{p}. Heavy (AJV002-a3): +2{p} if only card in weapon zones.
    // Once per Turn Action - {r}{r}{r}{r}{r}{r}: Attack.
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        weapon1: [summitTheUnforgiving],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Jarl = game.as(jarlVetreiI);

    // Act — activate the weapon (helper drains the 6-resource payment).
    Jarl.activate(summitTheUnforgiving);
    game.passBoth();

    // Assert — combat opened. Heavy +2 applies: base 4 + 2 = 6.
    expectCombat(game).toBeOpen().toHaveAttackPower(6);
  });

  it("boundaries: Summit is once per turn — second activation throws", () => {
    // Summit's activated ability has limit: { count: 1, per: "turn" }.
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        weapon1: [summitTheUnforgiving],
        resourcePoints: 12,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Jarl = game.as(jarlVetreiI);

    // First activation succeeds.
    Jarl.activate(summitTheUnforgiving);
    game.passBoth();
    expectCombat(game).toBeOpen();

    // Second activation in same turn is illegal (once-per-turn limit).
    Jarl.expectActivationRejected(summitTheUnforgiving);
  });
});
