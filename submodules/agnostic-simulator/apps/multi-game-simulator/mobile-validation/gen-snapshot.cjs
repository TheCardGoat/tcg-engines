// Generate a static snapshot of the current-card QA cases (88 cards -> scenarios)
// by evaluating the running app's module graph in-page (DEV dev server).
// Writes mobile-validation/card-qa-snapshot.json. No test runner involved.
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");
const D = require(__dirname + "/lib/mobile-driver.cjs");

void (async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: D.VIEWPORT });
  try {
    await page.goto(D.mobileUrl("openingMain"), { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__cyberpunkSimulator), null, {
      timeout: 15000,
    });

    const snapshot = await page.evaluate(async () => {
      const mod = await import("/src/games/cyberpunk/engine/fixtures/scenarios/current-card-qa.ts");
      const cases = mod.currentCardQaCases;
      return cases.map((entry) => ({
        setCode: entry.card.set.code,
        slug: entry.card.slug,
        name: entry.card.name,
        type: entry.card.type,
        definitionId: entry.card.id,
        scenarioIds: [...entry.scenarioIds],
        note: entry.note,
      }));
    });

    const byType = {};
    for (const c of snapshot) (byType[c.type] ??= []).push(c.slug);
    const out = {
      generatedAt: new Date().toISOString(),
      cardCount: snapshot.length,
      byType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.length])),
      cases: snapshot,
    };
    const dest = path.join(__dirname, "card-qa-snapshot.json");
    fs.writeFileSync(dest, JSON.stringify(out, null, 2));
    console.log("WROTE", dest, "cards:", snapshot.length, "byType:", JSON.stringify(out.byType));
    const scenarios = new Set();
    for (const c of snapshot) for (const s of c.scenarioIds) scenarios.add(s);
    console.log("distinct scenarios:", scenarios.size);
  } catch (e) {
    console.error("SNAPSHOT_FAILED", e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
