import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { mauiStubbornTrickster } from "./110-maui-stubborn-trickster";

const banishAction = createMockAction({
  id: "maui-banish-action",
  name: "Banish Action",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

const opposingCharacter1 = createMockCharacter({
  id: "maui-opp-char-1",
  name: "Opposing Character 1",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const opposingCharacter2 = createMockCharacter({
  id: "maui-opp-char-2",
  name: "Opposing Character 2",
  cost: 2,
  strength: 1,
  willpower: 5,
});

const yourCharacter = createMockCharacter({
  id: "maui-your-char",
  name: "Your Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const opposingItem1 = createMockItem({
  id: "maui-opp-item-1",
  name: "Opposing Item 1",
  cost: 1,
});

const opposingItem2 = createMockItem({
  id: "maui-opp-item-2",
  name: "Opposing Item 2",
  cost: 1,
});

const yourItem = createMockItem({
  id: "maui-your-item",
  name: "Your Item",
  cost: 1,
});

const opposingLocation1 = createMockLocation({
  id: "maui-opp-loc-1",
  name: "Opposing Location 1",
  cost: 1,
});

const opposingLocation2 = createMockLocation({
  id: "maui-opp-loc-2",
  name: "Opposing Location 2",
  cost: 1,
});

const yourLocation = createMockLocation({
  id: "maui-your-loc",
  name: "Your Location",
  cost: 1,
});

describe("Maui - Stubborn Trickster", () => {
  describe("I'M NOT FINISHED YET - When this character is banished, choose one:", () => {
    it("triggers when Maui is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingCharacter1],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mauiStubbornTrickster],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mauiStubbornTrickster] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
    });

    it("mode 0: Put 2 damage counters on all opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingCharacter1, opposingCharacter2],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mauiStubbornTrickster, yourCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mauiStubbornTrickster] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mauiStubbornTrickster, { choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(opposingCharacter1)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(opposingCharacter2)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(yourCharacter)).toBe(0);
    });

    it("mode 1: Banish all opposing items", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingItem1, opposingItem2],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mauiStubbornTrickster, yourItem],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mauiStubbornTrickster] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mauiStubbornTrickster, { choiceIndex: 1 }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(opposingItem1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(opposingItem2)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(yourItem)).toBe("play");
    });

    it("mode 2: Banish all opposing locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [opposingLocation1, opposingLocation2],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          play: [mauiStubbornTrickster, yourLocation],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [mauiStubbornTrickster] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(mauiStubbornTrickster, { choiceIndex: 2 }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(opposingLocation1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(opposingLocation2)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(yourLocation)).toBe("play");
    });
  });
});
