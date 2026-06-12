import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jetsamUrsulasSpy, simbaProtectiveCub } from "../../001";
import { theHorsemanStrikes } from "./029-the-horseman-strikes";

describe("The Horseman Strikes!", () => {
  it("draws a card and can banish the chosen Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theHorsemanStrikes],
        inkwell: theHorsemanStrikes.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [jetsamUrsulasSpy],
      },
    );
    const jetsamId = testEngine.findCardInstanceId(jetsamUrsulasSpy, "play", "p2");

    const playResult = testEngine.asPlayerOne().playCard(theHorsemanStrikes, {
      resolveOptional: true,
      targets: [jetsamId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(jetsamId)).toBe("discard");
  });

  it("still draws a card when the optional banish is skipped", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theHorsemanStrikes],
        inkwell: theHorsemanStrikes.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [jetsamUrsulasSpy],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(theHorsemanStrikes, {
      resolveOptional: false,
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(jetsamUrsulasSpy)).toBe("play");
  });

  it("regression: can target characters that gained Evasive through Boost or other abilities", () => {
    // A character that gains Evasive through a static effect should still be targetable
    const evasiveViaBuff = createMockCharacter({
      id: "horseman-evasive-via-buff",
      name: "Evasive Via Buff",
      cost: 3,
      strength: 2,
      willpower: 3,
      abilities: [
        {
          id: "horseman-evasive-static",
          type: "keyword",
          keyword: "Evasive",
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theHorsemanStrikes],
        inkwell: theHorsemanStrikes.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [evasiveViaBuff],
      },
    );

    const targetId = testEngine.findCardInstanceId(evasiveViaBuff, "play", "p2");

    const playResult = testEngine.asPlayerOne().playCard(theHorsemanStrikes, {
      resolveOptional: true,
      targets: [targetId],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(targetId)).toBe("discard");
  });
});
