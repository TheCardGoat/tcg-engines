import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  donaldDuckStruttingHisStuff,
  hakunaMatata,
  plasmaBlaster,
  reflection,
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

test.describe("Ward", () => {
  test("Ward prevents opponent from targeting with effects", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "ward-blocks-targeting",
        name: "Ward Blocks Targeting",
        description: "Ward prevents Plasma Blaster from targeting",
        playerOne: {
          inkwell: 2,
          play: [plasmaBlaster],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [donaldDuckStruttingHisStuff],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const plasmaId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Plasma Blaster");
    const donaldId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Donald Duck - Strutting His Stuff",
    );

    const result = await pom.execute(PLAYER_ONE_VIEW, "activateAbility", {
      cardId: plasmaId,
      targets: [donaldId],
    });
    expect(result.success).toBe(false);
  });

  test("Ward does not prevent challenges", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "ward-allows-challenges",
        name: "Ward Allows Challenges",
        description: "Ward character can still be challenged",
        playerOne: {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: donaldDuckStruttingHisStuff, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Stitch - New Dog");
    const defenderId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Donald Duck - Strutting His Stuff",
    );
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });
});
