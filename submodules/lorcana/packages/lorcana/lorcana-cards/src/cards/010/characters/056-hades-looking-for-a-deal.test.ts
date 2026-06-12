import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { robinHoodTimelyContestant } from "../../005";
import { donaldDuckGhostHunter, mickeyMouseDetective } from "../../010";
import { hadesLookingForADeal } from "./056-hades-looking-for-a-deal";

describe("Hades - Looking for a Deal", () => {
  it("lets the opposing player put the chosen character on the bottom of their deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "deck:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("lets the opposing player refuse and makes Hades's controller draw 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
    );
    const chosenId = testEngine.findCardInstanceId(mickeyMouseDetective, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "play:player_two",
    );
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("when played by the opponent, creates a choice-selection pending effect for the human player (not a broken Resolve button)", () => {
    // Regression: when the automated strategy resolves the Hades bag with a choiceIndex
    // (the planner generates choice variants for all effects including OPPONENT-chooser ones),
    // the choiceIndex leaked into the pending effect's resolutionInput. This caused
    // buildResolutionSelectionContext to skip building the choice-selection context,
    // leaving selectionContext=undefined and causing the UI to show a broken "Resolve" button
    // that fails with "resolveEffect requires choiceIndex for this pending effect".
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [donaldDuckGhostHunter, mickeyMouseDetective],
        deck: 5,
      },
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
    );
    const chosenId = testEngine.findCardInstanceId(donaldDuckGhostHunter, "play", PLAYER_ONE);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerTwo().getBagEffects();
    expect(bagEffects).toHaveLength(1);

    // The automated strategy resolves the bag with choiceIndex (bot planner generates variants)
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [chosenId],
        choiceIndex: 0,
      }),
    ).toBeSuccessfulCommand();

    // Player one (the human) must have a proper choice-selection pending effect, not a broken one
    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    expect(pendingEffects).toHaveLength(1);
    expect(pendingEffects[0]?.selectionContext?.kind).toBe("choice-selection");
    expect(pendingEffects[0]?.selectionContext?.currentSelection.targets).toEqual([chosenId]);

    // Player one can resolve it by choosing to put the character on the bottom of their deck
    expect(testEngine.asPlayerOne().respondWithChoice(0)).toBeSuccessfulCommand();
    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[chosenId]?.zoneKey).toBe(
      "deck:player_one",
    );
  });

  it("cannot choose an opposing character with Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [donaldDuckGhostHunter, robinHoodTimelyContestant],
        deck: 5,
      },
    );
    const wardedId = testEngine.findCardInstanceId(robinHoodTimelyContestant, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
        targets: [wardedId],
      }).success,
    ).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(hadesLookingForADeal)).toBe("play");
  });

  it("does not continue into the opponent choice when all opposing characters have Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hadesLookingForADeal],
        inkwell: hadesLookingForADeal.cost,
        deck: 10,
      },
      {
        play: [robinHoodTimelyContestant],
        deck: 5,
      },
    );
    const wardedId = testEngine.findCardInstanceId(robinHoodTimelyContestant, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(hadesLookingForADeal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hadesLookingForADeal, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getPendingEffects()).toEqual([]);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[wardedId]?.zoneKey).toBe(
      "play:player_two",
    );
  });
});
