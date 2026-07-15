import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { winterCampMedicalTent } from "../locations";
import { miracleCandle } from "./031-miracle-candle";

const madrigalOne = createMockCharacter({
  id: "miracle-candle-helper-1",
  name: "Madrigal Helper 1",
  cost: 1,
});

const madrigalTwo = createMockCharacter({
  id: "miracle-candle-helper-2",
  name: "Madrigal Helper 2",
  cost: 1,
});

const madrigalThree = createMockCharacter({
  id: "miracle-candle-helper-3",
  name: "Madrigal Helper 3",
  cost: 1,
});

describe("Miracle Candle", () => {
  it("gains 2 lore and removes up to 2 damage from the chosen location when you have 3 characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miracleCandle, madrigalOne, madrigalTwo, madrigalThree, winterCampMedicalTent],
    });

    testEngine.asServer().manualSetDamage(winterCampMedicalTent, 3);

    expect(
      testEngine.asPlayerOne().activateAbility(miracleCandle, {
        targets: [winterCampMedicalTent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(miracleCandle)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerOne().getDamage(winterCampMedicalTent)).toBe(1);
  });

  it("still banishes itself when you have fewer than 3 characters, but the effect does nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [miracleCandle, madrigalOne, madrigalTwo, winterCampMedicalTent],
    });

    testEngine.asServer().manualSetDamage(winterCampMedicalTent, 3);

    expect(
      testEngine.asPlayerOne().activateAbility(miracleCandle, {
        targets: [winterCampMedicalTent],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(miracleCandle)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(winterCampMedicalTent)).toBe(3);
  });
});
