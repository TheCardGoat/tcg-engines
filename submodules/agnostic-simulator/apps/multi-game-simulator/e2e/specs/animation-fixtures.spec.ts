import { expect, test, type Page } from "@playwright/test";

const FIXTURE_ROUTE = "/animation-fixtures";
const STEP_TYPES = [
  "entityTransfer",
  "emphasize",
  "entityStateChange",
  "effect",
  "combat",
  "valueDelta",
  "phaseChange",
  "randomization",
  "gameResult",
  "hold",
] as const;

test.describe("real simulator animation fixture inventory", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
  });

  test("inventories every shared step and preserves selected game in the URL", async ({ page }) => {
    await openInventory(page);

    for (const stepType of STEP_TYPES) {
      await expect(page.locator(`[data-animation-step="${stepType}"]`)).toHaveCount(1);
    }

    await page.getByTestId("animation-game-gundam").click();
    await expect(page).toHaveURL(`${FIXTURE_ROUTE}?game=gundam`);
    await expect(
      page.getByRole("heading", { name: "Gundam Card Game runtime cases" }),
    ).toBeVisible();
    await expect(page.getByText("Unreachable server cardFlip mapping")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gundam Card Game sequence fixtures" }),
    ).toBeVisible();
    await expect(page.getByTestId("open-sequence-gundam-mulligan-redraw")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("animation-game-gundam")).toHaveAttribute("aria-pressed", "true");

    await page.getByTestId("animation-game-riftbound").click();
    await expect(page.locator('a[data-testid^="open-"]')).toHaveCount(5);
    await expect(page.getByText("Official-catalog manual tabletop")).toBeVisible();
  });

  test("launches the real Cyberpunk fixture and observes a real card animation clear", async ({
    page,
  }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitFieldOperatorRetail?ai=off&auto-advance-attack=off",
      { waitUntil: "domcontentloaded" },
    );

    const card = page.locator('img[alt="Field Operator"]');
    await expect(card).toHaveCount(1, { timeout: 30_000 });
    await card.click();
    await page.getByRole("menuitem", { name: /^Play Pay/ }).click();

    await expect(page.locator('[aria-busy="true"]')).toBeAttached({ timeout: 1_000 });
    await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached({
      timeout: 1_000,
    });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    await expect(page.locator('img[alt="Field Operator"]')).toHaveCount(1);
    await expect(page.getByText("blocker", { exact: true })).toHaveCount(0);
  });

  test("launches the real Gundam fixture with production cards", async ({ page }) => {
    await page.goto("/gundam/simulator/vs-ai?fixture=deploy-unit-demo", {
      waitUntil: "domcontentloaded",
    });

    const gm = page.locator('img[alt="GM"]');
    await expect(gm).toHaveCount(1);
    await expect(page.locator('img[alt="Guncannon"]')).toHaveCount(1);
    await expect(page.locator('img[alt="Guntank"]')).toHaveCount(1);

    await gm.click();
    await page.getByRole("menuitem", { name: /Deploy Unit/ }).click();

    await expect(
      page.locator('[aria-label="Your battle area drop zone"] img[alt="GM"]'),
    ).toHaveCount(1, { timeout: 4_000 });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    await expect(page.locator('img[alt="GM"]')).toHaveCount(1);
  });

  test("lets an accepted Gundam drag own the hand-to-battle-area visual", async ({ page }) => {
    await page.goto("/gundam/simulator/vs-ai?fixture=deploy-unit-demo", {
      waitUntil: "domcontentloaded",
    });

    const gm = page.locator('img[alt="GM"]');
    const battleArea = page.locator('[aria-label="Your battle area drop zone"]');
    await expect(gm).toHaveCount(1);

    await gm.dragTo(battleArea, { steps: 12 });

    for (const delayMs of [0, 80, 180]) {
      if (delayMs > 0) await page.waitForTimeout(delayMs);
      await expect(page.locator('img[alt="GM"]:visible')).toHaveCount(1);
      await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0);
    }

    await expect(battleArea.locator('img[alt="GM"]')).toHaveCount(1, { timeout: 4_000 });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
  });

  test("runs the Gundam mulligan redraw before shuffling the deck", async ({ page }) => {
    await page.goto("/gundam/simulator/vs-ai?fixture=mulligan-animation-demo", {
      waitUntil: "domcontentloaded",
    });

    const hand = page.getByRole("list", { name: "Your hand" });
    const mulligan = page.getByRole("dialog", { name: "Keep or redraw?" });
    const handCardIds = () =>
      hand
        .locator("[data-card-id]")
        .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-card-id")));

    await expect(mulligan).toBeVisible({ timeout: 15_000 });
    await expect(hand.locator("[data-card-id]")).toHaveCount(5);
    const beforeIds = await handCardIds();

    await mulligan.getByRole("button", { name: "Redraw hand" }).click();

    await expect(page.locator('[aria-busy="true"]')).toBeAttached({ timeout: 1_000 });
    const transferLayer = page.locator("[data-animation-transfer-layer]");
    await expect(transferLayer).toBeAttached({ timeout: 1_000 });
    await expect(transferLayer.locator('[data-animation-transfer-face-change="true"]')).toHaveCount(
      10,
    );
    for (const id of beforeIds) {
      await expect(hand.locator(`[data-card-id="${id}"]:visible`)).toHaveCount(0, {
        timeout: 2500,
      });
    }
    const shuffle = page.locator('[data-animation-randomization-kind="shuffle"]');
    await expect(shuffle).toBeAttached({ timeout: 2_000 });
    await expect(hand.locator("[data-card-id]:visible")).toHaveCount(5);

    const replacementIds = (await handCardIds()).filter(
      (cardId): cardId is string => cardId !== null && !beforeIds.includes(cardId),
    );
    const replacementCenters = () =>
      hand.locator("[data-card-id]").evaluateAll(
        (cards, ids) =>
          Object.fromEntries(
            cards.flatMap((card) => {
              const id = card.getAttribute("data-card-id");
              const slot = card.closest(".hand-card");
              if (!id || !ids.includes(id) || !slot) return [];
              const rect = slot.getBoundingClientRect();
              return [[id, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }]];
            }),
          ),
        replacementIds,
      );
    const landingCenters = await replacementCenters();

    await expect(shuffle).toHaveCount(0);
    await expect(transferLayer).toHaveCount(0);
    await expect(hand.locator("[data-card-id]:visible")).toHaveCount(5);
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
    await expect(mulligan).toHaveCount(0);
    await expect(hand.locator("[data-card-id]")).toHaveCount(5);
    expect(new Set(await handCardIds())).not.toEqual(new Set(beforeIds));
    expect(await replacementCenters()).toEqual(landingCenters);
    await expect(page.getByRole("log", { name: "Event log" })).toContainText(
      "Finished mulligan (redraw count: 5).",
    );
  });

  test("runs the new semantic steps with real Riftbound catalog cards", async ({ page }) => {
    await page.goto("/riftbound/simulator/tests");
    await expect(page.getByTestId("riftbound-animation-controls")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator(".riftbound-card-button img").first()).toBeVisible();
    await expect(page.getByText("Unknown card", { exact: true })).toHaveCount(0);

    await page.getByTestId("riftbound-rotate").click();
    await expect(page.locator("[data-animation-state-change-layer]")).toBeAttached();
    const suppressedRealSlot = page.locator(
      '[inert][aria-hidden="true"][style*="visibility: hidden"]',
    );
    await expect(suppressedRealSlot).toBeAttached();
    await expect(page.locator("[data-animation-state-change-layer]")).toHaveCount(0, {
      timeout: 3_000,
    });
    await expect(suppressedRealSlot).toHaveCount(0);

    await page.getByTestId("riftbound-counter").click();
    await expect(page.locator('[data-animation-overlay="value-delta"]')).toBeAttached();
    await expect(page.locator('[data-animation-overlay="value-delta"]')).toHaveCount(0, {
      timeout: 3_000,
    });

    await page.getByTestId("riftbound-shuffle").click();
    await expect(page.locator('[data-animation-overlay="randomization"]')).toBeAttached();
    await expect(page.locator('[data-animation-overlay="randomization"]')).toHaveCount(0, {
      timeout: 3_000,
    });

    await page.getByRole("button", { name: "Draw", exact: true }).click();
    await expect(page.locator("[data-animation-transfer-layer]")).toBeAttached();
    await expect(page.locator("[data-animation-transfer-layer]")).toHaveCount(0, {
      timeout: 3_000,
    });

    await page.getByTestId("riftbound-result").click();
    await expect(page.locator('[data-animation-game-result="victory"]')).toBeAttached();
    await expect(page.locator('[data-animation-overlay="game-result"]')).toHaveCount(0, {
      timeout: 4_000,
    });
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  });

  test("repeats the Gundam Resource Area judge animation", async ({ page }) => {
    await page.goto("/gundam/simulator/vs-ai?fixture=resource-area-animation-demo", {
      waitUntil: "domcontentloaded",
    });

    const controls = page.getByRole("complementary", {
      name: "Resource Area animation fixture controls",
    });
    const addResource = controls.getByRole("button", { name: "Add Resource" });
    const resourceDeck = page.locator('[data-sim-zone-id="resourceDeck:player_one"]');
    const nextResourceDeckCard = resourceDeck.locator("[data-resource-deck-next-card]");

    await expect(controls).toContainText("Resource Area 0/15");
    await expect(resourceDeck.locator('[role="img"]:visible')).toHaveCount(3);
    await expect(nextResourceDeckCard).toHaveCSS("opacity", "1");
    await addResource.click();

    await expect(page.locator('[aria-busy="true"]')).toBeAttached({ timeout: 1_000 });
    const transferLayer = page.locator("[data-animation-transfer-layer]");
    await expect(transferLayer).toBeAttached({
      timeout: 1_000,
    });
    // The deck is an aggregate stack; only the travelling card has an overlay.
    await expect(resourceDeck.locator('[role="img"]:visible')).toHaveCount(3);
    await expect(resourceDeck.getByText("9", { exact: true })).toBeVisible();
    await expect(transferLayer.locator('[data-animation-transfer-face-change="true"]')).toHaveCount(
      1,
    );
    const nextCardBackground = await nextResourceDeckCard
      .locator('[role="img"]')
      .evaluate((card) => getComputedStyle(card).backgroundImage);
    const transferCardBackground = await transferLayer
      .locator('[role="img"][aria-label="Face-down card"]')
      .first()
      .evaluate((card) => getComputedStyle(card).backgroundImage);
    expect(transferCardBackground).toBe(nextCardBackground);
    await expect(nextResourceDeckCard).toHaveCSS("opacity", "1");
    await expect(controls).toContainText("Resource Area 1/15");
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
    await expect(resourceDeck.locator('[role="img"]:visible')).toHaveCount(3);

    await addResource.click();
    await expect(controls).toContainText("Resource Area 2/15");
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 4_000 });
  });

  test("launches One Piece through the interactive practice simulator, not a static board", async ({
    page,
  }) => {
    await page.goto("/one-piece/simulator/play/practice", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Jo Ken Po" })).toBeVisible({
      timeout: 10_000,
    });
    await expect(
      page.getByTestId("one-piece-jo-ken-po-modal").getByRole("button", { name: "Rock" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Concede", exact: true })).toBeVisible();
    await expect(page.getByText("Loaded visual fixture:", { exact: false })).toHaveCount(0);
  });
});

async function openInventory(page: Page) {
  await page.goto(FIXTURE_ROUTE);
  await expect(page.locator('[data-animation-fixture-ready="true"]')).toBeAttached();
}
