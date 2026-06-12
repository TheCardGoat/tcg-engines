import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  cinderellaBallroomSensation,
  eudoraAccomplishedSeamstress,
  gastonBaritoneBully,
} from "../../002";
import { packTactics } from "./100-pack-tactics";

describe("Pack Tactics", () => {
  it("gains 1 lore for each damaged opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [packTactics],
        inkwell: packTactics.cost,
      },
      {
        play: [
          { card: gastonBaritoneBully, damage: 1 },
          { card: eudoraAccomplishedSeamstress, damage: 1 },
          { card: cinderellaBallroomSensation, damage: 1 },
        ],
      },
    );

    expect(testEngine.asPlayerOne().playCard(packTactics)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });
});
