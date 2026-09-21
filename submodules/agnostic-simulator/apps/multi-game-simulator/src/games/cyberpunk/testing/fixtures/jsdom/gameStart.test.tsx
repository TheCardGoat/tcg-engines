import { describe, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

function renderGameStartPom() {
  ensureJsdomAnimationSupport();
  const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
  const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
  return { pom, container: view.container, unmount: () => view.unmount() };
}

interface ExpectedMulliganStats {
  counted: number;
  hidden: number;
  low: number;
  mid: number;
  high: number;
  units: number;
  sellable: number;
}

/**
 * Derive the expected mulligan summary from the rendered hand cards
 * themselves (their `data-cost` / `data-card-type` / `data-has-sell-tag`
 * attributes), so the assertion is independent of the fixture's shuffled
 * deck. Face-down hand cards carry no identity attributes and count as
 * hidden.
 */
function expectedMulliganStats(container: HTMLElement, side: string): ExpectedMulliganStats {
  const zone = container.querySelector(
    `[data-testid="hand-zone"][data-side=${JSON.stringify(side)}]`,
  );
  if (!zone) {
    throw new Error(`No hand zone rendered for side ${side}`);
  }
  const expected: ExpectedMulliganStats = {
    counted: 0,
    hidden: 0,
    low: 0,
    mid: 0,
    high: 0,
    units: 0,
    sellable: 0,
  };
  for (const card of zone.querySelectorAll('[data-testid="hand-card"]')) {
    const cardType = card.getAttribute("data-card-type");
    if (card.getAttribute("data-card-id") === null || cardType === null) {
      expected.hidden += 1;
      continue;
    }
    expected.counted += 1;
    const cost = card.getAttribute("data-cost");
    if (cost === null) continue;
    const costNumber = Number(cost);
    if (costNumber <= 2) expected.low += 1;
    else if (costNumber <= 5) expected.mid += 1;
    else expected.high += 1;
    if (cardType === "unit") expected.units += 1;
    if (card.getAttribute("data-has-sell-tag") === "true") expected.sellable += 1;
  }
  return expected;
}

function expectStripMatches(strip: Element, expected: ExpectedMulliganStats): void {
  const actual = {
    counted: strip.getAttribute("data-counted"),
    hidden: strip.getAttribute("data-hidden"),
    low: strip.getAttribute("data-low"),
    mid: strip.getAttribute("data-mid"),
    high: strip.getAttribute("data-high"),
    units: strip.getAttribute("data-units"),
    sellable: strip.getAttribute("data-sellable"),
  };
  expectEqual("mulligan stats counted", actual.counted, `${expected.counted}`);
  expectEqual("mulligan stats hidden", actual.hidden, `${expected.hidden}`);
  expectEqual("mulligan stats low curve", actual.low, `${expected.low}`);
  expectEqual("mulligan stats mid curve", actual.mid, `${expected.mid}`);
  expectEqual("mulligan stats high curve", actual.high, `${expected.high}`);
  expectEqual("mulligan stats units", actual.units, `${expected.units}`);
  expectEqual("mulligan stats sellable", actual.sellable, `${expected.sellable}`);
}

describe("gameStart fixture behavior", () => {
  test("starts both players in setup with six cards, private legends, fixer dice, and no gigs", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      expectEqual("initial phase", await pom.getPhase(), "setup");

      for (const player of [CYBERPUNK_P1, CYBERPUNK_P2]) {
        await pom.expectHandSize(player, 6);
        await pom.expectFaceDownLegendsCount(player, 3);
        await pom.expectFixerDiceCount(player, 6);
        await pom.expectGigCount(player, 0);
        expectEqual("setup eddies", await pom.getEddies(player), 0);
      }
    } finally {
      unmount();
    }
  });

  test("first player mulligans their hand and the game stays in setup for the second player", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      const first = await pom.getActivePlayerId();

      await pom.clearDispatchLog();
      await pom.mulligan(first);

      await pom.expectLastDispatch({ type: "mulligan", as: first });
      await pom.expectHandSize(first, 6);
      expectEqual("phase after first mulligan", await pom.getPhase(), "setup");
    } finally {
      unmount();
    }
  });

  test("second player keeps their hand and the game advances to the start phase", async () => {
    const { pom, unmount } = renderGameStartPom();
    try {
      const first = await pom.getActivePlayerId();
      const second = await pom.getOpponentOf(first);

      await pom.mulligan(first);
      await pom.clearDispatchLog();
      await pom.keepHand(second);

      await pom.expectLastDispatch({ type: "keepHand", as: second });
      expectEqual("phase after setup choices", await pom.getPhase(), "start");
      await pom.expectHandSize(first, 7);
      await pom.expectHandSize(second, 6);
      await pom.expectFaceDownLegendsCount(first, 3);
      await pom.expectFaceDownLegendsCount(second, 3);
    } finally {
      unmount();
    }
  });

  test("mulligan prompt summarizes the opening hand curve, units, and sellable cards", async () => {
    const { pom, container, unmount } = renderGameStartPom();
    try {
      expectEqual("initial phase", await pom.getPhase(), "setup");

      const banner = container.querySelector(
        '[data-testid="prompt-banner"][data-side="player"][data-state="mulligan"]',
      );
      if (!banner) {
        throw new Error("Player prompt banner is not in the mulligan state during setup");
      }
      const strip = banner.querySelector('[data-testid="prompt-mulligan-stats"]');
      if (!strip) {
        throw new Error("Mulligan prompt is missing the opening-hand stats strip");
      }
      expectStripMatches(strip, expectedMulliganStats(container, "player"));

      // The rival's prompt must never summarize their face-down hand.
      const rivalBanner = container.querySelector(
        '[data-testid="prompt-banner"][data-side="opponent"][data-state="mulligan"]',
      );
      if (rivalBanner) {
        const rivalStrip = rivalBanner.querySelector('[data-testid="prompt-mulligan-stats"]');
        if (rivalStrip) {
          expectStripMatches(rivalStrip, {
            counted: 0,
            hidden: 6,
            low: 0,
            mid: 0,
            high: 0,
            units: 0,
            sellable: 0,
          });
        }
      }

      const first = await pom.getActivePlayerId();
      const second = await pom.getOpponentOf(first);
      await pom.mulligan(first);
      await pom.keepHand(second);

      expectEqual("phase after setup choices", await pom.getPhase(), "start");
      if (container.querySelector('[data-testid="prompt-mulligan-stats"]')) {
        throw new Error("Mulligan stats strip outlived the setup phase");
      }
    } finally {
      unmount();
    }
  });
});
