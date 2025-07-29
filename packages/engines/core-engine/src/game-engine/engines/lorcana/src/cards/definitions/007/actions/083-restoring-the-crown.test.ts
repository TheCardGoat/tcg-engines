import { describe, expect, it } from "bun:test";
import {
  edgarBalthazarAmbitiousButler,
  madHatterUnrulyEccentric,
  petePirateScoundrel,
  restoringTheCrown,
  scroogeMcduckResourcefulMiser,
  yokaiIntellectualSchemer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Restoring The Crown", () => {
  it("Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: restoringTheCrown.cost,
        hand: [restoringTheCrown],
        play: [edgarBalthazarAmbitiousButler, scroogeMcduckResourcefulMiser],
      },
      {
        play: [
          petePirateScoundrel,
          madHatterUnrulyEccentric,
          yokaiIntellectualSchemer,
        ],
      },
    );

    await testEngine.playCard(restoringTheCrown);

    [
      petePirateScoundrel,
      madHatterUnrulyEccentric,
      yokaiIntellectualSchemer,
    ].forEach((character) => {
      expect(testEngine.getCardModel(character).exerted).toBe(true);
    });

    await testEngine.challenge({
      attacker: edgarBalthazarAmbitiousButler,
      defender: petePirateScoundrel,
    });

    expect(testEngine.getLoreForPlayer()).toBe(2);

    await testEngine.challenge({
      attacker: scroogeMcduckResourcefulMiser,
      defender: yokaiIntellectualSchemer,
    });

    expect(testEngine.getLoreForPlayer()).toBe(4);
  });
});
