import { expect, test } from "@playwright/test";

const matchPath = "/gundam/simulator/matches/fixture-match/games/fixture-game";

test("carries the covered frame through a native document swap and reveals only when ready", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    addEventListener("pagereveal", (event) => {
      if ("viewTransition" in event && event.viewTransition)
        sessionStorage.setItem("native-intro-seen", "yes");
    });
  });
  await page.goto("/lobby?slow");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-tcg-match-intro", "versus");
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.waitForTimeout(800);
  await page.screenshot({ path: testInfo.outputPath("versus-desktop.png") });
  await page.waitForURL(`**${matchPath}?slow`);
  await expect(page.locator("html")).toHaveAttribute("data-tcg-match-intro", "holding");
  await expect(page.locator("#board")).toBeHidden();
  expect(await page.evaluate(() => sessionStorage.getItem("tcg.match-intro.v1"))).toBeNull();
  expect(await page.evaluate(() => sessionStorage.getItem("native-intro-seen"))).toBe("yes");
  await page.screenshot({ path: testInfo.outputPath("handoff.png") });
  await expect(page.locator("#tcg-match-intro")).toBeHidden({ timeout: 6500 });
  await expect(page.getByRole("button", { name: "Keep hand" })).toBeEnabled();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await page.screenshot({ path: testInfo.outputPath("revealed.png") });
  expect(errors).toEqual([]);
});

test("skip and Escape never block the destination's loading controls", async ({ page }) => {
  await page.goto("/lobby?stalled");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?stalled`);
  await page.getByRole("button", { name: "Go to match" }).click();
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await expect(page.locator("#loading")).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("the incoming cover is visible before the simulator bundle hydrates", async ({ page }) => {
  await page.goto("/lobby");
  await page.route("**/client.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    await route.continue();
  });
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}`, { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveAttribute("data-tcg-match-intro", "holding");
  await expect(page.locator("#tcg-match-intro")).toBeVisible();
  await expect(page.locator("#tcg-match-intro")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".match-intro-skip")).toBeHidden();
  await expect(page.locator("#tcg-match-intro")).toBeHidden({ timeout: 5000 });
});

test("reduced motion skips the versus delay and spatial reveal", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/lobby");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.waitForURL(`**${matchPath}`, { timeout: 2000 });
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await expect(page.locator("#board")).toBeVisible();
});

test("refresh and back navigation do not replay the cinematic or leave the app inert", async ({
  page,
}) => {
  await page.goto("/lobby?slow");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?slow`);
  await page.reload();
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await page.goBack();
  await expect(page.getByRole("button", { name: "Simulate match found" })).toBeEnabled();
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("missing View Transition support retains the CSS handoff", async ({ page }) => {
  await page.addInitScript(() => {
    addEventListener("pagereveal", (event) => {
      if ("viewTransition" in event && event.viewTransition)
        sessionStorage.setItem("unexpected-native", "yes");
    });
  });
  await page.goto("/lobby?no-native");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?no-native`);
  await expect(page.locator("html")).toHaveAttribute("data-tcg-match-intro", "holding");
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await expect(page.locator("#board")).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem("unexpected-native"))).toBeNull();
});

test("the intro gates game keyboard shortcuts and releases them afterwards", async ({ page }) => {
  await page.addInitScript(() => {
    addEventListener("keydown", () => document.body.setAttribute("data-shortcut-fired", "true"));
  });
  await page.goto("/lobby?stalled");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("x");
  await expect(page.locator("body")).not.toHaveAttribute("data-shortcut-fired", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Go to match" })).toBeFocused();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?stalled`);
  await page.keyboard.press("Enter");
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await page.keyboard.press("x");
  await expect(page.locator("body")).toHaveAttribute("data-shortcut-fired", "true");
});

test("blocked storage degrades to normal navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        value: () => {
          throw new DOMException("Blocked", "SecurityError");
        },
      });
    }
  });
  await page.goto("/lobby");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}`);
  await expect(page.locator("#tcg-match-intro")).toBeHidden();
  await expect(page.locator("#board")).toBeVisible();
  expect(errors).toEqual([]);
});

test("a stalled match releases the overlay so recovery remains available", async ({ page }) => {
  await page.goto("/lobby?stalled");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?stalled`);
  await expect(page.locator("#tcg-match-intro")).toBeHidden({ timeout: 11_000 });
  await expect(page.locator("#loading")).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("late hydration shares the first-paint deadline and never leaves invisible input blocking", async ({
  page,
}) => {
  await page.goto("/lobby?stalled");
  await page.route("**/client.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 7800));
    await route.continue();
  });
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.keyboard.press("Escape");
  await page.waitForURL(`**${matchPath}?stalled`, { waitUntil: "commit" });
  await expect(page.locator("#tcg-match-intro")).toBeVisible();
  await expect(page.locator("#tcg-match-intro")).toBeHidden({ timeout: 11_000 });
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("mobile player names and skip fit within the viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lobby?long");
  await page.getByRole("button", { name: "Simulate match found" }).click();
  await page.waitForTimeout(800);
  const panels = await page.locator(".match-intro-player").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }),
  );
  for (const panel of panels) {
    expect(panel.left).toBeGreaterThanOrEqual(0);
    expect(panel.right).toBeLessThanOrEqual(390);
    expect(panel.top).toBeGreaterThan(50);
    expect(panel.bottom).toBeLessThan(800);
  }
  await expect(page.getByRole("button", { name: "Go to match" })).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath("versus-mobile.png") });
});
