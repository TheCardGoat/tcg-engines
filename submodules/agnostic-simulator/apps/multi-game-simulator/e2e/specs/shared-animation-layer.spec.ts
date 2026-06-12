import { expect, test } from "@playwright/test";
import {
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaMantisBlades,
  alphaRuthlessLowlife,
  alphaVCorporateExile,
  spoilerAfterpartyAtLizzieS,
  spoilerKerryEurodyneTheLastRockerboy,
} from "@tcg/cyberpunk-cards";

import { createPlaywrightCyberpunkSimulatorPom } from "../poms/CyberpunkPlaywrightHarnessClient";
import {
  CYBERPUNK_P1,
  CYBERPUNK_P2,
} from "../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";

test.describe("Cyberpunk shared animation layer", () => {
  test("default real board path uses shared transfers and keeps unsupported fallback cues", async ({
    page,
  }) => {
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const card = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaRuthlessLowlife.id,
    );

    await observeZoneTransferOverlay(page, "move-zone");
    await observeCardLandCue(page, card.instanceId);
    await triggerCardActionThroughBoardMenu(page, card.instanceId, "playCard");

    await expect
      .poll(() => readObservedZoneTransferOverlay(page))
      .toMatchObject({
        transferKind: "move-zone",
        fromZoneId: "p-hand",
        toZoneId: "p-field",
      });

    await expect.poll(() => readObservedCardLandCue(page)).toBe(true);
    await pom.expectFieldSize(CYBERPUNK_P1, 3);
  });

  test("real board card move uses the shared zone transfer overlay", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const card = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaRuthlessLowlife.id,
    );

    await observeZoneTransferOverlay(page, "move-zone");
    await triggerCardActionThroughBoardMenu(page, card.instanceId, "playCard");

    await expect
      .poll(() => readObservedZoneTransferOverlay(page))
      .toMatchObject({
        transferKind: "move-zone",
        fromZoneId: "p-hand",
        toZoneId: "p-field",
      });
    await pom.expectFieldSize(CYBERPUNK_P1, 3);
  });

  test("real board opponent draw uses the shared draw transfer", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const handBefore = await pom.getHandSize(CYBERPUNK_P2);
    const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);

    await observeZoneTransferOverlay(page, "draw");
    await passPhaseThroughBoardPrompt(page);

    await expect
      .poll(() => readObservedZoneTransferOverlay(page))
      .toMatchObject({
        transferKind: "draw",
        fromZoneId: "opp-deck",
        toZoneId: "opp-hand",
        sourceFace: "hidden",
        destinationFace: "hidden",
        currentFace: "hidden",
      });

    await pom.expectLastDispatch({ type: "passPhase", as: CYBERPUNK_P1 });
    await pom.expectHandSize(CYBERPUNK_P2, handBefore + 1);
    await expect.poll(() => pom.getDeckSize(CYBERPUNK_P2)).toBe(deckBefore - 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P2, "gainGig");
    await expect.poll(() => pom.getPhase()).toBe("start");
    await expect.poll(() => pom.getActivePlayerId()).toBe(CYBERPUNK_P2);
    await expect.poll(() => pom.getTurnNumber()).toBe(2);
  });

  test("real board owner draw reveals the card only to the owner viewer", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/unitKerryEurodyneTheLastRockerboy?ai=off&auto-advance-attack=off",
    );

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const handBefore = await pom.getHandSize(CYBERPUNK_P1);
    const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);
    const kerry = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerKerryEurodyneTheLastRockerboy.id,
    );

    await observeZoneTransferOverlay(page, "draw");
    await triggerFieldCardActionThroughBoardMenu(page, kerry.instanceId, "activateAbility");

    await expect
      .poll(() => readObservedZoneTransferOverlay(page))
      .toMatchObject({
        transferKind: "draw",
        fromZoneId: "p-deck",
        toZoneId: "p-hand",
        sourceFace: "hidden",
        destinationFace: "public",
      });

    await pom.expectLastDispatch({
      type: "activateAbility",
      cardId: kerry.instanceId,
      abilityIndex: 0,
      as: CYBERPUNK_P1,
    });
    await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
    await expect.poll(() => pom.getDeckSize(CYBERPUNK_P1)).toBe(deckBefore - 2);
  });

  test("real board card exit uses the shared primitive overlay", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const card = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaFloorIt.id);

    await observePrimitiveOverlay(page, "zoneExit");
    await triggerCardActionThroughBoardMenu(page, card.instanceId, "sellCard");

    await expect
      .poll(() => readObservedPrimitiveOverlay(page))
      .toMatchObject({
        primitive: "zoneExit",
        animationKind: "zone-exit",
        entityId: card.instanceId,
        fromZoneId: "p-hand",
        sourceFace: "public",
      });
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectEddies(CYBERPUNK_P1, 6);
  });

  test("real board attach uses the shared primitive overlay", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/gearAttachToGoSoloLegend?ai=off&auto-advance-attack=off",
    );

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const gear = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaMantisBlades.id);
    const host = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaVCorporateExile.id,
    );

    await observePrimitiveOverlay(page, "attach");
    await observeAttachedGearSuppression(page, gear.instanceId);
    await triggerCardActionThroughBoardMenu(page, gear.instanceId, "playCard");
    const hostCard = page.locator(
      `[data-testid="field-unit"][data-card-id="${host.instanceId}"] [data-interaction-state]`,
    );
    await expect(hostCard).toHaveAttribute("data-selectable", "true");
    await hostCard.click();

    await expect
      .poll(() => readObservedPrimitiveOverlay(page))
      .toMatchObject({
        primitive: "attach",
        animationKind: "attach",
        entityId: gear.instanceId,
        fromZoneId: "p-hand",
        toZoneId: "p-field",
        targetEntityId: host.instanceId,
        sourceFace: "public",
        destinationFace: "public",
      });
    await expect(
      page.locator('[data-sim-zone-id="p-field"][data-sim-zone-role="battlefield"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-sim-zone-id="p-pinfo"][data-sim-zone-role="custom"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-sim-zone-id="opp-pinfo"][data-sim-zone-visibility="public"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-sim-zone-id="p-gigs"][data-sim-zone-role="resource"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('[data-testid="gig-die"][data-sim-entity-id][data-sim-zone-id$="-gigs"]'),
    ).not.toHaveCount(0);
    await expect.poll(() => readObservedAttachedGearSuppression(page)).toBe(true);
    await expect(page.getByTestId("sim-animation-overlay")).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate((gearId) => {
          const attachedGear = document.querySelector<HTMLElement>(
            `[data-testid="attached-gear"][data-card-id="${gearId}"]`,
          );
          return attachedGear ? getComputedStyle(attachedGear).visibility : null;
        }, gear.instanceId),
      )
      .toBe("visible");
    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
  });

  test("real board legend reveal uses the shared primitive overlay", async ({ page }) => {
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const legend = (await pom.getCardsInZone("legendArea", CYBERPUNK_P1)).find(
      (candidate) => candidate.faceDown,
    );
    expect(legend, "expected openingMain to have a callable face-down legend").toBeTruthy();
    const faceDownLegendSlots = page.locator(
      '[data-testid="legends-zone"][data-side="player"] [data-testid="legend-slot"][data-face-down="true"]',
    );
    const faceDownBefore = await faceDownLegendSlots.count();

    await observePrimitiveOverlay(page, "flipReveal");
    await triggerFirstFaceDownLegendActionThroughBoardMenu(page, "callLegend");

    await expect
      .poll(() => readObservedPrimitiveOverlay(page))
      .toMatchObject({
        primitive: "flipReveal",
        animationKind: "flip-reveal",
        entityId: legend!.instanceId,
        zoneId: "p-legends",
        fromZoneId: "p-legends",
        toZoneId: "p-legends",
        sourceFace: "hidden",
        destinationFace: "public",
      });
    await expect(faceDownLegendSlots).toHaveCount(faceDownBefore - 1);
  });

  test("real board targeted program shows source-to-target beam", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progCorporateSurveillance?ai=off&auto-advance-attack=off",
    );

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaCorporateSurveillance.id,
    );
    const target = (await pom.getCardsInZone("field", CYBERPUNK_P2))[0];
    expect(target, "expected Corporate Surveillance to have a rival field target").toBeTruthy();

    await observeZoneTransferOverlay(page, "move-zone");
    await dragCardToCard(page, program.instanceId, target!.instanceId);

    await expect
      .poll(() => readObservedZoneTransferOverlay(page))
      .toMatchObject({
        transferKind: "move-zone",
        fromZoneId: "p-hand",
        toZoneId: "p-trash",
      });

    const beam = page.getByTestId("sim-effect-target-beam");
    await expect(beam).toBeVisible();
    await expect(beam).toHaveAttribute("data-animation-primitive", "effectTarget");
    await expect(beam).toHaveAttribute("data-source-entity-id", program.instanceId);
    await expect(beam).toHaveAttribute("data-target-entity-id", target!.instanceId);
    await expect(page.getByTestId("sim-effect-target-pulse")).toBeVisible();
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  });

  test("real board gig effect target uses shared die anchors", async ({ page }) => {
    await page.goto(
      "/cyberpunk/simulator/tests/progAfterpartyAtLizzies?ai=off&auto-advance-attack=off",
    );

    const pom = createPlaywrightCyberpunkSimulatorPom(page);
    await pom.waitForReady();
    const program = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerAfterpartyAtLizzieS.id,
    );
    const targetDie = (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d6");
    expect(targetDie, "expected Afterparty fixture to have a rival d6 target").toBeTruthy();

    await triggerCardActionThroughBoardMenu(page, program.instanceId, "playCard");
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    const targetDieButton = page.locator(
      `[data-testid="gig-die"][data-die-id="${targetDie!.id}"][data-sim-entity-id="${targetDie!.id}"]`,
    );
    await expect(targetDieButton).toHaveAttribute("data-interactive", "true");
    await expect(targetDieButton).toHaveAttribute("data-sim-zone-id", "opp-gigs");

    await targetDieButton.click({ force: true });
    await expect(page.getByTestId("gig-adjust-panel")).toHaveAttribute("aria-label", "Adjust D6");

    await observeEffectTargetBeam(page, "entity");
    await page.getByRole("button", { name: "+2 to 6" }).click();
    await expect
      .poll(() => readObservedEffectTargetBeam(page))
      .toMatchObject({
        primitive: "effectTarget",
        sourceEntityId: program.instanceId,
        targetKind: "entity",
        targetEntityId: targetDie!.id,
      });
    await pom.expectLastDispatch({ type: "resolveAdjustGig", value: 6, as: CYBERPUNK_P1 });
  });

  test("real board reduced motion completes shared animations through fast final states", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");
    await expect
      .poll(() =>
        page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      )
      .toBe(true);

    const movePom = createPlaywrightCyberpunkSimulatorPom(page);
    await movePom.waitForReady();
    const movingCard = await movePom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaRuthlessLowlife.id,
    );

    await triggerCardActionThroughBoardMenu(page, movingCard.instanceId, "playCard");

    await expect.poll(() => movePom.getFieldSize(CYBERPUNK_P1), { timeout: 350 }).toBe(3);
    await expect(page.getByTestId("zone-transfer-overlay")).toHaveCount(0);

    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");
    const exitPom = createPlaywrightCyberpunkSimulatorPom(page);
    await exitPom.waitForReady();
    const exitCard = await exitPom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaFloorIt.id,
    );

    await triggerCardActionThroughBoardMenu(page, exitCard.instanceId, "sellCard");

    await expect.poll(() => exitPom.getHandSize(CYBERPUNK_P1), { timeout: 350 }).toBe(2);
    await expect.poll(() => exitPom.getEddies(CYBERPUNK_P1), { timeout: 350 }).toBe(6);
    await expect(page.getByTestId("sim-animation-overlay")).toHaveCount(0);

    await page.goto(
      "/cyberpunk/simulator/tests/gearAttachToGoSoloLegend?ai=off&auto-advance-attack=off",
    );
    const attachPom = createPlaywrightCyberpunkSimulatorPom(page);
    await attachPom.waitForReady();
    const gear = await attachPom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaMantisBlades.id,
    );
    const host = await attachPom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaVCorporateExile.id,
    );

    await triggerCardActionThroughBoardMenu(page, gear.instanceId, "playCard");
    const hostCard = page.locator(
      `[data-testid="field-unit"][data-card-id="${host.instanceId}"] [data-interaction-state]`,
    );
    await expect(hostCard).toHaveAttribute("data-selectable", "true");
    await hostCard.click();

    await expect(
      page.locator(`[data-testid="field-unit"][data-card-id="${host.instanceId}"]`),
    ).toHaveAttribute("data-gear-count", "1", { timeout: 450 });
    await expect(page.getByTestId("sim-animation-overlay")).toHaveCount(0);

    await page.goto("/cyberpunk/simulator/tests/openingMain?ai=off&auto-advance-attack=off");
    const revealPom = createPlaywrightCyberpunkSimulatorPom(page);
    await revealPom.waitForReady();
    const faceDownLegendSlots = page.locator(
      '[data-testid="legends-zone"][data-side="player"] [data-testid="legend-slot"][data-face-down="true"]',
    );
    const faceDownBefore = await faceDownLegendSlots.count();

    await triggerFirstFaceDownLegendActionThroughBoardMenu(page, "callLegend");

    await expect(faceDownLegendSlots).toHaveCount(faceDownBefore - 1, { timeout: 450 });
    await expect(page.getByTestId("sim-animation-overlay")).toHaveCount(0);
  });
});

async function triggerCardActionThroughBoardMenu(
  page: import("@playwright/test").Page,
  cardId: string,
  actionId: "playCard" | "sellCard",
): Promise<void> {
  const cardWrapper = page.locator(`[data-testid="hand-card"][data-card-id="${cardId}"]`);
  const card = cardWrapper.locator("[data-interaction-state]");
  await expect(card).toHaveAttribute("data-interaction-state", "armable");
  await card.click();

  const actionMenu = page.locator('[data-testid="card-action-menu"]');
  await expect(actionMenu).toBeVisible();
  await actionMenu.locator(`[data-testid="card-action-${actionId}"]`).click();
}

async function triggerFieldCardActionThroughBoardMenu(
  page: import("@playwright/test").Page,
  cardId: string,
  actionId: "activateAbility",
): Promise<void> {
  const cardWrapper = page.locator(`[data-testid="field-unit"][data-card-id="${cardId}"]`);
  const card = cardWrapper.locator("[data-interaction-state]");
  await expect(card).toHaveAttribute("data-interaction-state", "armable");
  await card.click();

  const actionMenu = page.locator('[data-testid="card-action-menu"]');
  await expect(actionMenu).toBeVisible();
  await actionMenu.locator(`[data-testid="card-action-${actionId}"]`).click();
}

async function triggerFirstFaceDownLegendActionThroughBoardMenu(
  page: import("@playwright/test").Page,
  actionId: "callLegend",
): Promise<void> {
  const card = page
    .locator(
      '[data-testid="legends-zone"][data-side="player"] [data-testid="legend-slot"][data-call-legend-actionable="true"] [data-testid="face-down-card"]',
    )
    .first();
  await expect(card).toHaveAttribute("data-interaction-state", "armable");
  await card.click();

  const actionMenu = page.locator('[data-testid="card-action-menu"]');
  await expect(actionMenu).toBeVisible();
  await actionMenu.locator(`[data-testid="card-action-${actionId}"]`).click();
}

async function passPhaseThroughBoardPrompt(page: import("@playwright/test").Page): Promise<void> {
  const passButton = page.getByTestId("phase-advance");
  await expect(passButton).toBeVisible();
  await passButton.click();
  await page.getByRole("button", { name: "Pass turn", exact: true }).click();
}

interface ObservedZoneTransferOverlay {
  transferKind: string | null;
  fromZoneId: string | null;
  toZoneId: string | null;
  sourceFace: string | null;
  destinationFace: string | null;
  currentFace: string | null;
}

interface ObservedPrimitiveOverlay {
  primitive: string | null;
  animationKind: string | null;
  entityId: string | null;
  fromZoneId: string | null;
  toZoneId: string | null;
  zoneId: string | null;
  targetEntityId: string | null;
  sourceFace: string | null;
  destinationFace: string | null;
}

interface ObservedEffectTargetBeam {
  primitive: string | null;
  sourceEntityId: string | null;
  targetKind: string | null;
  targetEntityId: string | null;
  targetZoneId: string | null;
  targetSeatId: string | null;
}

async function observeZoneTransferOverlay(
  page: import("@playwright/test").Page,
  transferKind: string,
): Promise<void> {
  await page.evaluate((kind) => {
    type OverlayState = Window &
      typeof globalThis & {
        __observedZoneTransferOverlay?: ObservedZoneTransferOverlay | null;
      };
    const state = window as OverlayState;
    state.__observedZoneTransferOverlay = null;

    const readOverlay = (node: HTMLElement): ObservedZoneTransferOverlay => ({
      transferKind: node.getAttribute("data-transfer-kind"),
      fromZoneId: node.getAttribute("data-from-zone-id"),
      toZoneId: node.getAttribute("data-to-zone-id"),
      sourceFace: node.getAttribute("data-source-face"),
      destinationFace: node.getAttribute("data-destination-face"),
      currentFace: node.getAttribute("data-current-face"),
    });

    const capture = (): boolean => {
      const selector = `[data-testid="zone-transfer-overlay"][data-transfer-kind="${kind}"]`;
      const node = document.querySelector<HTMLElement>(selector);
      if (!node) return false;
      state.__observedZoneTransferOverlay = readOverlay(node);
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    capture();
  }, transferKind);
}

async function observePrimitiveOverlay(
  page: import("@playwright/test").Page,
  primitive: string,
): Promise<void> {
  await page.evaluate((expectedPrimitive) => {
    type OverlayState = Window &
      typeof globalThis & {
        __observedPrimitiveOverlay?: ObservedPrimitiveOverlay | null;
      };
    const state = window as OverlayState;
    state.__observedPrimitiveOverlay = null;

    const readOverlay = (node: HTMLElement): ObservedPrimitiveOverlay => ({
      primitive: node.getAttribute("data-animation-primitive"),
      animationKind: node.getAttribute("data-animation-kind"),
      entityId: node.getAttribute("data-entity-id"),
      fromZoneId: node.getAttribute("data-from-zone-id"),
      toZoneId: node.getAttribute("data-to-zone-id"),
      zoneId: node.getAttribute("data-zone-id"),
      targetEntityId: node.getAttribute("data-target-entity-id"),
      sourceFace: node.getAttribute("data-source-face"),
      destinationFace: node.getAttribute("data-destination-face"),
    });

    const capture = (): boolean => {
      const selector = `[data-testid="sim-animation-overlay"][data-animation-primitive="${expectedPrimitive}"]`;
      const node = document.querySelector<HTMLElement>(selector);
      if (!node) return false;
      state.__observedPrimitiveOverlay = readOverlay(node);
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    capture();
  }, primitive);
}

async function readObservedZoneTransferOverlay(
  page: import("@playwright/test").Page,
): Promise<ObservedZoneTransferOverlay | null> {
  return page.evaluate(() => {
    const state = window as Window &
      typeof globalThis & {
        __observedZoneTransferOverlay?: ObservedZoneTransferOverlay | null;
      };
    return state.__observedZoneTransferOverlay ?? null;
  });
}

async function readObservedPrimitiveOverlay(
  page: import("@playwright/test").Page,
): Promise<ObservedPrimitiveOverlay | null> {
  return page.evaluate(() => {
    const state = window as Window &
      typeof globalThis & {
        __observedPrimitiveOverlay?: ObservedPrimitiveOverlay | null;
      };
    return state.__observedPrimitiveOverlay ?? null;
  });
}

async function observeEffectTargetBeam(
  page: import("@playwright/test").Page,
  targetKind: string,
): Promise<void> {
  await page.evaluate((expectedTargetKind) => {
    type BeamState = Window &
      typeof globalThis & {
        __observedEffectTargetBeam?: ObservedEffectTargetBeam | null;
      };
    const state = window as BeamState;
    state.__observedEffectTargetBeam = null;

    const readBeam = (node: HTMLElement): ObservedEffectTargetBeam => ({
      primitive: node.getAttribute("data-animation-primitive"),
      sourceEntityId: node.getAttribute("data-source-entity-id"),
      targetKind: node.getAttribute("data-target-kind"),
      targetEntityId: node.getAttribute("data-target-entity-id"),
      targetZoneId: node.getAttribute("data-target-zone-id"),
      targetSeatId: node.getAttribute("data-target-seat-id"),
    });

    const capture = (): boolean => {
      const selector = `[data-testid="sim-effect-target-beam"][data-target-kind="${expectedTargetKind}"]`;
      const node = document.querySelector<HTMLElement>(selector);
      if (!node) return false;
      state.__observedEffectTargetBeam = readBeam(node);
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    capture();
  }, targetKind);
}

async function readObservedEffectTargetBeam(
  page: import("@playwright/test").Page,
): Promise<ObservedEffectTargetBeam | null> {
  return page.evaluate(() => {
    const state = window as Window &
      typeof globalThis & {
        __observedEffectTargetBeam?: ObservedEffectTargetBeam | null;
      };
    return state.__observedEffectTargetBeam ?? null;
  });
}

async function observeCardLandCue(
  page: import("@playwright/test").Page,
  cardId: string,
): Promise<void> {
  await page.evaluate((observedCardId) => {
    type CardLandState = Window &
      typeof globalThis & {
        __observedCardLandCue?: boolean;
      };
    const state = window as CardLandState;
    state.__observedCardLandCue = false;

    const capture = (): boolean => {
      const escapedCardId =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(observedCardId)
          : observedCardId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const node = document.querySelector(
        `[data-card-id="${escapedCardId}"][data-script-card-land="true"]`,
      );
      if (!node) return false;
      state.__observedCardLandCue = true;
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-script-card-land"],
      childList: true,
      subtree: true,
    });
    capture();
  }, cardId);
}

async function readObservedCardLandCue(page: import("@playwright/test").Page): Promise<boolean> {
  return page.evaluate(() => {
    const state = window as Window &
      typeof globalThis & {
        __observedCardLandCue?: boolean;
      };
    return state.__observedCardLandCue === true;
  });
}

async function observeAttachedGearSuppression(
  page: import("@playwright/test").Page,
  gearId: string,
): Promise<void> {
  await page.evaluate((observedGearId) => {
    type AttachedGearSuppressionState = Window &
      typeof globalThis & {
        __observedAttachedGearSuppression?: boolean;
      };
    const state = window as AttachedGearSuppressionState;
    state.__observedAttachedGearSuppression = false;

    const escapedGearId =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(observedGearId)
        : observedGearId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    const capture = (): boolean => {
      const node = document.querySelector<HTMLElement>(
        `[data-testid="attached-gear"][data-card-id="${escapedGearId}"]`,
      );
      if (!node || getComputedStyle(node).visibility !== "hidden") {
        return false;
      }
      state.__observedAttachedGearSuppression = true;
      return true;
    };

    const observer = new MutationObserver(() => {
      if (capture()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    capture();
  }, gearId);
}

async function readObservedAttachedGearSuppression(
  page: import("@playwright/test").Page,
): Promise<boolean> {
  return page.evaluate(() => {
    const state = window as Window &
      typeof globalThis & {
        __observedAttachedGearSuppression?: boolean;
      };
    return state.__observedAttachedGearSuppression === true;
  });
}

async function dragCardToCard(
  page: import("@playwright/test").Page,
  sourceCardId: string,
  targetCardId: string,
): Promise<void> {
  const source = page.locator(
    `[data-testid="hand-card"][data-card-id="${sourceCardId}"] [data-interaction-state]`,
  );
  const target = page.locator(`[data-testid="field-unit"][data-card-id="${targetCardId}"]`);
  await expect(source).toBeVisible();
  await expect(target).toBeVisible();

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  expect(sourceBox, "source card must have a bounding box").toBeTruthy();
  expect(targetBox, "target card must have a bounding box").toBeTruthy();

  const sourceCenter = {
    x: sourceBox!.x + sourceBox!.width / 2,
    y: sourceBox!.y + sourceBox!.height / 2,
  };
  const targetCenter = {
    x: targetBox!.x + targetBox!.width / 2,
    y: targetBox!.y + targetBox!.height / 2,
  };

  await page.mouse.move(sourceCenter.x, sourceCenter.y);
  await page.mouse.down();
  await page.mouse.move(sourceCenter.x + 8, sourceCenter.y + 8, { steps: 5 });
  await page.mouse.move(targetCenter.x, targetCenter.y, { steps: 12 });
  await page.mouse.up();
}
