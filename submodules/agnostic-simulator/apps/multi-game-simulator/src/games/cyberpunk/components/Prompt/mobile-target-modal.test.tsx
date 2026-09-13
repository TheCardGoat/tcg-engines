// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, test } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

describe("mobile target prompt", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test("keeps Mox Inciters as a spatial target prompt", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaPromosAndV",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      await playMobileHandCard(view.container, "Mox Inciters");
      await expectSpatialTargetPrompt(view.container, "Mox Inciters");
    } finally {
      view.unmount();
    }
  });

  test("keeps Floor It as a spatial target prompt", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaPromosAndV",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      await playMobileHandCard(view.container, "Floor It");
      await expectSpatialTargetPrompt(view.container, "Floor It");
    } finally {
      view.unmount();
    }
  });

  test("opens drawer for non-visible deck search choices", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitSketchyRipperRetail",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      const sketchyRipperId = await harness.evalEngine((engine, definitionId) => {
        const view = engine.getFilteredView(CYBERPUNK_P1);
        const field = view.players[CYBERPUNK_P1]?.zones.field;
        if (!Array.isArray(field)) {
          return null;
        }
        return field.find((card) => card.definitionId === definitionId)?.instanceId ?? null;
      }, welcomeToNightCityRetailSketchyRipper.id);
      if (!sketchyRipperId) {
        throw new Error("Missing Sketchy Ripper in the mobile fixture.");
      }
      await harness.dispatchEngine(
        (engine, payload) => engine.attackRival(payload.attackerId, { as: payload.as }),
        { attackerId: sketchyRipperId, as: CYBERPUNK_P1 },
      );
      const pendingChoice = await harness.evalEngine(
        (engine, playerId) => engine.getPrompt(playerId).choice?.type ?? null,
        CYBERPUNK_P1,
      );
      expectEqual("Mobile search pending choice", pendingChoice, "scry");

      const sheet = await waitForTargetSheet("Deck search");
      expectEqual("Mobile search drawer surface", sheet.getAttribute("data-surface"), "mobile");
      expectEqual("Mobile search drawer placement", sheet.getAttribute("data-placement"), "bottom");
      requiredElement<HTMLButtonElement>(sheet, '[data-testid="choice-modal-toggle-placement"]');
      expectEqual(
        "Mobile search drawer exposes deck cards",
        document.body.querySelectorAll('[data-testid="search-deck-card"]').length > 0,
        true,
      );
    } finally {
      view.unmount();
    }
  });

  test("opens Lizzy Wizzy Program choices from hand and trash as a drawer", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitLizzyWizzyDelicateWeaponRetail",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      const board = await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      expectEqual("Lizzy mobile active side", board.dataset.activeSide, "player");
      expectEqual("Lizzy mobile active field balance", board.dataset.fieldBalance, "player");

      await playMobileHandCard(view.container, "Lizzy Wizzy — Delicate Weapon");

      const sheet = await waitForTargetSheet("Lizzy Wizzy");
      expectEqual("Lizzy target drawer surface", sheet.getAttribute("data-surface"), "mobile");
      expectEqual(
        "Lizzy target drawer includes hand group",
        Array.from(
          document.body.querySelectorAll('[data-testid="target-modal-zone-heading"]'),
        ).some((heading) => heading.textContent?.trim() === "Hand"),
        true,
      );
      expectEqual(
        "Lizzy target drawer includes trash group",
        Array.from(
          document.body.querySelectorAll('[data-testid="target-modal-zone-heading"]'),
        ).some((heading) => heading.textContent?.trim() === "Trash"),
        true,
      );
      expectEqual(
        "Lizzy target drawer exposes Program choices",
        document.body.querySelectorAll('[data-testid="target-modal-card"]').length,
        2,
      );
    } finally {
      view.unmount();
    }
  });

  test("renders die target prompts as Gig choices instead of raw JSON", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitLaLloronaGhostOfThePastRetail",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      const ids = await harness.evalEngine(
        (engine, definitions) => {
          const state = engine.getState();
          const findFieldCard = (playerId: string, definitionId: string) =>
            state.G.players[playerId]?.zones.field.find((cardId) => {
              const card = state.G.cardIndex[cardId];
              return card?.definitionId === definitionId;
            }) ?? null;
          return {
            blockerId: findFieldCard(definitions.playerId, definitions.blockerDefinitionId),
            attackerId: findFieldCard(definitions.rivalId, definitions.attackerDefinitionId),
          };
        },
        {
          playerId: CYBERPUNK_P1,
          rivalId: CYBERPUNK_P2,
          blockerDefinitionId: welcomeToNightCityRetailLaLloronaGhostOfThePast.id,
          attackerDefinitionId: embracingPowerRetailStarterDeckMinotaur.id,
        },
      );
      if (!ids.blockerId || !ids.attackerId) {
        throw new Error("Missing La Llorona blocker fixture cards.");
      }

      await harness.dispatchEngine(
        (engine, payload) => {
          engine.attackRival(payload.attackerId, { as: payload.rivalId });
          engine.resolveAttack({ as: payload.rivalId });
          engine.useBlocker(payload.blockerId, { as: payload.playerId });
        },
        {
          attackerId: ids.attackerId,
          blockerId: ids.blockerId,
          playerId: CYBERPUNK_P1,
          rivalId: CYBERPUNK_P2,
        },
      );

      await expectSpatialTargetPrompt(view.container, "La Llorona");
      const banner = requiredElement<HTMLElement>(view.container, '[data-testid="prompt-banner"]');
      expectEqual(
        "La Llorona inline target controls hide raw JSON",
        banner.textContent?.includes('"requestId"'),
        false,
      );
      expectEqual(
        "La Llorona prompt exposes visible Gigs inline",
        banner.querySelectorAll('[data-testid="prompt-gig-target-option"]').length,
        1,
      );
    } finally {
      view.unmount();
    }
  });

  test("resolves Gig target and value entirely from the mobile prompt banner", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progAfterpartyAtLizzies",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      const rivalD6Id = await harness.evalEngine((engine, playerId) => {
        const state = engine.getState();
        const rivalGigArea = state.G.players[playerId]?.gigArea ?? [];
        return rivalGigArea.find((dieId) => state.G.gigDice[dieId]?.dieType === "d6") ?? null;
      }, CYBERPUNK_P2);
      if (!rivalD6Id) {
        throw new Error("Missing rival d6 in Afterparty mobile fixture.");
      }

      await playMobileHandCard(view.container, "Afterparty at Lizzie's");
      await expectSpatialTargetPrompt(view.container, "Afterparty at Lizzie's");
      const targetBanner = requiredElement<HTMLElement>(
        view.container,
        '[data-testid="prompt-banner"]',
      );
      expectEqual(
        "Afterparty prompt exposes Gig choices inline",
        Array.from(
          targetBanner.querySelectorAll<HTMLButtonElement>(
            '[data-testid="prompt-gig-target-option"]',
          ),
          (option) => option.textContent,
        ).join("|"),
        "Your D6: 4|Your D4: 2|Rival D6: 4|Rival D12: 10",
      );
      fireEvent.click(
        requiredElement<HTMLButtonElement>(
          targetBanner,
          `[data-testid="prompt-gig-target-option"][data-die-id="${rivalD6Id}"]`,
        ),
      );

      const valueBanner = await waitFor(() => {
        const banner = requiredElement<HTMLElement>(
          view.container,
          '[data-testid="prompt-banner"]',
        );
        requiredElement<HTMLButtonElement>(
          banner,
          '[data-testid="prompt-adjust-gig-option"][data-value="5"]',
        );
        return banner;
      });
      expectEqual(
        "Afterparty direct prompt path keeps the target sheet closed",
        document.body.querySelector('[data-testid="choice-modal-sheet"]'),
        null,
      );
      fireEvent.click(
        requiredElement<HTMLButtonElement>(
          valueBanner,
          '[data-testid="prompt-adjust-gig-option"][data-value="5"]',
        ),
      );
      await waitFor(async () => {
        const faceValue = await harness.evalEngine(
          (engine, dieId) => engine.getState().G.gigDice[dieId]?.faceValue,
          rivalD6Id,
        );
        expectEqual("Afterparty prompt-only path adjusts the selected Gig", faceValue, 5);
      });
    } finally {
      view.unmount();
    }
  });

  test("keeps native Gig targets inline without a target dialog", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progAfterpartyAtLizzies",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      const rivalD6Id = await harness.evalEngine((engine, playerId) => {
        const state = engine.getState();
        const rivalGigArea = state.G.players[playerId]?.gigArea ?? [];
        return rivalGigArea.find((dieId) => state.G.gigDice[dieId]?.dieType === "d6") ?? null;
      }, CYBERPUNK_P2);
      if (!rivalD6Id) {
        throw new Error("Missing rival d6 in Afterparty mobile fixture.");
      }

      await playMobileHandCard(view.container, "Afterparty at Lizzie's");
      await expectSpatialTargetPrompt(view.container, "Afterparty at Lizzie's");
      const banner = requiredElement<HTMLElement>(view.container, '[data-testid="prompt-banner"]');
      expectEqual(
        "Afterparty inline target controls hide raw JSON",
        banner.textContent?.includes('"requestId"'),
        false,
      );
      expectEqual(
        "Afterparty prompt exposes Gigs inline",
        banner.querySelectorAll('[data-testid="prompt-gig-target-option"]').length > 0,
        true,
      );
      expectEqual(
        "Afterparty target dialog remains absent",
        document.body.querySelector('[data-testid="choice-modal-sheet"]'),
        null,
      );
      expectEqual("Afterparty fixture exposes the rival d6", Boolean(rivalD6Id), true);
    } finally {
      view.unmount();
    }
  });
});

function installResizeObserverStub() {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

async function playMobileHandCard(container: HTMLElement, cardName: string) {
  const handCard = await waitFor(() =>
    requiredElement<HTMLElement>(
      container,
      `[data-testid="hand-card"][data-card-name="${cardName}"]`,
    ),
  );
  fireEvent.click(requiredElement<HTMLElement>(handCard, '[data-testid="card"]'));
  const menu = await waitFor(() =>
    requiredElement<HTMLElement>(document.body, "[data-card-context-menu]"),
  );
  expectEqual(
    `${cardName} mobile hand command tray removed`,
    container.querySelector('[data-testid="hand-command-tray"]'),
    null,
  );
  fireEvent.click(requiredElement<HTMLButtonElement>(menu, '[data-action-id^="playCard:"]'));
}

async function expectSpatialTargetPrompt(container: HTMLElement, sourceName: string) {
  await waitFor(() => {
    const banner = requiredElement<HTMLElement>(container, '[data-testid="prompt-banner"]');
    expectEqual(`${sourceName} prompt state`, banner.getAttribute("data-state"), "select-target");
    expectEqual(`${sourceName} prompt copy`, banner.textContent?.includes(sourceName), true);
    requiredElement<HTMLButtonElement>(
      container,
      '[data-testid="prompt-banner-toggle-board-placement"]',
    );
    expectEqual(
      `${sourceName} drawer sheet absent`,
      document.body.querySelector('[data-testid="choice-modal-sheet"]'),
      null,
    );
    expectEqual(
      `${sourceName} target modal button absent`,
      container.querySelector('[data-testid="prompt-target-modal-open"]'),
      null,
    );
  });
}

async function waitForTargetSheet(sourceName: string) {
  const sheet = await waitFor(() =>
    requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-sheet"]'),
  );
  expectEqual(`${sourceName} target sheet is open`, sheet.textContent?.includes(sourceName), true);
  return sheet;
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
