import { test, expect, type Page, type Locator } from "@playwright/test";

async function handCardCount(hand: Locator): Promise<number> {
  // CardFan mounts both desktop and mobile fans; count unique entity ids.
  return hand.locator("[data-entity-id]").evaluateAll((els) => {
    return new Set(els.map((el) => el.getAttribute("data-entity-id")).filter(Boolean)).size;
  });
}

async function deckCount(page: Page, side: "bottom" | "top"): Promise<number> {
  const stack = page.locator(`[data-testid="fab-player-${side}"] [data-zone="deck"] [data-count]`);
  const attr = await stack.first().getAttribute("data-count");
  if (attr != null && attr !== "") return Number(attr);
  const label = await page
    .locator(`[data-testid="fab-player-${side}"] [data-zone="deck"]`)
    .innerText();
  const match = label.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

async function expectInViewport(locator: Locator, label: string) {
  await expect(locator, `${label} attached`).toBeAttached();
  // Use layout geometry (getBoundingClientRect) — Playwright boundingBox is null
  // when ancestors clip with overflow:hidden even if the band is on-screen.
  const metrics = await locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      bottom: r.bottom,
      height: r.height,
      width: r.width,
      vh: window.innerHeight,
      vw: window.innerWidth,
    };
  });
  expect(metrics.height, `${label} has layout height`).toBeGreaterThan(40);
  expect(metrics.width, `${label} has layout width`).toBeGreaterThan(40);
  expect(metrics.bottom, `${label} bottom > 0`).toBeGreaterThan(0);
  expect(metrics.top, `${label} top < viewport`).toBeLessThan(metrics.vh);
  const visibleHeight = Math.min(metrics.bottom, metrics.vh) - Math.max(metrics.top, 0);
  expect(
    visibleHeight,
    `${label} visible slice > 48px (was ${JSON.stringify(metrics)})`,
  ).toBeGreaterThan(48);
}

async function expectFabVisualReady(page: Page) {
  const root = page.locator(".fab-simulator-root");
  await expect(root).toHaveAttribute("data-fab-hydrated", "true", { timeout: 30_000 });
  await expect(root).toHaveAttribute("data-fab-presentation-state", "ready", {
    timeout: 30_000,
  });
  await expect
    .poll(() => page.locator('[data-fab-image-state="loading"]:visible').count(), {
      timeout: 30_000,
      message: "visible FAB card images should finish loading before visual validation",
    })
    .toBe(0);
  await expect(page.locator('[data-fab-image-state="error"]:visible')).toHaveCount(0);
}

async function desktopTableGeometry(page: Page) {
  return page.getByTestId("fab-board").evaluate((board) => {
    const requiredRect = (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`Missing desktop table landmark: ${selector}`);
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    };

    return {
      rows: getComputedStyle(board).gridTemplateRows,
      topHand: requiredRect('.fab-tabletop-hand[data-side="top"]'),
      bottomHand: requiredRect('[data-testid="fab-desktop-hand-area"]'),
    };
  });
}

function expectStableDesktopTableGeometry(
  actual: Awaited<ReturnType<typeof desktopTableGeometry>>,
  baseline: Awaited<ReturnType<typeof desktopTableGeometry>>,
) {
  expect(actual.rows).toBe(baseline.rows);
  for (const landmark of ["topHand", "bottomHand"] as const) {
    expect(actual[landmark].top).toBeCloseTo(baseline[landmark].top, 1);
    expect(actual[landmark].bottom).toBeCloseTo(baseline[landmark].bottom, 1);
    expect(actual[landmark].height).toBeCloseTo(baseline[landmark].height, 1);
  }
}

async function advanceFabCombatToTerminal(page: Page) {
  for (let index = 0; index < 30; index += 1) {
    if (await page.getByTestId("fab-practice-terminal").count()) return;
    const pass = page.getByRole("button", { name: /^Pass/ }).last();
    if (
      (await pass.isVisible().catch(() => false)) &&
      (await pass.isEnabled().catch(() => false))
    ) {
      await pass.click();
    }
    await page.waitForTimeout(550);
  }
  throw new Error("FAB combat did not reach a visible terminal result.");
}

async function expectVisibleFabWin(page: Page) {
  const terminal = page.getByTestId("fab-practice-terminal");
  await expect(terminal).toBeVisible();
  await expect(page.getByTestId("fab-practice-winner")).toHaveText("You");
  await expect(page.getByTestId("fab-practice-loser")).toHaveText("Practice bot");
  await expect(page.getByTestId("fab-practice-new-game")).toBeVisible();
  await expect(page.getByTestId("fab-practice-new-game")).toBeEnabled();
  await expect(page.getByTestId("fab-practice-setup")).toHaveCount(0);
}

test.describe("Flesh and Blood board", () => {
  test("sidebar preview waits for hydrated, decoded card art before visual capture", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 955, height: 964 });
    await page.goto("/flesh-and-blood/simulator/tests/sidebar-preview");
    await expectFabVisualReady(page);

    const bravo = page.getByAltText("Bravo, Showstopper");
    await expect(bravo).toBeVisible();
    await expect
      .poll(
        () =>
          bravo.evaluate((image) => ({
            complete: (image as HTMLImageElement).complete,
            width: (image as HTMLImageElement).naturalWidth,
            height: (image as HTMLImageElement).naturalHeight,
          })),
        { timeout: 15_000 },
      )
      .toEqual({ complete: true, width: 320, height: 320 });
  });

  test("fixture catalog is discovery-only; opening fixture uses real play surface", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });

    // Catalog helper — no tabletop.
    await page.goto("/flesh-and-blood/simulator/tests");
    await expect(page.getByTestId("fab-fixture-index")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-board")).toHaveCount(0);
    await expect(page.getByTestId("fab-fixture-link-opening")).toBeVisible();

    // Real play surface with fixture preloaded (same component as practice).
    await page.goto("/flesh-and-blood/simulator/tests/opening");
    await expect(page.getByTestId("fab-practice-page")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-practice-page")).toHaveAttribute(
      "data-play-surface",
      "true",
    );
    await expect(page.getByTestId("fab-practice-page")).toHaveAttribute("data-fixture", "opening");
    await expect(page.getByTestId("fab-board")).toBeVisible();
    await expect(page.getByTestId("fab-player-top")).toBeVisible();
    await expect(page.getByTestId("fab-player-bottom")).toBeVisible();
    await expect(page.getByTestId("fab-combat-chain")).toHaveAttribute("data-chain-state", "empty");
    await expect(page.getByTestId("fab-chain-summary")).toContainText(/closed/i);

    await expectInViewport(page.getByTestId("fab-hand-bottom"), "bottom hand");
    await expectInViewport(page.getByTestId("fab-hand-top"), "top hand");

    const pilesBox = await page
      .locator('[data-testid="fab-player-bottom"] [data-zone-group="piles"]')
      .boundingBox();
    expect(pilesBox, "bottom piles present").not.toBeNull();
    expect(pilesBox!.height, "bottom piles height capped").toBeLessThanOrEqual(140);

    expect(errors, `page errors: ${errors.join(" | ")}`).toEqual([]);
  });

  test("combat fixture loads local engine on real practice surface", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/flesh-and-blood/simulator/tests/combat");
    await expect(page.getByTestId("fab-practice-page")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-practice-page")).toHaveAttribute("data-fixture", "combat");
    await expect(page.getByTestId("fab-practice-page")).toHaveAttribute("data-engine", "local");
    await expect(page.getByTestId("fab-tabletop")).toBeVisible();
    await expect(page.getByTestId("fab-combat-chain")).toHaveAttribute(
      "data-chain-state",
      "active",
    );
    await expect(page.getByTestId("fab-chain-attacker")).toContainText(/Alpha Rampage/i);
    await expect(page.getByTestId("fab-chain-equation")).toBeVisible();
    await expect(page.getByTestId("fab-chain-step")).toContainText(/Defend/i);
    await expect(page.getByTestId("fab-legal-moves")).toBeVisible();
    await expect(page.getByTestId("fab-match-actions")).toBeVisible();

    await expectInViewport(page.getByTestId("fab-hand-bottom"), "bottom hand on combat");
  });

  test("pending defense points the attacking viewer toward the opponent", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/flesh-and-blood/simulator/tests/defend-open-attacker");
    await expect(page.getByTestId("fab-board")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-board")).toHaveAttribute("data-agency-owner", "opponent");
    await expect(page.getByTestId("fab-player-top")).toHaveAttribute("data-agency", "true");
    await expect(page.getByTestId("fab-player-bottom")).not.toHaveAttribute("data-agency", "true");

    const nudge = await page.getByTestId("fab-combat-chain").evaluate((chain) => {
      const style = getComputedStyle(chain, "::after");
      return {
        content: style.content,
        top: style.top,
        borderBottomWidth: style.borderBottomWidth,
        borderBottomColor: style.borderBottomColor,
      };
    });
    expect(nudge.content).not.toBe("none");
    expect(nudge.top).toBe("0px");
    expect(nudge.borderBottomWidth).toBe("10px");
    expect(nudge.borderBottomColor).not.toBe("rgba(0, 0, 0, 0)");
  });

  test("desktop prompts and combat preserve both hand landmarks", async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1600, height: 500 });

    await page.goto("/flesh-and-blood/simulator/tests/opening");
    await expect(page.getByTestId("fab-board")).toBeVisible({ timeout: 30_000 });
    const baseline = await desktopTableGeometry(page);

    await page.goto("/flesh-and-blood/simulator/tests/combat-stack-responses");
    await expect(page.getByTestId("fab-board")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-combat-chain")).toHaveAttribute(
      "data-chain-state",
      "active",
    );
    expectStableDesktopTableGeometry(await desktopTableGeometry(page), baseline);

    const bottomHand = page.getByTestId("fab-desktop-hand-area");
    const visibleCardFaces = await bottomHand.locator(".sim-card-face").evaluateAll((cards) =>
      cards.flatMap((card) => {
        const rect = card.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0
          ? [{ top: rect.top, bottom: rect.bottom, height: rect.height }]
          : [];
      }),
    );
    expect(visibleCardFaces.length, "combat fixture has visible cards in hand").toBeGreaterThan(0);
    const handRect = await bottomHand.evaluate((hand) => {
      const rect = hand.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    });
    for (const card of visibleCardFaces) {
      expect(card.top, "hand card starts inside its stable track").toBeGreaterThanOrEqual(
        handRect.top - 0.5,
      );
      expect(card.bottom, "hand card ends inside its stable track").toBeLessThanOrEqual(
        handRect.bottom + 0.5,
      );
      expect(card.height, "hand card retains usable height").toBeGreaterThan(80);
    }

    await page.goto("/flesh-and-blood/simulator/tests/trigger-decision-lab");
    const prompt = page.getByTestId("interaction-resolution-prompt");
    await expect(prompt).toBeVisible({ timeout: 30_000 });
    expectStableDesktopTableGeometry(await desktopTableGeometry(page), baseline);

    const structure = await page.evaluate(() => {
      const host = document.querySelector(".fab-dnd-host");
      const board = document.querySelector('[data-testid="fab-board"]');
      const promptElement = document.querySelector<HTMLElement>(
        '[data-testid="interaction-resolution-prompt"]',
      );
      return {
        boardAndPromptShareHost:
          host !== null && board?.parentElement === host && promptElement?.parentElement === host,
        promptIsOutsideBoard:
          board !== null && promptElement !== null && !board.contains(promptElement),
        promptPosition: promptElement ? getComputedStyle(promptElement).position : null,
      };
    });
    expect(structure).toEqual({
      boardAndPromptShareHost: true,
      promptIsOutsideBoard: true,
      promptPosition: "absolute",
    });

    const triggerOverlay = await page.evaluate(() => {
      const board = document.querySelector<HTMLElement>('[data-testid="fab-board"]');
      const overlay = document.querySelector<HTMLElement>(
        '[data-testid="fab-board-overlay-layer"]',
      );
      const workspace = document.querySelector<HTMLElement>(
        '[data-testid="fab-desktop-combat-workspace"]',
      );
      const panel = document.querySelector<HTMLElement>(".fab-trigger-order-panel");
      if (!board || !overlay || !workspace || !panel) {
        throw new Error("Missing trigger-order overlay landmark");
      }
      const boardRect = board.getBoundingClientRect();
      const workspaceRect = workspace.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      return {
        overlayDirectBoardChild: overlay.parentElement === board,
        workspaceInOverlay: workspace.parentElement === overlay,
        panelInOverlay: panel.parentElement === overlay,
        directTransientChildren: board.querySelectorAll(
          [
            ":scope > .fab-trigger-order-panel",
            ":scope > .fab-pitch-order-panel",
            ":scope > .fab-desktop-combat-workspace",
            ":scope > .fab-active-effects-rail",
          ].join(", "),
        ).length,
        workspaceCenterX: workspaceRect.left + workspaceRect.width / 2,
        workspaceCenterY: workspaceRect.top + workspaceRect.height / 2,
        panelCenterX: panelRect.left + panelRect.width / 2,
        panelCenterY: panelRect.top + panelRect.height / 2,
        workspaceLeftInset: workspaceRect.left - boardRect.left,
        workspaceRightInset: boardRect.right - workspaceRect.right,
      };
    });
    expect(triggerOverlay.overlayDirectBoardChild).toBe(true);
    expect(triggerOverlay.workspaceInOverlay).toBe(true);
    expect(triggerOverlay.panelInOverlay).toBe(true);
    expect(triggerOverlay.directTransientChildren).toBe(0);
    expect(triggerOverlay.panelCenterX).toBeCloseTo(triggerOverlay.workspaceCenterX, 1);
    expect(triggerOverlay.panelCenterY).toBeCloseTo(triggerOverlay.workspaceCenterY, 1);
    expect(triggerOverlay.workspaceLeftInset).toBeCloseTo(triggerOverlay.workspaceRightInset, 1);

    await page.goto("/flesh-and-blood/simulator/tests/pitch-stack-four-cards");
    await expect(page.locator(".fab-pitch-order-panel")).toBeVisible({ timeout: 30_000 });
    expectStableDesktopTableGeometry(await desktopTableGeometry(page), baseline);
    const pitchOverlay = await page.evaluate(() => {
      const board = document.querySelector<HTMLElement>('[data-testid="fab-board"]');
      const overlay = document.querySelector<HTMLElement>(
        '[data-testid="fab-board-overlay-layer"]',
      );
      const panel = document.querySelector<HTMLElement>(".fab-pitch-order-panel");
      if (!board || !overlay || !panel) throw new Error("Missing pitch-order overlay landmark");
      const overlayRect = overlay.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      return {
        overlayDirectBoardChild: overlay.parentElement === board,
        panelInOverlay: panel.parentElement === overlay,
        directTransientChildren: board.querySelectorAll(
          [
            ":scope > .fab-trigger-order-panel",
            ":scope > .fab-pitch-order-panel",
            ":scope > .fab-desktop-combat-workspace",
            ":scope > .fab-active-effects-rail",
          ].join(", "),
        ).length,
        overlayCenterX: overlayRect.left + overlayRect.width / 2,
        panelCenterX: panelRect.left + panelRect.width / 2,
        panelCenterY: panelRect.top + panelRect.height / 2,
      };
    });
    expect(pitchOverlay.overlayDirectBoardChild).toBe(true);
    expect(pitchOverlay.panelInOverlay).toBe(true);
    expect(pitchOverlay.directTransientChildren).toBe(0);
    expect(pitchOverlay.panelCenterX).toBeCloseTo(pitchOverlay.overlayCenterX, 1);
    expect(pitchOverlay.panelCenterY).toBeCloseTo(triggerOverlay.workspaceCenterY, 1);
  });

  test("settles Motion before publishing deferred practice telemetry", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/flesh-and-blood/simulator/tests/dual-target-open");
    await expect(page.getByTestId("fab-practice-page")).toBeVisible({ timeout: 30_000 });

    await page
      .getByRole("button", { name: /^Snatch, card, player-1,/ })
      .first()
      .click();
    const animationBoundary = page.locator("[data-animation-interaction-boundary]");
    await expect(animationBoundary).toHaveAttribute("inert", "");
    await expect(animationBoundary).not.toHaveAttribute("inert", "", { timeout: 5_000 });
    await page.getByRole("tab", { name: "Lab" }).click();

    const decisions = page.getByTestId("fab-practice-decision-log");
    await expect(decisions).toContainText("Snatch");
    await expect(decisions).toContainText("Accepted");
  });

  test("practice setup starts match on the real play path", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/flesh-and-blood/simulator/play/practice");
    await expect(page.getByTestId("fab-practice-setup")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("fab-practice-start").click();
    await page.getByRole("button", { name: "Confirm selection" }).click();
    await expect(page.getByTestId("fab-practice-page")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("fab-board")).toBeVisible();
    await expect(page.getByTestId("fab-match-actions")).toBeVisible();
    await page.getByRole("tab", { name: "Now" }).click();
    await expect(page.getByTestId("fab-legal-moves")).toBeVisible();

    const hand = page.getByTestId("fab-hand-bottom");
    await expect
      .poll(async () => hand.evaluate((el) => el.getBoundingClientRect().height), {
        message: "practice hand has layout height",
        timeout: 5_000,
      })
      .toBeGreaterThan(40);
    await expectInViewport(hand, "practice bottom hand");

    const handBefore = await handCardCount(hand);
    const deckBefore = await deckCount(page, "bottom");
    expect(handBefore, "practice starts with cards in hand").toBeGreaterThan(0);
    expect(deckBefore, "practice starts with cards in deck").toBeGreaterThan(0);
  });

  test("portrait practice renders public hero and equipment art without crowding its rails", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto("/flesh-and-blood/simulator/play/practice");
    await page.getByTestId("fab-practice-start").click();
    await page.getByRole("button", { name: "Confirm selection" }).click();

    await expect(page.getByTestId("fab-board")).toHaveAttribute("data-layout", "portrait-mobile");
    await expect(page.getByTestId("fab-mobile-top-rail")).toBeVisible();
    await expect(page.getByTestId("fab-mobile-bottom-rail")).toBeVisible();

    const heroCards = page.locator(".fab-mobile-hero-slot [data-testid='card']");
    expect(await heroCards.count()).toBeGreaterThanOrEqual(10);
    const cardMetrics = await heroCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
    for (const metrics of cardMetrics) {
      expect(
        metrics.width,
        `hero/equipment card width: ${JSON.stringify(metrics)}`,
      ).toBeGreaterThan(40);
      expect(
        metrics.height,
        `hero/equipment card height: ${JSON.stringify(metrics)}`,
      ).toBeGreaterThan(40);
    }

    await expectInViewport(page.getByTestId("fab-hand-bottom"), "portrait practice hand");
    const boardMetrics = await page.getByTestId("fab-board").evaluate((board) => {
      const heroRows = Array.from(board.querySelectorAll<HTMLElement>(".fab-mobile-hero-row"));
      const arena = board.querySelector<HTMLElement>("[aria-label='Shared arena']");
      return {
        heroRows: heroRows.map((row) => row.getBoundingClientRect().height),
        arenaHeight: arena?.getBoundingClientRect().height ?? 0,
      };
    });
    expect(boardMetrics.heroRows).toHaveLength(2);
    expect(Math.max(...boardMetrics.heroRows)).toBeLessThanOrEqual(160);
    expect(boardMetrics.arenaHeight).toBeGreaterThan(220);
  });

  test("active bot match survives a multi-turn route remount without returning to setup", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/flesh-and-blood/simulator/play/practice");
    await page.getByTestId("fab-practice-your-deck").selectOption("cc-guilherme-coutinho-rhinar");
    await page.getByTestId("fab-practice-bot-deck").selectOption("cc-guilherme-coutinho-rhinar");
    await page.getByTestId("fab-practice-bot-strategy").selectOption("never-defend");
    await page.getByTestId("fab-practice-seed").fill("engineering-handoff-active-bot-1");
    await page.getByTestId("fab-practice-start").click();
    await page.getByRole("button", { name: "Confirm selection" }).click();

    const playSurface = page.getByTestId("fab-practice-page");
    await expect(playSurface).toBeVisible();
    await expect(playSurface).toHaveAttribute(
      "data-practice-seed",
      "engineering-handoff-active-bot-1",
    );
    await page.getByRole("tab", { name: "Now" }).click();
    const endTurn = page.getByTestId("fab-action-end-turn");
    await expect(endTurn).toBeVisible();
    await endTurn.click();
    await expect(endTurn).toBeHidden();
    for (let index = 0; index < 50; index += 1) {
      if (await endTurn.isVisible().catch(() => false)) break;
      const pass = page.getByRole("button", { name: /^Pass/ }).last();
      if (
        (await pass.isVisible().catch(() => false)) &&
        (await pass.isEnabled().catch(() => false))
      ) {
        await pass.click();
      }
      await page.waitForTimeout(550);
    }
    await expect(endTurn).toBeVisible();

    await page.reload();
    await expect(playSurface).toBeVisible({ timeout: 30_000 });
    await expect(playSurface).toHaveAttribute(
      "data-practice-seed",
      "engineering-handoff-active-bot-1",
    );
    await expect(page.getByTestId("fab-practice-setup")).toHaveCount(0);
    await expect(page.getByTestId("fab-practice-error")).toHaveCount(0);
  });

  test("practice match can run from setup to a terminal result without broken card art", async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000);
    const runtimeErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("requestfailed", (request) => failedRequests.push(request.url()));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/flesh-and-blood/simulator/play/practice");
    await page.getByTestId("fab-practice-your-deck").selectOption("cc-edinburgh-1st-gravy-bones");
    await page.getByTestId("fab-practice-bot-deck").selectOption("cc-guilherme-coutinho-rhinar");
    await page.getByTestId("fab-practice-bot-strategy").selectOption("hero-profile");
    await page.getByTestId("fab-practice-seed").fill("full-practice-browser-validation-1");
    await page.getByTestId("fab-practice-start").click();
    await page.getByRole("button", { name: "Confirm selection" }).click();
    await expect(page.getByTestId("fab-practice-page")).toBeVisible({ timeout: 30_000 });
    await expectFabVisualReady(page);

    const visibleCardImages = page.locator('[data-testid="fab-board"] img:visible');
    await expect.poll(() => visibleCardImages.count(), { timeout: 15_000 }).toBeGreaterThan(0);
    const imageFailures = await visibleCardImages.evaluateAll((images) =>
      images
        .filter(
          (image) =>
            !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0,
        )
        .map((image) => (image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src),
    );
    expect(imageFailures, `broken card images: ${imageFailures.join(" | ")}`).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath("practice-opening.png"), fullPage: true });

    for (let step = 0; step < 500; step += 1) {
      if (await page.getByText("Game complete", { exact: true }).count()) break;
      const nowTab = page.getByRole("tab", { name: "Now" });
      if (
        (await nowTab.isVisible().catch(() => false)) &&
        (await nowTab.getAttribute("aria-selected")) !== "true"
      ) {
        await nowTab.click();
      }

      const endTurn = page.getByTestId("fab-action-end-turn");
      const pass = page.getByRole("button", { name: /^Pass/ }).last();
      const closeChain = page.getByRole("button", { name: /^Close (combat )?chain$/ }).last();
      const chooseNone = page.getByRole("button", { name: "Choose none" });
      const defenseAction = page.getByTestId("fab-action-pass-priority");
      if (
        (await defenseAction.isVisible().catch(() => false)) &&
        (await defenseAction.isEnabled()) &&
        /Declare defense|Are you sure\?/.test((await defenseAction.textContent()) ?? "")
      ) {
        await defenseAction.click();
      } else if (
        (await chooseNone.isVisible().catch(() => false)) &&
        (await chooseNone.isEnabled())
      ) {
        await chooseNone.click();
      } else if ((await endTurn.isVisible().catch(() => false)) && (await endTurn.isEnabled())) {
        await endTurn.click();
      } else if (
        (await closeChain.isVisible().catch(() => false)) &&
        (await closeChain.isEnabled())
      ) {
        await closeChain.click();
      } else if ((await pass.isVisible().catch(() => false)) && (await pass.isEnabled())) {
        await pass.click();
      }
      await page.waitForTimeout(300);
    }

    await expect(page.getByTestId("fab-practice-now").getByText("Game complete")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Winner: player-2.", { exact: true })).toBeVisible();
    await expect(page.getByTestId("fab-practice-error")).toHaveCount(0);
    await expectFabVisualReady(page);
    await page.screenshot({ path: testInfo.outputPath("practice-terminal.png"), fullPage: true });
    expect(runtimeErrors, `runtime errors: ${runtimeErrors.join(" | ")}`).toEqual([]);
    expect(failedRequests, `failed requests: ${failedRequests.join(" | ")}`).toEqual([]);
  });

  test("attack-action lethal visibly identifies winner and loser", async ({ page }) => {
    await page.goto("/flesh-and-blood/simulator/tests/attack-action-lethal");
    await page.getByRole("button", { name: /Splatter Skull, card/ }).click();
    await page.getByRole("button", { name: /Nimblism, card/ }).click();
    await advanceFabCombatToTerminal(page);
    await expectVisibleFabWin(page);
  });

  test("weapon lethal visibly identifies winner and loser", async ({ page }) => {
    await page.goto("/flesh-and-blood/simulator/tests/weapon-lethal");
    await page.getByRole("button", { name: /Ravenous Meataxe, card/ }).click();
    await advanceFabCombatToTerminal(page);
    await expectVisibleFabWin(page);
  });
});
