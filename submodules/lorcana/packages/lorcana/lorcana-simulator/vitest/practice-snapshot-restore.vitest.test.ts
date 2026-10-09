// @vitest-environment jsdom
import { expect, test, vi } from "vite-plus/test";
import {
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  LorcanaServer,
  getLorcanaServerAuthoritativeSnapshot,
} from "@tcg/lorcana-engine";
import { HumanVsAiOrchestrator } from "../src/lib/features/simulator-devtools/vs-ai/human-vs-ai-orchestrator.svelte.js";
import { PracticeMatchOrchestrator } from "../src/lib/features/practice-match/practice-match-orchestrator.svelte.js";
import {
  steelSapphireMidrange,
  steelSapphireAggressive,
} from "../src/lib/features/simulator-devtools/deck-fixtures/index.js";
import type { GatewayTransportClient } from "../src/lib/features/gateway/gateway-transport.js";

vi.mock("$env/dynamic/public", () => ({ env: {} }));

test("restores a saved practice board without the original local deck settings", async () => {
  const original = await HumanVsAiOrchestrator.create({
    playerOneDeckText: steelSapphireMidrange.cards,
    playerTwoDeckText: steelSapphireAggressive.cards,
    seed: "practice-registry-restore",
    strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
    initialAiPlayMode: "step",
  });
  if (!(original.server instanceof LorcanaServer)) throw new Error("Expected authoritative server");
  const snapshot = getLorcanaServerAuthoritativeSnapshot(original.server, original.cardsMaps);
  const gateway: GatewayTransportClient = {
    send: () => true,
    sendWithAck: async () => undefined,
    addGameMessageListener: () => () => {},
    addStatusChangeListener: () => () => {},
  };
  try {
    const restored = await PracticeMatchOrchestrator.create({
      gameId: "platform-practice",
      playerId: "human",
      botPlayerId: "bot",
      gateway,
      deckConfig: {
        seed: "different-local-default",
        strategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
        playerOneDeckText: "",
        playerTwoDeckText: "",
        initialAiPlayMode: "step",
      },
      restoredSnapshot: snapshot,
      restoredVersion: 3,
    });
    try {
      expect(() => restored.readModel.getBoard("playerOne")).not.toThrow();
      expect(() => restored.readModel.getBoard("playerTwo")).not.toThrow();
      expect(restored.orchestrator.cardsMaps).toEqual(snapshot.cardsMaps);
      expect(restored.currentEngine.chooseFirstPlayer("player_one").success).toBe(true);
      expect(restored.readModel.getBoard("playerOne").players.player_one?.hand).toHaveLength(7);
    } finally {
      restored.dispose();
    }
  } finally {
    original.dispose();
  }
});
