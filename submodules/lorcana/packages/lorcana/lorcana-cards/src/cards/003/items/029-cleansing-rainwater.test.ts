import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import {
  eeyoreOverstuffedDonkey,
  mamaOdieVoiceOfWisdom,
  pigletPoohPirateCaptain,
} from "../characters";
import { cleansingRainwater } from "./029-cleansing-rainwater";

const opposingCharacter = createMockCharacter({
  id: "cleansing-rainwater-opponent",
  name: "Cleansing Rainwater Opponent",
  cost: 2,
  willpower: 4,
});

describe("Cleansing Rainwater", () => {
  it("banishes itself and removes up to 2 damage from each of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          cleansingRainwater,
          mamaOdieVoiceOfWisdom,
          pigletPoohPirateCaptain,
          eeyoreOverstuffedDonkey,
        ],
      },
      {
        play: [opposingCharacter],
      },
    );

    testEngine.asServer().manualSetDamage(mamaOdieVoiceOfWisdom, 5);
    testEngine.asServer().manualSetDamage(pigletPoohPirateCaptain, 1);
    testEngine.asServer().manualSetDamage(eeyoreOverstuffedDonkey, 4);
    testEngine.asServer().manualSetDamage(opposingCharacter, 2);

    const result = testEngine.asPlayerOne().activateAbility(cleansingRainwater, {
      ability: "ANCIENT POWER",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cleansingRainwater)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(mamaOdieVoiceOfWisdom)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(pigletPoohPirateCaptain)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(eeyoreOverstuffedDonkey)).toBe(2);
    expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(2);
  });
});
