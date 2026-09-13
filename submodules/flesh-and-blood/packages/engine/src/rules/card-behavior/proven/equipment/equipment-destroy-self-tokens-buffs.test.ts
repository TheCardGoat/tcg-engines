/**
 * Hand-authored AAA for destroy-self equipment that create tokens, mark the
 * opponent, or buff the next qualifying attack.
 *
 * Each card module was read end-to-end before writing scenarios. No dumps.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { runeholdRelease } from "../../../../../../cards/src/cards/equipment/runehold-release.ts";
import { vigorGirth } from "../../../../../../cards/src/cards/equipment/vigor-girth.ts";
import { goliathGauntlet } from "../../../../../../cards/src/cards/equipment/goliath-gauntlet.ts";
import { preySpotters } from "../../../../../../cards/src/cards/equipment/prey-spotters.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const STARTING_LIFE = 40;

// ---------------------------------------------------------------------------
// AUA005 runehold-release — Runeblade Arms d0
// Action - Destroy this: Create a Runechant token. Go again
//
// Reasoning:
// - create-token with controller:controller (no target decision, unlike Coat).
// - Runechant is the classic Runeblade aura token path.
// - go again refunds the Action AP.
// ---------------------------------------------------------------------------

describe("runehold-release (AUA005)", () => {
  it("core mechanic: destroy-self creates a Runechant under controller and refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [runeholdRelease],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(runeholdRelease);
    game.passBoth();

    expect(Bravo.zone("arms")).not.toContain(runeholdRelease.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(runeholdRelease.canonicalId);
    expect(Bravo.zone("arena").some((id) => id.toLowerCase().includes("runechant"))).toBe(true);
    expect(Bravo.actionPoints()).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// BET005 vigor-girth — Guardian/Warrior Chest d1 bladeBreak
// Action - Destroy this: Create a Vigor token. Go again
//
// Reasoning:
// - Same destroy→token shape as runehold, different token id (vigor).
// - bladeBreak is a second lifecycle path; core AAA here is the activate.
// ---------------------------------------------------------------------------

describe("vigor-girth (BET005)", () => {
  it("core mechanic: destroy-self creates a Vigor token under controller", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [vigorGirth],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(vigorGirth);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(vigorGirth.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(vigorGirth.canonicalId);
    expect(Bravo.zone("arena").some((id) => id.toLowerCase().includes("vigor"))).toBe(true);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: bladeBreak defend destroys the equipment without creating Vigor", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: STARTING_LIFE,
        chest: [vigorGirth],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(vigorGirth);
    game.helpers.resolveRestOfCombat();

    // d1 bladeBreak: life loss 4-1=3, equipment destroyed, no Vigor from defend.
    expect(Defender.life()).toBe(STARTING_LIFE - 3);
    expect(Defender.zone("chest")).not.toContain(vigorGirth.canonicalId);
    expect(Defender.zone("arena").some((id) => id.toLowerCase().includes("vigor"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// BVO006 goliath-gauntlet — Generic Arms d0
// Action - Destroy this: The next AAC with cost 2+ you play this turn gets
// +2{p}. Go again
//
// Reasoning:
// - appliesTo.next with cost gte 2 is the interesting filter.
// - cost-0 Snatch must NOT receive the buff (negative filter).
// - cost-2 Brutal Assault must receive +2 (base 6 → 8 damage).
// - If cost filter is ignored, both would buff and the negative fails.
// ---------------------------------------------------------------------------

describe("goliath-gauntlet (BVO006)", () => {
  it("core mechanic: next cost-2+ AAC deals +2 power after destroy-self", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [goliathGauntlet],
        hand: [brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(goliathGauntlet);
    game.passBoth();
    expect(Bravo.zone("arms")).not.toContain(goliathGauntlet.canonicalId);

    const lifeBefore = Opponent.life();
    Bravo.attackWith(brutalAssaultRed);
    game.helpers.resolveRestOfCombat();

    // Printed 6 + goliath +2 = 8.
    expect(Opponent.life()).toBe(lifeBefore - 8);
  });

  it("boundaries: cost-0 AAC does not receive the +2 power buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [goliathGauntlet],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(goliathGauntlet);
    game.passBoth();

    const lifeBefore = Opponent.life();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Snatch printed power 4, cost 0 — filter excludes it.
    expect(Opponent.life()).toBe(lifeBefore - 4);
  });
});

// ---------------------------------------------------------------------------
// AAC004 prey-spotters — Assassin Head d1 battleworn
// Attack Reaction - Destroy this: Mark target opposing hero.
//
// Reasoning:
// - abilityType attack-reaction: illegal outside the reaction window.
// - 1v1: selector "opponent" binds the sole opposing seat (no multi-target UI).
// - Mark is a player status flag (rules-visible on player state).
// ---------------------------------------------------------------------------

describe("prey-spotters (AAC004)", () => {
  it("boundaries: Attack Reaction is illegal outside open combat reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [preySpotters],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(preySpotters)).toThrow();
    expect(Bravo.zone("head")).toContain(preySpotters.canonicalId);
  });

  it("core mechanic: during reaction, destroy-self marks the sole opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [preySpotters],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(game.getState().players[Opponent.id]!.marked).toBe(false);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(preySpotters);
    game.passBoth();

    expect(Bravo.zone("head")).not.toContain(preySpotters.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(preySpotters.canonicalId);
    expect(game.getState().players[Opponent.id]!.marked).toBe(true);
  });
});
