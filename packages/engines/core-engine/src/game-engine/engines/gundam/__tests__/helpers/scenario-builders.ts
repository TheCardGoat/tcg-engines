import { GundamTestEngine } from "../../src/testing/gundam-test-engine";

/**
 * Options for configuring game start scenario
 */
type GameStartScenarioOptions = {
  /** Number of cards in player one's starting hand (default: 5) */
  playerOneHandSize?: number;
  /** Number of cards in player two's starting hand (default: 5) */
  playerTwoHandSize?: number;
  /** Number of shields for player one (default: 6) */
  playerOneShields?: number;
  /** Number of shields for player two (default: 6) */
  playerTwoShields?: number;
};

/**
 * Build a game start scenario with proper initial setup.
 *
 * Creates a GundamTestEngine with standard starting configuration according
 * to LLM-RULES Section 5 (Preparing to Play):
 * - Players start with 5 cards in hand
 * - Players start with 6 shields in shield section
 * - Players start with 10 cards in resource deck
 * - Remaining cards go to main deck
 *
 * Use this builder for testing:
 * - Game initialization and setup
 * - Starting hand mechanics
 * - Redraw mechanics
 * - Phase progression from game start
 *
 * @param options - Configuration for starting state (all optional)
 * @param options.playerOneHandSize - Cards in player one's hand (default: 5)
 * @param options.playerTwoHandSize - Cards in player two's hand (default: 5)
 * @param options.playerOneShields - Shields for player one (default: 6)
 * @param options.playerTwoShields - Shields for player two (default: 6)
 *
 * @returns A configured GundamTestEngine ready for testing
 *
 * @example
 * ```typescript
 * // Standard game start
 * const engine = buildGameStartScenario();
 *
 * // Custom starting configuration
 * const engine = buildGameStartScenario({
 *   playerOneHandSize: 7, // Testing after redraw
 *   playerOneShields: 3,   // Testing with reduced shields
 * });
 *
 * // Test game progression from start
 * assertGamePhase(engine, "start");
 * assertZoneCount(engine, "hand", 5, "player_one");
 * assertZoneCount(engine, "shieldSection", 6, "player_one");
 * ```
 *
 * @see LLM-RULES Section 5: Preparing to Play
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

/**
 * Options for configuring combat scenario
 */
type CombatScenarioOptions = {
  /** Number of units in attacker's battle area (required) */
  attackerCount: number;
  /** Number of units in defender's battle area (required) */
  defenderCount: number;
  /** Number of resources for attacker (default: 10) */
  attackerResources?: number;
  /** Number of resources for defender (default: 10) */
  defenderResources?: number;
};

/**
 * Result from building a combat scenario
 */
type CombatScenarioResult = {
  /** The configured GundamTestEngine instance */
  engine: GundamTestEngine;
  /** Array of instance IDs for attacker's units */
  attackerUnits: string[];
  /** Array of instance IDs for defender's units */
  defenderUnits: string[];
};

/**
 * Build a combat scenario with units in battle area.
 *
 * Creates a GundamTestEngine with units already deployed to battle areas,
 * ready for testing combat mechanics according to LLM-RULES Section 7 (Combat):
 * - Attack step mechanics
 * - Block step and <Blocker> keyword
 * - Damage step calculations
 * - Combat keyword interactions (<First Strike>, <Breach>, etc.)
 *
 * Units are automatically deployed to both players' battle areas,
 * and their instance IDs are returned for easy access in tests.
 *
 * @param options - Configuration for combat scenario (attackerCount and defenderCount required)
 * @param options.attackerCount - Number of units for attacking player (required)
 * @param options.defenderCount - Number of units for defending player (required)
 * @param options.attackerResources - Resources for attacker (default: 10)
 * @param options.defenderResources - Resources for defender (default: 10)
 *
 * @returns Object containing engine and unit instance IDs
 *
 * @example
 * ```typescript
 * // Basic combat: 1 attacker vs 1 defender
 * const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
 *   attackerCount: 1,
 *   defenderCount: 1
 * });
 *
 * // Multi-unit battle
 * const { engine, attackerUnits, defenderUnits } = buildCombatScenario({
 *   attackerCount: 3,
 *   defenderCount: 2
 * });
 *
 * // Test combat mechanics
 * const attackerId = attackerUnits[0];
 * const defenderId = defenderUnits[0];
 * assertCardInZone(engine, attackerId, "battleArea", "player_one");
 * assertCardInZone(engine, defenderId, "battleArea", "player_two");
 * ```
 *
 * @see LLM-RULES Section 7: Combat
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

/**
 * Options for configuring resource scenario
 */
type ResourceScenarioOptions = {
  /** Number of resources for player one (required, max 15) */
  playerOneResources: number;
  /** Number of resources for player two (required, max 15) */
  playerTwoResources: number;
};

/**
 * Build a scenario with specified resource counts.
 *
 * Creates a GundamTestEngine with specific resource configurations for testing:
 * - Resource accumulation and limits (max 15 resources)
 * - Cost payment mechanics
 * - Resource-based card interactions
 * - Late-game scenarios with abundant resources
 *
 * Resource counts are automatically capped at the game limit of 15.
 *
 * @param options - Configuration for resource counts (both required)
 * @param options.playerOneResources - Resources for player one (max 15)
 * @param options.playerTwoResources - Resources for player two (max 15)
 *
 * @returns A configured GundamTestEngine with specified resources
 *
 * @example
 * ```typescript
 * // Early game with few resources
 * const engine = buildResourceScenario({
 *   playerOneResources: 2,
 *   playerTwoResources: 3
 * });
 *
 * // Late game with abundant resources
 * const engine = buildResourceScenario({
 *   playerOneResources: 15, // At maximum
 *   playerTwoResources: 12
 * });
 *
 * // Test resource limits
 * assertZoneCount(engine, "resourceArea", 15, "player_one");
 * ```
 *
 * @see LLM-RULES Section 3: Game Locations (Resource Area)
 * @see LLM-RULES Section 6: Game Progression (Resource Phase)
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

/**
 * Options for configuring deck construction scenario
 */
type DeckConstructionScenarioOptions = {
  /** Total cards in main deck (standard: 50) */
  deckSize: number;
  /** Total cards in resource deck (standard: 10) */
  resourceDeckSize: number;
};

/**
 * Result from building a deck construction scenario
 */
type DeckConstructionScenarioResult = {
  /** The configured GundamTestEngine instance */
  engine: GundamTestEngine;
  /** Array of card instance IDs in player one's deck */
  playerOneDeck: string[];
  /** Array of card instance IDs in player one's resource deck */
  playerOneResourceDeck: string[];
};

/**
 * Build a scenario for testing deck construction rules.
 *
 * Creates a GundamTestEngine with specific deck sizes for testing:
 * - Deck construction requirements (50 cards main deck, 10 resource deck)
 * - Invalid deck configurations
 * - Card count limits and restrictions
 * - Deck-out defeat conditions
 *
 * Standard legal deck: 50 cards in main deck + 10 in resource deck.
 * Use non-standard values to test validation and edge cases.
 *
 * @param options - Configuration for deck sizes (both required)
 * @param options.deckSize - Number of cards in main deck (standard: 50)
 * @param options.resourceDeckSize - Number of cards in resource deck (standard: 10)
 *
 * @returns Object containing engine and deck instance IDs
 *
 * @example
 * ```typescript
 * // Valid deck configuration
 * const { engine, playerOneDeck, playerOneResourceDeck } =
 *   buildDeckConstructionScenario({
 *     deckSize: 50,
 *     resourceDeckSize: 10
 *   });
 *
 * assertZoneCount(engine, "deck", 50, "player_one");
 * assertZoneCount(engine, "resourceDeck", 10, "player_one");
 *
 * // Invalid deck for testing validation
 * const { engine } = buildDeckConstructionScenario({
 *   deckSize: 45, // Too few cards
 *   resourceDeckSize: 10
 * });
 *
 * // Test deck-out condition
 * const { engine } = buildDeckConstructionScenario({
 *   deckSize: 0, // Empty deck
 *   resourceDeckSize: 0
 * });
 * ```
 *
 * @see LLM-RULES Section 5: Preparing to Play (Deck Construction)
 * @see LLM-RULES Section 1: Game Overview (Defeat Conditions)
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
