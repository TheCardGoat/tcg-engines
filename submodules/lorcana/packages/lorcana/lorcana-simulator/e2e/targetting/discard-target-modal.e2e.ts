import { partOfYourWorld, mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;

const cardLabel = (card: { name: string; version?: string }) =>
  card.version ? `${card.name} - ${card.version}` : card.name;

const DISCARD_TARGET_FIXTURE = {
  id: "discard-target-modal",
  name: "Discard Target Modal",
  description: "Auto-opens the universal target modal for discard targeting.",
  playerOne: {
    inkwell: 10,
    hand: [partOfYourWorld],
    discard: [mickeyMouseTrueFriend],
  },
  playerTwo: {
    deck: 5,
  },
  skipPreGame: true,
} as const;

test.describe("Discard target modal", () => {
  test("auto-opens the target modal when resolving a discard-targeting effect", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    const playerOne = pom.asBottomPlayer();
    await pom.goto({ fixture: DISCARD_TARGET_FIXTURE, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const playerOneId = String(board.playerOrder[0]);
    const partOfYourWorldId = String(board.players[playerOneId]?.hand[0]);

    await pom.execute(PLAYER_ONE_VIEW, "playCard", {
      cardId: partOfYourWorldId,
    });

    const targetDialog = page.getByRole("dialog", { name: "Discard targets" });
    await expect(targetDialog).toBeVisible();
    await expect(
      targetDialog.getByRole("button", {
        name: new RegExp(`Toggle selection for ${cardLabel(mickeyMouseTrueFriend)}`, "i"),
      }),
    ).toBeVisible();

    await targetDialog
      .getByRole("button", {
        name: new RegExp(`Toggle selection for ${cardLabel(mickeyMouseTrueFriend)}`, "i"),
      })
      .click();
    await targetDialog.getByRole("button", { name: "Confirm" }).click();

    await expect(playerOne).toHaveCardInZone({
      card: cardLabel(mickeyMouseTrueFriend),
      zone: "hand",
    });
  });
});
