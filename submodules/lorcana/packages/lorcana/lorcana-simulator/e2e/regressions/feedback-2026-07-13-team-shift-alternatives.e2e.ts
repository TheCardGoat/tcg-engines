import type { Page } from "@playwright/test";
import {
  buildRegressionFixturePath,
  expect,
  findCardIdByLabel,
  LorcanaSimulatorPom,
  test,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("feedback-2026-07-13-team-shift-alternatives", {
  view: PLAYER_ONE_VIEW,
});

async function openShiftTargets(page: Page, handCardId: string): Promise<void> {
  const handCard = page.locator(`[data-card-id="${handCardId}"]`).first();
  await handCard.click();
  const previewShiftAction = page.getByRole("button", { name: /^Shift: \d+ ink$/ });
  await expect(previewShiftAction).toBeVisible();
  await previewShiftAction.click();
}

async function expectValidShiftTarget(page: Page, cardId: string): Promise<void> {
  await expect(page.locator(`[data-card-id="${cardId}"] .card-face--invalid-target`)).toHaveCount(
    0,
  );
}

async function expectInvalidShiftTarget(page: Page, cardId: string): Promise<void> {
  await expect(page.locator(`[data-card-id="${cardId}"] .card-face--invalid-target`)).toBeVisible();
}

test.describe("2026-07-13 team Shift feedback", () => {
  test("Darkwing Duck & Launchpad visually offers either named character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const teamCardId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Darkwing Duck & Launchpad - St. Canard's Finest",
    );
    const darkwingId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Darkwing Duck - Shadowy Superhero",
    );
    const launchpadId = findCardIdByLabel(board, PLAYER_ONE_ID, "play", "Launchpad - Sky Patrol");
    const carlId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Carl Fredricksen - Loving Husband",
    );

    await openShiftTargets(page, teamCardId);

    await expectValidShiftTarget(page, darkwingId);
    await expectValidShiftTarget(page, launchpadId);
    await expectInvalidShiftTarget(page, carlId);
  });

  test("Carl Fredricksen & Russell visually offers either named character", async ({ page }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const board = await pom.getBoard(PLAYER_ONE_VIEW);
    const teamCardId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "hand",
      "Carl Fredricksen & Russell - Intrepid Explorers",
    );
    const carlId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Carl Fredricksen - Loving Husband",
    );
    const russellId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Russell - Senior Wilderness Explorer",
    );
    const darkwingId = findCardIdByLabel(
      board,
      PLAYER_ONE_ID,
      "play",
      "Darkwing Duck - Shadowy Superhero",
    );

    await openShiftTargets(page, teamCardId);

    await expectValidShiftTarget(page, carlId);
    await expectValidShiftTarget(page, russellId);
    await expectInvalidShiftTarget(page, darkwingId);
  });
});
