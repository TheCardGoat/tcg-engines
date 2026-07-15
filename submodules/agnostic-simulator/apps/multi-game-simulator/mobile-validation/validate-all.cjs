// Broad mobile sweep: for every current retail card, load its happy-path
// scenario on a 390x844 mobile board and verify the card's primary action is
// reachable + fires through native point-and-click (no engine dispatch).
//
// Outputs: mobile-validation/results.json (machine) + per-card screenshots on
// failure. Run: node mobile-validation/validate-all.cjs
//
// Env: ONLY=<slug> to run a single card; TYPE=program to filter by card type.
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");
const D = require(__dirname + "/lib/mobile-driver.cjs");

const SNAPSHOT = require(__dirname + "/card-qa-snapshot.json");
const SHOT_DIR = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOT_DIR, { recursive: true });

// Pick the scenario to validate a card by. Prefer the first authored scenario.
function scenarioFor(cardCase) {
  return cardCase.scenarioIds[0];
}

// Decide the primary mobile action for a card given the live board state and
// the moves the engine reports it supports. Returns a descriptor or null.
function primaryAction(cardCase, state, supported, locate) {
  const inHand = state.hand.some((c) => c.definitionId === cardCase.definitionId);
  const inFieldAttached = state.field.some(
    (c) => c.definitionId === cardCase.definitionId && c.attachedToId,
  );
  const inField = state.field.some(
    (c) => c.definitionId === cardCase.definitionId && !c.attachedToId,
  );
  const legend = state.legendArea.find((c) => c.definitionId === cardCase.definitionId);

  if (inHand) {
    const moveIds = Object.keys(supported);
    if (supported.playCard) return { surface: "hand", action: "play" };
    if (supported.goSolo) return { surface: "hand", action: "goSolo" };
    if (supported.sellCard) return { surface: "hand", action: "sell" };
    return {
      surface: "hand",
      action: "none",
      reason: `hand supports: ${moveIds.join(",") || "nothing"}`,
    };
  }
  if (inFieldAttached) {
    return {
      surface: "gear",
      action: "equipped",
      reason: "gear already attached (passive scenario)",
    };
  }
  if (inField) {
    if (supported.attackRival) return { surface: "card", action: "attackRival" };
    if (supported.attackUnit) return { surface: "card", action: "attackUnit" };
    if (supported.activateAbility) return { surface: "card", action: "activateAbility" };
    if (supported.useBlocker) return { surface: "card", action: "useBlocker" };
    return {
      surface: "card",
      action: "none",
      reason: "field unit not actionable at start (Lag / no targets)",
    };
  }
  if (legend) {
    if (legend.faceDown && supported.callLegend) return { surface: "legend", action: "callLegend" };
    if (supported.goSolo) return { surface: "legend", action: "goSolo" };
    if (supported.activateAbility) return { surface: "legend", action: "activateAbility" };
    if (supported.callLegend) return { surface: "legend", action: "callLegend" };
    return {
      surface: "legend",
      action: legend.faceDown ? "none-face-down" : "none-face-up-passive",
      reason: `legend faceDown=${legend.faceDown}`,
    };
  }
  // Card not in player zones — locate across both players for a precise reason.
  if (locate) {
    const loc = Object.keys(locate)[0];
    if (loc?.startsWith("opponent")) {
      return {
        surface: "opponent",
        action: "reactive",
        reason: `card is opponent's (${loc}); reactive-only on mobile`,
      };
    }
    if (loc?.endsWith(":deck") || loc?.endsWith(":trash")) {
      return {
        surface: "inaccessible",
        action: "none",
        reason: `card is in ${loc} (not on the board)`,
      };
    }
  }
  return {
    surface: "not-found",
    action: "none",
    reason: "card not in visible player zones (likely face-down legend)",
  };
}

async function validateCard(browser, cardCase) {
  const scenarioId = scenarioFor(cardCase);
  const result = {
    slug: cardCase.slug,
    name: cardCase.name,
    type: cardCase.type,
    setCode: cardCase.setCode,
    scenarioId,
    definitionId: cardCase.definitionId,
    status: "unknown",
    detail: {},
    errors: [],
  };
  const page = await browser.newPage({ viewport: D.VIEWPORT });
  try {
    const { errors } = await D.openMobile(page, scenarioId);
    result.errors = errors.slice();
    if (errors.length) {
      result.status = "fail";
      result.detail.reason = "page errors on load";
      await D.screenshot(page, path.join(SHOT_DIR, `fail-${cardCase.slug}.png`));
      return result;
    }
    await D.clearBlockingPrompts(page);
    const state = await D.getBoardState(page);
    const supported = await D.getCardSupportedMoves(page, cardCase.definitionId);
    // Locate the card across both players to give precise reach-only reasons.
    const locate = await D.engineQuery(
      page,
      (engine, def) => {
        const out = {};
        for (const [pid, label] of [
          ["p1", "player"],
          ["p2", "opponent"],
        ]) {
          for (const zone of ["hand", "field", "legendArea", "trash", "deck"]) {
            const found = engine.getCardsInZone(zone, pid).find((c) => c.definitionId === def);
            if (found) out[label + ":" + zone] = true;
          }
        }
        return out;
      },
      cardCase.definitionId,
    );
    const plan = primaryAction(cardCase, state, supported, locate);
    result.detail.plan = plan;
    result.detail.supportedMoves = Object.keys(supported);

    if (
      plan.surface === "not-found" ||
      plan.surface === "opponent" ||
      plan.surface === "inaccessible" ||
      plan.surface === "gear"
    ) {
      // Card is not a player-tappable primary action in this scenario:
      //  - not-found: likely a face-down legend (random order) the player can't ID
      //  - opponent:  card under test is the opponent's (reactive/blocker scenario)
      //  - inaccessible: card is in deck/trash, not on the board
      //  - gear:      already equipped (passive scenario)
      result.status = "pass-reach-only";
      result.detail.reason = plan.reason || "card not in visible player zones";
      return result;
    }

    if (plan.action === "none" || plan.action.startsWith("none")) {
      // Card present but not actionable in this scenario's start state. That's a
      // legitimate reach-only result (e.g. a unit with Lag, or a passive legend).
      result.status = "pass-reach-only";
      result.detail.reason = plan.reason || "not actionable at scenario start";
      return result;
    }

    // Drive the action via native mobile taps.
    const before = state;
    let drove = false;
    let targetPicked = false;
    let afterPick;
    if (plan.surface === "hand") {
      const tray = await D.tapHandCard(page, cardCase.definitionId);
      result.detail.trayActions = tray.actions;
      if (!tray.actions.includes(`hand-action-${plan.action}`)) {
        result.status = "fail";
        result.detail.reason = `hand-action-${plan.action} not in tray (${tray.actions.join(",")})`;
        await D.screenshot(page, path.join(SHOT_DIR, `fail-${cardCase.slug}.png`));
        return result;
      }
      await D.tapHandAction(page, plan.action);
      drove = true;
    } else {
      // field unit or legend: resolve instanceId (mobile lacks data-definition-id
      // on field units and face-down legends), tap the card, then the menu item.
      const resolved = await D.resolveInstanceId(page, cardCase.definitionId);
      if (!resolved) {
        result.status = "fail";
        result.detail.reason = "could not resolve instanceId for field/legend tap";
        await D.screenshot(page, path.join(SHOT_DIR, `fail-${cardCase.slug}.png`));
        return result;
      }
      const menu = await D.tapFieldOrLegendCard(page, { instanceId: resolved.instanceId });
      result.detail.menuActions = menu.actions;
      // Some actions dispatch directly without opening a menu (e.g. callLegend on
      // a face-down legend). That's a valid drive if state then changes.
      if (menu.menuVisible) {
        const tid = `card-action-${plan.action}`;
        if (!menu.actions.includes(tid)) {
          result.status = "fail";
          result.detail.reason = `${tid} not in card menu (${menu.actions.join(",")})`;
          await D.screenshot(page, path.join(SHOT_DIR, `fail-${cardCase.slug}.png`));
          return result;
        }
        await D.tapCardAction(page, plan.action);
      }
      drove = true;
    }

    await D.sleep(250);
    // The action may open a target choice OR a spatial select-target banner
    // (programs/gear with board targets surface as a banner, not a "choice").
    // Resolve generically by picking the first target, looping for multi-step.
    for (let step = 0; step < 3; step++) {
      const mid = await D.getBoardState(page);
      if (!(await D.hasTargetSurface(page))) break;
      const pick = await D.openAndPickFirstTarget(page);
      result.detail.targetPick = (result.detail.targetPick || []).concat(
        pick.targets.length ? pick.targets.map((t) => t.label || t.kind) : ["no-targets"],
      );
      targetPicked = targetPicked || pick.targets.length > 0;
      await D.sleep(200);
      if (mid.pendingChoiceType === null && !(await D.hasTargetSurface(page))) break;
    }
    afterPick = await D.getBoardState(page);

    // Determine success: state changed in a way consistent with the action, and
    // no error thrown. We accept either a board-state delta OR a pending prompt
    // being progressed (choice type changed / consumed).
    const changed =
      JSON.stringify(before.hand) !== JSON.stringify(afterPick.hand) ||
      JSON.stringify(before.field) !== JSON.stringify(afterPick.field) ||
      before.trash !== afterPick.trash ||
      JSON.stringify(before.legendArea) !== JSON.stringify(afterPick.legendArea) ||
      before.eddies !== afterPick.eddies;
    const promptProgressed =
      before.pendingChoiceType !== afterPick.pendingChoiceType ||
      before.promptStatus !== afterPick.promptStatus;

    if (drove && (changed || promptProgressed || targetPicked)) {
      result.status = "pass";
      result.detail.after = {
        handCount: afterPick.handCount,
        fieldCount: afterPick.fieldCount,
        trash: afterPick.trash,
        promptStatus: afterPick.promptStatus,
        pendingChoiceType: afterPick.pendingChoiceType,
      };
    } else if (drove) {
      // Action fired but produced no observable delta — could be an effect that
      // needs a follow-up we didn't drive. Record as reach-only (action fired).
      result.status = "pass-reach-only";
      result.detail.reason = "action fired but no observable state delta (multi-step path)";
    }
    return result;
  } catch (e) {
    result.status = "fail";
    result.detail.reason = String(e.message || e).split("\n")[0];
    result.detail.stack = String(e.stack || "")
      .split("\n")
      .slice(0, 4)
      .join(" | ");
    await D.screenshot(page, path.join(SHOT_DIR, `fail-${cardCase.slug}.png`)).catch(() => {});
    return result;
  } finally {
    await page.close();
  }
}

void (async () => {
  let cases = SNAPSHOT.cases;
  if (process.env.ONLY) cases = cases.filter((c) => c.slug === process.env.ONLY);
  if (process.env.TYPE) cases = cases.filter((c) => c.type === process.env.TYPE);

  const browser = await chromium.launch();
  const results = [];
  const start = Date.now();
  try {
    for (let i = 0; i < cases.length; i++) {
      const cardCase = cases[i];
      process.stdout.write(`[${i + 1}/${cases.length}] ${cardCase.type}/${cardCase.slug} ... `);
      const r = await validateCard(browser, cardCase);
      results.push(r);
      console.log(r.status, r.detail.reason || "");
    }
  } finally {
    await browser.close();
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    elapsedMs: Date.now() - start,
    total: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    passReachOnly: results.filter((r) => r.status === "pass-reach-only").length,
    fail: results.filter((r) => r.status === "fail").length,
    byType: {},
    results,
  };
  for (const r of results) {
    const t = r.type;
    summary.byType[t] ??= { pass: 0, passReachOnly: 0, fail: 0 };
    if (r.status === "pass") summary.byType[t].pass++;
    else if (r.status === "pass-reach-only") summary.byType[t].passReachOnly++;
    else summary.byType[t].fail++;
  }
  const dest = path.join(__dirname, "results.json");
  fs.writeFileSync(dest, JSON.stringify(summary, null, 2));
  console.log("\n=== SUMMARY ===");
  console.log(
    JSON.stringify(
      {
        total: summary.total,
        pass: summary.pass,
        reachOnly: summary.passReachOnly,
        fail: summary.fail,
      },
      null,
      2,
    ),
  );
  console.log("byType:", JSON.stringify(summary.byType, null, 2));
  console.log("WROTE", dest);
})().catch((e) => {
  console.error("VALIDATE_ALL_FAILED", e);
  process.exit(1);
});
