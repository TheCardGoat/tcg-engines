// @vitest-environment jsdom
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailDeadmanTransmitter,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("regressionRedirectDefeatChoice fixture", () => {
  test("shows the replacement decision to Jackie’s controller", async () => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };
    window.matchMedia ??= (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionRedirectDefeatChoice",
      initialHumanSide: "player",
    });
    try {
      await waitFor(() => {
        expect(screen.getByText("Redirect this defeat?")).toBeTruthy();
      });
      expect(screen.getByRole("button", { name: "Spend 1 €$" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Let the Unit be defeated" })).toBeTruthy();
      expect(screen.queryByText("Choosing a replacement")).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("uses the screenshot's passive narration for the rival only", async () => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };
    window.matchMedia ??= (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionRedirectDefeatChoice",
      initialHumanSide: "opponent",
    });
    try {
      await waitFor(() => {
        expect(screen.getByText("Choosing a replacement")).toBeTruthy();
      });
      expect(screen.getByText("Waiting for opponent")).toBeTruthy();
      expect(screen.queryByRole("button", { name: "Spend 1 €$" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Let the Unit be defeated" })).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("resolves the same controls for a Program defeat and resumes the Program", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionCardEffectRedirectDefeatChoice",
      initialHumanSide: "player",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await waitFor(() => expect(screen.getByText("Redirect this defeat?")).toBeTruthy());

      fireEvent.click(screen.getByRole("button", { name: "Spend 1 €$" }));

      await waitFor(async () => {
        const field = await pom.getCardsInZone("field", CYBERPUNK_P1);
        const legends = await pom.getCardsInZone("legendArea", CYBERPUNK_P1);
        const trash = await pom.getCardsInZone("trash", CYBERPUNK_P2);
        expect(field.map((card) => card.definitionId)).toContain(
          welcomeToNightCityRetailFieldOperator.id,
        );
        expect(legends.map((card) => card.definitionId)).not.toContain(
          welcomeToNightCityRetailJackieWellesMamaSFavorite.id,
        );
        expect(trash.map((card) => card.definitionId)).toContain(
          welcomeToNightCityRetailWildInTheStreets.id,
        );
      });
      expect(screen.queryByText("Redirect this defeat?")).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("renders and resolves a mandatory Gear choice during a Program defeat", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionCardEffectSacrificialGearChoice",
      initialHumanSide: "player",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await waitFor(() => {
        expect(
          screen.getByText("Choose which attached Gear is defeated instead of this Unit"),
        ).toBeTruthy();
      });
      const choices = view.container.querySelectorAll<HTMLElement>(
        '[data-choice-eligible="true"][data-card-id]',
      );
      expect(choices).toHaveLength(2);
      fireEvent.click(choices[1]!);

      await waitFor(async () => {
        const field = await pom.getCardsInZone("field", CYBERPUNK_P1);
        const trash = await pom.getCardsInZone("trash", CYBERPUNK_P1);
        const rivalTrash = await pom.getCardsInZone("trash", CYBERPUNK_P2);
        expect(field.map((card) => card.definitionId)).toContain(
          welcomeToNightCityRetailFieldOperator.id,
        );
        expect(
          trash.filter(
            (card) => card.definitionId === welcomeToNightCityRetailDeadmanTransmitter.id,
          ),
        ).toHaveLength(1);
        expect(rivalTrash.map((card) => card.definitionId)).toContain(
          welcomeToNightCityRetailWildInTheStreets.id,
        );
      });
    } finally {
      view.unmount();
    }
  });
});
