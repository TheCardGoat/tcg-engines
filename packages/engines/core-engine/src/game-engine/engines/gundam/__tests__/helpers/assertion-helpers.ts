import type { ZoneType } from "../../src/gundam-engine-types";
import type { GundamTestEngine } from "../../src/testing/gundam-test-engine";

/**
 * Assert that a specific zone contains an expected number of cards.
 *
 * This helper validates zone counts for testing game rules like:
 * - Hand limits (max 10 cards)
 * - Battle area limits (max 6 units)
 * - Shield section limits (max 6 shields)
 * - Resource area limits (max 15 resources)
 *
 * @param engine - The GundamTestEngine instance to query
 * @param zone - The zone type to check (e.g., "hand", "battleArea", "shieldSection")
 * @param expectedCount - The expected number of cards in the zone
 * @param playerId - The player ID to check (defaults to "player_one")
 *
 * @throws {Error} If the actual count doesn't match the expected count
 *
 * @example
 * ```typescript
 * // Verify player has 5 cards in hand
 * assertZoneCount(engine, "hand", 5, "player_one");
 *
 * // Verify battle area is at limit
 * assertZoneCount(engine, "battleArea", 6, "player_one");
 * ```
 *
 * @see LLM-RULES Section 3: Game Locations
 */
export const assertZoneCount = (
  engine: GundamTestEngine,
  zone: ZoneType,
  expectedCount: number,
  playerId = "player_one",
): void => {
  const actualCount = engine.getZone(zone, playerId).length;
  if (actualCount !== expectedCount) {
    throw new Error(
      `Expected ${zone} to have ${expectedCount} cards, but found ${actualCount}`,
    );
  }
};

/**
 * Assert that the game is in a specific phase.
 *
 * Validates the current game phase for testing phase progression rules:
 * - Start phase
 * - Draw phase
 * - Resource phase
 * - Main phase
 * - End phase
 *
 * @param engine - The GundamTestEngine instance to query
 * @param expectedPhase - The expected phase name (e.g., "start", "draw", "main")
 *
 * @throws {Error} If the actual phase doesn't match the expected phase
 *
 * @example
 * ```typescript
 * // Verify game starts in Start phase
 * assertGamePhase(engine, "start");
 *
 * // Verify progression to Main phase
 * engine.progressPhase();
 * assertGamePhase(engine, "main");
 * ```
 *
 * @see LLM-RULES Section 6: Game Progression
 */
export const assertGamePhase = (
  engine: GundamTestEngine,
  expectedPhase: string,
): void => {
  const actualPhase = engine.getGamePhase();
  if (actualPhase !== expectedPhase) {
    throw new Error(
      `Expected game phase to be "${expectedPhase}", but found "${actualPhase}"`,
    );
  }
};

/**
 * Assert that the game is in a specific segment (step within a phase).
 *
 * Segments are the individual steps within each phase:
 * - Start phase: Active step, Start step
 * - Draw phase: Draw step
 * - Resource phase: Resource step
 * - Main phase: Main step
 * - End phase: Action step, End step, Hand step, Cleanup step
 *
 * @param engine - The GundamTestEngine instance to query
 * @param expectedSegment - The expected segment name (e.g., "active_step", "draw_step")
 *
 * @throws {Error} If the actual segment doesn't match the expected segment
 *
 * @example
 * ```typescript
 * // Verify game is in Active step of Start phase
 * assertGameSegment(engine, "active_step");
 *
 * // Verify game progressed to Draw step
 * assertGameSegment(engine, "draw_step");
 * ```
 *
 * @see LLM-RULES Section 6: Game Progression
 */
export const assertGameSegment = (
  engine: GundamTestEngine,
  expectedSegment: string,
): void => {
  const actualSegment = engine.getGameSegment();
  if (actualSegment !== expectedSegment) {
    throw new Error(
      `Expected game segment to be "${expectedSegment}", but found "${actualSegment}"`,
    );
  }
};

/**
 * Assert that a specific player is the turn player (Active player).
 *
 * The turn player (Active player) is the player whose turn it currently is.
 * They take their actions first during Main phase and have control over
 * turn progression.
 *
 * @param engine - The GundamTestEngine instance to query
 * @param expectedPlayer - The expected player ID (e.g., "player_one", "player_two")
 *
 * @throws {Error} If the actual turn player doesn't match the expected player
 *
 * @example
 * ```typescript
 * // Verify it's player one's turn
 * assertTurnPlayer(engine, "player_one");
 *
 * // After turn passes
 * engine.passTurn();
 * assertTurnPlayer(engine, "player_two");
 * ```
 *
 * @see LLM-RULES Section 4: Essential Terminology - Active/Standby Player
 */
export const assertTurnPlayer = (
  engine: GundamTestEngine,
  expectedPlayer: string,
): void => {
  const actualPlayer = engine.getTurnPlayer();
  if (actualPlayer !== expectedPlayer) {
    throw new Error(
      `Expected turn player to be "${expectedPlayer}", but found "${actualPlayer}"`,
    );
  }
};

/**
 * Assert that a specific player has priority (can take actions first).
 *
 * Priority determines the order in which players can take actions during
 * action steps. During combat and end phase action steps, the standby player
 * (non-turn player) has priority first, followed by the active player.
 *
 * @param engine - The GundamTestEngine instance to query
 * @param expectedPlayer - The expected player ID with priority (e.g., "player_one", "player_two")
 *
 * @throws {Error} If the actual priority player doesn't match the expected player
 *
 * @example
 * ```typescript
 * // During action step in combat, standby player has priority first
 * assertPriorityPlayer(engine, "player_two"); // If player_one is active
 *
 * // After standby player passes
 * engine.passActionPriority();
 * assertPriorityPlayer(engine, "player_one");
 * ```
 *
 * @see LLM-RULES Section 8: Action Steps
 */
export const assertPriorityPlayer = (
  engine: GundamTestEngine,
  expectedPlayer: string,
): void => {
  const priorityPlayers = engine.getPriorityPlayers();
  if (priorityPlayers[0] !== expectedPlayer) {
    throw new Error(
      `Expected priority player to be "${expectedPlayer}", but found "${priorityPlayers[0]}"`,
    );
  }
};

/**
 * Assert that a card is in a specific zone.
 *
 * Validates card location after moves like:
 * - Playing cards from hand
 * - Deploying units to battle area
 * - Discarding cards
 * - Moving cards between zones
 *
 * @param engine - The GundamTestEngine instance to query
 * @param cardInstanceId - The unique instance ID of the card to find
 * @param expectedZone - The zone where the card should be located
 * @param playerId - The player ID who owns the zone (defaults to "player_one")
 *
 * @throws {Error} If the card is not found in the expected zone
 *
 * @example
 * ```typescript
 * // Verify unit was deployed to battle area
 * assertCardInZone(engine, unitInstanceId, "battleArea", "player_one");
 *
 * // Verify card was discarded
 * assertCardInZone(engine, cardInstanceId, "discard", "player_one");
 * ```
 *
 * @see LLM-RULES Section 3: Game Locations
 */
export const assertCardInZone = (
  engine: GundamTestEngine,
  cardInstanceId: string,
  expectedZone: ZoneType,
  playerId = "player_one",
): void => {
  const zone = engine.getZone(expectedZone, playerId);
  if (!zone.includes(cardInstanceId)) {
    throw new Error(
      `Expected card ${cardInstanceId} to be in ${expectedZone}, but it was not found`,
    );
  }
};

/**
 * Assert that a unit has specific stats (AP, HP, level, cost).
 *
 * Validates unit statistics for testing:
 * - Base stats from card definition
 * - Stat modifications from effects (e.g., <Support>, <Repair>)
 * - Damage tracking (HP reduction)
 * - Level-based scaling
 *
 * @param engine - The GundamTestEngine instance to query
 * @param unitInstanceId - The unique instance ID of the unit to check
 * @param expectedStats - Object with expected stat values to verify
 * @param expectedStats.ap - Expected Attack Power (optional)
 * @param expectedStats.hp - Expected Hit Points (optional)
 * @param expectedStats.level - Expected level (optional)
 * @param expectedStats.cost - Expected deployment cost (optional)
 *
 * @throws {Error} If any specified stat doesn't match the expected value
 *
 * @example
 * ```typescript
 * // Verify unit has base stats
 * assertUnitHasStats(engine, unitId, { ap: 5, hp: 5 });
 *
 * // Verify unit HP after damage
 * assertUnitHasStats(engine, unitId, { hp: 2 }); // After taking 3 damage
 *
 * // Verify stat boost from Support
 * assertUnitHasStats(engine, unitId, { ap: 7 }); // Base 5 + Support 2
 * ```
 *
 * @see LLM-RULES Section 2: Card Information
 * @see LLM-RULES Section 11: Keyword Effects
 */
export const assertUnitHasStats = (
  engine: GundamTestEngine,
  unitInstanceId: string,
  expectedStats: {
    ap?: number;
    hp?: number;
    level?: number;
    cost?: number;
  },
): void => {
  const allCards = engine.authoritativeEngine.queryAllCards();
  const unit = allCards.find((c: any) => c.instanceId === unitInstanceId);

  if (!unit) {
    throw new Error(`Unit with instanceId ${unitInstanceId} not found`);
  }

  const card = (unit as any).card;

  if (expectedStats.ap !== undefined && card.ap !== expectedStats.ap) {
    throw new Error(
      `Expected unit AP to be ${expectedStats.ap}, but found ${card.ap}`,
    );
  }

  if (expectedStats.hp !== undefined && card.hp !== expectedStats.hp) {
    throw new Error(
      `Expected unit HP to be ${expectedStats.hp}, but found ${card.hp}`,
    );
  }

  if (expectedStats.level !== undefined && card.level !== expectedStats.level) {
    throw new Error(
      `Expected unit level to be ${expectedStats.level}, but found ${card.level}`,
    );
  }

  if (expectedStats.cost !== undefined && card.cost !== expectedStats.cost) {
    throw new Error(
      `Expected unit cost to be ${expectedStats.cost}, but found ${card.cost}`,
    );
  }
};
