import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";
import {
  arielSpectacularSinger,
  flounderVoiceOfReason,
  hakunaMatata,
  heiheiBoatSnack,
  mickeyMouseTrueFriend,
  reflection,
  simbaProtectiveCub,
  stitchNewDog,
} from "@tcg/lorcana-cards/cards/001";
import { theFamilyMadrigal } from "@tcg/lorcana-cards/cards/007";
import { i2i } from "@tcg/lorcana-cards/cards/009";
import { flynnRiderSpectralScoundrel, shantiVillageGirl } from "@tcg/lorcana-cards/cards/010";

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

test.describe("Support", () => {
  test("Support adds quester's strength to chosen character on quest", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "support-quest-buff",
        name: "Support Quest Buff",
        description: "Support triggers on quest and buffs another character",
        playerOne: {
          play: [heiheiBoatSnack, flounderVoiceOfReason],
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

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const heiheiId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "HeiHei - Boat Snack");
    const flounderId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Flounder - Voice of Reason",
    );
    const previousStateId = board.stateID;

    // Quest with Hei Hei to trigger Support
    const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: heiheiId });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Get bag effects from the board to resolve Support
    const boardAfterQuest = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = boardAfterQuest.bagEffects[0];
    expect(bagEffect).toBeDefined();

    const resolveStateId = boardAfterQuest.stateID;
    const resolveResult = await pom.execute(PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        resolveOptional: true,
        targets: [flounderId],
      },
    });
    expect(resolveResult.success).toBe(true);
    await pom.waitForStateChange(resolveStateId, PLAYER_ONE_VIEW);

    // Flounder should have increased strength
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const flounderCard = updatedBoard.cards[flounderId];
    expect(flounderCard?.strength).toBeGreaterThan(flounderVoiceOfReason.strength);
  });
});

test.describe("Singer", () => {
  test("Singer character can sing a song by exerting", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "singer-sings-song",
        name: "Singer Sings Song",
        description: "Singer 5 exerts to sing a song",
        playerOne: {
          hand: [theFamilyMadrigal],
          play: [arielSpectacularSinger],
          deck: [reflection, hakunaMatata, mickeyMouseTrueFriend, stitchNewDog, simbaProtectiveCub],
        },
        playerTwo: {
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const arielId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Ariel - Spectacular Singer");
    const songId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "The Family Madrigal");
    const previousStateId = board.stateID;

    // Use playCard with sing cost type
    const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId: songId,
      cost: "sing",
      singer: arielId,
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Ariel should be exerted after singing
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const arielCard = updatedBoard.cards[arielId];
    expect(arielCard?.exerted).toBe(true);
  });
});

test.describe("Sing Together", () => {
  test("Multiple characters exert to sing a song via Sing Together", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "sing-together",
        name: "Sing Together",
        description: "Two Singer characters sing together to meet cost threshold",
        playerOne: {
          hand: [i2i],
          play: [arielSpectacularSinger, shantiVillageGirl],
          discard: [i2i],
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
    const arielId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Ariel - Spectacular Singer");
    const shantiId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Shanti - Village Girl");
    const previousStateId = board.stateID;

    const panel = page.locator('section[aria-labelledby="available-moves-panel-title"]');
    await panel.getByRole("button", { name: "Sing" }).click();
    await expect(panel.getByText("Select a card to play.")).toBeVisible();

    await panel.getByRole("button", { name: "I2I" }).click();
    await expect(
      panel.getByText("Choose any number of ready characters to sing I2I. Selected 0/9."),
    ).toBeVisible();

    await panel.getByRole("button", { name: "Ariel - Spectacular Singer" }).click();
    await expect(
      panel.getByText("Choose any number of ready characters to sing I2I. Selected 5/9."),
    ).toBeVisible();

    await panel.getByRole("button", { name: "Shanti - Village Girl" }).click();
    await expect(
      panel.getByText("Choose any number of ready characters to sing I2I. Selected 10/9."),
    ).toBeVisible();

    await panel.getByRole("button", { name: "Confirm Sing" }).click();
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // I2I readies singers when 2+ characters sang it, so they should NOT be exerted
    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(updatedBoard.cards[arielId]?.exerted).toBe(false);
    expect(updatedBoard.cards[shantiId]?.exerted).toBe(false);
  });
});

test.describe("Boost", () => {
  test("Boost puts top card of deck under character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "boost-puts-card-under",
        name: "Boost Puts Card Under",
        description: "Boost 2 puts top card of deck under character",
        playerOne: {
          inkwell: 4,
          play: [flynnRiderSpectralScoundrel],
          deck: [mickeyMouseTrueFriend, simbaProtectiveCub, reflection, hakunaMatata],
        },
        playerTwo: {
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const flynnId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Flynn Rider - Spectral Scoundrel",
    );
    const previousStateId = board.stateID;

    const result = await pom.execute(PLAYER_ONE_VIEW, "activateAbility", {
      cardId: flynnId,
    });
    expect(result.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    const updatedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const flynnCard = updatedBoard.cards[flynnId];
    expect(flynnCard?.cardsUnder?.length ?? 0).toBe(1);
  });

  test("Boost can only be used once per turn", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({
      fixture: {
        id: "boost-once-per-turn",
        name: "Boost Once Per Turn",
        description: "Boost can only activate once per turn",
        playerOne: {
          inkwell: 6,
          play: [flynnRiderSpectralScoundrel],
          deck: [mickeyMouseTrueFriend, simbaProtectiveCub, reflection, hakunaMatata],
        },
        playerTwo: {
          deck: [reflection, hakunaMatata],
        },
        skipPreGame: true,
      },
      view: PLAYER_ONE_VIEW,
    });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const flynnId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Flynn Rider - Spectral Scoundrel",
    );
    const previousStateId = board.stateID;

    // First activation should succeed
    const firstResult = await pom.execute(PLAYER_ONE_VIEW, "activateAbility", {
      cardId: flynnId,
    });
    expect(firstResult.success).toBe(true);
    await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);

    // Second activation should fail
    const secondResult = await pom.execute(PLAYER_ONE_VIEW, "activateAbility", {
      cardId: flynnId,
    });
    expect(secondResult.success).toBe(false);
  });
});
