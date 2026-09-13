import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snapShotRed } from "./snap-shot.ts";

/**
 * Snap Shot (ELE041) — Ranger Action - Attack (arrow).
 * Printed: "Lightning Fusion / If Snap Shot was fused, you may activate
 * abilities of bows you control an additional time this turn and as though
 * they were an instant."
 *
 * Enforcement (§5 row ELE041, resolved): the fused allow/activate rule now
 * materializes during the attack's window (CR 7.3.1) with a CR 5.2.3
 * activation-limit companion, and the as-instant half waives both the
 * action-phase timing gate and the action point (CR 8.1.1d). The unfused
 * contrast pins that the grant is fused-only.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Snap Shot (ELE041) AAA", () => {
  it("happy: fused Snap Shot resolves and the bow still activates once this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [lightningPressRed, searingShotRed],
        arsenal: [snapShotRed],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
      manual,
    );
    game
      .as(azalea)
      .attackWith(snapShotRed, { from: "arsenal", fuse: true, fuseCards: [lightningPressRed] });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(bravo)).toHaveLife(16);

    // First bow activation of the turn: load an arrow, draw.
    game.as(azalea).activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(game.as(azalea).zone("arsenal")).toEqual([searingShotRed.canonicalId]);
  });

  it("grant: fused Snap Shot lets the bow activate one additional time this turn (CR 5.2.3)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [lightningPressRed, searingShotRed],
        arsenal: [snapShotRed],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);
    Azalea.attackWith(snapShotRed, { from: "arsenal", fuse: true, fuseCards: [lightningPressRed] });
    game.helpers.resolveRestOfCombat();

    // First bow activation of the turn: base once-per-turn limit (CR 5.2.3).
    Azalea.activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(game.as(azalea).zone("arsenal")).toEqual([searingShotRed.canonicalId]);

    // Printed "an additional time this turn": the second activation is
    // accepted — the activationLimitModifier granted at window
    // materialization raises the bow's limit to 2. Death Dealer's load needs
    // an empty arsenal, so the extra activation legally resolves as a no-op.
    Azalea.activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(game.as(azalea).zone("arsenal")).toEqual([searingShotRed.canonicalId]);

    // Exactly ONE additional: the third activation is still limited.
    const rejection = Azalea.expectActivationRejected(deathDealer);
    expect(rejection.errorCode).toBe("activation_limit");
  });

  it("grant: the bow activates mid-defend-window as though an instant (CR 8.1.1d)", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [lightningPressRed, searingShotRed],
        arsenal: [snapShotRed],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    game
      .as(azalea)
      .attackWith(snapShotRed, { from: "arsenal", fuse: true, fuseCards: [lightningPressRed] });
    game.advanceCombatTo("reaction");

    // Printed "and as though they were an instant": during the reaction step
    // (outside the action phase) the attacker may {t} the bow — CR 8.1.1d
    // waives the timing gate and the action point.
    game.as(azalea).activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expect(game.as(azalea).zone("arsenal")).toEqual([searingShotRed.canonicalId]);

    game.helpers.resolveRestOfCombat();
  });

  it("boundary: unfused Snap Shot leaves the once-per-turn bow limit intact", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [searingShotRed],
        arsenal: [snapShotRed],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);
    Azalea.attackWith(snapShotRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    Azalea.activate(deathDealer);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // Without fusion no additional activation is granted, so rejecting the
    // second activation is correct behavior.
    Azalea.expectActivationRejected(deathDealer);
  });
  it("boundary: unfused Snap Shot does not open the reaction-step as-instant window", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [searingShotRed],
        arsenal: [snapShotRed],
        resourcePoints: 4,
        actionPoints: 4,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      manual,
    );
    const Azalea = game.as(azalea);
    // Unfused: the bow grant never arms, so the action-type weapon activation
    // must be rejected at the reaction step — the mirror of the fused
    // mid-reaction acceptance. The CR 8.1.1d as-instant waiver rides the
    // printed fused grant; without fusion there is no timing waiver.
    Azalea.attackWith(snapShotRed, { from: "arsenal" });
    game.advanceCombatTo("reaction");
    Azalea.expectActivationRejected(deathDealer);
  });
});
