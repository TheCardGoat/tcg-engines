import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  aladdinPrinceAli,
  dukeOfWeseltonOpportunisticOfficial,
  healingGlow,
  jetsamUrsulasSpy,
  tinkerBellPeterPansAlly,
} from "../../001";
import { beOurGuest } from "./031-be-our-guest";

describe("Be Our Guest", () => {
  it("reveals a character from the top 4 cards and puts the rest on the bottom", () => {
    const initialDeckOrder = [
      aladdinPrinceAli,
      tinkerBellPeterPansAlly,
      jetsamUrsulasSpy,
      healingGlow,
      dukeOfWeseltonOpportunisticOfficial,
    ];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beOurGuest],
      inkwell: beOurGuest.cost,
      deck: initialDeckOrder,
    });

    const orderAfterLookingAtCards = [aladdinPrinceAli, healingGlow, tinkerBellPeterPansAlly];

    expect(
      testEngine.asPlayerOne().playCard(beOurGuest, {
        destinations: [
          { zone: "hand", cards: jetsamUrsulasSpy },
          { zone: "deck-bottom", cards: orderAfterLookingAtCards },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toBe("hand");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE).toSorted()).toEqual(
      [
        aladdinPrinceAli.id,
        tinkerBellPeterPansAlly.id,
        healingGlow.id,
        dukeOfWeseltonOpportunisticOfficial.id,
      ].toSorted(),
    );
  });
});
