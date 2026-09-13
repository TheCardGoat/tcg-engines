import { mickeyMouseTrueFriend } from "@tcg/lorcana-cards/cards/001";
import { expect, findCardIdByLabel, LorcanaSimulatorPom, test } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";

test("post-game state clears a card preview that was open on the final move", async ({ page }) => {
  const pom = new LorcanaSimulatorPom(page);
  await pom.goto({
    fixture: {
      id: "post-game-preview-cleanup",
      name: "Post-game preview cleanup",
      description: "Player one wins while a card preview remains open.",
      playerOne: {
        lore: 18,
        play: [{ card: mickeyMouseTrueFriend, isDrying: false }],
        deck: 2,
      },
      playerTwo: { deck: 2 },
      skipPreGame: true,
    },
    view: PLAYER_ONE_VIEW,
  });

  const board = await pom.getBoard(PLAYER_ONE_VIEW);
  const mickeyId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Mickey Mouse - True Friend");
  const card = page.locator(`[data-card-id="${mickeyId}"][data-zone-id="play"]`).last();
  await card.hover();
  await expect(page.getByRole("dialog", { name: "Card preview panel" })).toBeVisible();

  const questResult = await pom.execute(PLAYER_ONE_VIEW, "quest", { cardId: mickeyId });
  expect(questResult.success, JSON.stringify(questResult)).toBe(true);
  await pom.waitForStateChange(board.stateID, PLAYER_ONE_VIEW);

  await expect(page.getByRole("button", { name: "Back to matchmaking" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Card preview panel" })).toHaveCount(0);
});
