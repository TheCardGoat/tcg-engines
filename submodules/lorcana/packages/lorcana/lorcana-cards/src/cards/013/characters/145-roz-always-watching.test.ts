import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rozAlwaysWatching } from "./145-roz-always-watching";

const rozControllerTop = createMockCharacter({
  id: "roz-controller-top",
  name: "Roz Controller Top",
  cost: 1,
});

const rozOpponentTop = createMockCharacter({
  id: "roz-opponent-top",
  name: "Roz Opponent Top",
  cost: 1,
});

describe("Roz - Always Watching", () => {
  it("projects each opponent's top deck card face up", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [rozAlwaysWatching],
        deck: [rozControllerTop],
      },
      {
        deck: [rozOpponentTop],
      },
    );

    const controllerBoard = testEngine.getBoard("playerOne");
    const opponentBoard = testEngine.getBoard("playerTwo");
    const controllerViewOfOpponentTop = controllerBoard.players[PLAYER_TWO].deckTop as string;
    const opponentViewOfOwnTop = opponentBoard.players[PLAYER_TWO].deckTop as string;

    expect(controllerBoard.cards[controllerViewOfOpponentTop]?.definitionId).toBe(
      rozOpponentTop.id,
    );
    expect(opponentBoard.cards[opponentViewOfOwnTop]?.definitionId).toBe(rozOpponentTop.id);
    expect(controllerBoard.players[PLAYER_ONE].deckTop).toBeUndefined();
    expect(opponentBoard.players[PLAYER_ONE].deckTop).toBeUndefined();
  });
});
