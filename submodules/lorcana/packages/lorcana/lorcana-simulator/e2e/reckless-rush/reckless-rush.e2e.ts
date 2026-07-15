import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  hakunaMatata,
  mauiHeroToAll,
  reflection,
  stitchNewDog,
  teKTheBurningOne,
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

test.describe("Rush", () => {
  test("Rush lets a character challenge the turn it is played", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "rush-challenge-same-turn",
        name: "Rush Challenge Same Turn",
        description: "Rush character challenges immediately after being played",
        playerOne: {
          hand: [mauiHeroToAll],
          inkwell: mauiHeroToAll.cost,
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: stitchNewDog, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    // Play Maui from hand
    let board = await pom.getBoard(PLAYER_ONE_VIEW);
    const mauiHandId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Maui - Hero to All");
    let previousStateId = board.stateID;

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: mauiHandId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Challenge with Maui (Rush allows same-turn challenge)
    board = await pom.getBoard(PLAYER_ONE_VIEW);
    const mauiPlayId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Maui - Hero to All");
    const defenderId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Stitch - New Dog");
    previousStateId = board.stateID;

    const challengeResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
      attackerId: mauiPlayId,
      defenderId,
    });
    expect(challengeResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });
});

test.describe("Reckless", () => {
  test("Reckless character cannot quest", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "reckless-cant-quest",
        name: "Reckless Can't Quest",
        description: "Reckless character is prevented from questing",
        playerOne: {
          play: [teKTheBurningOne],
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
    const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Te Kā - The Burning One");

    const result = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId });
    expect(result.success).toBe(false);
  });

  test("Reckless character must challenge before passing turn", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "reckless-must-challenge",
        name: "Reckless Must Challenge",
        description: "Player cannot pass turn while Reckless character can challenge",
        playerOne: {
          play: [teKTheBurningOne],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: stitchNewDog, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    // Passing turn should fail because Reckless Te Kā can still challenge
    const passResult = await pom.execute(PLAYER_ONE_VIEW, "passTurn", {});
    expect(passResult.success).toBe(false);

    // Challenge with Te Kā
    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Te Kā - The Burning One");
    const defenderId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Stitch - New Dog");
    const previousStateId = board.stateID;

    const challengeResult = await pom.execute(PLAYER_ONE_VIEW, "challenge", {
      attackerId,
      defenderId,
    });
    expect(challengeResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
  });
});
