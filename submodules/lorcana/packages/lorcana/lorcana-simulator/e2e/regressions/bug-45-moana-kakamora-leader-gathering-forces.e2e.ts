import type { Page } from "@playwright/test";
import {
  expect,
  test,
  buildRegressionFixturePath,
  findCardIdByLabel,
  LorcanaSimulatorPom,
} from "../support/lorcana-test.js";

const PLAYER_ONE_VIEW = "playerOne" as const;
const PLAYER_ONE_ID = "player_one";
const REGRESSION_PATH = buildRegressionFixturePath("bug-45-moana-kakamora-leader-gathering-forces");

async function executeWithRetry(
  pom: LorcanaSimulatorPom,
  view: typeof PLAYER_ONE_VIEW,
  moveId: string,
  params: Record<string, unknown>,
): Promise<{ success: boolean; reason?: string; code?: string }> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const result = await pom.execute(view, moveId, params);
    if (result.success || result.code !== "OPTIMISTIC_MOVE_PENDING") {
      return result;
    }
    await pom.page.waitForTimeout(50);
  }

  return pom.execute(view, moveId, params);
}

async function expectLocationOccupantHighlightStable(page: Page, cardId: string): Promise<void> {
  const stability = await page.evaluate(async (targetCardId) => {
    const occupant = document.querySelector<HTMLElement>(
      `.location-cluster__slot--occupant[data-card-id="${CSS.escape(targetCardId)}"]`,
    );
    const rail = occupant?.closest<HTMLElement>(".location-cluster__occupants");
    const cardFace = occupant?.querySelector<HTMLElement>(".card-face");

    if (!occupant || !rail || !cardFace) {
      return { found: false };
    }

    const samples: Array<{
      cardLeft: number;
      occupantLeft: number;
      railScrollLeft: number;
      railScrollWidth: number;
    }> = [];

    for (let i = 0; i < 10; i += 1) {
      const occupantRect = occupant.getBoundingClientRect();
      const cardRect = cardFace.getBoundingClientRect();
      samples.push({
        cardLeft: cardRect.left,
        occupantLeft: occupantRect.left,
        railScrollLeft: rail.scrollLeft,
        railScrollWidth: rail.scrollWidth,
      });
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    const delta = (key: keyof (typeof samples)[number]) =>
      Math.max(...samples.map((sample) => sample[key])) -
      Math.min(...samples.map((sample) => sample[key]));

    return {
      found: true,
      cardLeftDelta: delta("cardLeft"),
      occupantLeftDelta: delta("occupantLeft"),
      railScrollLeftDelta: delta("railScrollLeft"),
      railScrollWidthDelta: delta("railScrollWidth"),
    };
  }, cardId);

  expect(stability.found).toBe(true);
  if (stability.found) {
    expect(stability.cardLeftDelta).toBeLessThan(0.5);
    expect(stability.occupantLeftDelta).toBeLessThan(0.5);
    expect(stability.railScrollLeftDelta).toBe(0);
    expect(stability.railScrollWidthDelta).toBe(0);
  }
}

test.describe("Bug 45 - Moana, Kakamora Leader", () => {
  test("Carl Fredricksen - On the Move lets the player move himself and another character after playing a location", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const carlId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Carl Fredricksen - On the Move",
    );
    const hathiId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Colonel Hathi - On the March",
    );
    const flotillaId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Flotilla - Coconut Armada",
    );
    const towerId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "hand",
      "Rapunzel's Tower - Taken by the Vine",
    );

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: towerId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText("Choose a character to move for");
    await expect(guidance).toContainText("Carl Fredricksen - On the Move: MOVING PARTNER");
    await expect(page.getByRole("button", { name: "Accept effect" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Decline effect" })).toHaveCount(0);

    const boardAfterPlay = await pom.getBoard(PLAYER_ONE_VIEW);
    await page
      .locator(`[data-card-id="${hathiId}"][aria-label="Colonel Hathi - On the March, cost 5"]`)
      .click({
        force: true,
      });

    const autoSubmitted = await page
      .waitForFunction(
        async ({ targetView, targetStateID }) => {
          const harness = (
            window as typeof window & {
              __lorcanaTestHarness?: {
                getStatus(view: string): Promise<{ stateID: number }>;
              };
            }
          ).__lorcanaTestHarness;
          if (!harness) {
            return false;
          }

          const status = await harness.getStatus(targetView);
          return status.stateID !== targetStateID;
        },
        { targetView: PLAYER_ONE_VIEW, targetStateID: boardAfterPlay.stateID },
        { timeout: 1500 },
      )
      .then(() => true)
      .catch(() => false);

    if (!autoSubmitted) {
      await expect(guidance).toContainText("Colonel Hathi - On the March");
      const beforeConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
      await pom.confirmResolutionSelection();
      await pom.waitForStateChange(beforeConfirm.stateID, PLAYER_ONE_VIEW);
    }

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
    expect(resolvedBoard.cards[carlId]?.atLocationId).toBe(towerId);
    expect(resolvedBoard.cards[hathiId]?.atLocationId).toBe(towerId);
  });

  test("Colonel Hathi - On the March asks the player to choose a location after questing", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const hathiId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Colonel Hathi - On the March",
    );
    const flotillaId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Flotilla - Coconut Armada",
    );

    const questResult = await executeWithRetry(pom, PLAYER_ONE_VIEW, "quest", {
      cardId: hathiId,
    });
    expect(questResult.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    const guidance = page.getByRole("region", { name: "Active player guidance" });
    await expect(guidance).toContainText("Choose a location to move to for");
    await expect(guidance).toContainText("Colonel Hathi - On the March: Hup, Two, Three, Four");
    await expect(guidance).toContainText("Colonel Hathi - On the March");
    await expect(guidance).not.toContainText("Choose a character to move for");

    const beforeSelection = await pom.getBoard(PLAYER_ONE_VIEW);
    await page
      .locator(`[data-card-id="${flotillaId}"][aria-label="Flotilla - Coconut Armada, cost 2"]`)
      .click({
        force: true,
      });

    const autoSubmitted = await page
      .waitForFunction(
        async ({ targetView, targetStateID }) => {
          const harness = (
            window as typeof window & {
              __lorcanaTestHarness?: {
                getStatus(view: string): Promise<{ stateID: number }>;
              };
            }
          ).__lorcanaTestHarness;
          if (!harness) {
            return false;
          }

          const status = await harness.getStatus(targetView);
          return status.stateID !== targetStateID;
        },
        { targetView: PLAYER_ONE_VIEW, targetStateID: beforeSelection.stateID },
        { timeout: 1500 },
      )
      .then(() => true)
      .catch(() => false);

    if (!autoSubmitted) {
      await expect(guidance).toContainText("Flotilla - Coconut Armada");
      const beforeConfirm = await pom.getBoard(PLAYER_ONE_VIEW);
      await pom.confirmResolutionSelection();
      await pom.waitForStateChange(beforeConfirm.stateID, PLAYER_ONE_VIEW);
    }

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
    expect(resolvedBoard.cards[hathiId]?.atLocationId).toBe(flotillaId);
    await expectLocationOccupantHighlightStable(page, hathiId);
  });

  test("GATHERING FORCES lets the player fill the character bucket and location slot explicitly", async ({
    page,
  }) => {
    const pom = new LorcanaSimulatorPom(page);
    await pom.gotoPath(REGRESSION_PATH);

    const setupBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    const moanaId = findCardIdByLabel(setupBoard, PLAYER_ONE_ID, "hand", "Moana - Kakamora Leader");
    const boardingPartyId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Kakamora - Boarding Party",
    );
    const specialistId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Kakamora - Long-Range Specialist",
    );
    const flotillaId = findCardIdByLabel(
      setupBoard,
      PLAYER_ONE_ID,
      "play",
      "Flotilla - Coconut Armada",
    );

    const playResult = await pom.execute(PLAYER_ONE_VIEW, "playCard", { cardId: moanaId });
    expect(playResult.success).toBe(true);
    await pom.waitForStateChange(setupBoard.stateID, PLAYER_ONE_VIEW);

    await expect(page.getByRole("region", { name: "Active player guidance" })).toContainText(
      "Choose characters to move, then choose a location for",
    );

    const boardAfterPlay = await pom.getBoard(PLAYER_ONE_VIEW);
    const bagEffect = boardAfterPlay.bagEffects[0];
    expect(bagEffect).toBeDefined();
    const resolveResult = await pom.execute(PLAYER_ONE_VIEW, "resolveBag", {
      bagId: bagEffect!.id,
      params: {
        targets: {
          kind: "move-to-location",
          subject: [boardingPartyId, specialistId],
          location: [flotillaId],
        },
      },
    });
    expect(resolveResult.success).toBe(true);
    await pom.waitForStateChange(boardAfterPlay.stateID, PLAYER_ONE_VIEW);

    const resolvedBoard = await pom.getBoard(PLAYER_ONE_VIEW);
    expect(resolvedBoard.bagEffects).toHaveLength(0);
    expect(resolvedBoard.players[PLAYER_ONE_ID]?.lore).toBe(2);
  });
});
