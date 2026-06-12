import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { owlIslandSecludedEntrance } from "./102-owl-island-secluded-entrance";

const firstActionI18n = {
  en: { name: "First Action" },
  de: { name: "First Action" },
  fr: { name: "First Action" },
  it: { name: "First Action" },
};

const secondActionI18n = {
  en: { name: "Second Action" },
  de: { name: "Second Action" },
  fr: { name: "Second Action" },
  it: { name: "Second Action" },
};

const residentOne = createMockCharacter({
  id: "owl-island-resident-1",
  name: "Resident One",
  cost: 2,
});
const residentTwo = createMockCharacter({
  id: "owl-island-resident-2",
  name: "Resident Two",
  cost: 2,
});

const firstAction: ActionCard = {
  id: "owl-island-first-action",
  canonicalId: "ci_owl_island_first_action",
  cardType: "action",
  name: "First Action",
  i18n: firstActionI18n,
  inkType: ["emerald"],
  set: "TST",
  cardNumber: 1,
  rarity: "common",
  cost: 5,
  inkable: true,
  abilities: [],
};

const secondAction: ActionCard = {
  id: "owl-island-second-action",
  canonicalId: "ci_owl_island_second_action",
  cardType: "action",
  name: "Second Action",
  i18n: secondActionI18n,
  inkType: ["emerald"],
  set: "TST",
  cardNumber: 2,
  rarity: "common",
  cost: 4,
  inkable: true,
  abilities: [],
};

describe("Owl Island - Secluded Entrance", () => {
  it("reduces the first action you play each turn by the number of characters you have here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [firstAction, secondAction],
      play: [
        owlIslandSecludedEntrance,
        { card: residentOne, atLocation: owlIslandSecludedEntrance },
        { card: residentTwo, atLocation: owlIslandSecludedEntrance },
      ],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().canPlayCard(firstAction)).toBe(true);
    expect(testEngine.asPlayerOne().canPlayCard(secondAction)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(firstAction)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().canPlayCard(secondAction)).toBe(false);
  });

  it("gains 3 lore when you play your second action in a turn", () => {
    const cheapActionOne: ActionCard = {
      ...firstAction,
      id: "owl-island-cheap-1",
      canonicalId: "ci_owl_island_cheap_1",
      name: "Cheap One",
      cost: 1,
    };
    const cheapActionTwo: ActionCard = {
      ...secondAction,
      id: "owl-island-cheap-2",
      canonicalId: "ci_owl_island_cheap_2",
      name: "Cheap Two",
      cost: 1,
    };
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapActionOne, cheapActionTwo],
      play: [owlIslandSecludedEntrance],
      inkwell: 2,
    });

    expect(testEngine.asPlayerOne().playCard(cheapActionOne)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(testEngine.asPlayerOne().resolvePendingByCard(owlIslandSecludedEntrance).success).toBe(
        true,
      );
    }
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().playCard(cheapActionTwo)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });
});
