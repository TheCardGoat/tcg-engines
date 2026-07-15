import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { allIsFound } from "./178-all-is-found";
import { doubleTrouble } from "./202-double-trouble";
import { showMeMore } from "./082-show-me-more";
import { theReturnOfHercules } from "./118-the-return-of-hercules";
import { waterHasMemory } from "./177-water-has-memory";

describe("Water Has Memory", () => {
  it("creates a chosen-player prompt before opening the scry selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [waterHasMemory],
        inkwell: waterHasMemory.cost,
        deck: [simbaProtectiveCub],
      },
      {
        deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(waterHasMemory)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    const [chosenPlayerPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(chosenPlayerPrompt?.selectionContext).toMatchObject({
      kind: "target-selection",
      playerCandidateIds: expect.arrayContaining([PLAYER_ONE, PLAYER_TWO]),
    });

    expect(
      testEngine.asPlayerOne().resolveEffect(chosenPlayerPrompt!.id, {
        targets: [PLAYER_TWO],
      }),
    ).toBeSuccessfulCommand();

    const [scryPrompt] = testEngine.asPlayerOne().getPendingEffects();
    expect(scryPrompt?.selectionContext).toMatchObject({
      kind: "scry-selection",
      chooserId: PLAYER_ONE,
    });

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          {
            zone: "deck-top",
            cards: [mickeyMouseTrueFriend],
          },
          {
            zone: "deck-bottom",
            cards: [allIsFound, theReturnOfHercules, showMeMore],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    const p2Deck = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO);
    expect(p2Deck.at(-1)).toBe(mickeyMouseTrueFriend.id);
    expect(p2Deck).toContain(doubleTrouble.id);
  });

  it("reorders the chosen player's looked-at cards while leaving untouched cards in place", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [waterHasMemory],
        inkwell: waterHasMemory.cost,
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardForPlayer(waterHasMemory, PLAYER_TWO),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          {
            zone: "deck-top",
            cards: [allIsFound],
          },
          {
            zone: "deck-bottom",
            cards: [theReturnOfHercules, showMeMore],
          },
        ],
      }),
    ).toBeSuccessfulCommand();

    // mickeyMouseTrueFriend goes to bottom via remainder (not explicit), then explicit cards at index 0
    // Deck after: deck-top gets allIsFound appended, deck-bottom gets remainder + explicit at index 0
    const p2Deck = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO);
    expect(p2Deck).toHaveLength(5);
    // allIsFound is on top (last element)
    expect(p2Deck.at(-1)).toBe(allIsFound.id);
    // doubleTrouble was untouched (not in looked-at set)
    expect(p2Deck).toContain(doubleTrouble.id);
  });

  it("regression: should reveal cards to the player after choosing a player's deck", () => {
    // Bug: Water Has Memory was not revealing cards after choosing a player's deck.
    // The scry effect should show the cards to the controller.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [waterHasMemory],
        inkwell: waterHasMemory.cost,
        deck: [doubleTrouble, allIsFound, theReturnOfHercules, showMeMore],
      },
      {
        deck: 5,
      },
    );

    // Play targeting own deck
    expect(
      testEngine.asPlayerOne().playCardForPlayer(waterHasMemory, PLAYER_ONE),
    ).toBeSuccessfulCommand();

    // Player should be able to resolve scry - this means cards were shown
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [doubleTrouble] },
          { zone: "deck-bottom", cards: [allIsFound, theReturnOfHercules, showMeMore] },
        ],
      }),
    ).toBeSuccessfulCommand();
  });
});
