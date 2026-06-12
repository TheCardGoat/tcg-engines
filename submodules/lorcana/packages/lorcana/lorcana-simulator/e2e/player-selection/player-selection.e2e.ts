import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const PLAYER_SELECTION_FIXTURE_ID = "player-selection";

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

async function playCardByLabel(pom: LorcanaSimulatorPom, label: string): Promise<void> {
  const board = await pom.getBoard(PLAYER_ONE_VIEW);
  const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", label);
  const previousStateId = board.stateID;

  const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId });
  expect(result.success).toBe(true);
  await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
}

test.describe("Player selection flows", () => {
  test("Water Has Memory opens player selection, then opens the scry overlay", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: PLAYER_SELECTION_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await playCardByLabel(pom, "Water Has Memory");

    await expect(page.getByRole("button", { name: "Player Two" })).toBeVisible();
    await page.getByRole("button", { name: "Player Two" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(page.getByTestId("scry-resolution-overlay")).toBeVisible();
  });
});
