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
  await page.waitForFunction(() =>
    Boolean((window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine),
  );

  const state = await page.evaluate(() => {
    const e = (window as unknown as { __cyberpunkEngine?: { getState: () => unknown } })
      .__cyberpunkEngine;
    return e!.getState();
  });
  console.log("Full state keys:", Object.keys(state as object));
  const s = state as Record<string, unknown>;
  const G = s.G as Record<string, unknown>;
  console.log("gamePhase:", G.gamePhase);
  console.log("turnMetadata:", JSON.stringify(G.turnMetadata, null, 2));
  console.log("gameEnded:", G.gameEnded);
  console.log("winnerId:", G.winnerId);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
