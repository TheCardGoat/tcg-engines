/**
 * Hand-authored AAA for equipment that:
 * - gates on dealt / been-dealt physical damage (Blood Drop Brocade)
 * - applies next-AAC power or cost buffs (Cracker Jax, Heartened Cross Strap)
 * - buffs the next named Crouching Tiger (Tearing Shuko — model fixed to name)
 *
 * Case-by-case reasoning surfaced two structural gaps:
 * 1. has-status dealt-or-been-dealt-physical-damage-this-turn was fail-closed
 *    because damage-taken was never stamped on the victim.
 * 2. Tearing Shuko's appliesTo used subtypes Crouching+Tiger, but Crouching
 *    Tiger's type box is Ninja Action Attack — printed identity is the name.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, crouchingTiger } from "../../../fixtures.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

import { bloodDropBrocade } from "../../../../../../cards/src/cards/equipment/blood-drop-brocade.ts";
import { crackerJax } from "../../../../../../cards/src/cards/equipment/cracker-jax.ts";
import { heartenedCrossStrap } from "../../../../../../cards/src/cards/equipment/heartened-cross-strap.ts";
import { tearingShuko } from "../../../../../../cards/src/cards/equipment/tearing-shuko.ts";

const STARTING_LIFE = 40;

// ---------------------------------------------------------------------------
// MON238 blood-drop-brocade — Generic Chest d0
// Instant - Destroy: Gain {r}. Only if dealt or been dealt {p} damage this turn.
// ---------------------------------------------------------------------------

describe("blood-drop-brocade (MON238)", () => {
  it("boundaries: Instant activate is illegal before any physical damage this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodDropBrocade],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(bloodDropBrocade)).toThrow();
    expect(Bravo.zone("chest")).toContain(bloodDropBrocade.canonicalId);
  });

  it("core mechanic: after dealing physical damage, Instant destroy-self gains 1 RP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodDropBrocade],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[Bravo.id]!.history.turn.dealtDamage).toBe(true);
    expect(
      game.getState().players[Bravo.id]!.history.turn.damageDealtByType.physical,
    ).toBeGreaterThan(0);

    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(bloodDropBrocade);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(bloodDropBrocade.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodDropBrocade.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
  });

  it("core mechanic: after being dealt physical damage, Instant destroy-self gains 1 RP", () => {
    // Opponent hits first on their turn — then Bravo's Instant gates on been-dealt.
    // Simpler 1v1 path: Bravo is the defender, takes Snatch, then on next turn activates.
    // Same-turn path: start with opponent? Active player is always p1.
    // Use opponent dealing damage via playing on Bravo's open? Actually only turn player acts.
    // Arrange: Bravo takes damage by… we need the opponent to attack. Flip seats:
    // dash is p1 with snatch, bravo is p2 with brocade. After dash hits, end turn,
    // bravo activates.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: STARTING_LIFE,
        chest: [bloodDropBrocade],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[Bravo.id]!.history.turn.beenDealtDamage).toBe(true);
    expect(
      game.getState().players[Bravo.id]!.history.turn.damageTakenByType.physical,
    ).toBeGreaterThan(0);

    // Still Dash's turn — Instant can activate on either turn if the status is turn-scoped
    // and Bravo has priority? Instant is anytime priority. After combat, Dash has priority.
    // Pass to Bravo if needed, or just have Bravo activate if legal with priority.
    // Blood Drop is Instant — needs priority. Give Bravo priority via pass.
    Dash.pass();
    // If not Bravo's priority, pass again.
    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      Dash.pass();
    }

    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(bloodDropBrocade);
    game.passBoth();

    expect(Bravo.zone("chest")).not.toContain(bloodDropBrocade.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
  });
});

// ---------------------------------------------------------------------------
// ELE235 cracker-jax — Generic Arms d0
// Action - Destroy: next AAC +1{p}. Go again
// ---------------------------------------------------------------------------

describe("cracker-jax (ELE235)", () => {
  it("core mechanic: next AAC deals +1 power after destroy-self", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [crackerJax],
        hand: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(crackerJax);
    game.passBoth();
    expect(Bravo.zone("arms")).not.toContain(crackerJax.canonicalId);

    const lifeBefore = Opponent.life();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // Snatch 4 + 1 = 5.
    expect(Opponent.life()).toBe(lifeBefore - 5);
  });
});

// ---------------------------------------------------------------------------
// KSU006 heartened-cross-strap — Generic Chest d0
// Action - Destroy: next AAC costs {r}{r} less. Go again
// ---------------------------------------------------------------------------

describe("heartened-cross-strap (KSU006)", () => {
  it("core mechanic: next cost-2 AAC plays free after destroy-self", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartenedCrossStrap],
        hand: [brutalAssaultRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(heartenedCrossStrap);
    game.passBoth();
    expect(Bravo.zone("chest")).not.toContain(heartenedCrossStrap.canonicalId);

    // Without the -2 cost, Brutal Assault (cost 2) would be illegal at 0 RP.
    const lifeBefore = Opponent.life();
    Bravo.attackWith(brutalAssaultRed);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(lifeBefore - 6);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: without the strap, cost-2 AAC is illegal at 0 RP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.attackWith(brutalAssaultRed)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// DYN046 tearing-shuko — Ninja Arms d1 battleworn
// Instant - Destroy: next Crouching Tiger +2{p}
// ---------------------------------------------------------------------------

describe("tearing-shuko (DYN046)", () => {
  it("core mechanic: next Crouching Tiger deals base 0 + 2 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tearingShuko],
        hand: [crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(tearingShuko);
    game.passBoth();
    expect(Bravo.zone("arms")).not.toContain(tearingShuko.canonicalId);

    const lifeBefore = Opponent.life();
    Bravo.attackWith(crouchingTiger);
    game.helpers.resolveRestOfCombat();
    // Printed power 0 + tearing shuko +2 = 2.
    expect(Opponent.life()).toBe(lifeBefore - 2);
  });

  it("boundaries: a non-Crouching-Tiger AAC does not receive the +2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [tearingShuko],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: STARTING_LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.activate(tearingShuko);
    game.passBoth();

    const lifeBefore = Opponent.life();
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(lifeBefore - 4);
  });
});
