import {
  AIPlayer,
  LocalEngine,
  setCardRegistry,
  getAutomatedActionStrategyOption,
  withDeckProfile,
} from "@tcg/cyberpunk-engine";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { AiWorkerRequest, AiWorkerResponse } from "./ai-worker-protocol";

const catalog = new Map<string, CardDefinition>();
let player: AIPlayer | undefined;

// Each worker belongs to one seat/strategy lifetime. Keep its RNG between moves.
self.onmessage = ({ data }: MessageEvent<AiWorkerRequest>) => {
  let response: AiWorkerResponse;
  try {
    for (const definition of data.definitions) catalog.set(definition.id, definition);
    setCardRegistry(catalog);
    const engine = new LocalEngine(data.state, { combatProgression: data.combatProgression });
    if (!player) {
      const option = getAutomatedActionStrategyOption(data.strategy.id);
      if (!option) throw new Error(`Unknown bot strategy: ${data.strategy.id}`);
      const strategy = data.strategy.profile
        ? withDeckProfile(option.strategy, data.strategy.profile)
        : option.strategy;
      player = new AIPlayer(engine, data.playerId, strategy, { rngSeed: data.rngSeed });
    }
    response = { id: data.id, selection: player.decide(engine) };
  } catch (error) {
    response = { id: data.id, error: error instanceof Error ? error.message : String(error) };
  }
  self.postMessage(response);
};
