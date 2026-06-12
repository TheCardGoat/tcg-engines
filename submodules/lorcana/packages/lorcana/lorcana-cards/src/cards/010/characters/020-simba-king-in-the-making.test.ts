import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { simbaKingInTheMaking } from "./020-simba-king-in-the-making";

const topDeckCharacter = createMockCharacter({
  id: "simba-test-top-character",
  name: "Top Deck Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const topDeckAction = createMockAction({
  id: "simba-test-top-action",
  name: "Top Deck Action",
  cost: 2,
  text: "Draw a card.",
});

const deckFiller = createMockCharacter({
  id: "simba-test-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Simba - King in the Making", () => {
  it("has the Boost 3 keyword ability", () => {
    const boostAbility = simbaKingInTheMaking.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Boost",
    );
    expect(boostAbility).toBeDefined();
    expect(
      boostAbility?.type === "keyword" && "value" in boostAbility ? boostAbility.value : undefined,
    ).toBe(3);
  });

  it("has TIMELY ALLIANCE triggered ability with correct put-card-under trigger", () => {
    const timelyAlliance = simbaKingInTheMaking.abilities?.find(
      (a) => a.type === "triggered" && "name" in a && a.name === "TIMELY ALLIANCE",
    );
    expect(timelyAlliance).toBeDefined();
    expect(timelyAlliance?.type).toBe("triggered");
    const trigger = (timelyAlliance as { trigger?: { event?: string; timing?: string } }).trigger;
    expect(trigger?.event).toBe("put-card-under");
    expect(trigger?.timing).toBe("whenever");
  });

  describe("TIMELY ALLIANCE - Whenever you put a card under this character", () => {
    it("triggers when Boost puts a card under Simba and top card is a character - player can play it for free exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [simbaKingInTheMaking],
        inkwell: 3,
        deck: [deckFiller, topDeckCharacter, deckFiller],
      });

      const playerOne = testEngine.asPlayerOne();

      // Activate Boost 3 - pay 3 ink to put top deck card under Simba
      expect(playerOne.activateAbility(simbaKingInTheMaking, "Boost 3")).toBeSuccessfulCommand();

      // TIMELY ALLIANCE should trigger (optional bag)
      const bagCount = playerOne.getBagCount();
      expect(bagCount).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger
      const [bagEffect] = playerOne.getBagEffects();
      expect(
        playerOne.resolvePendingByCard(simbaKingInTheMaking, {
          resolveOptional: true,
          destinations: [{ zone: "play", cards: [topDeckCharacter] }],
        }),
      ).toBeSuccessfulCommand();

      // The character should now be in play and exerted
      expect(playerOne.getCardZone(topDeckCharacter)).toBe("play");
      expect(playerOne.isExerted(topDeckCharacter)).toBe(true);
    });

    it("triggers when Boost puts a card under Simba and top card is NOT a character - put on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [simbaKingInTheMaking],
        inkwell: 3,
        deck: [topDeckAction, deckFiller, deckFiller],
      });

      const playerOne = testEngine.asPlayerOne();
      const initialDeckSize = playerOne.getCardsInZone("deck", "player_one").count;

      // Activate Boost 3
      expect(playerOne.activateAbility(simbaKingInTheMaking, "Boost 3")).toBeSuccessfulCommand();

      // TIMELY ALLIANCE should trigger (optional bag)
      const bagCount = playerOne.getBagCount();
      expect(bagCount).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger - put non-character on bottom
      const [bagEffect] = playerOne.getBagEffects();
      expect(
        playerOne.resolvePendingByCard(simbaKingInTheMaking, {
          resolveOptional: true,
          destinations: [{ zone: "deck-bottom", cards: [topDeckAction] }],
        }),
      ).toBeSuccessfulCommand();

      // Action card should remain in deck (put on bottom)
      expect(playerOne.getCardZone(topDeckAction)).toBe("deck");
      // Deck size should be same as before (Boost took one card from deck, action was put back)
      expect(playerOne.getCardsInZone("deck", "player_one").count).toBe(initialDeckSize - 1);
    });

    it("can decline TIMELY ALLIANCE optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [simbaKingInTheMaking],
        inkwell: 3,
        deck: [topDeckCharacter, deckFiller, deckFiller],
      });

      const playerOne = testEngine.asPlayerOne();

      // Activate Boost 3
      expect(playerOne.activateAbility(simbaKingInTheMaking, "Boost 3")).toBeSuccessfulCommand();

      // TIMELY ALLIANCE should trigger (optional bag)
      const [bagEffect] = playerOne.getBagEffects();
      expect(
        playerOne.resolvePendingByCard(simbaKingInTheMaking, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Character should still be in deck
      expect(playerOne.getCardZone(topDeckCharacter)).toBe("deck");
    });
  });

  it("regression: Boost is activable on the same turn Simba is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [simbaKingInTheMaking],
      inkwell: simbaKingInTheMaking.cost + 3, // Enough to play Simba + activate Boost 3
      deck: [topDeckCharacter, deckFiller, deckFiller, deckFiller, deckFiller],
    });

    // Play Simba
    expect(testEngine.asPlayerOne().playCard(simbaKingInTheMaking)).toBeSuccessfulCommand();

    // Boost should be activable immediately on the same turn
    const boostResult = testEngine.asPlayerOne().activateAbility(simbaKingInTheMaking, "Boost 3");
    expect(boostResult).toBeSuccessfulCommand();

    // Card should be under Simba
    expect(testEngine.getCardsUnder(simbaKingInTheMaking)).toHaveLength(1);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mufasaBetrayedLeader } from "@lorcanito/lorcana-engine/cards/002/characters/014-mufasa-betrayed-leader";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   InscrutableMap,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Simba - King in the Making", () => {
//   It("Boost 3 (Once during your turn, you may pay 3 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [simbaKingInTheMaking],
//     });
//
//     Expect(testEngine.getCardModel(simbaKingInTheMaking).hasBoost).toBe(true);
//   });
//
//   Describe("TIMELY ALLIANCE Whenever you put a card under this character, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the bottom of your deck.", () => {
//     It("Top card is a character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [simbaKingInTheMaking],
//         Deck: [inscrutableMap, goofyKnightForADay, mufasaBetrayedLeader],
//       });
//
//       Await testEngine.activateCard(simbaKingInTheMaking);
//
//       Const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       Const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(cardUnderTest));
//
//       Const topDeckCard = testEngine.getCardModel(goofyKnightForADay);
//
//       Expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       Await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: choose to play the character
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Play: [goofyKnightForADay],
//           },
//         },
//         True,
//       );
//
//       Expect(topDeckCard.zone).toBe("play");
//       Expect(topDeckCard.exerted).toBe(true);
//     });
//
//     It("Top card is NOT a character", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 3,
//         Play: [simbaKingInTheMaking],
//         Deck: [goofyKnightForADay, inscrutableMap, mufasaBetrayedLeader],
//       });
//
//       Await testEngine.activateCard(simbaKingInTheMaking);
//
//       Const boostedCard = testEngine.getCardModel(mufasaBetrayedLeader);
//       Const cardUnderTest = testEngine.getCardModel(simbaKingInTheMaking);
//
//       Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//       Expect(boostedCard.isUnder(cardUnderTest));
//
//       Const topDeckCard = testEngine.getCardModel(inscrutableMap);
//
//       Expect(topDeckCard.zone).toBe("deck");
//
//       // Accept TIMELY ALLIANCE optional ability
//       Await testEngine.acceptOptionalAbility();
//
//       // Resolve scry: inscrutableMap is not a character, so put it on bottom
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: {
//             Bottom: [inscrutableMap],
//           },
//         },
//         True,
//       );
//
//       Expect(topDeckCard.zone).toBe("deck");
//     });
//   });
// });
//
