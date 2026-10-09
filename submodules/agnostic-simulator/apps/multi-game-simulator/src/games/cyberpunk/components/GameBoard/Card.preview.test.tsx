// @vitest-environment jsdom
import { cleanup, fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

function setHoverCapability(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: /any-hover: hover|\(hover: hover\)/.test(query) ? matches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function installResizeObserverStub() {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

describe("Cyberpunk face-up legend hover preview", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
  });

  test("shows the global preview while hovering a face-up legend", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();
    setHoverCapability(true);
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendVCorporateExile" });
    const legend = view.container.querySelector(
      '[data-testid="legend-slot"][data-face-down="false"] [data-testid="card"]',
    );
    expect(legend).not.toBeNull();

    fireEvent.mouseEnter(legend!);
    // The preview must show the hovered legend's own art: a SECOND img with
    // the legend's name appears while hovering (the first is the legend slot).
    await waitFor(() => {
      const artCount = [...document.body.querySelectorAll("img")].filter((img) =>
        (img.getAttribute("aria-label") ?? img.getAttribute("alt") ?? "").includes(
          "Corporate Exile",
        ),
      ).length;
      expect(artCount).toBeGreaterThan(1);
    });
  });
});
