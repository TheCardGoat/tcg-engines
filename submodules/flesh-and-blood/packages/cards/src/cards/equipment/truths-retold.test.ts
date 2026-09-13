import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { truthsRetold } from "./truths-retold.ts";
import { tensionInTheAirBlue } from "../instants/tension-in-the-air.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Truths Retold (MST029) — Mystic Illusionist Equipment - Head, Cloaked,
 * Ward 1.
 *
 * Printed: "Cloaked / Instant - {r}, turn this face-up: Put an aura from your
 * graveyard on the bottom of your deck. / Ward 1"
 */
describe("Truths Retold (MST029) AAA", () => {
  it("happy: turning the cloaked head face-up buries an aura from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        head: [{ card: truthsRetold, state: { faceDown: true } }],
        graveyard: [tensionInTheAirBlue],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    // Cloaked: the head starts face down.
    expectFabCard(Enigma, truthsRetold).toBeFaceDown();

    // {r}, turn this face-up: an aura from the graveyard goes to deck bottom.
    Enigma.activate(truthsRetold);
    game.helpers.resolveUntilIdle();

    expectFabCard(Enigma, truthsRetold).toBeFaceUp();
    expect(Enigma.cardsIn("deck", tensionInTheAirBlue)).toHaveLength(1);
    expect(Enigma.cardsIn("graveyard", tensionInTheAirBlue)).toHaveLength(0);
    expectFabPlayer(Enigma).toHaveResourceCount(0);
  });

  it("boundary: with no aura in the graveyard the head turns up but nothing moves", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        head: [{ card: truthsRetold, state: { faceDown: true } }],
        graveyard: [snatchRed],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.activate(truthsRetold);
    game.helpers.resolveUntilIdle();

    // The head still turns face up and pays {r}, but no aura exists to bury.
    expectFabCard(Enigma, truthsRetold).toBeFaceUp();
    expectFabPlayer(Enigma).toHaveResourceCount(0);
    expect(Enigma.cardsIn("graveyard", snatchRed)).toHaveLength(1);
    expect(Enigma.zone("deck")).toHaveLength(6);
  });
});
