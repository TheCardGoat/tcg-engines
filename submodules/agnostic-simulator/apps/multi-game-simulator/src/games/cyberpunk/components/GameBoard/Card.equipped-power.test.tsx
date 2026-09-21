// @vitest-environment jsdom
import { cleanup, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

describe("Cyberpunk equipped power visual fixture", () => {
  afterEach(cleanup);

  test("shows V at 8 power with exactly one +2 Dying Night contribution", async () => {
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
      scenarioId: "legendVStreetkidEquippedPower",
    });

    const v = await waitFor(() => {
      const card = view.container.querySelector(
        '[data-testid="card"][data-card-name="V: Streetkid"][data-definition-id="81a8dec7-9541-4020-93e1-7d798a57dcbc"]',
      );
      expect(card).not.toBeNull();
      return card!;
    });
    expect(v?.getAttribute("data-power")).toBe("8");
    expect(v?.getAttribute("data-effective-power")).toBe("8");
    expect(v?.getAttribute("data-gear-count")).toBe("1");

    expect(screen.getByLabelText("6 printed power, 8 current power")).not.toBeNull();
    expect(screen.getByLabelText("Power effects").textContent).toContain(
      "+2Dying Night: V's Pistol",
    );
  });
});
