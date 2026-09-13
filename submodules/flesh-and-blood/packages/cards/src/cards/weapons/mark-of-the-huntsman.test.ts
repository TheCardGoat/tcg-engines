import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { markOfTheHuntsman } from "./mark-of-the-huntsman.ts";
import { hunterSKlaive } from "./hunter-s-klaive.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Mark of the Huntsman (HNT010) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 2 resources, opens combat with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [markOfTheHuntsman],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(markOfTheHuntsman);
    game.passBoth();

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(1);

    // resolveRestOfCombat would hit the on-hit optional decision — use resolveUntilIdle instead.
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Arakni.actionPoints()).toBe(1);
  });

  it("happy: hit on hero offers optional destroy-self + mark; accepting marks the opponent and destroys weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [markOfTheHuntsman],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(markOfTheHuntsman);
    // Resolve combat — the on-hit optional decision fires.
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Opponent is marked and weapon is destroyed (in graveyard).
    expectFabPlayer(game.as(dash)).toBeMarked();
    expectFabCard(Arakni, markOfTheHuntsman).toBeIn("graveyard");
  });

  it("happy: attacking a marked hero gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        weapon2: [markOfTheHuntsman],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    // Step 1: mark the opponent using Hunter's Klaive.
    Arakni.activate(hunterSKlaive);
    game.helpers.resolveRestOfCombat();

    // Step 2: activate Mark of the Huntsman against the now-marked hero.
    Arakni.activate(markOfTheHuntsman);
    game.passBoth();

    // Base power 1 + 1 vs marked = 2.
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: base power is 1 without mark bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [markOfTheHuntsman],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(markOfTheHuntsman);
    game.passBoth();

    // No mark on opponent — power stays at base 1.
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("boundary: attacking an unmarked hero does NOT get the power bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [markOfTheHuntsman],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(markOfTheHuntsman);
    game.passBoth();

    // No mark on opponent — power stays at base 1.
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [markOfTheHuntsman],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Arakni = game.as(arakniMarionette);

    // First activation.
    Arakni.activate(markOfTheHuntsman);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Second activation should fail — once per turn limit.
    Arakni.expectActivationRejected(markOfTheHuntsman);
  });
});
