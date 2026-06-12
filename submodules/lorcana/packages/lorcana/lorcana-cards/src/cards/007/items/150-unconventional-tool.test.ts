import { describe, expect, it } from "bun:test";
import type { ItemCard } from "@tcg/lorcana-types";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bellesFavoriteBook } from "../../008/items/179-belles-favorite-book";
import { unconventionalTool } from "./150-unconventional-tool";

const expensivePrototype: ItemCard = {
  id: "unconventional-tool-expensive-item",
  canonicalId: "ci_unconventional-tool-expensive-item",
  cardType: "item",
  name: "Expensive Prototype",
  cost: 4,
  inkType: ["sapphire"],
  inkable: true,
  set: "TST",
  rarity: "common",
  abilities: [],
  i18n: {
    en: {
      name: "Expensive Prototype",
    },
    de: {
      name: "Expensive Prototype",
    },
    fr: {
      name: "Expensive Prototype",
    },
    it: {
      name: "Expensive Prototype",
    },
  },
  cardNumber: 777,
};

describe("Unconventional Tool", () => {
  it("reduces the cost of the next item you play this turn when it is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [bellesFavoriteBook],
      hand: [expensivePrototype],
      inkwell: 2,
      play: [unconventionalTool, bellesFavoriteBook],
    });

    expect(testEngine.asPlayerOne().canPlayCard(expensivePrototype)).toBe(false);
    expect(
      testEngine.asPlayerOne().activateAbility(bellesFavoriteBook, {
        ability: "CHAPTER THREE",
        costs: {
          banishItems: [unconventionalTool],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(unconventionalTool)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().canPlayCard(expensivePrototype)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(expensivePrototype)).toBeSuccessfulCommand();
  });
});
