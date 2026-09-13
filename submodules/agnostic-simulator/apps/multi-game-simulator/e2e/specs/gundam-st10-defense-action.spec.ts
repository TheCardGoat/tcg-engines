import { expect, test, type Page } from "@playwright/test";

const ROUTE = "/gundam/simulator/tests/st10-defense-action-lab";

test.describe("Gundam · ST10 Defense and Action lab", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await openLab(page);
    await expect(page.getByText("Attacked direct with Guncannon.", { exact: true })).toBeVisible();
    await expect(page.getByTestId("primary-action")).toContainText("SKIP BLOCK");
  });

  test("redirects to a Blocker, resolves Diffuse Beam Cannon, and settles combat", async ({
    page,
  }) => {
    await chooseBattleAreaCardAction(page, /Graze Duel Type, action available/i, "Block");
    await expect(
      page.getByText("Blocked Guncannon with Graze Duel Type.", { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("primary-action")).toContainText("PASS ACTION");

    // Action Step: a single-enabled Command activates on click.
    await page.getByRole("listitem", { name: "Diffuse Beam Cannon (cost 1)" }).click();
    await expect(page.getByTestId("card-context-menu")).toHaveCount(0);
    await expectAnimationToSettle(page);
    await expect(page.getByText("Played Diffuse Beam Cannon.", { exact: true })).toBeVisible();

    const targetPrompt = page.getByRole("region", { name: "Current effect" });
    await expect(targetPrompt).toContainText("choose 1 enemy Unit");
    await expect(targetPrompt).toContainText("Required · Choose exactly 1 target");
    await page.getByRole("button", { name: /^Guncannon, unit/i }).click();
    await expect(page.locator('[data-animation-overlay="value-delta"]')).toContainText("-3 AP");
    await expectAnimationToSettle(page);
    await expect(
      page.getByText("Guncannon gets AP -3 during this battle.", { exact: true }),
    ).toBeVisible();

    const completedBattle = page.getByRole("button", {
      name: /Turn 1 battle \/ end \d+ entries/i,
    });
    await expect(completedBattle).toHaveAttribute("aria-expanded", "false");
    await completedBattle.click();
    await expect(completedBattle).toHaveAttribute("aria-expanded", "true");

    await expect(page.getByText("Guncannon took 2 damage.", { exact: true })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Combat resolved.", { exact: true })).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.locator('img[alt="Guncannon"]').locator("xpath=ancestor::*[@data-card-id][1]"),
    ).toContainText("DMG2");
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("can skip the revealed Burst and leave Luna Mana out of the Base section", async ({
    page,
  }) => {
    await page.getByTestId("primary-action").click();
    await expect(page.getByText("You did not block.", { exact: true })).toBeVisible();

    await page.getByTestId("primary-action").click();
    await expectAnimationToSettle(page);
    await expect(
      page.getByText("Revealed Luna Mana & Carry Base from Shields.", { exact: true }),
    ).toBeVisible();
    const burstPrompt = page.getByRole("region", { name: "Current effect" });
    await expect(burstPrompt).toContainText("Luna Mana & Carry Base — Burst");
    await expect(burstPrompt).toContainText("Deploy this card");
    await expect(burstPrompt).toContainText("Optional");

    await burstPrompt.getByRole("button", { name: "Skip", exact: true }).click();
    await expectAnimationToSettle(page);
    await expect(
      page.locator('[data-sim-zone-id="baseSection:player_one"] img[alt="Luna Mana & Carry Base"]'),
    ).toHaveCount(0);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("resolves Burst, animates Luna Mana into the Base section, and applies Deploy", async ({
    page,
  }) => {
    await page.getByTestId("primary-action").click();
    await expect(page.getByText("You did not block.", { exact: true })).toBeVisible();
    await page.getByTestId("primary-action").click();
    await expectAnimationToSettle(page);

    await page
      .getByRole("region", { name: "Current effect" })
      .getByRole("button", { name: "Resolve", exact: true })
      .click();
    await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached();
    await expectAnimationToSettle(page);

    await expect(
      page.locator('[data-sim-zone-id="baseSection:player_one"] img[alt="Luna Mana & Carry Base"]'),
    ).toBeVisible();
    await expect(page.getByText("Added 1 Shield to hand.", { exact: true })).toBeVisible();
    await expect(page.getByText("Graze Duel Type recovered 1 HP.", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Finished resolving Luna Mana & Carry Base · Deploy.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("settles the Blocker branch immediately with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await waitForLab(page);

    await chooseBattleAreaCardAction(page, /Graze Duel Type, action available/i, "Block");
    await expect(
      page.getByText("Blocked Guncannon with Graze Duel Type.", { exact: true }),
    ).toBeVisible();
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
    await expect(page.locator('[data-animation-overlay="combat"]')).toHaveCount(0);
    await expect(page.getByTestId("primary-action")).toContainText("PASS ACTION");
  });
});

async function openLab(page: Page) {
  await page.goto(ROUTE);
  await waitForLab(page);
}

async function waitForLab(page: Page) {
  await expect(page.getByText("Loading match", { exact: true })).toHaveCount(0, {
    timeout: 15_000,
  });
  await expect(page.getByTestId("primary-action")).toBeVisible();
}

async function chooseBattleAreaCardAction(page: Page, cardName: RegExp, _actionName: string) {
  // Block / single-enabled step responses activate on the first click;
  // no card-context menu pick is required.
  const card = page.getByRole("button", { name: cardName });
  await card.click();
}

async function expectAnimationToSettle(page: Page) {
  await expect(page.locator('[aria-busy="true"]')).toBeAttached({ timeout: 2_000 });
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 6_000 });
}
