// @vitest-environment jsdom

import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../testing/render-cyberpunk-simulator";

describe("board payment selection", () => {
  afterEach(() => cleanup());

  test("clicking a ready Eddie commits manual payment without a dialog", async () => {
    ensureBrowserSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "boardTappedResourcesQa" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const lucyna = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        promoLucynaKushinada.id,
      );

      fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
      fireEvent.click(screen.getByRole("menuitem", { name: "Choose payment for next cost" }));
      fireEvent.click(
        view.container.querySelector<HTMLElement>(
          `[data-testid="card"][data-instance-id="${lucyna.instanceId}"]`,
        )!,
      );

      expect(await screen.findByRole("region", { name: "Choose payment" })).toBeTruthy();
      expect(screen.queryByRole("dialog", { name: /Choose payment/ })).toBeNull();

      const eddieSource = await waitFor(() => {
        const source = view.container.querySelector<HTMLElement>(
          '[data-payment-source="true"][data-resource-state="ready"]',
        );
        expect(source).toBeTruthy();
        return source!;
      });
      const sourceId = eddieSource.getAttribute("data-instance-id");
      expect(sourceId).toBeTruthy();
      fireEvent.click(eddieSource.querySelector("button")!);

      await waitFor(() => {
        expect(screen.queryByRole("region", { name: "Choose payment" })).toBeNull();
        expect(
          view.container
            .querySelector(`[data-instance-id="${sourceId}"]`)
            ?.getAttribute("data-spent"),
        ).toBe("true");
        expect(
          view.container
            .querySelector(`[data-instance-id="${lucyna.instanceId}"]`)
            ?.getAttribute("data-face-down"),
        ).toBe("false");
      });
    } finally {
      view.unmount();
    }
  });
});

function ensureBrowserSupport() {
  ensureJsdomAnimationSupport();
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
