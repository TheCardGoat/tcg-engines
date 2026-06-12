import { describe, expect, it } from "bun:test";
import { healingGlow } from "./028-healing-glow";
import { jetsamUrsulasSpy } from "../characters/046-jetsam-ursulas-spy";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  dukeOfWeseltonOpportunisticOfficial,
  tinkerBellPeterPansAlly,
} from "../characters";
import { beOurGuest } from "./025-be-our-guest";

describe("Be Our Guest", () => {
  it("Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const initialDeckOrder = [
      // This should be the first card in the deck pile
      aladdinPrinceAli,
      tinkerBellPeterPansAlly,
      jetsamUrsulasSpy,
      healingGlow,
      // This is the last card of the deck
      dukeOfWeseltonOpportunisticOfficial,
    ];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beOurGuest],
      inkwell: beOurGuest.cost,
      deck: initialDeckOrder,
    });

    const getDeckDefinitionIdsAuthoritative = () =>
      testEngine
        .getCardInstanceIdsInZone("deck", PLAYER_ONE)
        .map((cardId) => testEngine.getCardDefinitionId(cardId) ?? cardId);

    expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(
      initialDeckOrder.length,
    );
    expect(getDeckDefinitionIdsAuthoritative()).toEqual(initialDeckOrder.map((card) => card.id));

    const orderAfterLookingAtCards = [aladdinPrinceAli, healingGlow, tinkerBellPeterPansAlly];
    testEngine.asPlayerOne().playCard(beOurGuest, {
      destinations: [
        {
          zone: "hand",
          cards: jetsamUrsulasSpy,
        },
        {
          zone: "deck-bottom",
          cards: orderAfterLookingAtCards,
        },
      ],
    });

    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toEqual("hand");
    expect(testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count).toBe(4);
    // The revealed card is visible to the opponent immediately after the effect
    // (reveal: true on the hand destination creates a persistent reveal window).
    expect(
      testEngine
        .asPlayerTwo()
        .getCardsInZone("hand", PLAYER_ONE)
        .cards.map((card) => card.definitionId),
    ).toEqual([jetsamUrsulasSpy.id]);
    expect(getDeckDefinitionIdsAuthoritative().toSorted()).toEqual(
      [
        aladdinPrinceAli.id,
        tinkerBellPeterPansAlly.id,
        healingGlow.id,
        dukeOfWeseltonOpportunisticOfficial.id,
      ].toSorted(),
    );
  });
});
