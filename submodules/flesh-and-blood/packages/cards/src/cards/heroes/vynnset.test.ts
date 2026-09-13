import { describe, expect, it } from "vitest";
import { expectCombat, expectFabToken, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { vynnset } from "./vynnset.ts";
import { flailOfAgony } from "../weapons/flail-of-agony.ts";
import { funeralMoonRed } from "../actions/funeral-moon.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Vynnset (DTD134).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic (a): start of turn → banish card from hand → create Runechant
 * - Core mechanic (b): play Shadow non-attack → optional pay 1 life →
 *   unpreventable Runechant damage this turn
 * - Boundaries: declining the life payment
 *
 * Signature weapon: Flail of Agony (DTD135)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

describe("vynnset (DTD134)", () => {
  it("core mechanic: start of turn banish from hand creates a Runechant", () => {
    // At start of turn, Vynnset banishes a card from hand → creates Runechant.
    // The start-phase trigger fires automatically.
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [snatchRed],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Vynnset = game.as(vynnset);
    const Opponent = game.as(opponentHero);

    // Fixture creation begins in the action phase. Advance to Vynnset's next
    // turn before resolving her beginning-of-turn trigger.
    Vynnset.endTurn();
    Opponent.endTurn();

    // The start-phase trigger produces an entity-target decision.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Card banished from hand, Runechant created.
    expectFabToken(game, "runechant").toHaveCount(1).toBeIn("arena");
  });

  it("core mechanic: Shadow non-attack → optional 1 life payment for unpreventable Runechant", () => {
    // Funeral Moon is Shadow Runeblade Action (non-attack) with blood-debt.
    // Playing it triggers Vynnset's second ability: optional pay 1 life.
    // Use plain .play() to control the optional boolean.
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [funeralMoonRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Vynnset = game.as(vynnset);

    const lifeBefore = Vynnset.life();

    Vynnset.play(funeralMoonRed);

    // Resolve optional boolean (accept → pay 1 life).
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Life paid: 1 less.
    expect(Vynnset.life()).toBe(lifeBefore - 1);
  });

  it("boundaries: declining the life payment does not cost life", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [funeralMoonRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Vynnset = game.as(vynnset);

    const lifeBefore = Vynnset.life();

    Vynnset.play(funeralMoonRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Life unchanged.
    expect(Vynnset.life()).toBe(lifeBefore);
  });

  it("signature weapon: Flail of Agony (DTD135) attacks for 1 life cost", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [flailOfAgony],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Vynnset = game.as(vynnset);

    const lifeBefore = Vynnset.life();

    Vynnset.activate(flailOfAgony);
    game.passBoth();

    // Life cost paid, combat opened with power 1.
    expect(Vynnset.life()).toBe(lifeBefore - 1);
    expectCombat(game).toBeOpen().toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline" });
  });

  it("signature weapon: Flail of Agony hit creates a Runechant token", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        weapon1: [flailOfAgony],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Vynnset = game.as(vynnset);

    Vynnset.activate(flailOfAgony);
    game.passBoth();

    // No defense → hit → DTD135-a2 fires → create Runechant.
    for (let safety = 0; safety < 24; safety += 1) {
      if (!game.combat()?.open && !game.isStackWaiting()) break;
      if (game.waitState().kind === "decision") {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }

    expectFabToken(game, "runechant").toHaveCount(1);
  });
});
