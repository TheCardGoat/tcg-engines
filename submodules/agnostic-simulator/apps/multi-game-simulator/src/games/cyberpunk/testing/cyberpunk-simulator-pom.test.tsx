import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "./render-cyberpunk-simulator";

describe("CyberpunkSimulatorPom jsdom driver", () => {
  test("renders shared animation anchors on real board zones and visible cards", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

      await pom.waitForReady();

      const zones = [
        "p-deck",
        "p-hand",
        "p-field",
        "p-trash",
        "p-legendArea",
        "opp-legendArea",
        "p-gigArea",
        "opp-gigArea",
      ] as const;
      for (const zoneId of zones) {
        expect(
          view.container.querySelector(`[data-zone-id="${zoneId}"]`),
          `expected zone ${zoneId} to be rendered`,
        ).not.toBeNull();
      }
      expect(
        view.container.querySelector('[data-zone-id="p-hand"] [data-entity-id]'),
      ).not.toBeNull();
      expect(
        view.container.querySelector('[data-testid="card"][data-face="hidden"][data-entity-id]'),
      ).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("renders shared animation anchors on real board gig dice", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "stealGigTest" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

      await pom.waitForReady();

      expect(
        view.container.querySelector(
          '[data-zone-id="p-gigArea"] [data-testid="card"][data-card-kind="die"][data-entity-id]',
        ),
      ).not.toBeNull();
      expect(
        view.container.querySelector(
          '[data-zone-id="opp-gigArea"] [data-testid="card"][data-card-kind="die"][data-entity-id]',
        ),
      ).not.toBeNull();
      expect(
        view.container.querySelector(
          '[data-zone-id="p-fixer"] [data-testid="card"][data-card-kind="die"][data-entity-id]',
        ),
      ).not.toBeNull();
      expect(
        view.container.querySelector(
          '[data-zone-id="opp-fixer"] [data-testid="card"][data-card-kind="die"][data-entity-id]',
        ),
      ).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("drives mulligan decisions through the same POM without Playwright", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

      await pom.waitForReady();
      const first = await pom.getActivePlayerId();
      const second = await pom.getOpponentOf(first);

      expect(await pom.getPhase()).toBe("setup");
      await pom.expectHandSize(first, 6);
      await pom.expectHandSize(second, 6);

      await pom.clearDispatchLog();
      await pom.mulligan(first);
      await pom.expectLastDispatch({ type: "mulligan", as: first });

      await pom.mulligan(second);
      await pom.expectLastDispatch({ type: "mulligan", as: second });

      expect(await pom.getPhase()).toBe("start");
      await pom.expectHandSize(first, 7);
    } finally {
      view.unmount();
    }
  });
});
