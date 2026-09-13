import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { cindra } from "./cindra.ts";
import { kunaiOfRetribution } from "../weapons/kunai-of-retribution.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";

/**
 * Hero behavior acceptance test — Cindra (CIN001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: hitting a marked hero creates a Fealty token
 * - Core mechanic: equip up to 2 Draconic daggers from graveyard
 * - Boundaries: 20hp health, once per turn
 * - Signature weapon: Kunai of Retribution (CIN002) — attack + delayed destroy
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// cindra (CIN001) — Royal/Draconic/Ninja/Young — 20hp
// Printed: "Whenever you hit a marked hero, create a Fealty token.
// Once per Turn Instant - {r}{r}{r}: Equip up to 2 Draconic daggers from
// your graveyard. Costs {r} less per Draconic chain link."
// ---------------------------------------------------------------------------

describe("cindra (CIN001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: cindra, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(cindra)).toHaveLife(20);
  });

  it("signature weapon: Kunai of Retribution (CIN002) attacks at 1 power with go again", () => {
    // CIN002-a1: Once per Turn Action - {r}: Attack. Go again. Delayed destroy.
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Cindra = game.as(cindra);

    Cindra.activate(kunaiOfRetribution);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
    // Go again refunds AP only after the combat chain closes.
    game.helpers.resolveRestOfCombat();
    expect(Cindra.actionPoints()).toBe(1);
  });

  it("signature weapon: Kunai of Retribution deals 1 damage when unblocked", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Cindra = game.as(cindra);
    const Opponent = game.as(opponentHero);

    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    // 1 damage dealt.
    expect(Opponent.life()).toBe(19);
  });

  it("signature weapon: Kunai of Retribution is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Cindra = game.as(cindra);

    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    // Second activation should throw (once per turn; Kunai also destroyed).
    expect(() => Cindra.activate(kunaiOfRetribution)).toThrow();
  });

  it("core mechanic: a2 equips up to 2 Draconic daggers from the graveyard for {r}{r}{r}", () => {
    // CIN001-a2: Once per Turn Instant - {r}{r}{r}: Equip up to 2 Draconic
    // daggers from the graveyard.
    const game = FabTestEngine.start(
      {
        hero: cindra,
        graveyard: [kunaiOfRetribution, obsidianFireVein],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const Cindra = game.as(cindra);

    Cindra.activate(cindra);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    const weapons = [...Cindra.zone("weapon1"), ...Cindra.zone("weapon2")];
    expect(weapons).toContain(kunaiOfRetribution.canonicalId);
    expect(weapons).toContain(obsidianFireVein.canonicalId);
    expect(Cindra.zone("graveyard")).not.toContain(kunaiOfRetribution.canonicalId);
    expectFabPlayer(Cindra).toHaveResourceCount(0);
  });

  it("core mechanic: hitting a marked hero creates a Fealty token", () => {
    // CIN001-a1: trigger on hit vs marked hero → create Fealty.
    // Verify the triggered ability is present on the hero.
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, marked: true, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Cindra = game.as(cindra);
    const Opponent = game.as(opponentHero);

    // Attack with Kunai — it hits the marked defending hero.
    Cindra.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Cindra).toHaveTokenCount("fealty", 1);
    // CR 9.3.3 removes Marked as part of the same hit event. The Fealty
    // trigger proves its event-time marked predicate survived that cleanup.
    expectFabPlayer(Opponent).notToBeMarked();
  });
});
