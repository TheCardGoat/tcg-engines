// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
} from "@tcg/cyberpunk-cards";
import type { CardInstanceId, GigDieId } from "@tcg/cyberpunk-engine";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../testing/cyberpunk-simulator-pom";
import { expectEqual } from "../../testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

// The defender's gig-steal prevention prompt (Alt Cunningham — Mother of
// Daemons) must surface as a choice modal that pairs each stolen Gig with a
// hand card of equal cost, with an explicit pass to let the steal resolve.

describe("prevent gig steal modal", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  interface Setup {
    stolenDieId: GigDieId;
    rivalAttackerId: CardInstanceId;
  }

  async function armPreventionPrompt(): Promise<{
    view: ReturnType<typeof renderCyberpunkSimulatorScenario>;
    harness: WindowCyberpunkHarnessClient;
    setup: Setup;
  }> {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitAltCunninghamMotherOfDaemons",
      layout: "mobile",
    });
    const harness = new WindowCyberpunkHarnessClient();
    await harness.waitForReady();
    await waitFor(() =>
      requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
    );

    const setup = await harness.evalEngine((engine) => {
      const state = engine.getState();
      const myGigArea = state.G.players[CYBERPUNK_P1]?.gigArea ?? [];
      const stolenDieId =
        myGigArea.find((dieId) => {
          const die = state.G.gigDice[dieId];
          return die?.dieType === "d4" && die?.faceValue === 2;
        }) ?? null;
      const rivalField = state.G.players[CYBERPUNK_P2]?.zones.field ?? [];
      const rivalAttackerId =
        rivalField.find(
          (cardId) =>
            state.G.cardIndex[cardId]?.definitionId === welcomeToNightCityRetailDelamainCab.id,
        ) ?? null;
      return { stolenDieId, rivalAttackerId } as Setup;
    });
    if (!setup.stolenDieId || !setup.rivalAttackerId) {
      throw new Error("Missing prevention fixture entities (d4 gig or Delamain Cab).");
    }

    // Hand the turn to the rival, answer the turn-start gainGig choice, then
    // walk the stepped direct attack (attack → react → steal) targeting the
    // cost-2 Gig so the prevention choice arms for P1.
    await harness.dispatchEngine((engine) => engine.completeTurn({ as: CYBERPUNK_P1 }));
    const setupChoice = await harness.evalEngine(
      (engine, playerId) => engine.getPrompt(playerId).choice?.type ?? null,
      CYBERPUNK_P2,
    );
    if (setupChoice === "gainGig") {
      const allowedDieId = await harness.evalEngine((engine, playerId) => {
        const choice = engine.getPrompt(playerId).choice;
        if (!choice || choice.type !== "gainGig") {
          return null;
        }
        return choice.payload.allowedDieIds[0] ?? null;
      }, CYBERPUNK_P2);
      if (!allowedDieId) {
        throw new Error("gainGig choice has no allowed dice.");
      }
      await harness.dispatchEngine(
        (engine, payload) => {
          engine.gainGig(payload.allowedDieId, { as: CYBERPUNK_P2 });
        },
        { allowedDieId },
      );
    }
    await harness.dispatchEngine((engine, payload) => {
      engine.attackRival(payload.rivalAttackerId, { as: CYBERPUNK_P2 });
      engine.resolveAttack({ as: CYBERPUNK_P2 });
      engine.resolveAttack({ as: CYBERPUNK_P2, pass: true });
      engine.resolveAttack({ as: CYBERPUNK_P2, gigIdsToSteal: [payload.stolenDieId] });
    }, setup);

    const defenderChoice = await harness.evalEngine(
      (engine, playerId) => engine.getPrompt(playerId).choice?.type ?? null,
      CYBERPUNK_P1,
    );
    expectEqual("Prevention prompt reaches the defender", defenderChoice, "preventGigSteal");
    return { view, harness, setup };
  }

  test("pairs a matching-cost hand card with the stolen Gig to prevent the steal", async () => {
    const { view, harness, setup } = await armPreventionPrompt();
    try {
      const sheet = await waitForTargetSheet("Prevent Gig Steal");
      const rows = sheet.querySelectorAll('[data-testid="prevent-steal-gig-row"]');
      expectEqual("One row per stolen Gig", rows.length, 1);
      const cardOption = requiredElement<HTMLButtonElement>(
        sheet,
        '[data-testid="prevent-steal-card-option"]',
      );
      expectEqual("Matching hand card is enabled", cardOption.disabled, false);
      fireEvent.click(cardOption);
      fireEvent.click(
        requiredElement<HTMLButtonElement>(sheet, '[data-testid="prevent-steal-confirm"]'),
      );

      await waitFor(async () => {
        const outcome = await harness.evalEngine((engine, payload) => {
          const state = engine.getState();
          return {
            pending: state.G.turnMetadata.pendingChoice?.type ?? null,
            gigHome: (state.G.players[CYBERPUNK_P1]?.gigArea ?? []).includes(payload.stolenDieId),
            preventCardTrashed: (state.G.players[CYBERPUNK_P1]?.zones.trash ?? []).some(
              (cardId) =>
                state.G.cardIndex[cardId]?.definitionId ===
                welcomeToNightCityRetailCorpoSecurity.id,
            ),
          };
        }, setup);
        expectEqual("Prevention drains the pending choice", outcome.pending, null);
        expectEqual("Protected Gig stays with the defender", outcome.gigHome, true);
        expectEqual("Prevention card was discarded", outcome.preventCardTrashed, true);
      });
      expectEqual(
        "Prevention sheet closes",
        document.body.querySelector('[data-testid="choice-modal-sheet"]'),
        null,
      );
    } finally {
      view.unmount();
    }
  });

  test("lets the steal resolve when the defender passes", async () => {
    const { view, harness, setup } = await armPreventionPrompt();
    try {
      const sheet = await waitForTargetSheet("Prevent Gig Steal");
      fireEvent.click(
        requiredElement<HTMLButtonElement>(sheet, '[data-testid="prevent-steal-pass"]'),
      );

      await waitFor(async () => {
        const stolenAway = await harness.evalEngine((engine, payload) => {
          const state = engine.getState();
          return {
            pending: state.G.turnMetadata.pendingChoice?.type ?? null,
            gigStolen: (state.G.players[CYBERPUNK_P2]?.gigArea ?? []).includes(payload.stolenDieId),
            preventCardInHand: (state.G.players[CYBERPUNK_P1]?.zones.hand ?? []).some(
              (cardId) =>
                state.G.cardIndex[cardId]?.definitionId ===
                welcomeToNightCityRetailCorpoSecurity.id,
            ),
          };
        }, setup);
        expectEqual("Pass drains the pending choice", stolenAway.pending, null);
        expectEqual("Passed Gig moves to the rival", stolenAway.gigStolen, true);
        expectEqual("Pass keeps the hand card", stolenAway.preventCardInHand, true);
      });
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

async function waitForTargetSheet(sourceName: string) {
  const sheet = await waitFor(() =>
    requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-sheet"]'),
  );
  expectEqual(`${sourceName} sheet is open`, sheet.textContent?.includes(sourceName), true);
  return sheet;
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
