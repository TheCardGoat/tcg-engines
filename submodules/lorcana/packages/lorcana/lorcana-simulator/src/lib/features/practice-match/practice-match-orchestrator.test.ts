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
      gateway: gateway as GatewayClientStore,
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

  it("waits for durable processing confirmation before completing the flush", async () => {
    let resolveResponse: (() => void) | undefined;
    const response = new Promise<void>((resolve) => {
      resolveResponse = resolve;
    });
    const send = mock((_message: object) => true);
    const sendWithAck = mock((_message: object, _timeoutMs?: number) => response);
    const gameId = "practice-match-final-flush";
    const orchestrator = await createOrchestrator(
      { send, sendWithAck } as unknown as Partial<GatewayClientStore>,
      gameId,
    );

    try {
      let completed = false;
      const flush = orchestrator.flushPendingState("return").then(() => {
        completed = true;
      });

      expect(sendWithAck).toHaveBeenCalledTimes(1);
      expect(sendWithAck.mock.calls[0]?.[0]).toMatchObject({
        type: "push_state",
        gameId,
        moveType: "return",
      });
      expect(sendWithAck.mock.calls[0]?.[1]).toBe(3_000);
      await Bun.sleep(0);
      expect(completed).toBe(false);

      resolveResponse?.();
      await flush;
      expect(completed).toBe(true);
      expect(send).not.toHaveBeenCalled();
    } finally {
      orchestrator.dispose();
    }
  });

  it("still flushes a terminal snapshot after the debounce already sent", async () => {
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
      await Bun.sleep(125);
      expect(send).toHaveBeenCalledTimes(1);

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

      await orchestrator.flushPendingState("return");

      expect(sendWithAck).toHaveBeenCalledTimes(1);
      expect(sendWithAck.mock.calls[0]?.[0]).toMatchObject({
        type: "push_state",
        moveType: "return",
      });
    } finally {
      orchestrator.dispose();
    }
  });

  it("does not reject navigation when confirmation times out", async () => {
    const sendWithAck = mock(async (_message: object, _timeoutMs?: number) => {
      throw "timeout";
    });
    const orchestrator = await createOrchestrator(
      { send: mock(() => true), sendWithAck } as unknown as Partial<GatewayClientStore>,
      "practice-match-timeout",
    );

    try {
      await expect(orchestrator.flushPendingState("return")).resolves.toBeUndefined();
      expect(sendWithAck).toHaveBeenCalledTimes(1);
    } finally {
      orchestrator.dispose();
    }
  });
});
