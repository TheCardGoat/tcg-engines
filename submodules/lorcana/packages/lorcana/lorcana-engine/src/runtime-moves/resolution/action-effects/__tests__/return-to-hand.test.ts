import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";

describe("return-to-hand", () => {
  it("publishes the discard-to-hand outcome after the player selects a card", () => {
    const target = createMockCharacter({
      id: "return-hand-target",
      name: "Returned Friend",
      cost: 2,
    });
    const action = createMockAction({
      id: "return-hand-action",
      name: "Return Friend",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: { upTo: 1 },
              owner: "you",
              zones: ["discard"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action],
      inkwell: 1,
      discard: [target],
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    const targetId = game.findCardInstanceId(target, "discard", PLAYER_ONE);
    expect(game.asPlayerOne().resolveNextPending({ targets: [target] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(target)).toBe("hand");
    expect(
      game
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "resolveEffect")?.public,
    ).toContainEqual({
      key: "lorcana.outcome.cardReturnedToHand",
      values: { playerId: PLAYER_ONE, cardId: targetId },
    });
  });
});
