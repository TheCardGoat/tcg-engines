import {
  GundamTestEngine,
  type TestInitialState,
} from "../../src/testing/gundam-test-engine";

type GameStartScenarioOptions = {
  playerOneHandSize?: number;
  playerTwoHandSize?: number;
  playerOneShields?: number;
  playerTwoShields?: number;
};

/**
 * Build a game start scenario with proper initial setup
 * Following rules from LLM-RULES Section 5 (Preparing to Play)
 */
export const buildGameStartScenario = (
  options: GameStartScenarioOptions = {},
): GundamTestEngine => {
  const {
    playerOneHandSize = 5,
    playerTwoHandSize = 5,
    playerOneShields = 6,
    playerTwoShields = 6,
  } = options;

  return new GundamTestEngine(
    {
      hand: playerOneHandSize,
      shieldSection: playerOneShields,
      deck: 50 - playerOneHandSize - playerOneShields,
      resourceDeck: 10,
    },
    {
      hand: playerTwoHandSize,
      shieldSection: playerTwoShields,
      deck: 50 - playerTwoHandSize - playerTwoShields,
      resourceDeck: 10,
    },
    {
      skipPreGame: false,
    },
  );
};

type CombatScenarioOptions = {
  attackerCount: number;
  defenderCount: number;
  attackerResources?: number;
  defenderResources?: number;
};

type CombatScenarioResult = {
  engine: GundamTestEngine;
  attackerUnits: string[];
  defenderUnits: string[];
};

/**
 * Build a combat scenario with units in battle area
 * Following rules from LLM-RULES Section 7 (Combat)
 */
export const buildCombatScenario = (
  options: CombatScenarioOptions,
): CombatScenarioResult => {
  const {
    attackerCount,
    defenderCount,
    attackerResources = 10,
    defenderResources = 10,
  } = options;

  const engine = new GundamTestEngine(
    {
      battleArea: attackerCount,
      resourceArea: attackerResources,
      deck: 30,
      resourceDeck: 10 - attackerResources,
    },
    {
      battleArea: defenderCount,
      resourceArea: defenderResources,
      deck: 30,
      resourceDeck: 10 - defenderResources,
    },
  );

  const attackerUnits = engine.getZone("battleArea", "player_one");
  const defenderUnits = engine.getZone("battleArea", "player_two");

  return {
    engine,
    attackerUnits,
    defenderUnits,
  };
};

type ResourceScenarioOptions = {
  playerOneResources: number;
  playerTwoResources: number;
};

/**
 * Build a scenario with specified resource counts
 * Following rules from LLM-RULES Section 9 (Resource System)
 */
export const buildResourceScenario = (
  options: ResourceScenarioOptions,
): GundamTestEngine => {
  const { playerOneResources, playerTwoResources } = options;

  // Ensure resource counts don't exceed limits
  const p1Resources = Math.min(playerOneResources, 15);
  const p2Resources = Math.min(playerTwoResources, 15);

  return new GundamTestEngine(
    {
      resourceArea: p1Resources,
      resourceDeck: Math.max(0, 10 - p1Resources),
      deck: 30,
    },
    {
      resourceArea: p2Resources,
      resourceDeck: Math.max(0, 10 - p2Resources),
      deck: 30,
    },
  );
};

type DeckConstructionScenarioOptions = {
  deckSize: number;
  resourceDeckSize: number;
};

type DeckConstructionScenarioResult = {
  engine: GundamTestEngine;
  playerOneDeck: string[];
  playerOneResourceDeck: string[];
};

/**
 * Build a scenario for testing deck construction rules
 * Following rules from LLM-RULES Section 5 (Preparing to Play)
 */
export const buildDeckConstructionScenario = (
  options: DeckConstructionScenarioOptions,
): DeckConstructionScenarioResult => {
  const { deckSize, resourceDeckSize } = options;

  const engine = new GundamTestEngine(
    {
      deck: deckSize,
      resourceDeck: resourceDeckSize,
    },
    {
      deck: 50,
      resourceDeck: 10,
    },
    {
      skipPreGame: false,
    },
  );

  const playerOneDeck = engine.getZone("deck", "player_one");
  const playerOneResourceDeck = engine.getZone("resourceDeck", "player_one");

  return {
    engine,
    playerOneDeck,
    playerOneResourceDeck,
  };
};
