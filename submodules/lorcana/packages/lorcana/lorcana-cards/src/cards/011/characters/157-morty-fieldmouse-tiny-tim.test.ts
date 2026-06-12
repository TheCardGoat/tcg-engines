import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { scroogesCountingHouseEbenezersOffice } from "../locations/134-scrooges-counting-house-ebenezers-office";
import { peteGhostOfChristmasFuture } from "./154-pete-ghost-of-christmas-future";
import { tamatoaSeekerOfShine } from "./156-tamatoa-seeker-of-shine";
import { mortyFieldmouseTinyTim } from "./157-morty-fieldmouse-tiny-tim";
import { mickeyMouseBobCratchit } from "./159-mickey-mouse-bob-cratchit";

describe("Morty Fieldmouse - Tiny Tim", () => {
  describe("HOLIDAY SPIRIT - Once during your turn, whenever you put a card under one of your other characters, put the top card of your deck facedown under this character", () => {
    it("should put a card under Morty when putting a card under another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mortyFieldmouseTinyTim, tamatoaSeekerOfShine],
        deck: 5,
        inkwell: 10,
      });

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);
      const tamatoaId = testEngine.findCardInstanceId(tamatoaSeekerOfShine, "play", PLAYER_ONE);

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);
      expect(testEngine.getCardsUnder(tamatoaId)).toHaveLength(0);

      // Tamatoa's Boost ability puts a card from deck under Tamatoa
      expect(
        testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Tamatoa should now have 1 card under it
      expect(testEngine.getCardsUnder(tamatoaId)).toHaveLength(1);

      // HOLIDAY SPIRIT triggers: put top card of deck under Morty
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(mortyFieldmouseTinyTim),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(1);
    });

    it("should only trigger once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mortyFieldmouseTinyTim, tamatoaSeekerOfShine, peteGhostOfChristmasFuture],
        deck: 10,
        inkwell: 10,
      });

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

      // First trigger: put card under Tamatoa, HOLIDAY SPIRIT fires
      expect(
        testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tamatoaSeekerOfShine),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(1);

      // Second trigger: put card under Pete, HOLIDAY SPIRIT should NOT fire again this turn
      expect(
        testEngine.asPlayerOne().activateAbility(peteGhostOfChristmasFuture, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // No additional HOLIDAY SPIRIT bag effect should appear for Morty
      const bagEffectsAfterSecond = testEngine.asPlayerOne().getBagEffects();
      // Filter for Morty's HOLIDAY SPIRIT ability specifically (abilityName is inside payload)
      const mortyHolidaySpiritEffects = bagEffectsAfterSecond.filter(
        (e) => (e.payload as Record<string, unknown>)?.abilityName === "HOLIDAY SPIRIT",
      );
      expect(mortyHolidaySpiritEffects).toHaveLength(0);

      // Morty should still have only 1 card under him
      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(1);
    });

    it("does not trigger on the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mortyFieldmouseTinyTim],
          deck: 5,
        },
        {
          play: [tamatoaSeekerOfShine],
          deck: 5,
          inkwell: 10,
        },
      );

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);

      // Player one passes turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two uses Tamatoa's Boost (puts card under Tamatoa - opponent's character)
      expect(
        testEngine.asPlayerTwo().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Morty's HOLIDAY SPIRIT should NOT trigger (not player one's turn)
      // Morty should have no cards under him
      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);
    });
  });

  describe("HOLIDAY CHEER - This character gets +1 {L} for each card under him", () => {
    it("should gain +1 lore for each card under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mortyFieldmouseTinyTim, tamatoaSeekerOfShine],
        deck: 5,
        inkwell: 10,
      });

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

      const mortyBefore = testEngine.asPlayerOne().getCard(mortyFieldmouseTinyTim);
      expect(mortyBefore.lore).toBe(mortyFieldmouseTinyTim.lore); // base 1 lore, 0 cards under

      // Put a card manually under Morty
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mortyId, deckCards[0]!);

      const mortyAfterOne = testEngine.asPlayerOne().getCard(mortyFieldmouseTinyTim);
      expect(mortyAfterOne.lore).toBe(mortyFieldmouseTinyTim.lore! + 1);

      // Put a second card under Morty
      const deckCardsUpdated = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mortyId, deckCardsUpdated[0]!);

      const mortyAfterTwo = testEngine.asPlayerOne().getCard(mortyFieldmouseTinyTim);
      expect(mortyAfterTwo.lore).toBe(mortyFieldmouseTinyTim.lore! + 2);
    });

    it("should quest for increased lore when cards are under him", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mortyFieldmouseTinyTim],
          deck: 5,
          inkwell: 10,
        },
        {
          deck: 1,
        },
      );

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

      // Put 2 cards under Morty
      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      testEngine.putCardUnder(mortyId, deckCards[0]!);
      testEngine.putCardUnder(mortyId, deckCards[1]!);

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(2);

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(mortyFieldmouseTinyTim)).toBeSuccessfulCommand();

      // Morty should quest for base lore (1) + cards under (2) = 3
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + mortyFieldmouseTinyTim.lore! + 2);
    });
  });

  it("regression: does NOT trigger from Scrooge's Counting House Boost (locations are not 'other characters')", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mortyFieldmouseTinyTim, scroogesCountingHouseEbenezersOffice],
      deck: 10,
      inkwell: 10,
    });

    const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

    expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);

    // Activate Scrooge's Counting House Boost (puts card under the LOCATION, not a character)
    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(scroogesCountingHouseEbenezersOffice, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    // Morty's HOLIDAY SPIRIT should NOT trigger because it says "other characters" not locations
    // No bag effect should be created for Morty
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    const mortyEffects = bagEffects.filter(
      (e) => (e.payload as Record<string, unknown>)?.abilityName === "HOLIDAY SPIRIT",
    );
    expect(mortyEffects).toHaveLength(0);

    // Morty should still have 0 cards under him
    expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);
  });

  describe("HOLIDAY SPIRIT triggers with Mickey Mouse - Bob Cratchit interaction", () => {
    it("should trigger when Mickey quests and puts a card under himself via HARD WORK", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mortyFieldmouseTinyTim, mickeyMouseBobCratchit],
          deck: 5,
          inkwell: 10,
        },
        {
          deck: 1,
        },
      );

      const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);
      const mickeyId = testEngine.findCardInstanceId(mickeyMouseBobCratchit, "play", PLAYER_ONE);

      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(0);
      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(0);

      // Mickey quests:
      // 1. HARD WORK triggers and auto-resolves: puts top card of deck under Mickey
      // 2. put-card-under event fires for Mickey
      // 3. HOLIDAY SPIRIT triggers and auto-resolves: puts top card of deck under Morty
      expect(testEngine.asPlayerOne().quest(mickeyMouseBobCratchit)).toBeSuccessfulCommand();

      // Both HARD WORK and HOLIDAY SPIRIT should have been auto-resolved (no player input needed)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Mickey should have 1 card under him (HARD WORK)
      expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(1);

      // Morty should also have 1 card under him (HOLIDAY SPIRIT triggered by put-card-under Mickey)
      expect(testEngine.getCardsUnder(mortyId)).toHaveLength(1);
    });
  });

  it("regression: triggers once per Morty when multiple characters receive cards (not once per character)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mortyFieldmouseTinyTim, tamatoaSeekerOfShine, peteGhostOfChristmasFuture],
      deck: 10,
      inkwell: 10,
    });

    const mortyId = testEngine.findCardInstanceId(mortyFieldmouseTinyTim, "play", PLAYER_ONE);

    // Put card under Tamatoa via Boost
    expect(
      testEngine.asPlayerOne().activateAbility(tamatoaSeekerOfShine, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    // Resolve any bag effects
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const e of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(mortyFieldmouseTinyTim);
    }

    // Morty should have exactly 1 card under him (once per turn), not more
    expect(testEngine.getCardsUnder(mortyId)).toHaveLength(1);
  });
});
