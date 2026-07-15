import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  captainHookForcefulDuelist,
  fireTheCannons,
  hakunaMatata,
  mickeyMouseTrueFriend,
  reflection,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { daisyDuckDonaldsDate } from "@tcg/lorcana-cards/cards/005";
import { eeyoreOverstuffedDonkey } from "@tcg/lorcana-cards/cards/009";

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

test.describe("Challenger", () => {
  test("Challenger adds bonus strength while attacking", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "challenger-attack-bonus",
        name: "Challenger Attack Bonus",
        description: "Challenger +2 adds strength when attacking",
        playerOne: {
          play: [captainHookForcefulDuelist],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: daisyDuckDonaldsDate, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Captain Hook - Forceful Duelist",
    );
    const defenderId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Daisy Duck - Donald's Date",
    );
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Captain Hook: str 1 + Challenger +2 = 3 damage on Daisy
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const daisyCard = updatedBoard.cards[defenderId];
    expect(daisyCard?.damage).toBe(captainHookForcefulDuelist.strength + 2);
  });

  test("Challenger bonus does not apply while defending", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "challenger-no-defense-bonus",
        name: "Challenger No Defense Bonus",
        description: "Challenger bonus only applies when attacking",
        playerOne: {
          play: [{ card: stitchNewDog, isDrying: false }],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: captainHookForcefulDuelist, exerted: true }],
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
      "Captain Hook - Forceful Duelist",
    );
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Stitch takes only Captain Hook's base strength (1), not 1+2
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const stitchCard = updatedBoard.cards[attackerId];
    expect(stitchCard?.damage).toBe(captainHookForcefulDuelist.strength);
  });
});

test.describe("Resist", () => {
  test("Resist reduces damage from effects", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "resist-reduces-effect-damage",
        name: "Resist Reduces Effect Damage",
        description: "Resist +1 reduces Fire the Cannons damage from 2 to 1",
        playerOne: {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [eeyoreOverstuffedDonkey],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Fire the Cannons!");
    const targetId = findCardIdByLabel(board, PLAYER_TWO_ID, "play", "Eeyore - Overstuffed Donkey");
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId,
      targets: [targetId],
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Fire the Cannons deals 2 damage, Resist +1 reduces to 1
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const eeyoreCard = updatedBoard.cards[targetId];
    expect(eeyoreCard?.damage).toBe(1);
  });

  test("Resist reduces damage from challenges", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "resist-reduces-challenge-damage",
        name: "Resist Reduces Challenge Damage",
        description: "Resist +1 reduces challenge damage",
        playerOne: {
          play: [mickeyMouseTrueFriend],
          deck: [reflection, hakunaMatata],
        },
        playerTwo: {
          play: [{ card: eeyoreOverstuffedDonkey, exerted: true }],
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const attackerId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Mickey Mouse - True Friend",
    );
    const defenderId = findCardIdByLabel(
      board,
      PLAYER_TWO_ID,
      "play",
      "Eeyore - Overstuffed Donkey",
    );
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "challenge", { attackerId, defenderId });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Mickey has 3 strength, Resist +1 reduces damage to 2
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const eeyoreCard = updatedBoard.cards[defenderId];
    expect(eeyoreCard?.damage).toBe(mickeyMouseTrueFriend.strength - 1);
  });
});
