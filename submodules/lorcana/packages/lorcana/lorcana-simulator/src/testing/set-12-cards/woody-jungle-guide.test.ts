import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { woodyJungleGuide } from "@tcg/lorcana-cards/cards/012";

const cheapCharacter = createMockCharacter({
  id: "woody-cheap-char",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("LET'S GET MOVIN' - Woody, Jungle Guide - Whenever this character quests, draw a card. Then, you may play a character with cost 2 or less for free.", () => {
  it("should prompt with card picker when only 1 eligible card exists (R16 regression)", () => {
    // R16: with exactly 1 eligible card, the engine must still surface a
    // target-selection context so the player sees WHICH card will be played
    // rather than having it auto-resolve invisibly.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: woodyJungleGuide, exerted: false }],
        hand: [cheapCharacter],
        deck: 3,
        inkwell: 3,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

    // Bag effect fires: draw + optional. Resolve the bag (triggers draw step,
    // then queues the optional as a pending effect).
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide)).toBeSuccessfulCommand();

    // After draw: the optional play-card pending effect must be waiting.
    // It must NOT have been auto-resolved (R16 regression).
    const pending = testEngine.asPlayerOne().getPendingEffects();
    const bag = testEngine.asPlayerOne().getBagEffects();

    // Either pending or bag should have the optional waiting for player input
    expect(pending.length + bag.length).toBeGreaterThanOrEqual(1);
  });

  it("should allow declining the optional play (R16)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: woodyJungleGuide, exerted: false }],
        hand: [cheapCharacter],
        deck: 3,
        inkwell: 3,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

    // Resolve the bag (draw step)
    expect(testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide)).toBeSuccessfulCommand();

    // Decline the optional
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // cheapCharacter should stay in hand (not played)
    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
  });

  it("should allow accepting and explicitly selecting the card to play (R16)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: woodyJungleGuide, exerted: false }],
        hand: [cheapCharacter],
        deck: 3,
        inkwell: 3,
      },
      { deck: 2 },
    );

    expect(testEngine.asPlayerOne().quest(woodyJungleGuide)).toBeSuccessfulCommand();

    // Resolve the bag (draw step)
    expect(testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide)).toBeSuccessfulCommand();

    // Accept and explicitly pick the card — engine must require explicit target
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyJungleGuide, {
        resolveOptional: true,
        targets: [cheapCharacter],
      }),
    ).toBeSuccessfulCommand();

    // cheapCharacter should now be in play (played for free)
    expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
  });
});
