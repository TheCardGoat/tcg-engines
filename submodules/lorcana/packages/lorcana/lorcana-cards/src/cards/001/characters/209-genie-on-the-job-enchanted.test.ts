import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { genieOnTheJobEnchanted } from "./209-genie-on-the-job-enchanted";

const opposingTarget = createMockCharacter({
  id: "genie-on-the-job-enchanted-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Genie - On the Job - Enchanted", () => {
  it("matches the base card's return-to-hand play trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [genieOnTheJobEnchanted],
        inkwell: genieOnTheJobEnchanted.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(genieOnTheJobEnchanted)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(genieOnTheJobEnchanted),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [opposingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("play", PLAYER_TWO).count).toBe(0);
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count).toBe(1);
  });
});
