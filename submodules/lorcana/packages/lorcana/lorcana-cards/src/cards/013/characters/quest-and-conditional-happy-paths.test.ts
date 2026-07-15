import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { abuWiseSultan } from "./043-abu-wise-sultan";
import { aladdinDoingHisPart } from "./085-aladdin-doing-his-part";
import { mushuStealthyDragon } from "./097-mushu-stealthy-dragon";
import { robinHoodCreatedByTheVine } from "./159-robin-hood-created-by-the-vine";
import { owlHunnyRanger } from "./185-owl-hunny-ranger";

const targetItem = createMockItem({
  id: "aladdin-doing-his-part-target-item",
  name: "Target Item",
  cost: 1,
});

const deckCard = createMockCharacter({
  id: "mushu-stealthy-dragon-deck-card",
  name: "Deck Card",
  cost: 1,
});

const opposingHandCardA = createMockCharacter({
  id: "mushu-stealthy-dragon-opposing-hand-a",
  name: "Opposing Hand A",
  cost: 1,
});

const opposingHandCardB = createMockCharacter({
  id: "mushu-stealthy-dragon-opposing-hand-b",
  name: "Opposing Hand B",
  cost: 1,
});

const floodbornAlly = createMockCharacter({
  id: "robin-hood-created-by-vine-floodborn-ally",
  name: "Floodborn Ally",
  cost: 3,
  classifications: ["Floodborn"],
});

const otherHunny = createMockCharacter({
  id: "owl-hunny-ranger-other-hunny",
  name: "Other Hunny",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

describe("Set 13 quest and conditional happy paths", () => {
  it("Abu - Wise Sultan banishes himself when he quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: abuWiseSultan, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(abuWiseSultan)).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.asPlayerOne().getCardZone(abuWiseSultan)).toBe("discard");
  });

  it("Aladdin - Doing His Part may pay 1 ink to banish a chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [aladdinDoingHisPart],
        inkwell: aladdinDoingHisPart.cost + 1,
      },
      {
        play: [targetItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(aladdinDoingHisPart)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(aladdinDoingHisPart, {
        targets: [targetItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(targetItem)).toBe("discard");
  });

  it("Mushu - Stealthy Dragon has Evasive and may draw when an opponent has more cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mushuStealthyDragon, isDrying: false }],
        deck: [deckCard],
      },
      {
        hand: [opposingHandCardA, opposingHandCardB],
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(mushuStealthyDragon, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().quest(mushuStealthyDragon)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mushuStealthyDragon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
  });

  it("Robin Hood - Created by the Vine gives your Floodborn characters Alert", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [robinHoodCreatedByTheVine, floodbornAlly],
    });

    expect(testEngine.asPlayerOne().hasKeyword(floodbornAlly, "Alert")).toBe(true);
  });

  it("Owl - Hunny Ranger gains Resist +2 while you have another Hunny character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [owlHunnyRanger, otherHunny],
    });

    expect(testEngine.asPlayerOne().getKeywordValue(owlHunnyRanger, "Resist")).toBe(2);
  });
});
