import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { briarWardenOfThorns } from "./briar-warden-of-thorns.ts";
import { rosettaThorn } from "../weapons/rosetta-thorn.ts";
import { electrifyRed as electrify } from "../actions/electrify.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Briar, Warden of Thorns (ELE062).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic (a): first attack-action damage to opposing hero each turn
 *   creates an Embodiment of Earth token
 * - Core mechanic (b): second non-attack action card each turn creates an
 *   Embodiment of Lightning token
 * - Core interaction: dual triggers same turn — Lightning from 2nd non-attack
 *   then Earth from AAC damage
 * - Boundaries: Earth once per turn, AACs don't count toward Lightning ordinal
 * - Boundaries: hero defaults to 40 life (adult hero)
 * - Signature weapon: Rosetta Thorn (ELE222)
 *
 * Pattern mirrors ELE063-briar.test.ts (Young Briar, 20hp) with adult stats.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// briar, Warden of Thorns (ELE062) — Elemental/Runeblade — 40hp
// Ability 1: "The first time an attack action card you control deals damage
//   to an opposing hero, create an Embodiment of Earth token."
// Ability 2: "Whenever you play your second 'non-attack' action card each
//   turn, create an Embodiment of Lightning token."
// ---------------------------------------------------------------------------

describe("briar-warden-of-thorns (ELE062) AAA", () => {
  it("boundaries: hero defaults to 40 life (adult hero health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: briarWardenOfThorns, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(briarWardenOfThorns)).toHaveLife(40);
  });

  it("core mechanic: second non-attack action card each turn creates an Embodiment of Lightning token", () => {
    // Arrange — two non-attack action cards in hand.
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [tomeOfFyendalYellow, electrify],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);

    // Act — play the first non-attack action (no token: ordinal 1 ≠ 2).
    Briar.must.play(tomeOfFyendalYellow);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

    // Play the second non-attack action → triggers Briar's ordinal-2 ability.
    Briar.must.play(electrify);

    // Assert — Embodiment of Lightning token created.
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
  });

  it("core mechanic: first attack-action damage to opposing hero creates an Embodiment of Earth token", () => {
    // Arrange — Briar with an attack action card.
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);
    const Opponent = game.as(opponentHero);

    const attacks = Briar.cardsIn("hand", snatchRed);
    expect(attacks).toHaveLength(1);

    // Act — play the attack and resolve combat.
    Briar.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Engine applies damage correctly. Dash (opponent) defaults to 20hp.
    expect(Opponent.life()).toBe(16); // 20 − 4

    // Assert — Embodiment of Earth token created on first dealt damage.
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
  });

  it("boundaries: Embodiment of Earth trigger fires only once per turn", () => {
    // Two attacks: first creates Earth token, second does not.
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);
    const attacks = Briar.cardsIn("hand", snatchRed);

    // First attack — Earth token created after combat resolves.
    Briar.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);

    // Second attack — no additional token (limit: count 1).
    Briar.must.playAttack(attacks[1]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
  });

  it("core interaction: dual triggers same turn — Lightning from 2nd non-attack then Earth from AAC damage", () => {
    // Independent paths fire the same turn.
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [tomeOfFyendalYellow, electrify, snatchRed],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);

    Briar.must.play(tomeOfFyendalYellow);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);

    Briar.must.play(electrify);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);

    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    // Earth token from AAC damage; the Lightning Embodiment expired at end of combat.
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
  });

  it("boundaries: attack actions do not count toward the second non-attack Lightning ordinal", () => {
    // One AAC + one non-attack is not "second non-attack".
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [snatchRed, electrify],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);

    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    // Earth token created from first AAC damage.
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    Briar.must.play(electrify);
    // Still only one non-attack played this turn → no Lightning.
    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
  });

  it("signature weapon: Rosetta Thorn (ELE222) can attack for 1{r} with base power 2", () => {
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        weapon1: [rosettaThorn],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Briar = game.as(briarWardenOfThorns);

    Briar.activate(rosettaThorn);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
  });
});
