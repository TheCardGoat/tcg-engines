import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pleakleyScientificExpert } from "./144-pleakley-scientific-expert";

const friendlyResearcher = createMockCharacter({
  id: "pleakley-friendly-researcher",
  name: "Friendly Researcher",
  cost: 2,
});

describe("Pleakley - Scientific Expert", () => {
  it("puts a chosen character of yours into your inkwell facedown and exerted when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pleakleyScientificExpert],
      inkwell: pleakleyScientificExpert.cost,
      play: [friendlyResearcher],
      deck: 1,
    });
    const researcherId = testEngine.findCardInstanceId(friendlyResearcher, "play", "p1");

    expect(testEngine.asPlayerOne().playCard(pleakleyScientificExpert)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pleakleyScientificExpert),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [researcherId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(researcherId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(researcherId)).toEqual(
      expect.objectContaining({ exerted: true, zone: "inkwell" }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[researcherId]?.publicFaceState,
    ).toBe("faceDown");
  });

  it("regression: ability is mandatory - must put a chosen character into inkwell when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pleakleyScientificExpert],
      inkwell: pleakleyScientificExpert.cost,
      play: [friendlyResearcher],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(pleakleyScientificExpert)).toBeSuccessfulCommand();

    // The triggered ability MUST fire (mandatory, not optional)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Resolve it - pick the researcher
    const researcherId = testEngine.findCardInstanceId(friendlyResearcher, "play", "p1");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pleakleyScientificExpert),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [researcherId],
      }),
    ).toBeSuccessfulCommand();

    // The character must have been put into inkwell
    expect(testEngine.asPlayerOne().getCardZone(researcherId)).toBe("inkwell");
  });

  // TODO: requires manualPutCardUnder method on LorcanaServer
  // it("regression: cards under a character also enter inkwell when that character is put into inkwell", () => {
  //   const characterWithCardsUnder = createMockCharacter({
  //     id: "pleakley-char-with-cards-under",
  //     name: "Character With Cards Under",
  //     cost: 3,
  //     classifications: ["Storyborn", "Hero"],
  //     abilities: [
  //       {
  //         id: "pleakley-boost",
  //         type: "keyword",
  //         keyword: "Boost",
  //         value: 2,
  //       },
  //     ],
  //   });

  //   const cardUnder = createMockCharacter({
  //     id: "pleakley-card-under",
  //     name: "Card Under",
  //     cost: 1,
  //   });

  //   const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
  //     hand: [pleakleyScientificExpert],
  //     inkwell: pleakleyScientificExpert.cost,
  //     play: [characterWithCardsUnder],
  //     deck: [cardUnder],
  //   });

  //   // Put a card under the character (via boost)
  //   testEngine.asServer().manualPutCardUnder(cardUnder, characterWithCardsUnder);

  //   const characterId = testEngine.findCardInstanceId(characterWithCardsUnder, "play", "p1");
  //   const cardUnderId = testEngine.findCardInstanceId(cardUnder, "under", "p1");

  //   expect(testEngine.asPlayerOne().playCard(pleakleyScientificExpert)).toBeSuccessfulCommand();
  //   expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  //   expect(
  //     testEngine.asPlayerOne().resolvePendingByCard(pleakleyScientificExpert),
  //   ).toBeSuccessfulCommand();
  //   expect(
  //     testEngine.asPlayerOne().resolveNextPending({
  //       targets: [characterId],
  //     }),
  //   ).toBeSuccessfulCommand();

  //   // Both the character and the card under it should be in the inkwell
  //   expect(testEngine.asPlayerOne().getCardZone(characterId)).toBe("inkwell");
  //   expect(testEngine.asPlayerOne().getCardZone(cardUnderId)).toBe("inkwell");
  // });

  it("regression: only allows targeting own characters, not opponent's characters", () => {
    const opponentCharacter = createMockCharacter({
      id: "pleakley-opponent-char",
      name: "Opponent Character",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pleakleyScientificExpert],
        inkwell: pleakleyScientificExpert.cost,
        play: [friendlyResearcher],
        deck: 1,
      },
      {
        play: [opponentCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(pleakleyScientificExpert)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pleakleyScientificExpert),
    ).toBeSuccessfulCommand();

    // Attempting to target opponent's character should fail
    const opponentId = testEngine.findCardInstanceId(opponentCharacter, "play", "p2");
    const result = testEngine.asPlayerOne().resolveNextPending({
      targets: [opponentId],
    });
    expect(result.success).toBe(false);
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
  });
});
