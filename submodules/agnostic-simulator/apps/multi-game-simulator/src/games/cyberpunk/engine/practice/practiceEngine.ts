import {
  CyberpunkTestEngine,
  createMatchState,
  createPlayerId,
  getSafeAutomatedActionStrategyOption,
  type AIStrategy,
  type DeckList,
} from "@tcg/cyberpunk-engine";
import {
  DEFAULT_BOT_PRACTICE_DECK_ID,
  getPracticeCardCatalog,
  getPracticeDeckFixture,
} from "./deckFixtures";
import type { AISideConfig } from "../EngineProvider";
import type { PracticeMatchConfig } from "./sessionStorage";

export function createPracticeEngine(config: PracticeMatchConfig): CyberpunkTestEngine {
  const playerDeck = resolvePlayerDeck(config);
  const botDeck = resolveBotDeck(config);
  if (!playerDeck || !botDeck) {
    throw new Error("Practice match references a deck fixture that no longer exists.");
  }

  const state = createMatchState({
    players: [
      { id: createPlayerId("p1"), name: "You" },
      { id: createPlayerId("p2"), name: botDeck.name },
    ],
    catalog: getPracticeCardCatalog(),
    deckLists: [
      { ...playerDeck.deck, playerId: "p1", playerName: playerDeck.name },
      { ...botDeck.deck, playerId: "p2", playerName: botDeck.name },
    ],
    seed: config.seed,
    matchId: config.matchId,
  });

  return CyberpunkTestEngine.fromState(state, { autoGainGig: false });
}

export function createPracticeAiConfig(config: PracticeMatchConfig): AISideConfig {
  const strategy = strategyForId(config.botStrategyId);
  return { player: null, opponent: strategy };
}

function resolvePlayerDeck(
  config: PracticeMatchConfig,
): { deck: DeckList; name: string } | undefined {
  if (config.playerDeck) {
    return { deck: config.playerDeck, name: config.playerDeck.playerName || "You" };
  }
  if (!config.playerDeckFixtureId) {
    return undefined;
  }
  const fixture = getPracticeDeckFixture(config.playerDeckFixtureId);
  return fixture ? { deck: fixture.deck, name: "You" } : undefined;
}

function resolveBotDeck(config: PracticeMatchConfig): { deck: DeckList; name: string } | undefined {
  if (config.botDeck) {
    return { deck: config.botDeck, name: config.botDeck.playerName || "Bot" };
  }
  const fixture = getPracticeDeckFixture(config.botDeckFixtureId ?? DEFAULT_BOT_PRACTICE_DECK_ID);
  return fixture ? { deck: fixture.deck, name: fixture.label } : undefined;
}

function strategyForId(id: PracticeMatchConfig["botStrategyId"]): AIStrategy {
  return getSafeAutomatedActionStrategyOption(id).strategy;
}
