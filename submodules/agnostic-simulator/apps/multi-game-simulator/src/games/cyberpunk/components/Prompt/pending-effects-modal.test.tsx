// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { defOf } from "@tcg/cyberpunk-engine";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { WindowCyberpunkHarnessClient } from "../../testing/window-cyberpunk-harness-client";
import { resetChoiceModalStateForTests } from "./choiceModalState";

describe("pending effects modal", () => {
  afterEach(() => {
    resetChoiceModalStateForTests();
  });

  test.each(["Safety Override", "Maelstrom Zealots"])(
    "resolves %s first from a real fight's card and delayed effects",
    async (firstEffect) => {
      ensureJsdomAnimationSupport();
      installResizeObserverStub();
      const view = renderCyberpunkSimulatorScenario({
        scenarioId: "pendingFightEffectOrder",
        layout: "mobile",
        boardProps: { initialAi: { player: null, opponent: null } },
      });
      try {
        const harness = new WindowCyberpunkHarnessClient();
        await harness.waitForReady();
        const sheet = await waitForChoiceSheet();
        const options = [
          ...sheet.querySelectorAll<HTMLButtonElement>('[data-testid="pending-effect-option"]'),
        ];
        expect(options).toHaveLength(2);
        expect(sheet.textContent).toContain("Safety Override");
        expect(sheet.textContent).toContain("Maelstrom Zealots");
        const selected = options.find((option) => option.textContent?.includes(firstEffect));
        if (!selected) throw new Error(`Missing effect: ${firstEffect}`);
        fireEvent.click(selected);
        await waitFor(async () => {
          const rivalTrash = await harness.evalEngine((engine) =>
            engine.getCardsInZone("trash", CYBERPUNK_P2).map((card) => defOf(card).displayName),
          );
          expect(rivalTrash).toContain("Field Operator");
          expect(rivalTrash).toContain("Mantis Blades");
          expect(document.body.querySelector('[data-testid="pending-effect-option"]')).toBeNull();
        });
        const rivalChoice = await harness.evalEngine(
          (engine) => engine.getPrompt(CYBERPUNK_P2).choice?.type,
        );
        expect(rivalChoice).toBe("scry");
      } finally {
        view.unmount();
      }
    },
  );

  test("shows source card art and makes each pending effect a resolve-next choice", async () => {
    const { view, harness, sourceCards } = await renderPendingChoiceFixture();
    try {
      await harness.dispatchEngine((engine, cards) => {
        engine.judgeSetPendingChoice({
          type: "chooseTrigger",
          chooserId: CYBERPUNK_P1,
          effectId: "pending-effects-ui",
          payload: {
            options: cards.map((card, index) => ({
              triggerId: `pending-effect-${index + 1}`,
              sourceCardId: card.instanceId,
              sourcePlayerId: CYBERPUNK_P1,
              abilityIndex: index,
              abilityText:
                index === 0
                  ? "Search the top 2 cards of your deck and trash 1."
                  : "Play another Unit with cost 9 or less from your trash for free.",
              cardName: card.name,
            })),
          },
        });
      }, sourceCards);

      const sheet = await waitForChoiceSheet();
      expect(sheet.textContent).toContain("Choose the next effect");
      expect(sheet.textContent).toContain("2 effects are pending");

      const options = sheet.querySelectorAll<HTMLButtonElement>(
        '[data-testid="pending-effect-option"]',
      );
      expect(options).toHaveLength(2);
      expect(options[0]?.getAttribute("aria-label")).toContain("Resolve");
      expect(options[0]?.getAttribute("aria-label")).toContain(sourceCards[0]!.name);
      expect(options[1]?.getAttribute("aria-label")).toContain(sourceCards[1]!.name);
      expect(options[0]?.querySelector(`img[alt="${sourceCards[0]!.name}"]`)).not.toBeNull();
      expect(options[1]?.querySelector(`img[alt="${sourceCards[1]!.name}"]`)).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("defaults to the compact card row and expands to the stacked list", async () => {
    const { view, harness, sourceCards } = await renderPendingChoiceFixture();
    try {
      const abilityTexts = [
        "Search the top 2 cards of your deck and trash 1.",
        "Play another Unit with cost 9 or less from your trash for free.",
      ];
      await harness.dispatchEngine((engine, cards) => {
        engine.judgeSetPendingChoice({
          type: "chooseTrigger",
          chooserId: CYBERPUNK_P1,
          effectId: "pending-effects-ui",
          payload: {
            options: cards.map((card, index) => ({
              triggerId: `pending-effect-${index + 1}`,
              sourceCardId: card.instanceId,
              sourcePlayerId: CYBERPUNK_P1,
              abilityIndex: index,
              abilityText: abilityTexts[index]!,
              cardName: card.name,
            })),
          },
        });
      }, sourceCards);

      const sheet = await waitForChoiceSheet();
      // Compact is the default render: a row of card faces with names only —
      // no stacked ability text — plus the expand toggle.
      const toggle = requiredElement<HTMLButtonElement>(
        sheet,
        '[data-testid="choice-modal-toggle-expanded"]',
      );
      expect(toggle.getAttribute("aria-label")).toBe("Switch to expanded effect list");
      expect(sheet.querySelector('[class*="triggerCompactCard"]')).not.toBeNull();
      for (const abilityText of abilityTexts) {
        expect(sheet.textContent).not.toContain(abilityText);
      }

      fireEvent.click(toggle);

      await waitFor(() => {
        const expandedSheet = requiredElement<HTMLElement>(
          document.body,
          '[data-testid="choice-modal-sheet"]',
        );
        expect(expandedSheet.querySelector('[class*="triggerCompactCard"]')).toBeNull();
        for (const abilityText of abilityTexts) {
          expect(expandedSheet.textContent).toContain(abilityText);
        }
      });
      // And the toggle flips back to compact.
      const expandedToggle = requiredElement<HTMLButtonElement>(
        document.body,
        '[data-testid="choice-modal-toggle-expanded"]',
      );
      expect(expandedToggle.getAttribute("aria-label")).toBe("Switch to compact effect list");
    } finally {
      view.unmount();
    }
  });

  test("hides the stale effect chooser while a live move awaits authoritative state", async () => {
    const { view, harness, sourceCards } = await renderPendingChoiceFixture({
      hasPendingRemoteMove: true,
    });
    try {
      await harness.dispatchEngine((engine, cards) => {
        engine.judgeSetPendingChoice({
          type: "chooseTrigger",
          chooserId: CYBERPUNK_P1,
          effectId: "pending-effects-live-sync",
          payload: {
            options: cards.map((card, index) => ({
              triggerId: `pending-effect-${index + 1}`,
              sourceCardId: card.instanceId,
              sourcePlayerId: CYBERPUNK_P1,
              abilityIndex: index,
              abilityText: "Resolve this pending effect.",
              cardName: card.name,
            })),
          },
        });
      }, sourceCards);

      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).toBeNull();
      });
    } finally {
      view.unmount();
    }
  });

  test("offers one keep-or-reroll decision for Kerry's Gig roll", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendKerryEurodyneAxeAttitudeAudienceRetail",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      const prompt = await waitFor(() =>
        requiredElement<HTMLElement>(
          document.body,
          '[data-testid="prompt-banner"][data-state="reroll-gig"]',
        ),
      );
      expect(prompt.querySelector('[data-testid="prompt-banner-title"]')?.textContent).toContain(
        "Kerry Eurodyne: Axe, Attitude, Audience",
      );
      expect(
        prompt.querySelector('[data-testid="prompt-banner-title"] [role="button"]'),
      ).not.toBeNull();
      expect(prompt.textContent).toContain("D12 rolled 6");
      expect(prompt.textContent).toContain("Reroll");
      expect(prompt.textContent).not.toContain("Choose the next effect");
      expect(
        prompt.querySelector('[data-testid="prompt-banner-toggle-board-placement"]'),
      ).not.toBeNull();
      expect(
        document.body.querySelector('[data-testid="interaction-resolution-prompt"]'),
      ).toBeNull();
      expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).toBeNull();
      const keep = requiredElement<HTMLButtonElement>(
        prompt,
        '[data-testid="prompt-keep-gig-roll"]',
      );
      fireEvent.click(keep);
      await waitFor(() => expect(prompt.isConnected).toBe(false));
    } finally {
      view.unmount();
    }
  });

  test("rerolls Kerry's Gig from the board banner without opening a target sheet", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendKerryEurodyneAxeAttitudeAudienceRetail",
      layout: "mobile",
    });
    try {
      const harness = new WindowCyberpunkHarnessClient();
      await harness.waitForReady();
      const prompt = await waitFor(() =>
        requiredElement<HTMLElement>(
          document.body,
          '[data-testid="prompt-banner"][data-state="reroll-gig"]',
        ),
      );
      const reroll = requiredElement<HTMLButtonElement>(
        prompt,
        '[data-testid="prompt-reroll-gig"]',
      );
      fireEvent.click(reroll);
      await waitFor(() => expect(prompt.isConnected).toBe(false));
      expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).toBeNull();
    } finally {
      view.unmount();
    }
  });
});

async function renderPendingChoiceFixture(
  boardProps: Parameters<typeof renderCyberpunkSimulatorScenario>[0]["boardProps"] = {},
) {
  ensureJsdomAnimationSupport();
  installResizeObserverStub();
  const view = renderCyberpunkSimulatorScenario({
    scenarioId: "retailReleaseAug2026AllCards",
    layout: "mobile",
    boardProps,
  });
  const harness = new WindowCyberpunkHarnessClient();
  await harness.waitForReady();
  await waitFor(() => requiredElement(view.container, '[data-testid="mobile-cyberpunk-board"]'));
  const sourceCards = await harness.evalEngine((engine) =>
    [
      engine.getCardsInZone("field", CYBERPUNK_P1)[0],
      engine.getCardsInZone("field", CYBERPUNK_P1)[2],
    ]
      .filter((card): card is NonNullable<typeof card> => card !== undefined)
      .map((card) => ({
        instanceId: card.instanceId,
        name: defOf(card).displayName,
      })),
  );
  expect(sourceCards).toHaveLength(2);
  return { view, harness, sourceCards };
}

async function waitForChoiceSheet() {
  return waitFor(() =>
    requiredElement<HTMLElement>(document.body, '[data-testid="choice-modal-sheet"]'),
  );
}

function installResizeObserverStub() {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
