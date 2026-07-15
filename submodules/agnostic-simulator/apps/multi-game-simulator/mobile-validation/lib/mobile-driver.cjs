// Native mobile point-and-click driver for the Cyberpunk simulator.
// Drives ONLY the real mobile DOM (no engine dispatch for actions). Uses the
// DEV-only window.__cyberpunkSimulator.engine exclusively to READ state for
// detection and assertions, never to mutate it.
//
// Why .cjs: the app workspace is ESM ("type":"module"); standalone node scripts
// must use CommonJS. Callers (validate-*.cjs, verify-driver.cjs) resolve and
// launch `chromium` from @playwright/test themselves; this module only exports
// page-level helpers and never launches a browser.

const BASE = process.env.SIM_BASE || "http://localhost:5193";
const VIEWPORT = { width: 390, height: 844 };
const DEFAULT_TIMEOUT = 15000;

function mobileUrl(scenarioId) {
  return (
    `${BASE}/cyberpunk/simulator/tests/${scenarioId}` + "?ai=off&auto-advance-attack=off&mobile=1"
  );
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Open a fresh mobile browser context on a scenario and wait for the board. */
async function openMobile(page, scenarioId) {
  await page.setViewportSize(VIEWPORT);
  const errors = [];
  const listener = (e) => errors.push(String(e));
  page.on("pageerror", listener);
  await page.goto(mobileUrl(scenarioId), { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.__cyberpunkSimulator), null, {
    timeout: DEFAULT_TIMEOUT,
  });
  await page.waitForSelector('[data-testid="mobile-cyberpunk-board"]', {
    timeout: DEFAULT_TIMEOUT,
  });
  return {
    errors,
    detach: () => page.off("pageerror", listener),
  };
}

// --- engine READ helpers (detection + assertions only) ----------------------

async function engineQuery(page, fn, arg) {
  return page.evaluate(
    ({ src, arg }) => {
      const sim = window.__cyberpunkSimulator;
      if (!sim || !sim.engine) throw new Error("engine not exposed");
      // Stringify a trusted local helper and run it in the browser context.
      // The Function constructor is intentional here: page.evaluate receives a
      // serialized helper that runs against the live dev-only engine handle.
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-function
      const fn = new Function("engine", "arg", "return (" + src + ")(engine, arg)");
      return fn(sim.engine, arg);
    },
    { src: fn.toString(), arg },
  );
}

async function getBoardState(page) {
  return engineQuery(page, (engine) => {
    const P1 = "p1";
    const prompt = engine.getPrompt(P1);
    return {
      activePlayerId: engine.getActivePlayerId(),
      phase: engine.getPhase(),
      turnNumber: engine.getTurnNumber(),
      promptStatus: prompt.status,
      pendingChoiceType: prompt.choice?.type ?? null,
      availableMoveIds: prompt.availableMoves.map((m) => m.moveId),
      hand: engine.getCardsInZone("hand", P1).map((c) => ({
        instanceId: c.instanceId,
        definitionId: c.definitionId,
      })),
      field: engine.getCardsInZone("field", P1).map((c) => ({
        instanceId: c.instanceId,
        definitionId: c.definitionId,
        spent: !!c.meta.spent,
        hasLag: !!c.meta.hasLag,
        attachedToId: c.meta.attachedToId ?? null,
      })),
      legendArea: engine.getCardsInZone("legendArea", P1).map((c) => ({
        instanceId: c.instanceId,
        definitionId: c.definitionId,
        faceDown: !!c.meta.faceDown,
        spent: !!c.meta.spent,
      })),
      trash: engine.getCardsInZone("trash", P1).length,
      handCount: engine.getCardsInZone("hand", P1).length,
      fieldCount: engine.getCardsInZone("field", P1).filter((c) => !c.meta.attachedToId).length,
      eddies: engine.getEddies(P1),
    };
  });
}

/**
 * For a card in a given zone, return the moveIds it supports as the active
 * player (derived from availableMoves whose candidate includes this card).
 */
async function getCardSupportedMoves(page, definitionId) {
  return engineQuery(
    page,
    (engine, definitionId) => {
      const P1 = "p1";
      const prompt = engine.getPrompt(P1);
      const moves = {};
      for (const move of prompt.availableMoves) {
        const spec = move.inputSpec;
        let candidates = [];
        if (spec.type === "playCard") candidates = spec.candidates.map((c) => c.cardId);
        else if (spec.type === "selectCard") candidates = spec.candidates.map(String);
        else if (spec.type === "selectAbility") {
          candidates = spec.candidates.map((c) => String(c.cardId));
          // keep ability indices too
        } else if (spec.type === "selectPair") candidates = spec.fromCandidates.map(String);
        // resolve cardId -> definitionId
        const G = engine.getState().G;
        const toDef = (id) => {
          const card = G.cardIndex[id];
          return card ? card.definitionId : null;
        };
        const defs = candidates.map(toDef);
        if (defs.includes(definitionId)) {
          if (!moves[move.moveId]) moves[move.moveId] = [];
          if (move.moveId === "activateAbility") {
            for (const c of spec.candidates) {
              if (toDef(c.cardId) === definitionId) moves[move.moveId].push(c.abilityIndex);
            }
          } else {
            moves[move.moveId] = defs;
          }
        }
      }
      return moves;
    },
    definitionId,
  );
}

// --- native DOM tap helpers --------------------------------------------------

/**
 * Dispatch a mobile-style tap (pointerdown + pointerup at the same coords) so
 * the `useHandCardTap` recognizer treats it as a tap, not a drag. Falls back to
 * a real click if pointer events don't open the expected surface.
 */
async function tapElement(page, selector) {
  // Use Playwright mouse with a tiny dwell to mimic a mobile tap (pointerdown
  // then pointerup at the same point) so the useHandCardTap recognizer treats
  // it as a tap rather than a drag.
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (!box) throw new Error(`tapElement: no bounding box for ${selector}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await sleep(40);
  await page.mouse.up();
}

async function exists(page, selector) {
  return (await page.locator(selector).count()) > 0;
}

async function waitFor(page, selector, timeout = DEFAULT_TIMEOUT) {
  await page.waitForSelector(selector, { state: "visible", timeout });
}

async function clickTestId(page, testid) {
  await page.locator(`[data-testid="${testid}"]`).first().click({ timeout: DEFAULT_TIMEOUT });
}

// --- high-level mobile actions ----------------------------------------------

/**
 * Tap a hand card by definitionId, opening the hand-command-tray.
 * Returns the tray's available action testids.
 */
async function tapHandCard(page, definitionId) {
  const sel = `[data-testid="hand-card"][data-definition-id="${definitionId}"]`;
  await waitFor(page, sel);
  await tapElement(page, sel);
  // tray should appear
  await sleep(150);
  const trayVisible = await exists(page, '[data-testid="hand-command-tray"]');
  if (!trayVisible) {
    // some cards may not be armable; that's a legitimate "no action" result
    return { trayVisible: false, actions: [] };
  }
  const actions = await page
    .locator('[data-testid^="hand-action-"]')
    .evaluateAll((els) =>
      els.filter((e) => e.offsetParent !== null).map((e) => e.getAttribute("data-testid")),
    );
  return { trayVisible: true, actions };
}

async function tapHandAction(page, action /* "play" | "sell" | "goSolo" */) {
  await clickTestId(page, `hand-action-${action}`);
}

/**
 * Resolve a card's instanceId by definitionId across the player's zones, using
 * the engine query API. Needed because mobile field units and legends expose
 * data-card-id (instanceId) but NOT data-definition-id.
 */
async function resolveInstanceId(page, definitionId) {
  return engineQuery(
    page,
    (engine, definitionId) => {
      const P1 = "p1";
      for (const zone of ["hand", "field", "legendArea"]) {
        const card = engine.getCardsInZone(zone, P1).find((c) => c.definitionId === definitionId);
        if (card) return { instanceId: card.instanceId, zone };
      }
      return null;
    },
    definitionId,
  );
}

/**
 * Tap a field unit or legend and read its card-action menu. Targets by
 * definitionId when present (mobile field units + face-up legends expose it),
 * else by instanceId (face-down legends hide their definitionId by design), else
 * by card-name fallback.
 */
async function tapFieldOrLegendCard(page, { instanceId, definitionId, cardName } = {}) {
  let sel;
  if (definitionId) {
    sel = `[data-definition-id="${definitionId}"]`;
  } else if (instanceId) {
    sel = `[data-card-id="${instanceId}"]`;
  } else if (cardName) {
    sel = `[data-card-name="${cardName}"]`;
  } else {
    throw new Error("tapFieldOrLegendCard requires definitionId/instanceId/cardName");
  }
  await waitFor(page, sel);
  await tapElement(page, sel);
  await sleep(150);
  const menuVisible = await exists(page, '[data-testid="card-action-menu"]');
  if (!menuVisible) {
    return { menuVisible: false, actions: [] };
  }
  const actions = await page
    .locator('[data-testid^="card-action-"]')
    .evaluateAll((els) =>
      els.filter((e) => e.offsetParent !== null).map((e) => e.getAttribute("data-testid")),
    );
  return { menuVisible: true, actions };
}

async function tapCardAction(page, action /* "attackUnit" | "attackRival" | ... */) {
  await clickTestId(page, `card-action-${action}`);
}

/**
 * Handle a pending target choice via the mobile ChoiceModal sheet:
 * open it (if spatial) then select the first candidate (single-target auto-submits).
 * Returns the targets offered.
 */
async function openAndPickFirstTarget(page) {
  const targets = [];
  // If a "Show valid targets" button is present (spatial prompt), open the sheet.
  const openBtn = page.locator('[data-testid="prompt-target-modal-open"]');
  if ((await openBtn.count()) > 0) {
    await openBtn.first().click({ timeout: DEFAULT_TIMEOUT });
    await waitFor(page, '[data-testid="choice-modal-sheet"]', 5000);
  }
  // ChoiceModal may already be open (non-spatial). Wait briefly for candidates.
  try {
    await page.waitForSelector(
      '[data-testid="target-modal-card"], [data-testid="target-modal-gig"], [data-testid="search-deck-card"]',
      { timeout: 5000 },
    );
  } catch {
    return { sheetOpen: false, targets: [] };
  }
  const cardTargets = await page.locator('[data-testid="target-modal-card"]').evaluateAll((els) =>
    els.map((e) => ({
      kind: "card",
      cardId: e.getAttribute("data-card-id"),
      label: e.textContent?.trim().slice(0, 40),
    })),
  );
  const gigTargets = await page.locator('[data-testid="target-modal-gig"]').evaluateAll((els) =>
    els.map((e) => ({
      kind: "gig",
      dieId: e.getAttribute("data-die-id"),
    })),
  );
  targets.push(...cardTargets, ...gigTargets);

  if (targets.length === 0) return { sheetOpen: true, targets: [] };

  // Select first candidate. Single-target (max<=1) auto-submits on click.
  const first = targets[0];
  const sel =
    first.kind === "card"
      ? `[data-testid="target-modal-card"][data-card-id="${first.cardId}"]`
      : `[data-testid="target-modal-gig"][data-die-id="${first.dieId}"]`;
  await page.locator(sel).first().click({ timeout: DEFAULT_TIMEOUT });

  // If multi-select confirm is needed, click it.
  const confirm = page.locator('[data-testid="target-modal-confirm"]');
  if ((await confirm.count()) > 0 && (await confirm.first().isEnabled())) {
    await confirm.first().click({ timeout: DEFAULT_TIMEOUT });
  }
  // Wait for sheet to close.
  await page
    .waitForSelector('[data-testid="choice-modal-sheet"]', { state: "detached", timeout: 5000 })
    .catch(() => {});
  return { sheetOpen: true, targets };
}

/**
 * Resolve a pending gain-gig prompt by tapping the first fixer die.
 */
async function gainGigFirst(page) {
  const die = page.locator('[data-testid="fixer-die"]').first();
  if ((await die.count()) === 0) return false;
  await die.click({ timeout: DEFAULT_TIMEOUT });
  return true;
}

/**
 * Pass / advance the phase via the bottom-rail control. Handles the confirm dialog.
 */
async function passPhase(page) {
  const btn = page.locator('[data-testid="phase-advance"]').first();
  await btn.click({ timeout: DEFAULT_TIMEOUT });
  const confirm = page.locator('[data-testid="pass-confirm-submit"]');
  if ((await confirm.count()) > 0) {
    await confirm.first().click({ timeout: DEFAULT_TIMEOUT });
  }
}

/**
 * Detect whether a target-selection surface is currently presented: either a
 * pending engine choice, the mobile "Show valid targets" banner button, or an
 * already-open ChoiceModal sheet. Programs/gear with spatial targets surface as
 * a select-target BANNER (promptStatus "action"), not a "choice", so checking
 * both is required.
 */
async function hasTargetSurface(page) {
  const choice = await page.evaluate(() => {
    const sim = window.__cyberpunkSimulator;
    const pending = sim?.engine?.getState?.().G.turnMetadata.pendingChoice;
    return {
      pendingChoiceType: pending?.type ?? null,
      openBtn: !!document.querySelector('[data-testid="prompt-target-modal-open"]'),
      sheet: !!document.querySelector('[data-testid="choice-modal-sheet"]'),
      bannerState:
        document.querySelector('[data-testid="prompt-banner"]')?.getAttribute("data-state") ?? null,
    };
  });
  return Boolean(
    choice.pendingChoiceType ||
    choice.openBtn ||
    choice.sheet ||
    choice.bannerState === "select-target",
  );
}

/**
 * Resolve any auto prompts that block a primary action from landing:
 * gain-gig at turn start, and optional triggers we can pass. Best-effort.
 */
async function clearBlockingPrompts(page, maxSteps = 6) {
  for (let i = 0; i < maxSteps; i++) {
    const st = await getBoardState(page);
    if (st.promptStatus === "choice" && st.pendingChoiceType === "gainGig") {
      await gainGigFirst(page);
      await sleep(150);
      continue;
    }
    break;
  }
}

async function screenshot(page, path) {
  await page.screenshot({ path, fullPage: false });
}

module.exports = {
  BASE,
  VIEWPORT,
  DEFAULT_TIMEOUT,
  mobileUrl,
  openMobile,
  sleep,
  engineQuery,
  getBoardState,
  getCardSupportedMoves,
  resolveInstanceId,
  tapElement,
  exists,
  waitFor,
  clickTestId,
  tapHandCard,
  tapHandAction,
  tapFieldOrLegendCard,
  tapCardAction,
  openAndPickFirstTarget,
  hasTargetSurface,
  gainGigFirst,
  passPhase,
  clearBlockingPrompts,
  screenshot,
};
