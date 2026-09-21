import { expect, type Page, test } from "@playwright/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import {
  progLiveWithTheAftermathActiveOnlyRetail,
  progLiveWithTheAftermathNoUnitsRetail,
  progLiveWithTheAftermathRetail,
  progLiveWithTheAftermathRivalOnlyRetail,
} from "@cyberpunk/testing/e2e-fixtures";

async function selectBoardTarget(page: Page, cardId: string): Promise<void> {
  const card = page.locator(
    `[data-testid="card"][data-entity-id="${cardId}"][data-selectable="true"]`,
  );
  await expect(card).toBeVisible();
  await card.click({ position: { x: 5, y: 5 } });
}

test("Live with the Aftermath - each player defeats their own Unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(page, progLiveWithTheAftermathRetail);
  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );
  const friendly = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMoxInciters.id,
  );
  const rival = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );
  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  await selectBoardTarget(page, friendly.instanceId);
  await expect.poll(() => pom.getPendingChoiceType(CYBERPUNK_P2)).toBe("chooseTarget");
  await selectBoardTarget(page, rival.instanceId);
  await expect(
    page.getByRole("button", { name: /resolving program: live with the aftermath/i }),
  ).toHaveCount(0);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMoxInciters.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );
  await expect
    .poll(async () => {
      try {
        await pom.expectStructuralState();
        return true;
      } catch {
        return false;
      }
    })
    .toBe(true);
});

test("Live with the Aftermath - only the active player has a Unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    progLiveWithTheAftermathActiveOnlyRetail,
  );
  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );
  const friendly = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMoxInciters.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
  await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
  await selectBoardTarget(page, friendly.instanceId);

  await expect(
    page.getByRole("button", { name: /resolving program: live with the aftermath/i }),
  ).toHaveCount(0);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailMoxInciters.id,
  );
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
});

test("Live with the Aftermath - only the rival has a Unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    progLiveWithTheAftermathRivalOnlyRetail,
  );
  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );
  const rival = await pom.getCardInZoneByDefinitionId(
    "field",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await expect(page.getByTestId("choice-modal-sheet")).toHaveCount(0);
  await expect(
    page.locator(`[data-entity-id="${rival.instanceId}"][data-selectable="true"]`),
  ).toHaveCount(0);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, "chooseTarget");

  await pom.takeControl(CYBERPUNK_P1);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileBoard = page.getByTestId("mobile-cyberpunk-board");
  await expect(mobileBoard).toBeVisible();
  await expect(mobileBoard).toHaveAttribute("data-external-rails", "true");
  await expect(mobileBoard).toHaveAttribute("data-zone-summaries", "true");
  await expect(mobileBoard).toHaveAttribute("data-prompt-active", "false");
  const mobileLayout = mobileBoard.locator('[data-mobile-portrait-layout="true"]');
  await expect(mobileLayout).toHaveCount(1);
  await expect
    .poll(() =>
      mobileLayout.evaluate((layout) =>
        Array.from(layout.children).map((element) =>
          element.getAttribute("data-mobile-portrait-slot"),
        ),
      ),
    )
    .toEqual([
      "opponent-hand",
      "opponent-zone-summary",
      "opponent-battlefield",
      "ledger",
      "player-battlefield",
      "player-zone-summary",
      "player-hand",
    ]);
  await expect
    .poll(() =>
      mobileLayout.evaluate(
        (layout) => getComputedStyle(layout).gridTemplateRows.split(" ").filter(Boolean).length,
      ),
    )
    .toBe(7);

  await page.setViewportSize({ width: 1440, height: 900 });
  await pom.takeControl(CYBERPUNK_P2);
  await page.setViewportSize({ width: 390, height: 844 });
  await selectBoardTarget(page, rival.instanceId);
  await expect(
    page.getByRole("button", { name: /resolving program: live with the aftermath/i }),
  ).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P2,
    welcomeToNightCityRetailCorpoSecurity.id,
  );
});

test("Live with the Aftermath - neither player has a Unit", async ({ page }) => {
  const pom = await createPlaywrightCyberpunkSimulatorPom(
    page,
    progLiveWithTheAftermathNoUnitsRetail,
  );
  const program = await pom.getCardInZoneByDefinitionId(
    "hand",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );

  await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
  await pom.getCardInZoneByDefinitionId(
    "trash",
    CYBERPUNK_P1,
    welcomeToNightCityRetailLiveWithTheAftermath.id,
  );
  await expect(page.getByTestId("choice-modal-sheet")).toHaveCount(0);
});
