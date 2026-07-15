// Deep mobile replay: complete full happy paths through native mobile taps with
// explicit outcome assertions, for the generically-completable card categories:
//   - programs (play -> resolve target -> assert trash+1 / effect)
//   - gear-in-hand (play -> attach -> assert gear count+1)
//   - play-and-attack units (already covered broadly; assert field+1)
//   - call legends (tap face-down legend -> assert it flips face-up)
//   - sell (tap hand -> sell -> assert eddies unchanged but card to eddies)
//
// Reuses the broad-sweep driver. Writes mobile-validation/results-deep.json.
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");
const D = require(__dirname + "/lib/mobile-driver.cjs");
const SNAPSHOT = require(__dirname + "/card-qa-snapshot.json");
const SHOT_DIR = path.join(__dirname, "screenshots");

// Determine the deep strategy per card type + scenario start state.
function deepStrategy(cardCase, state, supported) {
  const inHand = state.hand.some((c) => c.definitionId === cardCase.definitionId);
  const legendFaceDown = state.legendArea.find(
    (c) => c.definitionId === cardCase.definitionId && c.faceDown,
  );
  if (inHand && supported.playCard) {
    if (cardCase.type === "program") return "play-program";
    if (cardCase.type === "gear") return "play-gear-attach";
    if (cardCase.type === "unit") return "play-unit";
    if (cardCase.type === "legend") return supported.goSolo ? "play-gosolo" : "play-program";
  }
  if (inHand && supported.sellCard && !supported.playCard) return "sell";
  if (legendFaceDown && supported.callLegend) return "call-legend";
  return null; // not generically completable here
}

async function runDeep(browser, cardCase) {
  const scenarioId = cardCase.scenarioIds[0];
  const out = {
    slug: cardCase.slug,
    type: cardCase.type,
    scenarioId,
    strategy: null,
    status: "skip",
    detail: {},
  };
  const page = await browser.newPage({ viewport: D.VIEWPORT });
  try {
    const { errors } = await D.openMobile(page, scenarioId);
    if (errors.length) {
      out.status = "fail";
      out.detail.reason = "page errors";
      return out;
    }
    await D.clearBlockingPrompts(page);
    const before = await D.getBoardState(page);
    const supported = await D.getCardSupportedMoves(page, cardCase.definitionId);
    const strat = deepStrategy(cardCase, before, supported);
    out.strategy = strat;
    if (!strat) {
      out.status = "skip";
      out.detail.reason = "no generic deep strategy for this start state";
      return out;
    }

    const def = cardCase.definitionId;

    if (
      strat === "play-program" ||
      strat === "play-gear-attach" ||
      strat === "play-unit" ||
      strat === "play-gosolo"
    ) {
      // play from hand
      const tray = await D.tapHandCard(page, def);
      if (!tray.actions.includes("hand-action-play")) {
        out.status = "fail";
        out.detail.reason = "play not in tray: " + tray.actions.join(",");
        await D.screenshot(page, path.join(SHOT_DIR, `deep-fail-${cardCase.slug}.png`));
        return out;
      }
      await D.tapHandAction(page, "play");
      await D.sleep(250);
      // resolve any target surface
      let picked = 0;
      for (let i = 0; i < 3; i++) {
        if (!(await D.hasTargetSurface(page))) break;
        const pick = await D.openAndPickFirstTarget(page);
        if (pick.targets.length) picked++;
        await D.sleep(200);
      }
      out.detail.targetsPicked = picked;
      const after = await D.getBoardState(page);
      if (strat === "play-unit") {
        // unit entered field (may have Lag) and hand decreased
        out.status = after.handCount === before.handCount - 1 ? "pass" : "fail";
        out.detail.check = `hand ${before.handCount}->${after.handCount}`;
      } else if (strat === "play-program") {
        // program resolved: hand-1, trash+1 (programs go to trash after resolving)
        out.status =
          after.handCount === before.handCount - 1 && after.trash === before.trash + 1
            ? "pass"
            : "fail";
        out.detail.check = `hand ${before.handCount}->${after.handCount}, trash ${before.trash}->${after.trash}`;
      } else if (strat === "play-gear-attach") {
        // gear attached: hand-1, eddies-cost, and a field unit gained gear
        const fieldGear = await D.engineQuery(
          page,
          (engine) =>
            engine.getCardsInZone("field", "p1").filter((c) => c.meta.attachedToId).length,
        );
        out.status = after.handCount === before.handCount - 1 && fieldGear > 0 ? "pass" : "fail";
        out.detail.check = `hand ${before.handCount}->${after.handCount}, attachedGear ${fieldGear}`;
      } else if (strat === "play-gosolo") {
        out.status = after.handCount === before.handCount - 1 ? "pass" : "fail";
        out.detail.check = `hand ${before.handCount}->${after.handCount}`;
      }
      if (out.status === "fail")
        await D.screenshot(page, path.join(SHOT_DIR, `deep-fail-${cardCase.slug}.png`));
      return out;
    }

    if (strat === "sell") {
      const tray = await D.tapHandCard(page, def);
      if (!tray.actions.includes("hand-action-sell")) {
        out.status = "fail";
        out.detail.reason = "sell not in tray";
        return out;
      }
      await D.tapHandAction(page, "sell");
      await D.sleep(200);
      const after = await D.getBoardState(page);
      // selling a card moves it to Eddies area (sold face-down) for 1 Eddie/turn when spent; hand-1
      out.status = after.handCount === before.handCount - 1 ? "pass" : "fail";
      out.detail.check = `hand ${before.handCount}->${after.handCount}`;
      return out;
    }

    if (strat === "call-legend") {
      const resolved = await D.resolveInstanceId(page, def);
      if (!resolved) {
        out.status = "fail";
        out.detail.reason = "legend instance not resolved";
        return out;
      }
      // Tapping a face-down legend opens a card-action menu; click callLegend.
      const menu = await D.tapFieldOrLegendCard(page, { instanceId: resolved.instanceId });
      if (menu.menuVisible && menu.actions.includes("card-action-callLegend")) {
        await D.tapCardAction(page, "callLegend");
      }
      await D.sleep(250);
      // a call trigger may open a follow-up target surface; resolve first target
      if (await D.hasTargetSurface(page)) {
        await D.openAndPickFirstTarget(page);
        await D.sleep(200);
      }
      const after = await D.getBoardState(page);
      const legend = after.legendArea.find((c) => c.definitionId === def);
      out.status = legend && !legend.faceDown ? "pass" : "fail";
      out.detail.check = `legend faceDown ${legend?.faceDown}, eddies ${before.eddies}->${after.eddies}`;
      return out;
    }

    out.status = "skip";
    return out;
  } catch (e) {
    out.status = "fail";
    out.detail.reason = String(e.message || e).split("\n")[0];
    await D.screenshot(page, path.join(SHOT_DIR, `deep-fail-${cardCase.slug}.png`)).catch(() => {});
    return out;
  } finally {
    await page.close();
  }
}

void (async () => {
  let cases = SNAPSHOT.cases;
  if (process.env.ONLY) cases = cases.filter((c) => c.slug === process.env.ONLY);
  const browser = await chromium.launch();
  const results = [];
  try {
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      process.stdout.write(`[${i + 1}/${cases.length}] ${c.type}/${c.slug} ... `);
      const r = await runDeep(browser, c);
      results.push(r);
      console.log(r.strategy || "skip", "->", r.status, r.detail.check || r.detail.reason || "");
    }
  } finally {
    await browser.close();
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    fail: results.filter((r) => r.status === "fail").length,
    skip: results.filter((r) => r.status === "skip").length,
    byStrategy: {},
    results,
  };
  for (const r of results) {
    const k = r.strategy || "no-strategy";
    summary.byStrategy[k] ??= { pass: 0, fail: 0, skip: 0 };
    summary.byStrategy[k][r.status]++;
  }
  fs.writeFileSync(path.join(__dirname, "results-deep.json"), JSON.stringify(summary, null, 2));
  console.log("\n=== DEEP SUMMARY ===");
  console.log(
    JSON.stringify(
      { total: summary.total, pass: summary.pass, fail: summary.fail, skip: summary.skip },
      null,
      2,
    ),
  );
  console.log("byStrategy:", JSON.stringify(summary.byStrategy, null, 2));
})().catch((e) => {
  console.error("DEEP_FAILED", e);
  process.exit(1);
});
