import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { propheticVision } from "./137-prophetic-vision";

const revealedAction = createMockAction({
  id: "prophetic-vision-revealed-action",
  name: "Revealed Action",
  cost: 1,
});

const revealedCharacter = createMockCharacter({
  id: "prophetic-vision-revealed-character",
  name: "Revealed Character",
  cost: 1,
});

describe("Prophetic Vision", () => {
  it("may play a revealed action card for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [propheticVision],
        inkwell: propheticVision.cost,
        deck: [revealedAction],
      },
      {
        startingLore: {
          [PLAYER_ONE]: 0,
          [PLAYER_TWO]: 2,
        },
      },
    );

    expect(testEngine.asPlayerOne().playCard(propheticVision)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(revealedAction)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(2);
  });

  it("puts a non-action on the bottom, makes each opponent lose 1 lore, and gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [propheticVision],
        inkwell: propheticVision.cost,
        deck: [revealedCharacter],
      },
      {
        startingLore: {
          [PLAYER_ONE]: 0,
          [PLAYER_TWO]: 2,
        },
      },
    );

    expect(testEngine.asPlayerOne().playCard(propheticVision)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(revealedCharacter)).toBe("deck");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(1);

    const playLog = [...testEngine.getServerEngine().getRuntime().getMoveLogHistory()]
      .reverse()
      .find((log) => log.moveType === "playCard");
    expect(playLog?.public.map((message) => message.key)).toEqual([
      "lorcana.move.playCard",
      "lorcana.effect.resolve.revealTopCard.autoBottom",
      "lorcana.outcome.loreLost",
      "lorcana.outcome.loreGained",
    ]);
  });
});
