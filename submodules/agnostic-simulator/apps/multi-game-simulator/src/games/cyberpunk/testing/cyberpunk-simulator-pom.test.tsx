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
    const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

    await pom.waitForReady();

    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-deck"]')
        ?.getAttribute("data-sim-zone-visibility"),
    ).toBe("secret");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-hand"]')
        ?.getAttribute("data-sim-zone-visibility"),
    ).toBe("private");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-field"]')
        ?.getAttribute("data-sim-zone-visibility"),
    ).toBe("public");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-trash"]')
        ?.getAttribute("data-sim-zone-role"),
    ).toBe("discard");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-pinfo"]')
        ?.getAttribute("data-sim-zone-role"),
    ).toBe("custom");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="opp-pinfo"]')
        ?.getAttribute("data-sim-zone-visibility"),
    ).toBe("public");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="p-gigs"]')
        ?.getAttribute("data-sim-zone-role"),
    ).toBe("resource");
    expect(
      view.container
        .querySelector('[data-sim-zone-id="opp-gigs"]')
        ?.getAttribute("data-sim-zone-visibility"),
    ).toBe("public");
    expect(
      view.container.querySelector('[data-sim-entity-id][data-sim-zone-id="p-hand"]'),
    ).not.toBeNull();
    expect(view.container.querySelector('[data-testid="face-down-card"][data-sim-entity-id]')).toBe(
      null,
    );
  });

  test("renders shared animation anchors on real board gig dice", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "stealGigTest" });
    const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

    await pom.waitForReady();

    expect(
      view.container.querySelector(
        '[data-testid="gig-die"][data-sim-entity-id][data-sim-zone-id="p-gigs"]',
      ),
    ).not.toBeNull();
    expect(
      view.container.querySelector(
        '[data-testid="gig-die"][data-sim-entity-id][data-sim-zone-id="opp-gigs"]',
      ),
    ).not.toBeNull();
    expect(
      view.container.querySelector(
        '[data-testid="fixer-die"][data-sim-entity-id][data-sim-zone-id="player-fixer"]',
      ),
    ).not.toBeNull();
    expect(
      view.container.querySelector(
        '[data-testid="fixer-die"][data-sim-entity-id][data-sim-zone-id="opponent-fixer"]',
      ),
    ).not.toBeNull();
  });

  test("drives mulligan decisions through the same POM without Playwright", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
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
  });
});
