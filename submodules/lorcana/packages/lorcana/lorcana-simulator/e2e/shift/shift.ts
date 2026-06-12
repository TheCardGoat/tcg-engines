import type { Page } from "@playwright/test";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { expect, test, LorcanaSimulatorPom } from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const SHIFT_FIXTURE_ID = "shift";

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

async function shiftCardOntoTarget(
  pom: LorcanaSimulatorPom,
  handLabel: string,
  targetLabel: string,
): Promise<void> {
  const board = await pom.getBoard(PLAYER_ONE_VIEW);
  const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", handLabel);
  const shiftTarget = findCardIdByLabel(board, PLAYER_ONE_ID, "play", targetLabel);
  const previousStateId = board.stateID;

  const result = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId, shiftTarget });
  expect(result.success).toBe(true);
  await pom.waitForStateChange(previousStateId, PLAYER_ONE_VIEW);
}

async function clickShiftActionChip(page: Page, cardId: string): Promise<void> {
  await page.locator(`[data-card-id="${cardId}"]`).first().hover();
  await page.getByTestId("card-hover-action-chip-shift-card").click();
}

test.describe("Shift", () => {
  test("shows shift action chip when hovering a card with Shift ability", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const cardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Baloo - Carefree Bear");

    await page.locator(`[data-card-id="${cardId}"]`).first().hover();

    await expect(page.getByTestId("card-hover-action-chip-shift-card")).toBeVisible();
  });

  test("universal shift: valid same-name target has no invalid-target class; unrelated cards do", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const handCardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Baloo - Carefree Bear");
    const validTargetId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Baloo - Laid-Back Bear");
    const invalidTargetId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Moana - Determined Explorer",
    );

    await clickShiftActionChip(page, handCardId);

    await expect(
      page.locator(`[data-card-id="${validTargetId}"] .card-face--invalid-target`),
    ).toHaveCount(0);

    await expect(
      page.locator(`[data-card-id="${invalidTargetId}"] .card-face--invalid-target`),
    ).toBeVisible();
  });

  test("universal shift: completes via API and shifted card is marked as playedViaShift", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await shiftCardOntoTarget(pom, "Baloo - Carefree Bear", "Baloo - Laid-Back Bear");

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const shiftedCardId = board.players[PLAYER_ONE_ID]?.play.find(
      (id) => board.cards[id]?.fullName === "Baloo - Carefree Bear",
    );

    expect(shiftedCardId).toBeDefined();
    expect(board.cards[shiftedCardId!]?.playedViaShift).toBe(true);
  });

  test("named shift ('Genie'): only Genie target is valid; all others are invalid", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const handCardId = findCardIdByLabel(board, PLAYER_ONE_ID, "hand", "Genie - Powers Unleashed");
    const validTargetId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Genie - On the Job");
    const invalidTargetIds = [
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Baloo - Laid-Back Bear"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Chip - Friend Indeed"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Dale - Bumbler"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Moana - Determined Explorer"),
    ];

    await clickShiftActionChip(page, handCardId);

    await expect(
      page.locator(`[data-card-id="${validTargetId}"] .card-face--invalid-target`),
    ).toHaveCount(0);

    for (const invalidId of invalidTargetIds) {
      await expect(
        page.locator(`[data-card-id="${invalidId}"] .card-face--invalid-target`),
      ).toBeVisible();
    }
  });

  test("named shift ('Chip or Dale'): both Chip and Dale are valid; others are invalid", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const handCardId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Chip 'n' Dale - Recovery Rangers",
    );
    const validTargetIds = [
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Chip - Friend Indeed"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Dale - Bumbler"),
    ];
    const invalidTargetIds = [
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Baloo - Laid-Back Bear"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Genie - On the Job"),
      findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Moana - Determined Explorer"),
    ];

    await clickShiftActionChip(page, handCardId);

    for (const validId of validTargetIds) {
      await expect(
        page.locator(`[data-card-id="${validId}"] .card-face--invalid-target`),
      ).toHaveCount(0);
    }

    for (const invalidId of invalidTargetIds) {
      await expect(
        page.locator(`[data-card-id="${invalidId}"] .card-face--invalid-target`),
      ).toBeVisible();
    }
  });

  test("named shift ('Chip or Dale'): executes successfully onto Dale", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.goto({ fixtureId: SHIFT_FIXTURE_ID, view: PLAYER_ONE_VIEW });

    await shiftCardOntoTarget(pom, "Chip 'n' Dale - Recovery Rangers", "Dale - Bumbler");

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const shiftedCardId = board.players[PLAYER_ONE_ID]?.play.find(
      (id) => board.cards[id]?.fullName === "Chip 'n' Dale - Recovery Rangers",
    );

    expect(shiftedCardId).toBeDefined();
    expect(board.cards[shiftedCardId!]?.playedViaShift).toBe(true);
  });
});
