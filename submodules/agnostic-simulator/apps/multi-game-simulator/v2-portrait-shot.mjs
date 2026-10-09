import { chromium } from "/Users/wazar/projects/the-card-goat-online/submodules/agnostic-simulator/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 412, height: 915 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:5196/cyberpunk/simulator/tests/progBootlegBlackSapphireShowRetail?ui=v2", { waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="cyberpunk-board-v2"]', { timeout: 20000 });
await page.waitForTimeout(6000);
const state = await page.evaluate(() => {
  const root = document.querySelector('[data-testid="cyberpunk-board-v2"]');
  const surface = document.querySelector("[data-forced-landscape]");
  return {
    compact: root?.getAttribute("data-compact"),
    forced: surface?.getAttribute("data-forced-landscape"),
    surfaceBox: (() => { const r = surface?.getBoundingClientRect(); return r && [r.width|0, r.height|0]; })(),
  };
});
await page.screenshot({ path: "/tmp/v2-compact-portrait-mobile.png" });
console.log(JSON.stringify(state));
await browser.close();
