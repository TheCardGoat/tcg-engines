import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://localhost:5174/cyberpunk/simulator/practice");
  await page.getByTestId("practice-setup-your-deck").selectOption("arasaka-print-n-play");
  await page.getByTestId("practice-setup-bot-deck").selectOption("merc-print-n-play");
  await page.getByTestId("practice-setup-bot-strategy").selectOption("greedy");
  await page.getByTestId("practice-setup-start").click();
  await page.waitForURL(/\/practice\/practice_/);
  await page.waitForSelector('[data-testid="board-wrap"]', { timeout: 15000 });
  const seed = await page.getByTestId("practice-match-seed").getAttribute("data-seed");
  const matchId = await page.getByTestId("practice-match-id").getAttribute("data-match-id");
  console.log("matchId:", matchId);
  console.log("seed:", seed);
  console.log(
    "player hand:",
    await page.locator('[data-testid="hand-zone"][data-side="player"]').getAttribute("data-count"),
  );
  console.log(
    "opponent hand:",
    await page
      .locator('[data-testid="hand-zone"][data-side="opponent"]')
      .getAttribute("data-count"),
  );
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
