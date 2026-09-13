// @vitest-environment jsdom

import { fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { installBrowserShims } from "../../../testing/browser-shims";
import { renderFabSimulatorScenario, type FabSimulatorRender } from "./render-fab-simulator";

const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const originalMotionSetting = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;

describe("FAB nonblocking phase and turn announcements", () => {
  let session: FabSimulatorRender | null = null;

  beforeEach(() => {
    installBrowserShims();
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
  });

  afterEach(() => {
    session?.unmount();
    session = null;
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = originalMotionSetting;
    vi.restoreAllMocks();
  });

  it("keeps the current combat-step plaque visible without holding priority actions", async () => {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open" });
    const game = session.pom;
    await game.waitForReady();

    await game.as("player-1").play("Snatch", { target: "player-2" });

    await vi.waitFor(() => {
      expect(document.querySelector('[data-animation-overlay="phase-change"]')).not.toBeNull();
    });
    await vi.waitFor(
      () => {
        expect(
          document.querySelector('[data-animation-interaction-boundary][aria-busy="true"]'),
        ).toBeNull();
      },
      { timeout: 3_000 },
    );

    expect(document.querySelector('[data-animation-overlay="phase-change"]')).not.toBeNull();
    expect(await game.humanCanPass()).toBe(true);
  }, 15_000);

  it("keeps the turn plaque visible after end-of-turn card movement settles", async () => {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open", search: "ai=off" });
    const game = session.pom;
    await game.waitForReady();

    await game.endActionPhase("player-1");
    const arsenalPrompt = await screen.findByTestId("interaction-resolution-prompt");
    fireEvent.click(within(arsenalPrompt).getByRole("button", { name: "Choose none" }));

    await vi.waitFor(
      () => {
        expect(
          document
            .querySelector('[data-animation-overlay="phase-change"]')
            ?.getAttribute("data-animation-variant"),
        ).toBe("turn");
      },
      { timeout: 3_000 },
    );
    await vi.waitFor(
      () => {
        expect(
          document.querySelector('[data-animation-interaction-boundary][aria-busy="true"]'),
        ).toBeNull();
      },
      { timeout: 3_000 },
    );

    expect(
      document
        .querySelector('[data-animation-overlay="phase-change"]')
        ?.getAttribute("data-animation-variant"),
    ).toBe("turn");
  }, 15_000);
});
