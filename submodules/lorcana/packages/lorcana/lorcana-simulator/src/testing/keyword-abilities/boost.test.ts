import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { flynnRiderSpectralScoundrel } from "@tcg/lorcana-cards/cards/010";

describe("Boost - Flynn Rider, Spectral Scoundrel - Boost 2 (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this card.)", () => {
  it("Boost puts top card of deck under character and costs ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [flynnRiderSpectralScoundrel],
        inkwell: 4,
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        deck: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
    ).toHaveLength(0);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);

    expect(
      testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
    ).toHaveLength(1);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("Boost can only be used once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [flynnRiderSpectralScoundrel],
        inkwell: 4,
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        deck: [mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel),
    ).toBeSuccessfulCommand();

    const secondActivation = testEngine
      .asPlayerOne()
      .activateAbility(flynnRiderSpectralScoundrel) as CommandFailure;

    expect(secondActivation.success).toBe(false);
    expect(secondActivation.errorCode).toBe("ABILITY_USES_EXHAUSTED");
  });

  it("Card put under with Boost is not in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flynnRiderSpectralScoundrel],
      inkwell: 2,
      deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().getZonesCardCount().play).toBe(1);

    expect(
      testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().play).toBe(1);
    expect(
      testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel).cardsUnder ?? [],
    ).toHaveLength(1);
  });

  it.todo("Boost cannot be activated if the player does not have enough ink", () => {});

  it.todo("Boost cannot be activated if the deck is empty", () => {});
});
