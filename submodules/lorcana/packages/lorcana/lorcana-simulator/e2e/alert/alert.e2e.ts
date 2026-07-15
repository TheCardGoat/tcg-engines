import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  genieOnTheJob,
  hakunaMatata,
  reflection,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { crikeeGoodLuckCharm } from "@tcg/lorcana-cards/cards/010";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";

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

test.describe("Alert", () => {
  test("Alert character can challenge an Evasive character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "alert-vs-evasive",
        name: "Alert vs Evasive",
        description: "Alert character challenges Evasive character",
        playerOne: {
          play: [crikeeGoodLuckCharm],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: genieOnTheJob, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Cri-Kee - Good Luck Charm");
    const defenderId = findCardIdByLabel(board, "player_two", "play", "Genie - On the Job");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });

  test("Non-Evasive character cannot challenge an Evasive character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "no-evasive-vs-evasive",
        name: "No Evasive vs Evasive",
        description: "Non-Evasive attacker fails to challenge Evasive defender",
        playerOne: {
          play: [stitchNewDog],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: genieOnTheJob, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Stitch - New Dog");
    const defenderId = findCardIdByLabel(board, "player_two", "play", "Genie - On the Job");

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(false);
  });

  test("Alert does not grant Evasive — non-Evasive can challenge Alert character", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "challenge-alert-character",
        name: "Challenge Alert Character",
        description: "Non-Evasive attacker challenges Alert defender",
        playerOne: {
          play: [stitchNewDog],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: crikeeGoodLuckCharm, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Stitch - New Dog");
    const defenderId = findCardIdByLabel(board, "player_two", "play", "Cri-Kee - Good Luck Charm");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });
});
