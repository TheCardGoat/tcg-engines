import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  genieOnTheJob,
  hakunaMatata,
  reflection,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { peterPanHighFlyer } from "@tcg/lorcana-cards/cards/010";

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

test.describe("Evasive", () => {
  test("Non-Evasive character cannot challenge an Evasive character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "evasive-blocks-non-evasive",
        name: "Evasive Blocks Non-Evasive",
        description: "Non-Evasive attacker cannot challenge Evasive defender",
        playerOne: {
          play: [{ card: stitchNewDog, isDrying: false }],
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
    const defenderId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Genie - On the Job");

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(false);
  });

  test("Evasive character can challenge another Evasive character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "evasive-vs-evasive",
        name: "Evasive vs Evasive",
        description: "Evasive attacker challenges Evasive defender",
        playerOne: {
          play: [genieOnTheJob],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: peterPanHighFlyer, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Genie - On the Job");
    const defenderId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Peter Pan - High Flyer");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });
});
