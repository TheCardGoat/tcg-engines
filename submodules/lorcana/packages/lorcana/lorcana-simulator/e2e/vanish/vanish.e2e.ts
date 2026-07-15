import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  fireTheCannons,
  hakunaMatata,
  reflection,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { rajahGhostlyTiger } from "@tcg/lorcana-cards/cards/007";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_TWO_ID = "player_two";

function findCardIdByLabel(
  board: LorcanaProjectedBoardView,
  playerId: string,
  zone: "hand" | "play",
  label: string,
): string {
  const cardId = board.players[playerId]?.[zone].find(
    (candidate) => board.cards[candidate]?.fullName === label,
  );
  if (!cardId) {
    throw new Error(`Card "${label}" not found in ${zone} for ${playerId}.`);
  }
  return String(cardId);
}

test.describe("Vanish", () => {
  test("Vanish triggers when opponent targets with an action effect", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "vanish-opponent-action",
        name: "Vanish Opponent Action",
        description: "Vanish banishes character when targeted by opponent action",
        playerOne: {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          play: [simbaProtectiveCub],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [rajahGhostlyTiger],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Fire the Cannons!");
    const targetId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Rajah - Ghostly Tiger");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId,
      targets: [targetId],
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Rajah should be banished by Vanish (moved to discard)
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const rajahStillInPlay = updatedBoard.players[PLAYER_TWO_ID]?.play.find(
      (id) => updatedBoard.cards[id]?.fullName === "Rajah - Ghostly Tiger",
    );
    expect(rajahStillInPlay).toBeUndefined();
  });
});
