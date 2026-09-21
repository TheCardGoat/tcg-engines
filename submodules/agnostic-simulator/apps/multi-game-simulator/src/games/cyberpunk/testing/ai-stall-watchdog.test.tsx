import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CyberpunkTestEngine, firstLegalStrategy, type AIStrategy } from "@tcg/cyberpunk-engine";

import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import { CardInspectProvider } from "../components/GameBoard/CardInspectContext";
import { UserConfigProvider } from "../engine";
import { AI_STALL_FALLBACK_MS, AI_STALL_RETRY_MS } from "../engine/EngineProvider";
import { DEFAULT_SCENARIO, P2 } from "../engine/fixtures/scenarios";
import { BoardSharedPage } from "../pages/BoardShared.page";
import { theme } from "../theme";

/**
 * Regression harness for the AI stall watchdog: the bot seat must never sit
 * on a mandatory prompt forever. A thrown strategy decision used to halt the
 * auto loop permanently (lastAiError), which left the opening mulligan
 * unanswered in client-authority live matches — the rival clock drained and
 * the human had to take over the bot seat to unbrick the game.
 */

function createSetupEngine(): CyberpunkTestEngine {
  // Seed "a" makes P2 the first player: setup phase with hands drawn and the
  // opponent seat owing the opening mulligan.
  return CyberpunkTestEngine.createWithFixture(
    { deck: 40 },
    { deck: 40 },
    { seed: "a", skipSetup: false, gamePhase: "setup", autoGainGig: false },
  );
}

function renderAutoBoard(options: {
  opponentStrategy: AIStrategy;
  onLocalCommandCommitted?: (commit: unknown) => void;
}) {
  const engine = createSetupEngine();
  const commits = options.onLocalCommandCommitted;
  render(
    <UserConfigProvider>
      <MantineProvider theme={theme} env="test">
        <Notifications position="top-right" />
        <CardInspectProvider>
          <CardPreviewProvider>
            <BoardSharedPage
              scenarioId={DEFAULT_SCENARIO}
              initialEngineBuilder={() => engine}
              initialAi={{ player: null, opponent: options.opponentStrategy }}
              initialHumanSide="player"
              initialAiMode="auto"
              initialAiSpeed="fast"
              autoResolveSingletonCardTargets={false}
              onLocalCommandCommitted={commits}
            />
          </CardPreviewProvider>
        </CardInspectProvider>
      </MantineProvider>
    </UserConfigProvider>,
  );
  return engine;
}

describe("cyberpunk AI stall watchdog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("answers the opening mulligan when the strategy keeps throwing", () => {
    const commits: unknown[] = [];
    const engine = renderAutoBoard({
      opponentStrategy: {
        name: "always-throws",
        decideAction: () => {
          throw new Error("synthetic strategy failure");
        },
      },
      onLocalCommandCommitted: (commit) => commits.push(commit),
    });

    // The first auto step throws and halts the loop; inside the grace window
    // the mulligan is still open.
    act(() => {
      vi.advanceTimersByTime(AI_STALL_RETRY_MS - 1);
    });
    expect(engine.getState().G.players[P2]?.mulliganDone).not.toBe(true);

    // Forced retries then the safe fallback keep the game alive: the
    // watchdog answers with keepHand through the standard commit pipeline.
    act(() => {
      vi.advanceTimersByTime(AI_STALL_FALLBACK_MS + 5_000);
    });
    expect(engine.getState().G.players[P2]?.mulliganDone).toBe(true);
    expect(commits.length).toBeGreaterThan(0);
  });

  it("resumes normal stepping after a transient strategy failure", () => {
    let calls = 0;
    const engine = renderAutoBoard({
      opponentStrategy: {
        name: "flaky",
        decideAction: (ctx) => {
          calls += 1;
          if (calls === 1) {
            throw new Error("transient failure");
          }
          return firstLegalStrategy.decideAction(ctx);
        },
      },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(engine.getState().G.players[P2]?.mulliganDone).not.toBe(true);
    expect(calls).toBe(1);

    // The watchdog's forced retry re-runs the strategy, which now succeeds.
    act(() => {
      vi.advanceTimersByTime(AI_STALL_RETRY_MS + 2_000);
    });
    expect(engine.getState().G.players[P2]?.mulliganDone).toBe(true);
    expect(calls).toBeGreaterThanOrEqual(2);
  });

  it("never forces a step inside the normal pacing window", () => {
    let calls = 0;
    const engine = renderAutoBoard({
      opponentStrategy: {
        name: "counting",
        decideAction: (ctx) => {
          calls += 1;
          return firstLegalStrategy.decideAction(ctx);
        },
      },
    });

    act(() => {
      vi.advanceTimersByTime(AI_STALL_RETRY_MS - 1);
    });
    // Healthy stepping: the strategy resolved the mulligan on its own well
    // before any watchdog intervention (forced === 0).
    expect(engine.getState().G.players[P2]?.mulliganDone).toBe(true);
    expect(calls).toBe(1);
  });
});
