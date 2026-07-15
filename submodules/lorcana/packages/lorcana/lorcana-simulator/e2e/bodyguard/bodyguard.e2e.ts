import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  hakunaMatata,
  mickeyMouseTrueFriend,
  reflection,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";

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

test.describe("Bodyguard", () => {
  test("Bodyguard forces attacker to target it instead of other characters", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "bodyguard-restriction",
        name: "Bodyguard Restriction",
        description: "Bodyguard forces challenge target",
        playerOne: {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [
            { card: simbaProtectiveCub, exerted: true },
            { card: mickeyMouseTrueFriend, exerted: true },
          ],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Stitch - New Dog");
    const mickeyId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Mickey Mouse - True Friend");
    const simbaId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Simba - Protective Cub");

    // Challenging Mickey should fail because Bodyguard Simba must be targeted
    const failedResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
      attackerId,
      defenderId: mickeyId,
    });
    expect(failedResult.success).toBe(false);

    // Challenging the Bodyguard should succeed
    const previousStateId = board.stateID;
    const successResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
      attackerId,
      defenderId: simbaId,
    });
    expect(successResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });

  test("Bodyguard may enter play exerted", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "bodyguard-enter-exerted",
        name: "Bodyguard Enter Exerted",
        description: "Bodyguard enters play exerted",
        playerOne: {
          hand: [simbaProtectiveCub],
          inkwell: [mickeyMouseTrueFriend, stitchNewDog],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Simba - Protective Cub");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId,
      resolveOptional: true,
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const simbaInPlay = findCardIdByLabel(
      updatedBoard,
      PLAYER_ONE_ID,
      "play",
      "Simba - Protective Cub",
    );
    expect(updatedBoard.cards[simbaInPlay]?.exerted).toBe(true);
  });
});
