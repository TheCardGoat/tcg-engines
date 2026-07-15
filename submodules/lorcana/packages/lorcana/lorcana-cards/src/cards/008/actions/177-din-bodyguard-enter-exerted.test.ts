import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { downInNewOrleans } from "@tcg/lorcana-cards/cards/008";

/**
 * Triage report 2026-05-11 (#11, game mgIkWFaJZPQEZ1EMb5iWXsK turn 11):
 *
 * Player cast Down in New Orleans which revealed Thunderbolt — Wonder Dog
 * (Bodyguard). The scry resolution let them play Thunderbolt for free, but
 * the engine never honored Bodyguard's "may enter exerted" option — the
 * character always landed ready. The resolveEffect destination payload had
 * no slot for that decision.
 *
 * Engine fix: propagate `enterPlayExerted` from the resolveEffect/playCard
 * resolution input into the scry-play branch. When the played card has
 * Bodyguard and the player chose `enterPlayExerted: true`, the card enters
 * play exerted.
 */

const bodyguardChar = createMockCharacter({
  id: "din-bg-enter-exerted",
  name: "Bodyguard Hero",
  cost: 4,
  willpower: 5,
  strength: 2,
  abilities: [{ type: "keyword", keyword: "Bodyguard" }],
});

const noBodyguardChar = createMockCharacter({
  id: "din-no-bg",
  name: "Plain Char",
  cost: 4,
  willpower: 5,
  strength: 2,
});

// Cards like Mickey Mouse — Expedition Leader and Hamish, Hubert & Harris print
// a non-Bodyguard "may enter exerted" static ability. The scry resolver must
// honor enterPlayExerted for these too (review feedback Codex P2).
const mayEnterExertedChar = createMockCharacter({
  id: "din-may-enter-exerted",
  name: "Long Journey Mock",
  cost: 4,
  willpower: 5,
  strength: 2,
  abilities: [
    {
      id: "mock-long-journey",
      name: "LONG JOURNEY",
      type: "static",
      text: "This character may enter play exerted.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
  ],
});

const fillerA = createMockItem({ id: "din-bg-filler-a", name: "Filler A", cost: 1 });
const fillerB = createMockItem({ id: "din-bg-filler-b", name: "Filler B", cost: 1 });

describe("Down in New Orleans — Bodyguard enter-exerted", () => {
  it("plays a Bodyguard character exerted when enterPlayExerted is true", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [downInNewOrleans],
        inkwell: downInNewOrleans.cost,
        deck: [fillerA, fillerB, bodyguardChar],
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(downInNewOrleans, {
        destinations: [
          { zone: "play", cards: bodyguardChar },
          { zone: "deck-bottom", cards: [fillerA, fillerB] },
        ],
        enterPlayExerted: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.isExerted(bodyguardChar)).toBe(true);
  });

  it("plays a Bodyguard character ready when enterPlayExerted is false (or omitted)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [downInNewOrleans],
        inkwell: downInNewOrleans.cost,
        deck: [fillerA, fillerB, bodyguardChar],
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(downInNewOrleans, {
        destinations: [
          { zone: "play", cards: bodyguardChar },
          { zone: "deck-bottom", cards: [fillerA, fillerB] },
        ],
        enterPlayExerted: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.isExerted(bodyguardChar)).toBe(false);
  });

  it("plays a 'may enter play exerted' non-Bodyguard character exerted when chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [downInNewOrleans],
        inkwell: downInNewOrleans.cost,
        deck: [fillerA, fillerB, mayEnterExertedChar],
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(downInNewOrleans, {
        destinations: [
          { zone: "play", cards: mayEnterExertedChar },
          { zone: "deck-bottom", cards: [fillerA, fillerB] },
        ],
        enterPlayExerted: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.isExerted(mayEnterExertedChar)).toBe(true);
  });

  it("ignores enterPlayExerted: true for a plain character with no entry-mode option", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [downInNewOrleans],
        inkwell: downInNewOrleans.cost,
        deck: [fillerA, fillerB, noBodyguardChar],
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(downInNewOrleans, {
        destinations: [
          { zone: "play", cards: noBodyguardChar },
          { zone: "deck-bottom", cards: [fillerA, fillerB] },
        ],
        enterPlayExerted: true,
      }),
    ).toBeSuccessfulCommand();

    // No entry-mode option: enterPlayExerted has no effect, character lands ready.
    expect(testEngine.isExerted(noBodyguardChar)).toBe(false);
  });
});
