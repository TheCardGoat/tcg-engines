import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { plutoSteelChampion } from "./191-pluto-steel-champion";

const opposingItem = createMockItem({
  id: "pluto-opposing-item",
  name: "Opposing Item",
  cost: 2,
});

const incomingSteelAlly = createMockCharacter({
  id: "pluto-incoming-steel",
  name: "Incoming Steel",
  cost: 2,
  strength: 2,
  willpower: 2,
  inkType: ["steel"],
});

const steelAlly = createMockCharacter({
  id: "pluto-steel-ally",
  name: "Steel Ally",
  cost: 3,
  strength: 5,
  willpower: 5,
  inkType: ["steel"],
  classifications: ["Storyborn"],
});

const weakOpponent = createMockCharacter({
  id: "pluto-weak-opponent",
  name: "Weak Opponent",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Pluto - Steel Champion", () => {
  it("regression: gains 2 lore when another Steel character banishes an opponent in a challenge", () => {
    // Bug: Pluto was not gaining lore when another Steel character banished
    // an opponent's character in a challenge.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [plutoSteelChampion, { card: steelAlly, isDrying: false }],
        lore: 0,
      },
      {
        play: [{ card: weakOpponent, exerted: true }],
      },
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    // Steel ally challenges and banishes the weak opponent
    expect(testEngine.asPlayerOne().challenge(steelAlly, weakOpponent)).toBeSuccessfulCommand();

    // Weak opponent should be banished
    expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

    // Pluto's WINNER TAKE ALL should trigger, gaining 2 lore
    // Resolve bag effects if needed
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(plutoSteelChampion);
    }

    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("does not gain lore when Pluto himself banishes a character (only OTHER Steel characters)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: plutoSteelChampion, isDrying: false }],
        lore: 0,
      },
      {
        play: [{ card: weakOpponent, exerted: true }],
      },
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().challenge(plutoSteelChampion, weakOpponent),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

    // Pluto should NOT gain lore when he himself banishes (trigger is on OTHER characters)
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(plutoSteelChampion);
    }

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("MAKE ROOM banishes a chosen opposing item when another Steel character is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: plutoSteelChampion, isDrying: false }],
        hand: [incomingSteelAlly],
        inkwell: incomingSteelAlly.cost,
      },
      {
        play: [opposingItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(incomingSteelAlly)).toBeSuccessfulCommand();
    const itemId = testEngine.findCardInstanceId(opposingItem, "play", "p2");

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBe(1);
    expect(bagEffects[0]!.chooserId).toBe(PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [itemId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(itemId)).toBe("discard");
  });
});
