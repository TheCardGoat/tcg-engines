import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fairyGodmothersWand } from "./168-fairy-godmothers-wand";

const princessTarget = createMockCharacter({
  id: "fairy-godmothers-wand-princess",
  name: "Princess Target",
  cost: 3,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const nonPrincessTarget = createMockCharacter({
  id: "fairy-godmothers-wand-non-princess",
  name: "Non-Princess Target",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

const inkCard = createMockCharacter({
  id: "fairy-godmothers-wand-ink-card",
  name: "Ink Card",
  cost: 1,
});

const inkCard2 = createMockCharacter({
  id: "fairy-godmothers-wand-ink-card-2",
  name: "Ink Card 2",
  cost: 1,
});

describe("Fairy Godmother's Wand", () => {
  it("triggers when you ink a card during your turn and grants Ward until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [inkCard],
        play: [fairyGodmothersWand, princessTarget],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fairyGodmothersWand, {
        targets: [princessTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(princessTarget, "Ward")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(princessTarget, "Ward")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(princessTarget, "Ward")).toBe(false);
  });

  it("does not trigger during the opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [fairyGodmothersWand],
      },
      {
        deck: 2,
        hand: [inkCard2],
        play: [princessTarget],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent inks a card — the wand should NOT trigger (restriction: during-turn your)
    expect(testEngine.asPlayerTwo().ink(inkCard2)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("only accepts Princess characters as valid targets", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [inkCard],
        play: [fairyGodmothersWand, princessTarget, nonPrincessTarget],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const bagEffectId = testEngine.asPlayerOne().getBagEffects()[0]!.id;

    // Targeting a non-Princess character should fail
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fairyGodmothersWand, {
        targets: [nonPrincessTarget],
      }),
    ).not.toBeSuccessfulCommand();

    // Targeting a Princess character should succeed
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(fairyGodmothersWand, {
        targets: [princessTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(princessTarget, "Ward")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(nonPrincessTarget, "Ward")).toBe(false);
  });
});
