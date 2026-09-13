import { describe, it } from "vitest";
import {
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { upholdTradition } from "./uphold-tradition.ts";

const wardAura = fabToken("spectral-shield");

/**
 * Uphold Tradition (ENG005) — Mystic Illusionist Equipment - Arms.
 *
 * Printed: Cloaked. Instant - {r}, turn this face-up: Put a +1{p} counter on
 * an aura you control with ward. Ward 1.
 */

describe("Uphold Tradition (ENG005) AAA", () => {
  it("happy: turning this face up puts a +1{p} counter on an aura you control with ward", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [upholdTradition],
        arena: [wardAura],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.activate(upholdTradition);
    game.untilIdle();

    expectFabCard(Enigma, upholdTradition).toBeIn("arms");
    expectFabCard(Enigma, upholdTradition).toBeFaceUp();
    expectFabCard(Enigma, wardAura).toHaveCounters(1);
  });

  it("boundary: once face up the turn-face-up cost is illegal, so no second counter", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        arms: [upholdTradition],
        arena: [wardAura],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.activate(upholdTradition);
    game.untilIdle();
    expectFabCard(Enigma, wardAura).toHaveCounters(1);

    Enigma.expectActivationRejected(upholdTradition);
    expectFabCard(Enigma, wardAura).toHaveCounters(1);
    // The rejected activation must not have spent the second {r}.
    expectFabPlayer(Enigma).toHaveResourceCount(1);
  });
});
