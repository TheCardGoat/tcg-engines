import { DEFAULT_AUTOMATED_ACTION_STRATEGY_ID } from "@tcg/lorcana-engine";
import { describe, expect, it, mock } from "bun:test";
import type { GatewayClientStore } from "../gateway/gateway-client.svelte.js";
import {
  steelSapphireAggressive,
  steelSapphireMidrange,
} from "../simulator-devtools/deck-fixtures/index.js";
import { PracticeMatchOrchestrator } from "./practice-match-orchestrator.svelte.js";

describe("PracticeMatchOrchestrator", () => {
  async function createOrchestrator(gateway: Partial<GatewayClientStore>, gameId: string) {
    return PracticeMatchOrchestrator.create({
      gameId,
      playerId: "human-profile",
      botPlayerId: "bot-profile",
      gateway: {
        // The orchestrator registers a stale-rejection listener on every
        // client-authority gateway; tests override only the push methods
        // they assert on.
        addGameMessageListener: mock(
          (_handler: Parameters<GatewayClientStore["addGameMessageListener"]>[0]) => () => {},
        ),
        ...gateway,
      } as GatewayClientStore,
      authority: "client",
      deckConfig: {
        playerOneDeckText: steelSapphireMidrange.cards,
        playerTwoDeckText: steelSapphireAggressive.cards,
        playerOneFixtureId: steelSapphireMidrange.id,
        playerTwoFixtureId: steelSapphireAggressive.id,
        strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        seed: gameId,
        initialAiPlayMode: "step",
      },
    });
  }

  it("persists the immutable initial snapshot when flush races startup", async () => {
    const send = mock((_message: object) => true);
    const sendWithAck = mock(async (_message: object, _timeoutMs?: number) => undefined);
    const gameId = "practice-match-final-flush";
    const orchestrator = await createOrchestrator(
      { send, sendWithAck } as unknown as Partial<GatewayClientStore>,
      gameId,
    );

    try {
      await orchestrator.flushPendingState("return");

      expect(sendWithAck).toHaveBeenCalledTimes(1);
      expect(sendWithAck.mock.calls[0]?.[0]).toMatchObject({
        type: "push_state",
        gameId,
        moveType: "init",
        version: 0,
        expectedVersion: null,
      });
      expect(send).not.toHaveBeenCalled();
    } finally {
      orchestrator.dispose();
    }
  });

  it("does not re-push on a terminal flush when every snapshot is already durable", async () => {
    const send = mock((_message: object) => true);
    const sendWithAck = mock(async (_message: object, _timeoutMs?: number) => ({
      type: "push_state:response",
      correlationId: "c_push",
      status: "ok",
      data: {
        gameId: "practice-match-post-debounce",
        stateVersion: 0,
        matchId: "match-1",
        matchCompleted: true,
      },
    }));
    const orchestrator = await createOrchestrator(
      { send, sendWithAck } as unknown as Partial<GatewayClientStore>,
      "practice-match-post-debounce",
    );

    try {
      await Bun.sleep(150);
      expect(sendWithAck).toHaveBeenCalledTimes(1);

      const server = orchestrator.orchestrator.server;
      const originalGetState = server.getState.bind(server);
      server.getState = (() => {
        const state = originalGetState();
        return {
          ...state,
          ctx: {
            ...state.ctx,
            status: { ...state.ctx.status, gameEnded: true },
          },
        };
      }) as typeof server.getState;

      // The runtime only accepts forward-only versions, so a flush with no
      // unpersisted moves must not re-send the already-durable snapshot —
      // the repeat would only bounce as rejected_stale.
      await expect(orchestrator.flushPendingState("return")).resolves.toBeUndefined();
      expect(sendWithAck).toHaveBeenCalledTimes(1);
      expect(send).not.toHaveBeenCalled();
    } finally {
      orchestrator.dispose();
    }
  });

  it("does not reject navigation when a terminal confirmation times out", async () => {
    const sendWithAck = mock(async (_message: object, _timeoutMs?: number) => {
      if (sendWithAck.mock.calls.length > 1) throw "timeout";
      return undefined;
    });
    const orchestrator = await createOrchestrator(
      { send: mock(() => true), sendWithAck } as unknown as Partial<GatewayClientStore>,
      "practice-match-timeout",
    );

    try {
      await Bun.sleep(150);
      expect(sendWithAck).toHaveBeenCalledTimes(1);

      // Unpersisted moves arm the flush while the move debounce is still
      // pending, so flushPendingState is what carries them — and its awaited
      // acknowledgement times out. stepAi() no-ops before the AI is the
      // active actor, so drive the current actor's automated action instead.
      const playbackServer = orchestrator.orchestrator.server;
      const actorId = playbackServer.getCurrentActorId()!;
      const strategy = playbackServer.resolveAutomatedActionStrategyForPlayer(
        DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        actorId,
      )!;
      playbackServer.takeAutomatedActionForCurrentActor({ strategy: strategy.strategy });
      await expect(orchestrator.flushPendingState("return")).resolves.toBeUndefined();
      expect(sendWithAck).toHaveBeenCalledTimes(2);
    } finally {
      orchestrator.dispose();
    }
  });

  it("retries the initial snapshot after a disconnected acknowledgement", async () => {
    const sendWithAck = mock(async (_message: object, _timeoutMs?: number) => {
      if (sendWithAck.mock.calls.length === 1) throw "disconnected";
      return undefined;
    });
    const orchestrator = await createOrchestrator(
      { send: mock(() => true), sendWithAck } as unknown as Partial<GatewayClientStore>,
      "practice-match-retry-initial-state",
    );

    try {
      await Bun.sleep(250);
      expect(sendWithAck).toHaveBeenCalledTimes(2);
      expect(sendWithAck.mock.calls[0]?.[0]).toMatchObject({
        type: "push_state",
        version: 0,
        expectedVersion: null,
        moveType: "init",
      });
      expect(sendWithAck.mock.calls[1]?.[0]).toMatchObject({
        type: "push_state",
        version: 0,
        expectedVersion: null,
        moveType: "init",
      });
    } finally {
      orchestrator.dispose();
    }
  });
});
