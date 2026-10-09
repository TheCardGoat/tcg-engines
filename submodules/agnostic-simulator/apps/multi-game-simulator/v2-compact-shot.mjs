import { chromium } from "/Users/wazar/projects/the-card-goat-online/submodules/agnostic-simulator/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs";

const url = "http://127.0.0.1:5196/cyberpunk/simulator/tests/progBootlegBlackSapphireShowRetail?ui=v2";
const browser = await chromium.launch();
const shots = [
  { name: "landscape-915x412", width: 915, height: 412 },
  { name: "landscape-menu-open", width: 915, height: 412, openMenu: true },
  { name: "portrait-412x915", width: 412, height: 915, touch: true },
  { name: "landscape-crowded", width: 915, height: 412, fixture: "unitOctantRetail" },
];

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    hasTouch: shot.touch ?? false,
    isMobile: false,
  });
  const page = await context.newPage();
  const fixture = shot.fixture ?? "progBootlegBlackSapphireShowRetail";
  await page.goto(`http://127.0.0.1:5196/cyberpunk/simulator/tests/${fixture}?ui=v2`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="cyberpunk-board-v2"]', { timeout: 20000 });
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-testid="cyberpunk-board-v2"]');
    return root?.getAttribute("data-compact") !== undefined &&
      document.querySelector("canvas") && document.querySelector("canvas").width > 400;
  }, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const state = await page.evaluate(() => {
    const root = document.querySelector('[data-testid="cyberpunk-board-v2"]');
    const canvas = document.querySelector("canvas");
    return {
      compact: root?.getAttribute("data-compact"),
      canvasW: canvas?.width,
      toolbarVisible: !!root?.querySelector('[class*="unifiedHeader"], [class*="toolbar"]')?.offsetParent,
    };
  });
  if (shot.openMenu) {
    await page.getByRole("button", { name: /menu/i }).first().click().catch(() => {});
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: `/tmp/v2-compact-${shot.name}.png` });
  console.log(shot.name, JSON.stringify(state));
  await context.close();
}
await browser.close();
