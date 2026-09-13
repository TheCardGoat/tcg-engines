import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { iyslander } from "./iyslander.ts";
import { krakenSAethervein } from "../weapons/kraken-s-aethervein.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Iyslander (EVR120).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: opponent's turn — blue non-attack action arsenal → instant
 * - Core mechanic: Ice card during opponent's turn → Frostbite token
 * - Boundaries: 18hp health
 *
 * Signature weapon: Kraken's Aethervein (EVR121)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// iyslander (EVR120) — Elemental/Wizard/Young — 18hp
// Printed: "If it's not your turn, you may play blue 'non-attack' action
// cards from your arsenal as though they were an instant."
// "Whenever you play an Ice card during an opponents turn, create a
// Frostbite token under their control."
// Signature weapon: Kraken's Aethervein (EVR121) — Wizard Weapon Staff 2H
//   Once per Turn Instant - {r}{r}{r}: Deal 1 arcane damage to target
//   opposing hero. Draw a card for each arcane damage dealt this way.
// ---------------------------------------------------------------------------

describe("iyslander (EVR120)", () => {
  it("boundaries: hero defaults to 18 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: iyslander, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(iyslander)).toHaveLife(18);
  });

  it("core mechanic: an Ice instant on an opponent's turn creates a Frostbite under them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: iyslander, hand: [blizzardBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    game.toReaction("defender");
    Iyslander.play(blizzardBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(game.as(iyslander)).toHaveTokenCount("frostbite", 0);
  });

  it("core mechanic: not your turn — a blue non-attack action from arsenal plays as an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: iyslander, arsenal: [nimblismBlue], actionPoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    game.toReaction("defender");
    Iyslander.playFromArsenal(nimblismBlue);
    game.untilIdle({ ordering: "listed" });

    // Playing an Action outside her own turn is only legal as the printed
    // instant — the card resolves into the graveyard.
    expectFabCard(Iyslander, nimblismBlue).toBeIn("graveyard");
  });

  it("signature weapon: Kraken's Aethervein activates as an instant and deals arcane damage", () => {
    // EVR121-a1: Once per Turn Instant - {r}{r}{r}: Deal 1 arcane to opposing hero.
    // Draw a card for each arcane damage dealt this way.
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        weapon1: [krakenSAethervein],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Iyslander = game.as(iyslander);
    const Opponent = game.as(opponentHero);
    const lifeBefore = Opponent.life();

    Iyslander.activate(krakenSAethervein);
    game.helpers.resolveUntilIdle();

    // Arcane damage dealt → opponent loses 1 life.
    expect(Opponent.life()).toBe(lifeBefore - 1);
  });

  it("boundaries: Kraken's Aethervein is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        weapon1: [krakenSAethervein],
        resourcePoints: 6,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Iyslander = game.as(iyslander);

    Iyslander.activate(krakenSAethervein);
    game.helpers.resolveUntilIdle();

    // Second activation must fail — once per turn limit.
    Iyslander.expectActivationRejected(krakenSAethervein);
  });

  it("boundaries: Kraken's Aethervein cannot activate without sufficient resources", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        weapon1: [krakenSAethervein],
        hand: [],
        resourcePoints: 2, // Need 3, have 2
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Iyslander = game.as(iyslander);

    Iyslander.expectActivationRejected(krakenSAethervein);
  });

  it("core mechanic: Kraken's Aethervein draws for the arcane damage it deals", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        weapon1: [krakenSAethervein],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Iyslander = game.as(iyslander);
    const handBefore = Iyslander.handCount();

    Iyslander.activate(krakenSAethervein);
    game.helpers.resolveUntilIdle();

    // Should draw 1 card (1 arcane damage dealt).
    expect(Iyslander.handCount()).toBe(handBefore + 1);
  });
});
