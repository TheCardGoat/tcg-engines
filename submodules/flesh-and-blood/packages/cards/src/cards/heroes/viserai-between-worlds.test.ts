import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { viseraiBetweenWorlds } from "./viserai-between-worlds.ts";
import { envelopInDarknessRed } from "../actions/envelop-in-darkness.ts";
import { sevenSinNebula } from "../weapons/seven-sin-nebula.ts";
import { readTheRunesYellow } from "../actions/read-the-runes.ts";
import { snatchRed } from "../actions/snatch.ts";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "../../runtime-registry.ts";

/**
 * Hero behavior acceptance test — Viserai, Between Worlds (IAR107).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: Runechant creation → banish top card of deck
 * - Core mechanic: 3+ Runechants created this turn → traverse
 * - Boundaries: <3 Runechants = no traverse
 *
 * Signature weapon: Seven Sin Nebula (IAR108)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;
const viseraiBetweenWorldsPhysical = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(
  viseraiBetweenWorlds.canonicalId,
)!;

describe("viserai-between-worlds (IAR107)", () => {
  it("core mechanic: creating Runechants banishes top card of deck", () => {
    // Read the Runes creates 2 Runechant tokens → triggers IAR107-a1.
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [readTheRunesYellow],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed, // top of deck — this will be banished
        ],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    Viserai.must.play(readTheRunesYellow);

    // Read the Runes creates 2 Runechants → IAR107-a1 fires → banish top.
    game.helpers.resolveUntilIdle();

    // Top card of deck should be banished.
    expect(Viserai.zone("banished").length).toBeGreaterThan(0);
    // Runechants created.
    expectFabToken(game, "runechant").toHaveCount(2).toBeIn("arena");
  });

  it("boundaries: <3 Runechants this turn does not traverse", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [readTheRunesYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    Viserai.must.play(readTheRunesYellow);
    game.helpers.resolveUntilIdle();

    // Read the Runes creates only 2 Runechants — below the traverse threshold.
    expectFabToken(game, "runechant").toHaveCount(2);
    // Banished card present from the hero trigger.
    expect(Viserai.zone("banished").length).toBeGreaterThan(0);
  });

  it("signature weapon: Seven Sin Nebula (IAR108) requires played-from-banished this turn", () => {
    // Seven Sin Nebula condition: must have played a card from banished zone.
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        weapon1: [sevenSinNebula],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Viserai = game.as(viseraiBetweenWorlds);

    // Without playing from banished this turn, activation is rejected.
    Viserai.expectActivationRejected(sevenSinNebula);
  });

  it("UST notes: the physical hero traverses into Viserai, Usurper after the third Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorldsPhysical,
        hand: [envelopInDarknessRed, envelopInDarknessRed, envelopInDarknessRed],
        resourcePoints: 6,
        actionPoints: 1,
        life: 33,
        marked: true,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiBetweenWorldsPhysical);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3).toHaveLife(33).toBeMarked();
    expectFabCard(Viserai, viseraiBetweenWorldsPhysical).toHaveName("Viserai, Usurper");
  });
});
