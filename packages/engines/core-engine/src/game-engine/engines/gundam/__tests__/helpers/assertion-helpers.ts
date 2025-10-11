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
 * Assert that a zone is at its maximum capacity.
 *
 * Encodes domain knowledge of zone limits from LLM-RULES Section 3:
 * - Battle area: 6 units max
 * - Hand: 10 cards max (enforced during end phase)
 * - Resource area: 15 resources max
 * - Shield section: 6 shields (starting amount)
 * - Shield base: 1 base max
 *
 * This helper reduces magic numbers in tests by encoding game rule knowledge.
 * Instead of `assertZoneCount(engine, "battleArea", 6)`, use
 * `assertZoneAtCapacity(engine, "battleArea")` for more semantic assertions.
 *
 * @param engine - The GundamTestEngine instance to query
 * @param zone - The zone to check capacity for
 * @param playerId - The player ID to check (defaults to "player_one")
 *
 * @throws {Error} If zone doesn't have defined capacity or is not at capacity
 *
 * @example
 * ```typescript
 * // Check if battle area is at maximum (6 units)
 * assertZoneAtCapacity(engine, "battleArea", "player_one");
 *
 * // Check if hand is at maximum (10 cards)
 * assertZoneAtCapacity(engine, "hand");
 *
 * // Check if resource area is at maximum (15 resources)
 * assertZoneAtCapacity(engine, "resourceArea");
 *
 * // More semantic than magic numbers
 * // Before: assertZoneCount(engine, "battleArea", 6, "player_one")
 * // After:  assertZoneAtCapacity(engine, "battleArea", "player_one")
 * ```
 *
 * @see LLM-RULES Section 3: Game Locations
 * @see assertZoneCount for checking specific counts
 */
export const assertZoneAtCapacity = (
  engine: GundamTestEngine,
  zone: ZoneType,
  playerId = "player_one",
): void => {
  // Zone capacity limits from LLM-RULES Section 3
  const zoneCapacities: Partial<Record<ZoneType, number>> = {
    battleArea: 6, // Max 6 units in battle area
    hand: 10, // Max 10 cards in hand (end phase limit)
    resourceArea: 15, // Max 15 resources
    shieldSection: 6, // 6 shields at game start
    shieldBase: 1, // Max 1 base in shield base section
  };

  const capacity = zoneCapacities[zone];

  if (capacity === undefined) {
    throw new Error(
      `Zone "${zone}" does not have a defined maximum capacity. ` +
        `Zones with capacity limits: ${Object.keys(zoneCapacities).join(", ")}`,
    );
  }

  assertZoneCount(engine, zone, capacity, playerId);
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
 * Assert that priority order matches expected player sequence.
 *
 * Validates the complete priority queue for testing complex priority scenarios.
 * This is useful for validating:
 * - Action step priority (standby player → active player)
 * - Effect resolution priority (active player → standby player)
 * - Multiple trigger resolution order
 * - Priority passing mechanics
 *
 * Unlike `assertPriorityPlayer` which only checks the first player with priority,
 * this helper validates the entire priority sequence, ensuring all players are
 * in the correct order.
 *
 * @param engine - The GundamTestEngine instance to query
 * @param expectedOrder - Array of player IDs in expected priority order
 *
 * @throws {Error} If priority order doesn't match expected sequence
 *
 * @example
 * ```typescript
 * // During action step in combat (standby player has priority first)
 * assertPriorityOrder(engine, ["player_two", "player_one"]);
 *
 * // During effect resolution (active player resolves first)
 * assertPriorityOrder(engine, ["player_one", "player_two"]);
 *
 * // After standby player passes in action step
 * engine.passActionPriority();
 * assertPriorityOrder(engine, ["player_one"]); // Only active player left
 *
 * // More comprehensive than assertPriorityPlayer
 * // Before: assertPriorityPlayer(engine, "player_two")
 * // After:  assertPriorityOrder(engine, ["player_two", "player_one"])
 * ```
 *
 * @see LLM-RULES Section 8: Action Steps
 * @see LLM-RULES Section 9: Effect System
 * @see assertPriorityPlayer for checking only the first player
 */
export const assertPriorityOrder = (
  engine: GundamTestEngine,
  expectedOrder: string[],
): void => {
  const actualPriority = engine.getPriorityPlayers();

  if (actualPriority.length !== expectedOrder.length) {
    throw new Error(
      `Expected priority order with ${expectedOrder.length} player(s), ` +
        `but found ${actualPriority.length} player(s). ` +
        `Expected: [${expectedOrder.join(", ")}], ` +
        `Actual: [${actualPriority.join(", ")}]`,
    );
  }

  for (let i = 0; i < expectedOrder.length; i++) {
    if (actualPriority[i] !== expectedOrder[i]) {
      throw new Error(
        `Expected player at priority position ${i} to be "${expectedOrder[i]}", ` +
          `but found "${actualPriority[i]}". ` +
          `Full expected order: [${expectedOrder.join(", ")}], ` +
          `Actual order: [${actualPriority.join(", ")}]`,
      );
    }
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
