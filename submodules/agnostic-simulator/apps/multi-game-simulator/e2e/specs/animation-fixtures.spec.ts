import { test, expect } from "../fixtures/test";

test.describe("animation fixtures", () => {
  const visibleHandCards = '[data-zone-id="human-hand"] [data-entity-id]:visible';
  const publicMoveNeighborSelectors = [
    '[data-zone-id="shared-discard"] [data-card-id="delamain-cab"]',
    '[data-zone-id="shared-discard"] [data-card-id="secondhand-bombus"]',
    '[data-zone-id="human-battlefield"] [data-card-id="armored-minotaur"]',
    '[data-zone-id="human-battlefield"] [data-card-id="swordwise-huscle"]',
  ];

  test("fits the desktop viewport without page scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 980 });
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    await expect(
      page.getByRole("heading", { name: "Card transfer building blocks" }),
    ).toBeVisible();
    const animationTable = page.locator('[aria-label="Animation table"]');
    await expect(animationTable).toBeVisible();

    const pageMetrics = await page.evaluate(() => ({
      bodyScrollHeight: document.body.scrollHeight,
      documentScrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    }));
    const tableMetrics = await animationTable.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));

    expect(pageMetrics.bodyScrollHeight).toBeLessThanOrEqual(pageMetrics.viewportHeight);
    expect(pageMetrics.documentScrollHeight).toBeLessThanOrEqual(pageMetrics.viewportHeight);
    expect(tableMetrics.scrollHeight).toBeLessThanOrEqual(tableMetrics.clientHeight);
  });

  test("perspective switch resolves secret private and public zones", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    const secretZone = page.locator('[data-zone-id="secret-cache"]');
    const privateZone = page.locator('[data-zone-id="human-hand"]');
    const publicZone = page.locator('[data-zone-id="human-battlefield"]');

    await expect(
      secretZone.locator('[data-entity-id="classified-contract:hidden"]'),
    ).toHaveAttribute("aria-label", /Hidden card/);
    await expect(secretZone).not.toContainText("Classified Contract");
    await expect(privateZone.locator('[data-card-id="reboot-optics"]:visible')).toHaveAttribute(
      "aria-label",
      /Reboot Optics/,
    );
    await expect(publicZone.locator('[data-card-id="ruthless-lowlife"]')).toHaveAttribute(
      "aria-label",
      /Ruthless Lowlife/,
    );

    await page.getByTestId("switch-perspective").click();

    await expect(page.getByTestId("viewer-opponent")).toHaveAttribute("aria-pressed", "true");
    await expect(
      secretZone.locator('[data-entity-id="classified-contract:hidden"]'),
    ).toHaveAttribute("aria-label", /Hidden card/);
    await expect(secretZone).not.toContainText("Classified Contract");
    await expect(
      privateZone.locator('[data-entity-id="reboot-optics:hidden"]:visible'),
    ).toHaveAttribute("aria-label", /Hidden card/);
    await expect(privateZone).not.toContainText("Reboot Optics");
    await expect(publicZone.locator('[data-card-id="ruthless-lowlife"]')).toHaveAttribute(
      "aria-label",
      /Ruthless Lowlife/,
    );

    await page.getByTestId("switch-perspective").click();

    await expect(page.getByTestId("viewer-owner")).toHaveAttribute("aria-pressed", "true");
    await expect(privateZone.locator('[data-card-id="reboot-optics"]:visible')).toHaveAttribute(
      "aria-label",
      /Reboot Optics/,
    );

    await page.getByTestId("viewer-spectator").click();

    await expect(page.getByTestId("viewer-spectator")).toHaveAttribute("aria-pressed", "true");
    await expect(
      secretZone.locator('[data-entity-id="classified-contract:hidden"]'),
    ).toHaveAttribute("aria-label", /Hidden card/);
    await expect(
      privateZone.locator('[data-entity-id="reboot-optics:hidden"]:visible'),
    ).toHaveAttribute("aria-label", /Hidden card/);
    await expect(privateZone).not.toContainText("Reboot Optics");
    await expect(publicZone.locator('[data-card-id="ruthless-lowlife"]')).toHaveAttribute(
      "aria-label",
      /Ruthless Lowlife/,
    );
  });

  test("draw animation reveals the card only for the owner viewer", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    await page.getByTestId("viewer-owner").click();
    await expect(page.locator(visibleHandCards)).toHaveCount(2);
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-card-id="reboot-optics"]:visible'),
    ).toBeVisible();
    await page.getByTestId("run-draw").click();

    const ownerOverlay = page.getByTestId("zone-transfer-overlay");
    await expect(ownerOverlay).toBeVisible();
    await expect(ownerOverlay).toHaveAttribute("data-transfer-kind", "draw");
    await expect(ownerOverlay).toHaveAttribute("data-from-zone-id", "human-deck");
    await expect(ownerOverlay).toHaveAttribute("data-to-zone-id", "human-hand");
    await expect(ownerOverlay).toHaveAttribute("data-source-face", "hidden");
    await expect(ownerOverlay).toHaveAttribute("data-destination-face", "public");
    const ownerDrawDestination = page
      .locator('[data-zone-id="human-hand"] [data-card-id="floor-it"]')
      .first();
    await expect(ownerDrawDestination).toHaveAttribute("aria-label", /Floor It/);
    await expect(ownerDrawDestination).toBeHidden();
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-card-id="reboot-optics"]:visible'),
    ).toBeVisible();
    await expect(page.getByTestId("animation-status")).toContainText(
      "Draw complete: hidden to public",
    );
    await expect(ownerDrawDestination).toBeVisible();
    await expect(page.locator(visibleHandCards)).toHaveCount(3);

    await page.getByTestId("reset-animation-fixture").click();
    await page.getByTestId("viewer-opponent").click();
    await expect(page.locator(visibleHandCards)).toHaveCount(2);
    await page.getByTestId("run-draw").click();

    const opponentOverlay = page.getByTestId("zone-transfer-overlay");
    await expect(opponentOverlay).toBeVisible();
    await expect(opponentOverlay).toHaveAttribute("data-transfer-kind", "draw");
    await expect(opponentOverlay).toHaveAttribute("data-source-face", "hidden");
    await expect(opponentOverlay).toHaveAttribute("data-destination-face", "hidden");
    const opponentDrawDestination = page
      .locator('[data-zone-id="human-hand"] [data-entity-id="floor-it:hidden"]')
      .first();
    await expect(opponentDrawDestination).toHaveAttribute("aria-label", /Hidden card/);
    await expect(opponentDrawDestination).toBeHidden();
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-entity-id="reboot-optics:hidden"]:visible'),
    ).toBeVisible();
    await expect(page.locator('[data-zone-id="human-hand"]')).not.toContainText("Floor It");
    await expect(page.getByTestId("animation-status")).toContainText(
      "Draw complete: hidden to hidden",
    );
    await expect(opponentDrawDestination).toBeVisible();
    await expect(page.locator(visibleHandCards)).toHaveCount(3);
  });

  test("opening hand draw overlaps multiple card transfers", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    await expect(page.locator(visibleHandCards)).toHaveCount(2);
    await page.getByTestId("run-opening-hand-draw").click();

    const overlays = page.getByTestId("zone-transfer-overlay");
    const overlay = overlays.first();
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("data-transfer-kind", "draw");
    await expect(overlay).toHaveAttribute("data-from-zone-id", "human-deck");
    await expect(overlay).toHaveAttribute("data-to-zone-id", "human-hand");
    await expect
      .poll(() => overlays.count(), { intervals: [25, 50, 100], timeout: 1000 })
      .toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId("animation-status")).toContainText("Opening hand drawn", {
      timeout: 7000,
    });
    await expect(page.locator(visibleHandCards)).toHaveCount(7);
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-card-id="corporate-surveillance"]:visible'),
    ).toHaveAttribute("aria-label", /Corporate Surveillance/);
    await expect(page.getByTestId("run-opening-hand-draw")).toBeDisabled();
  });

  test("public zone movement keeps the card face public", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    const battlefield = page.locator('[data-zone-id="human-battlefield"]');
    const discard = page.locator('[data-zone-id="shared-discard"]');
    const initialBattlefieldBox = await battlefield.boundingBox();

    await expect(battlefield.locator("[data-entity-id]")).toHaveCount(3);
    await expect(discard.locator("[data-entity-id]")).toHaveCount(2);
    await expect(battlefield.locator('[data-card-id="ruthless-lowlife"]')).toHaveAttribute(
      "aria-label",
      /Ruthless Lowlife/,
    );
    await page.getByTestId("run-public-move").click();

    const overlay = page.getByTestId("zone-transfer-overlay");
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("data-transfer-kind", "move-zone");
    await expect(overlay).toHaveAttribute("data-from-zone-id", "human-battlefield");
    await expect(overlay).toHaveAttribute("data-to-zone-id", "shared-discard");
    await expect(overlay).toHaveAttribute("data-source-face", "public");
    await expect(overlay).toHaveAttribute("data-destination-face", "public");
    await expect(
      page.locator('[data-zone-id="human-battlefield"] [data-card-id="ruthless-lowlife"]'),
    ).toHaveCount(0);
    await expect(battlefield.locator("[data-entity-id]")).toHaveCount(2);
    await expect(discard.locator("[data-entity-id]")).toHaveCount(3);

    const publicMoveDestination = page.locator(
      '[data-zone-id="shared-discard"] [data-card-id="ruthless-lowlife"]',
    );
    await expect(publicMoveDestination).toHaveAttribute("aria-label", /Ruthless Lowlife/);
    await expect(publicMoveDestination).toBeHidden();
    await expect(discard.locator('[data-card-id="delamain-cab"]')).toBeVisible();
    await expect(battlefield.locator('[data-card-id="armored-minotaur"]')).toBeVisible();

    const neighborRectsDuringTransfer = await readRects(page, publicMoveNeighborSelectors);
    await page.waitForTimeout(180);
    await expect(overlay).toBeVisible();
    const neighborRectsMidTransfer = await readRects(page, publicMoveNeighborSelectors);
    expectRectMapsToMatch(neighborRectsMidTransfer, neighborRectsDuringTransfer);

    const landing = await page.evaluate(() => {
      const activeOverlay = document.querySelector<HTMLElement>(
        "[data-testid='zone-transfer-overlay']",
      );
      const destination = document.querySelector<HTMLElement>(
        '[data-zone-id="shared-discard"] [data-card-id="ruthless-lowlife"]',
      );
      const destinationRect = destination?.getBoundingClientRect();

      return {
        destination: destinationRect
          ? {
              height: destinationRect.height,
              left: destinationRect.left,
              top: destinationRect.top,
              width: destinationRect.width,
            }
          : null,
        overlay: activeOverlay
          ? {
              height: Number.parseFloat(activeOverlay.style.height),
              left: Number.parseFloat(activeOverlay.style.left),
              top: Number.parseFloat(activeOverlay.style.top),
              width: Number.parseFloat(activeOverlay.style.width),
            }
          : null,
      };
    });
    expectRectToMatch(landing.overlay, landing.destination);

    await expect(page.getByTestId("animation-status")).toContainText(
      "Move complete: public to public",
    );
    await expect(publicMoveDestination).toBeVisible();
    await expect(battlefield.locator("[data-entity-id]")).toHaveCount(2);
    await expect(discard.locator("[data-entity-id]")).toHaveCount(3);

    const neighborRectsAfterTransfer = await readRects(page, publicMoveNeighborSelectors);
    expectRectMapsToMatch(neighborRectsDuringTransfer, neighborRectsAfterTransfer);

    const emptyBattlefieldBox = await battlefield.boundingBox();
    expect(initialBattlefieldBox?.height).toBeDefined();
    expect(emptyBattlefieldBox?.height).toBeDefined();
    expect(
      Math.abs((emptyBattlefieldBox?.height ?? 0) - (initialBattlefieldBox?.height ?? 0)),
    ).toBeLessThanOrEqual(1);
  });

  test("public to private movement redacts the destination for non-owner viewers", async ({
    page,
  }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    await page.getByTestId("viewer-opponent").click();
    const battlefield = page.locator('[data-zone-id="human-battlefield"]');
    const hand = page.locator('[data-zone-id="human-hand"]');

    await expect(battlefield.locator('[data-card-id="ruthless-lowlife"]')).toHaveAttribute(
      "aria-label",
      /Ruthless Lowlife/,
    );
    await expect(page.locator(visibleHandCards)).toHaveCount(2);

    await page.getByTestId("run-public-to-private").click();

    const overlay = page.getByTestId("zone-transfer-overlay");
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveAttribute("data-transfer-kind", "move-zone");
    await expect(overlay).toHaveAttribute("data-from-zone-id", "human-battlefield");
    await expect(overlay).toHaveAttribute("data-to-zone-id", "human-hand");
    await expect(overlay).toHaveAttribute("data-source-face", "public");
    await expect(overlay).toHaveAttribute("data-destination-face", "hidden");

    const hiddenDestination = hand.locator('[data-entity-id="ruthless-lowlife:hidden"]').first();
    await expect(hiddenDestination).toHaveAttribute("aria-label", /Hidden card/);
    await expect(hiddenDestination).toBeHidden();
    await expect(hand).not.toContainText("Ruthless Lowlife");

    await expect(page.getByTestId("animation-status")).toContainText(
      "Move complete: public to hidden",
    );
    await expect(hiddenDestination).toBeVisible();
    await expect(battlefield.locator('[data-card-id="ruthless-lowlife"]')).toHaveCount(0);
    await expect(page.locator(visibleHandCards)).toHaveCount(3);
  });

  test("shared primitive overlays render exit attach and flip reveal semantics", async ({
    page,
  }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    await observeLayoutShiftAnimation(page);
    await page.getByTestId("run-shared-primitives").click();

    await expect
      .poll(() => readObservedLayoutShiftAnimation(page))
      .toMatchObject({
        entityIds: expect.arrayContaining(["delamain-cab", "secondhand-bombus"]),
      });

    const exitOverlay = page.locator(
      '[data-testid="sim-animation-overlay"][data-animation-primitive="zoneExit"]',
    );
    await expect(exitOverlay).toBeVisible();
    await expect(exitOverlay).toHaveAttribute("data-animation-kind", "zone-exit");
    await expect(exitOverlay).toHaveAttribute("data-entity-id", "ruthless-lowlife");
    await expect(exitOverlay).toHaveAttribute("data-from-zone-id", "human-battlefield");
    await expect(exitOverlay).toHaveAttribute("data-source-face", "public");
    await expect(exitOverlay).toHaveAttribute("data-destination-face", "public");

    const enterOverlay = page.locator(
      '[data-testid="sim-animation-overlay"][data-animation-primitive="zoneEnter"]',
    );
    await expect(enterOverlay).toBeVisible();
    await expect(enterOverlay).toHaveAttribute("data-animation-kind", "zone-enter");
    await expect(enterOverlay).toHaveAttribute("data-entity-id", "dying-night");
    await expect(enterOverlay).toHaveAttribute("data-to-zone-id", "shared-discard");
    await expect(enterOverlay).toHaveAttribute("data-source-face", "public");
    await expect(enterOverlay).toHaveAttribute("data-destination-face", "public");

    const attachOverlay = page.locator(
      '[data-testid="sim-animation-overlay"][data-animation-primitive="attach"]',
    );
    await expect(attachOverlay).toBeVisible();
    await expect(attachOverlay).toHaveAttribute("data-animation-kind", "attach");
    await expect(attachOverlay).toHaveAttribute("data-entity-id", "kiroshi-optics");
    await expect(attachOverlay).toHaveAttribute("data-from-zone-id", "human-hand");
    await expect(attachOverlay).toHaveAttribute("data-to-zone-id", "human-battlefield");
    await expect(attachOverlay).toHaveAttribute("data-target-entity-id", "armored-minotaur");
    await expect(attachOverlay).toHaveAttribute("data-source-face", "public");
    await expect(attachOverlay).toHaveAttribute("data-destination-face", "public");

    const flipOverlay = page.locator(
      '[data-testid="sim-animation-overlay"][data-animation-primitive="flipReveal"]',
    );
    await expect(flipOverlay).toBeVisible();
    await expect(flipOverlay).toHaveAttribute("data-animation-kind", "flip-reveal");
    await expect(flipOverlay).toHaveAttribute("data-entity-id", "reboot-optics");
    await expect(flipOverlay).toHaveAttribute("data-zone-id", "human-hand");
    await expect(flipOverlay).toHaveAttribute("data-source-face", "hidden");
    await expect(flipOverlay).toHaveAttribute("data-destination-face", "public");
    await expect(flipOverlay).toHaveAttribute("data-current-face", "public");

    await expect(page.getByTestId("animation-status")).toContainText("Shared primitives complete");
  });

  test("empty zones keep dimensions while a card leaves and after it resolves", async ({
    page,
  }) => {
    await page.goto("/cyberpunk/simulator/animation-fixtures");

    const secretZone = page.locator('[data-zone-id="secret-cache"]');
    const secretGrid = secretZone.locator(".card-grid");
    const secretZoneBefore = await secretZone.boundingBox();
    const secretGridBefore = await secretGrid.boundingBox();

    await page.getByTestId("run-shared-primitives").click();

    const transferOverlay = page.locator(
      '[data-testid="zone-transfer-overlay"][data-from-zone-id="secret-cache"][data-to-zone-id="shared-discard"]',
    );
    await expect(transferOverlay).toBeVisible();
    await expect(transferOverlay).toHaveAttribute("data-source-face", "hidden");
    await expect(transferOverlay).toHaveAttribute("data-destination-face", "public");
    await expect(secretZone.locator(".empty-zone")).toBeVisible();

    const secretZoneDuring = await secretZone.boundingBox();
    const secretGridDuring = await secretGrid.boundingBox();
    expectRectToMatch(secretZoneDuring, secretZoneBefore);
    expectRectToMatch(secretGridDuring, secretGridBefore);

    await expect(page.getByTestId("animation-status")).toContainText("Shared primitives complete");
    await expect(secretZone.locator(".empty-zone")).toBeVisible();
    await expect(
      page.locator('[data-zone-id="shared-discard"] [data-card-id="classified-contract"]'),
    ).toBeVisible();

    const secretZoneAfter = await secretZone.boundingBox();
    const secretGridAfter = await secretGrid.boundingBox();
    expectRectToMatch(secretZoneAfter, secretZoneBefore);
    expectRectToMatch(secretGridAfter, secretGridBefore);
  });

  test("reduced motion completes transfer and primitive overlays through fast final states", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cyberpunk/simulator/animation-fixtures");
    await expect
      .poll(() =>
        page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      )
      .toBe(true);

    await page.getByTestId("viewer-owner").click();
    await page.getByTestId("run-draw").click();

    await expect(page.getByTestId("animation-status")).toContainText(
      "Draw complete: hidden to public",
      { timeout: 350 },
    );
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-card-id="floor-it"]:visible'),
    ).toHaveAttribute("aria-label", /Floor It/);
    await expect(page.getByTestId("zone-transfer-overlay")).toHaveCount(0);

    await page.getByTestId("reset-animation-fixture").click();
    await page.getByTestId("run-shared-primitives").click();

    await expect(page.getByTestId("animation-status")).toContainText("Shared primitives complete", {
      timeout: 450,
    });
    await expect(page.getByTestId("sim-animation-overlay")).toHaveCount(0);
    await expect(
      page.locator('[data-zone-id="human-hand"] [data-card-id="reboot-optics"]:visible'),
    ).toHaveAttribute("aria-label", /Reboot Optics/);
  });
});

function expectRectToMatch(actual: ComparableRect | null, expected: ComparableRect | null) {
  expect(actual).not.toBeNull();
  expect(expected).not.toBeNull();
  expect(Math.abs(rectLeft(actual) - rectLeft(expected))).toBeLessThanOrEqual(1);
  expect(Math.abs(rectTop(actual) - rectTop(expected))).toBeLessThanOrEqual(1);
  expect(Math.abs((actual?.width ?? 0) - (expected?.width ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((actual?.height ?? 0) - (expected?.height ?? 0))).toBeLessThanOrEqual(1);
}

type ComparableRect = {
  height: number;
  left?: number;
  top?: number;
  width: number;
  x?: number;
  y?: number;
};

interface ObservedLayoutShiftAnimation {
  animationId: string | null;
  entityIds: string[];
}

async function observeLayoutShiftAnimation(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => {
    type LayoutShiftState = Window &
      typeof globalThis & {
        __observedLayoutShiftAnimation?: ObservedLayoutShiftAnimation | null;
      };
    const state = window as LayoutShiftState;
    state.__observedLayoutShiftAnimation = null;

    const capture = (): boolean => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-sim-layout-shift-animation]"),
      );
      if (nodes.length === 0) return false;
      state.__observedLayoutShiftAnimation = {
        animationId: nodes[0]?.getAttribute("data-sim-layout-shift-animation") ?? null,
        entityIds: nodes.flatMap((node) => [
          node.getAttribute("data-sim-entity-id") ??
            node.getAttribute("data-entity-id") ??
            node.getAttribute("data-card-layout-id") ??
            "",
        ]),
      };
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributeFilter: ["data-sim-layout-shift-animation"],
      attributes: true,
      subtree: true,
    });
    capture();
  });
}

async function readObservedLayoutShiftAnimation(
  page: import("@playwright/test").Page,
): Promise<ObservedLayoutShiftAnimation | null> {
  return page.evaluate(() => {
    type LayoutShiftState = Window &
      typeof globalThis & {
        __observedLayoutShiftAnimation?: ObservedLayoutShiftAnimation | null;
      };
    return (window as LayoutShiftState).__observedLayoutShiftAnimation ?? null;
  });
}

function rectLeft(rect: ComparableRect | null): number {
  return rect?.left ?? rect?.x ?? 0;
}

function rectTop(rect: ComparableRect | null): number {
  return rect?.top ?? rect?.y ?? 0;
}

async function readRects(
  page: import("@playwright/test").Page,
  selectors: string[],
): Promise<Record<string, { left: number; top: number; width: number; height: number } | null>> {
  return page.evaluate((targetSelectors) => {
    return Object.fromEntries(
      targetSelectors.map((selector) => {
        const element = document.querySelector<HTMLElement>(selector);
        const rect = element?.getBoundingClientRect();
        return [
          selector,
          rect
            ? {
                height: rect.height,
                left: rect.left,
                top: rect.top,
                width: rect.width,
              }
            : null,
        ];
      }),
    );
  }, selectors);
}

function expectRectMapsToMatch(
  actual: Record<string, { left: number; top: number; width: number; height: number } | null>,
  expected: Record<string, { left: number; top: number; width: number; height: number } | null>,
) {
  for (const selector of Object.keys(expected)) {
    expectRectToMatch(actual[selector], expected[selector]);
  }
}
