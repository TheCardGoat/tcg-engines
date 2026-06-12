import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { perilousMazeWateryLabyrinth } from "./101-perilous-maze-watery-labyrinth";

const discardFodderI18n = {
  en: { name: "Discard Fodder" },
  de: { name: "Discard Fodder" },
  fr: { name: "Discard Fodder" },
  it: { name: "Discard Fodder" },
};

const discardFodder: ActionCard = {
  id: "perilous-maze-discard-fodder",
  canonicalId: "ci_perilous_maze_discard_fodder",
  cardType: "action",
  name: "Discard Fodder",
  i18n: discardFodderI18n,
  inkType: ["emerald"],
  set: "TST",
  cardNumber: 1,
  rarity: "common",
  cost: 1,
  inkable: true,
  abilities: [],
};

const mazeResident = createMockCharacter({
  id: "perilous-maze-resident",
  name: "Maze Resident",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const mazeAttacker = createMockCharacter({
  id: "perilous-maze-attacker",
  name: "Maze Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Perilous Maze - Watery Labyrinth", () => {
  it("makes each opponent choose and discard a card when a character here is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          perilousMazeWateryLabyrinth,
          { card: mazeResident, atLocation: perilousMazeWateryLabyrinth, exerted: true },
        ],
      },
      {
        play: [mazeAttacker],
        hand: [discardFodder],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(mazeAttacker, mazeResident)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(perilousMazeWateryLabyrinth).success).toBe(
      true,
    );
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [discardFodder] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("discard");
  });
});
