import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { drBushrootEvilBotanist } from "./092-dr-bushroot-evil-botanist";

const bushrootChallenger = createMockCharacter({
  id: "dr-bushroot-challenger",
  name: "Bushroot Challenger",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const discardedCard = createMockCharacter({
  id: "dr-bushroot-discarded-card",
  name: "Discarded Card",
  cost: 1,
});

describe("Dr. Bushroot - Evil Botanist", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [drBushrootEvilBotanist],
    });

    expect(testEngine.asPlayerOne().hasKeyword(drBushrootEvilBotanist, "Ward")).toBe(true);
  });

  it("makes the challenging opponent discard when he is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: drBushrootEvilBotanist, exerted: true }],
      },
      {
        play: [{ card: bushrootChallenger, isDrying: false }],
        hand: [discardedCard],
      },
    );
    const discardedCardId = testEngine.findCardInstanceId(discardedCard, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(bushrootChallenger, drBushrootEvilBotanist),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(drBushrootEvilBotanist),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(discardedCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(discardedCard)).toBe("discard");
  });
});
