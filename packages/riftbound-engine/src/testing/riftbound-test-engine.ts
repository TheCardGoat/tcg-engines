/**
 * Riftbound Test Engine
 *
 * A test-friendly wrapper for testing Riftbound games.
 * Provides ergonomic API for setting up game state and executing moves.
 *
 * Features:
 * - Simple player state setup ({ victoryPoints: 5, energy: 3 })
 * - Battlefield and unit configuration via initialState
 * - Convenient state inspection helpers
 * - Turn and phase management
 *
 * NOTE: This is a stub implementation. Methods are defined but not yet implemented.
 * Tests should use it.skip() until the engine is fully implemented.
 */

import type {
  BattlefieldState,
  CombatRole,
  Domain,
  GamePhase,
  GameStatus,
  PlayerId,
  RiftboundCardMeta,
  RunePool,
} from "../types";

// =============================================================================
// Constants
// =============================================================================

export const PLAYER_ONE = "player1";
export const PLAYER_TWO = "player2";

// =============================================================================
// Test State Types
// =============================================================================

/**
 * Test unit configuration for setting up units on battlefields
 */
export interface TestUnitConfig {
  /** Unit ID (auto-generated if not provided) */
  id?: string;
  /** Unit's might (health threshold) */
  might?: number;
  /** Current damage on unit */
  damage?: number;
  /** Whether unit is exhausted */
  exhausted?: boolean;
  /** Combat role (attacker/defender) */
  combatRole?: CombatRole;
  /** Whether unit is hidden */
  hidden?: boolean;
}

/**
 * Test battlefield configuration
 */
export interface TestBattlefieldConfig {
  /** Battlefield ID */
  id: string;
  /** Controller player ID (null if uncontrolled) */
  controller?: PlayerId | null;
  /** Whether battlefield is contested */
  contested?: boolean;
  /** Player who contested the battlefield */
  contestedBy?: PlayerId;
  /** Units at this battlefield, keyed by owner player ID */
  units?: Record<PlayerId, TestUnitConfig[]>;
}

/**
 * Test player state configuration
 */
export interface TestPlayerState {
  /** Victory points */
  victoryPoints?: number;
  /** Rune pool energy */
  energy?: number;
  /** Rune pool power by domain */
  power?: Partial<Record<Domain, number>>;
}

/**
 * Test engine options
 */
export interface TestEngineOptions {
  /** Victory score needed to win (default: 8) */
  victoryScore?: number;
  /** Initial game phase (default: "action") */
  phase?: GamePhase;
  /** Initial turn number (default: 1) */
  turnNumber?: number;
  /** Which player is active (default: PLAYER_ONE) */
  activePlayer?: PlayerId;
  /** Game status (default: "playing") */
  status?: GameStatus;
  /** Battlefield configurations */
  battlefields?: TestBattlefieldConfig[];
}

// =============================================================================
// Internal Types
// =============================================================================

/**
 * Game state type for Neutral/Showdown
 */
export type TurnStateType = "neutral" | "showdown";

/**
 * Chain state type for Open/Closed
 */
export type ChainStateType = "open" | "closed";

/**
 * Combined game state
 */
export interface CombinedGameState {
  turnState: TurnStateType;
  chainState: ChainStateType;
}

/**
 * Unit representation for testing
 */
export interface TestUnit {
  id: string;
  ownerId: PlayerId;
  battlefieldId?: string;
  meta: RiftboundCardMeta;
  might: number;
}

/**
 * Chain item representation for testing
 */
export interface ChainItem {
  id: string;
  controllerId: PlayerId;
  type: "spell" | "ability";
}

/**
 * Zone names for player zones
 */
export type ZoneName =
  | "hand"
  | "mainDeck"
  | "trash"
  | "banishment"
  | "base"
  | "runeDeck"
  | "runePool";

/**
 * Card object representation for zone contents
 *
 * Simplified card representation for test zone tracking.
 * Contains the card ID and optional reference to the full definition.
 */
export interface CardObject {
  /** Card instance ID */
  id: string;
  /** Card definition ID (may differ from instance ID) */
  definitionId?: string;
  /** Card name for debugging */
  name?: string;
  /** Card type */
  cardType?: string;
}

/**
 * Deck card representation for validation
 *
 * Used by deck validation helpers to check deck construction rules.
 */
export interface DeckCard {
  /** Card name (used for copy limit checking) */
  name: string;
  /** Card domain(s) for domain identity validation */
  domain?: Domain | Domain[];
  /** Whether this is a Champion unit */
  isChampion?: boolean;
  /** Whether this is a Signature card */
  isSignature?: boolean;
  /** Champion tag for champion/signature validation */
  championTag?: string;
}

/**
 * Deck validation result
 */
export interface DeckValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Validation error code */
  code?: string;
  /** All errors (for combined validation) */
  errors?: string[];
}

// =============================================================================
// Test Engine Implementation
// =============================================================================

/**
 * RiftboundTestEngine - Test-friendly game engine
 *
 * Provides utilities for testing game scenarios with a simplified API.
 *
 * @example
 * ```typescript
 * const engine = new RiftboundTestEngine(
 *   { victoryPoints: 5, energy: 3 },  // Player 1 state
 *   { victoryPoints: 2 },              // Player 2 state
 *   {
 *     phase: "action",
 *     battlefields: [
 *       {
 *         id: "bf1",
 *         controller: PLAYER_ONE,
 *         units: {
 *           [PLAYER_ONE]: [{ might: 3, damage: 1 }],
 *           [PLAYER_TWO]: [{ might: 2 }],
 *         },
 *       },
 *     ],
 *   }
 * );
 * ```
 */
export class RiftboundTestEngine {
  // Internal state (stub - not yet implemented)
  private _turnNumber: number;
  private _activePlayer: PlayerId;
  private _phase: GamePhase;
  private _status: GameStatus;
  private _victoryScore: number;
  private _players: Record<PlayerId, { victoryPoints: number }>;
  private _runePools: Record<PlayerId, RunePool>;
  private _battlefields: Map<string, BattlefieldState>;
  private _units: Map<string, TestUnit>;
  private _inShowdown: boolean;
  private _chain: ChainItem[];
  private _priorityHolder: PlayerId | null;
  private _focusHolder: PlayerId | null;
  private _pendingCombats: Set<string>;
  private _scoredThisTurn: Record<PlayerId, string[]>;
  private _unitCounter: number;

  // Zone tracking for test scenarios
  private _zones: Map<string, CardObject[]>;
  private _cardDefinitions: Map<string, CardObject>;

  constructor(
    playerOneState: TestPlayerState = {},
    playerTwoState: TestPlayerState = {},
    options: TestEngineOptions = {},
  ) {
    // Initialize turn state
    this._turnNumber = options.turnNumber ?? 1;
    this._activePlayer = options.activePlayer ?? PLAYER_ONE;
    this._phase = options.phase ?? "action";
    this._status = options.status ?? "playing";
    this._victoryScore = options.victoryScore ?? 8;

    // Initialize players
    this._players = {
      [PLAYER_ONE]: { victoryPoints: playerOneState.victoryPoints ?? 0 },
      [PLAYER_TWO]: { victoryPoints: playerTwoState.victoryPoints ?? 0 },
    };

    // Initialize rune pools
    this._runePools = {
      [PLAYER_ONE]: {
        energy: playerOneState.energy ?? 0,
        power: (playerOneState.power ?? {}) as Record<Domain, number>,
      },
      [PLAYER_TWO]: {
        energy: playerTwoState.energy ?? 0,
        power: (playerTwoState.power ?? {}) as Record<Domain, number>,
      },
    };

    // Initialize battlefields and units
    this._battlefields = new Map();
    this._units = new Map();
    this._unitCounter = 0;

    if (options.battlefields) {
      for (const bf of options.battlefields) {
        this._battlefields.set(bf.id, {
          id: bf.id,
          controller: bf.controller ?? null,
          contested: bf.contested ?? false,
          contestedBy: bf.contestedBy,
        });

        // Create units at this battlefield
        if (bf.units) {
          for (const [ownerId, unitConfigs] of Object.entries(bf.units)) {
            for (const config of unitConfigs) {
              const unitId = config.id ?? `unit-${++this._unitCounter}`;
              this._units.set(unitId, {
                id: unitId,
                ownerId,
                battlefieldId: bf.id,
                might: config.might ?? 3,
                meta: {
                  damage: config.damage ?? 0,
                  buffed: false,
                  stunned: false,
                  exhausted: config.exhausted ?? false,
                  combatRole: config.combatRole ?? null,
                  hidden: config.hidden ?? false,
                },
              });
            }
          }
        }
      }
    }

    // Initialize game state tracking
    this._inShowdown = false;
    this._chain = [];
    this._priorityHolder = null;
    this._focusHolder = null;
    this._pendingCombats = new Set();
    this._scoredThisTurn = {
      [PLAYER_ONE]: [],
      [PLAYER_TWO]: [],
    };

    // Initialize zone tracking
    this._zones = new Map();
    this._cardDefinitions = new Map();

    // Initialize empty zones for each player
    const zoneNames: ZoneName[] = [
      "hand",
      "mainDeck",
      "trash",
      "banishment",
      "base",
      "runeDeck",
      "runePool",
    ];
    for (const zoneName of zoneNames) {
      this._zones.set(`${PLAYER_ONE}:${zoneName}`, []);
      this._zones.set(`${PLAYER_TWO}:${zoneName}`, []);
    }
  }

  // ===========================================================================
  // Basic State Accessors
  // ===========================================================================

  getActivePlayer(): PlayerId {
    return this._activePlayer;
  }

  getTurnNumber(): number {
    return this._turnNumber;
  }

  getCurrentPhase(): GamePhase {
    return this._phase;
  }

  getPlayerIds(): PlayerId[] {
    return [PLAYER_ONE, PLAYER_TWO];
  }

  getVictoryPoints(playerId: PlayerId): number {
    return this._players[playerId]?.victoryPoints ?? 0;
  }

  isGameOver(): boolean {
    if (this._status === "finished") return true;
    for (const player of Object.values(this._players)) {
      if (player.victoryPoints >= this._victoryScore) return true;
    }
    return false;
  }

  getWinner(): PlayerId | undefined {
    // Stub - check for victory condition
    for (const [playerId, player] of Object.entries(this._players)) {
      if (player.victoryPoints >= this._victoryScore) return playerId;
    }
    return undefined;
  }

  // ===========================================================================
  // Victory Points
  // ===========================================================================

  addVictoryPoints(playerId: PlayerId, points: number): void {
    if (this._players[playerId]) {
      this._players[playerId].victoryPoints += points;
    }
  }

  setWinner(playerId: PlayerId): void {
    this._status = "finished";
    // Winner is determined by getWinner() based on victory points
    this._players[playerId].victoryPoints = this._victoryScore;
  }

  // ===========================================================================
  // Phase Management
  // ===========================================================================

  advancePhase(): GamePhase | null {
    const phases: GamePhase[] = [
      "awaken",
      "beginning",
      "channel",
      "draw",
      "action",
      "ending",
      "cleanup",
    ];
    const currentIndex = phases.indexOf(this._phase);
    if (currentIndex === -1 || currentIndex === phases.length - 1) {
      return null;
    }
    this._phase = phases[currentIndex + 1] as GamePhase;
    return this._phase;
  }

  endTurn(): void {
    const playerIds = this.getPlayerIds();
    const currentIndex = playerIds.indexOf(this._activePlayer);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    this._activePlayer = playerIds[nextIndex] as PlayerId;
    this._turnNumber++;
    this._phase = "awaken";

    // Clear turn-based tracking
    this._scoredThisTurn = {
      [PLAYER_ONE]: [],
      [PLAYER_TWO]: [],
    };
  }

  // ===========================================================================
  // Turn State (Neutral/Showdown)
  // ===========================================================================

  getTurnState(): TurnStateType {
    return this._inShowdown ? "showdown" : "neutral";
  }

  isInShowdown(): boolean {
    return this._inShowdown;
  }

  startShowdown(): void {
    this._inShowdown = true;
  }

  endShowdown(): void {
    this._inShowdown = false;
    this._focusHolder = null;
  }

  // ===========================================================================
  // Chain State (Open/Closed)
  // ===========================================================================

  getChainState(): ChainStateType {
    return this._chain.length > 0 ? "closed" : "open";
  }

  hasChain(): boolean {
    return this._chain.length > 0;
  }

  getChain(): readonly ChainItem[] {
    return this._chain;
  }

  addToChain(item: ChainItem): void {
    this._chain.push(item);
  }

  resolveChainItem(): ChainItem | undefined {
    return this._chain.pop();
  }

  clearChain(): void {
    this._chain = [];
  }

  getCombinedState(): CombinedGameState {
    return {
      turnState: this.getTurnState(),
      chainState: this.getChainState(),
    };
  }

  // ===========================================================================
  // Priority and Focus
  // ===========================================================================

  getPriorityHolder(): PlayerId | null {
    return this._priorityHolder;
  }

  setPriorityHolder(playerId: PlayerId | null): void {
    this._priorityHolder = playerId;
  }

  hasPriority(playerId: PlayerId): boolean {
    return this._priorityHolder === playerId;
  }

  passPriority(): void {
    if (!this._priorityHolder) return;
    const playerIds = this.getPlayerIds();
    const currentIndex = playerIds.indexOf(this._priorityHolder);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    this._priorityHolder = playerIds[nextIndex] as PlayerId;
  }

  getFocusHolder(): PlayerId | null {
    return this._focusHolder;
  }

  setFocusHolder(playerId: PlayerId | null): void {
    this._focusHolder = playerId;
  }

  hasFocus(playerId: PlayerId): boolean {
    return this._focusHolder === playerId;
  }

  // ===========================================================================
  // Rune Pool
  // ===========================================================================

  getEnergy(playerId: PlayerId): number {
    return this._runePools[playerId]?.energy ?? 0;
  }

  setEnergy(playerId: PlayerId, energy: number): void {
    if (this._runePools[playerId]) {
      this._runePools[playerId].energy = energy;
    }
  }

  getPower(playerId: PlayerId, domain: Domain): number {
    return this._runePools[playerId]?.power[domain] ?? 0;
  }

  setPower(playerId: PlayerId, domain: Domain, power: number): void {
    if (this._runePools[playerId]) {
      this._runePools[playerId].power[domain] = power;
    }
  }

  getRunePool(playerId: PlayerId): RunePool {
    return this._runePools[playerId] ?? { energy: 0, power: {} };
  }

  emptyRunePool(playerId: PlayerId): void {
    if (this._runePools[playerId]) {
      this._runePools[playerId] = { energy: 0, power: {} };
    }
  }

  // ===========================================================================
  // Resource Manipulation
  // ===========================================================================

  /**
   * Add energy to a player's rune pool
   *
   * @param playerId - The player to add energy to
   * @param amount - The amount of energy to add
   *
   * @example
   * ```typescript
   * engine.addEnergy(PLAYER_ONE, 3);
   * expect(engine.getEnergy(PLAYER_ONE)).toBe(3);
   * ```
   */
  addEnergy(playerId: PlayerId, amount: number): void {
    if (this._runePools[playerId]) {
      this._runePools[playerId].energy += amount;
    }
  }

  /**
   * Add power of a specific domain to a player's rune pool
   *
   * @param playerId - The player to add power to
   * @param domain - The domain of power to add
   * @param amount - The amount of power to add
   *
   * @example
   * ```typescript
   * engine.addPower(PLAYER_ONE, "fury", 2);
   * expect(engine.getPower(PLAYER_ONE, "fury")).toBe(2);
   * ```
   */
  addPower(playerId: PlayerId, domain: Domain, amount: number): void {
    if (this._runePools[playerId]) {
      const currentPower = this._runePools[playerId].power[domain] ?? 0;
      this._runePools[playerId].power[domain] = currentPower + amount;
    }
  }

  /**
   * Spend energy from a player's rune pool
   *
   * @param playerId - The player to spend energy from
   * @param amount - The amount of energy to spend
   * @returns true if the energy was spent, false if insufficient
   *
   * @example
   * ```typescript
   * engine.setEnergy(PLAYER_ONE, 5);
   * const success = engine.spendEnergy(PLAYER_ONE, 3);
   * expect(success).toBe(true);
   * expect(engine.getEnergy(PLAYER_ONE)).toBe(2);
   * ```
   */
  spendEnergy(playerId: PlayerId, amount: number): boolean {
    if (!this._runePools[playerId]) return false;
    if (this._runePools[playerId].energy < amount) return false;
    this._runePools[playerId].energy -= amount;
    return true;
  }

  /**
   * Spend power of a specific domain from a player's rune pool
   *
   * @param playerId - The player to spend power from
   * @param domain - The domain of power to spend
   * @param amount - The amount of power to spend
   * @returns true if the power was spent, false if insufficient
   *
   * @example
   * ```typescript
   * engine.setPower(PLAYER_ONE, "fury", 3);
   * const success = engine.spendPower(PLAYER_ONE, "fury", 2);
   * expect(success).toBe(true);
   * expect(engine.getPower(PLAYER_ONE, "fury")).toBe(1);
   * ```
   */
  spendPower(playerId: PlayerId, domain: Domain, amount: number): boolean {
    if (!this._runePools[playerId]) return false;
    const currentPower = this._runePools[playerId].power[domain] ?? 0;
    if (currentPower < amount) return false;
    this._runePools[playerId].power[domain] = currentPower - amount;
    return true;
  }

  /**
   * Check if a player can afford a cost
   *
   * @param playerId - The player to check
   * @param cost - The cost to check (energy and/or power by domain)
   * @returns true if the player can afford the cost
   *
   * @example
   * ```typescript
   * engine.setEnergy(PLAYER_ONE, 5);
   * engine.setPower(PLAYER_ONE, "fury", 2);
   * const canAfford = engine.canAfford(PLAYER_ONE, { energy: 3, power: { fury: 1 } });
   * expect(canAfford).toBe(true);
   * ```
   */
  canAfford(
    playerId: PlayerId,
    cost: { energy?: number; power?: Partial<Record<Domain, number>> },
  ): boolean {
    const pool = this._runePools[playerId];
    if (!pool) return false;

    // Check energy
    if (cost.energy && pool.energy < cost.energy) return false;

    // Check power by domain
    if (cost.power) {
      for (const [domain, amount] of Object.entries(cost.power)) {
        const currentPower = pool.power[domain as Domain] ?? 0;
        if (currentPower < (amount ?? 0)) return false;
      }
    }

    return true;
  }

  /**
   * Get total power across all domains for a player
   *
   * @param playerId - The player to query
   * @returns Total power across all domains
   *
   * @example
   * ```typescript
   * engine.setPower(PLAYER_ONE, "fury", 2);
   * engine.setPower(PLAYER_ONE, "calm", 3);
   * expect(engine.getTotalPower(PLAYER_ONE)).toBe(5);
   * ```
   */
  getTotalPower(playerId: PlayerId): number {
    const pool = this._runePools[playerId];
    if (!pool) return 0;
    return Object.values(pool.power).reduce(
      (sum, power) => sum + (power ?? 0),
      0,
    );
  }

  /**
   * Get all domains that have power in a player's pool
   *
   * @param playerId - The player to query
   * @returns Array of domains with power > 0
   *
   * @example
   * ```typescript
   * engine.setPower(PLAYER_ONE, "fury", 2);
   * engine.setPower(PLAYER_ONE, "calm", 0);
   * engine.setPower(PLAYER_ONE, "mind", 1);
   * expect(engine.getDomainsWithPower(PLAYER_ONE)).toEqual(["fury", "mind"]);
   * ```
   */
  getDomainsWithPower(playerId: PlayerId): Domain[] {
    const pool = this._runePools[playerId];
    if (!pool) return [];
    return (Object.entries(pool.power) as [Domain, number][])
      .filter(([_, power]) => power > 0)
      .map(([domain]) => domain);
  }

  // ===========================================================================
  // Units
  // ===========================================================================

  getUnit(unitId: string): TestUnit | undefined {
    return this._units.get(unitId);
  }

  getAllUnits(): TestUnit[] {
    return Array.from(this._units.values());
  }

  getUnitsAtBattlefield(battlefieldId: string): TestUnit[] {
    return this.getAllUnits().filter((u) => u.battlefieldId === battlefieldId);
  }

  getUnitsOwnedBy(playerId: PlayerId): TestUnit[] {
    return this.getAllUnits().filter((u) => u.ownerId === playerId);
  }

  getExhaustedUnits(playerId: PlayerId): TestUnit[] {
    return this.getUnitsOwnedBy(playerId).filter((u) => u.meta.exhausted);
  }

  readyAllUnits(playerId: PlayerId): void {
    for (const unit of this.getUnitsOwnedBy(playerId)) {
      unit.meta.exhausted = false;
    }
  }

  clearAllDamage(): void {
    for (const unit of this._units.values()) {
      unit.meta.damage = 0;
    }
  }

  shouldUnitDie(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    return unit.meta.damage >= unit.might;
  }

  // ===========================================================================
  // Battlefields
  // ===========================================================================

  getBattlefield(battlefieldId: string): BattlefieldState | undefined {
    return this._battlefields.get(battlefieldId);
  }

  getAllBattlefields(): BattlefieldState[] {
    return Array.from(this._battlefields.values());
  }

  hasOpposingUnits(battlefieldId: string): boolean {
    const units = this.getUnitsAtBattlefield(battlefieldId);
    const owners = new Set(units.map((u) => u.ownerId));
    return owners.size > 1;
  }

  /**
   * Get the controller of a battlefield
   *
   * @param battlefieldId - The battlefield ID to query
   * @returns The PlayerId of the controller, or null if uncontrolled
   *
   * @example
   * ```typescript
   * const controller = engine.getBattlefieldController("bf1");
   * expect(controller).toBe(PLAYER_ONE);
   * ```
   */
  getBattlefieldController(battlefieldId: string): PlayerId | null {
    const battlefield = this._battlefields.get(battlefieldId);
    return battlefield?.controller ?? null;
  }

  /**
   * Check if a battlefield is contested
   *
   * A battlefield is contested when a player has challenged control
   * but the showdown hasn't resolved yet.
   *
   * @param battlefieldId - The battlefield ID to query
   * @returns true if the battlefield is contested
   *
   * @example
   * ```typescript
   * expect(engine.isBattlefieldContested("bf1")).toBe(true);
   * ```
   */
  isBattlefieldContested(battlefieldId: string): boolean {
    const battlefield = this._battlefields.get(battlefieldId);
    return battlefield?.contested ?? false;
  }

  /**
   * Set the controller of a battlefield (for test setup)
   *
   * @param battlefieldId - The battlefield ID
   * @param playerId - The player to set as controller (null for uncontrolled)
   */
  setBattlefieldController(
    battlefieldId: string,
    playerId: PlayerId | null,
  ): void {
    const battlefield = this._battlefields.get(battlefieldId);
    if (battlefield) {
      battlefield.controller = playerId;
    }
  }

  /**
   * Set the contested status of a battlefield (for test setup)
   *
   * @param battlefieldId - The battlefield ID
   * @param contested - Whether the battlefield is contested
   * @param contestedBy - The player who contested (optional)
   */
  setBattlefieldContested(
    battlefieldId: string,
    contested: boolean,
    contestedBy?: PlayerId,
  ): void {
    const battlefield = this._battlefields.get(battlefieldId);
    if (battlefield) {
      battlefield.contested = contested;
      battlefield.contestedBy = contestedBy;
    }
  }

  // ===========================================================================
  // Zone Management
  // ===========================================================================

  /**
   * Get the contents of a zone for a player
   *
   * @param playerId - The player whose zone to query
   * @param zone - The zone name
   * @returns Array of CardObjects in the zone
   *
   * @example
   * ```typescript
   * const handCards = engine.getZoneContents(PLAYER_ONE, "hand");
   * expect(handCards.length).toBe(5);
   * ```
   */
  getZoneContents(playerId: PlayerId, zone: ZoneName): CardObject[] {
    const key = `${playerId}:${zone}`;
    return this._zones.get(key) ?? [];
  }

  /**
   * Get the number of cards in a player's hand
   *
   * @param playerId - The player to query
   * @returns Number of cards in hand
   */
  getHandSize(playerId: PlayerId): number {
    return this.getZoneContents(playerId, "hand").length;
  }

  /**
   * Get the number of cards in a player's main deck
   *
   * @param playerId - The player to query
   * @returns Number of cards in deck
   */
  getDeckSize(playerId: PlayerId): number {
    return this.getZoneContents(playerId, "mainDeck").length;
  }

  /**
   * Get the number of cards in a player's trash (discard pile)
   *
   * @param playerId - The player to query
   * @returns Number of cards in trash
   */
  getTrashSize(playerId: PlayerId): number {
    return this.getZoneContents(playerId, "trash").length;
  }

  /**
   * Add a card to a zone (for test setup)
   *
   * @param playerId - The player who owns the zone
   * @param zone - The zone to add to
   * @param card - The card object to add
   *
   * @example
   * ```typescript
   * engine.addToZone(PLAYER_ONE, "hand", { id: "card-1", name: "Test Card" });
   * ```
   */
  addToZone(playerId: PlayerId, zone: ZoneName, card: CardObject): void {
    const key = `${playerId}:${zone}`;
    const zoneContents = this._zones.get(key) ?? [];
    zoneContents.push(card);
    this._zones.set(key, zoneContents);

    // Also track the card definition
    this._cardDefinitions.set(card.id, card);
  }

  /**
   * Add multiple cards to a zone (for test setup)
   *
   * @param playerId - The player who owns the zone
   * @param zone - The zone to add to
   * @param cards - Array of card objects to add
   */
  addCardsToZone(
    playerId: PlayerId,
    zone: ZoneName,
    cards: CardObject[],
  ): void {
    for (const card of cards) {
      this.addToZone(playerId, zone, card);
    }
  }

  /**
   * Remove a card from a zone
   *
   * @param playerId - The player who owns the zone
   * @param zone - The zone to remove from
   * @param cardId - The ID of the card to remove
   * @returns The removed card, or undefined if not found
   */
  removeFromZone(
    playerId: PlayerId,
    zone: ZoneName,
    cardId: string,
  ): CardObject | undefined {
    const key = `${playerId}:${zone}`;
    const zoneContents = this._zones.get(key) ?? [];
    const index = zoneContents.findIndex((c) => c.id === cardId);
    if (index === -1) return undefined;

    const [removed] = zoneContents.splice(index, 1);
    return removed;
  }

  /**
   * Move a card between zones
   *
   * @param playerId - The player who owns the zones
   * @param fromZone - The source zone
   * @param toZone - The destination zone
   * @param cardId - The ID of the card to move
   * @returns true if the card was moved, false if not found
   */
  moveCard(
    playerId: PlayerId,
    fromZone: ZoneName,
    toZone: ZoneName,
    cardId: string,
  ): boolean {
    const card = this.removeFromZone(playerId, fromZone, cardId);
    if (!card) return false;
    this.addToZone(playerId, toZone, card);
    return true;
  }

  /**
   * Clear all cards from a zone
   *
   * @param playerId - The player who owns the zone
   * @param zone - The zone to clear
   */
  clearZone(playerId: PlayerId, zone: ZoneName): void {
    const key = `${playerId}:${zone}`;
    this._zones.set(key, []);
  }

  /**
   * Get a card definition by ID
   *
   * @param cardId - The card ID to look up
   * @returns The card object, or undefined if not found
   */
  getCard(cardId: string): CardObject | undefined {
    return this._cardDefinitions.get(cardId);
  }

  // ===========================================================================
  // Abilities and Keywords (Stub implementations)
  // ===========================================================================

  /**
   * Get abilities on a card
   *
   * NOTE: This is a stub implementation. Returns empty array until
   * the ability system is fully implemented.
   *
   * @param cardId - The card ID to query
   * @returns Array of ability strings (currently empty)
   *
   * @example
   * ```typescript
   * const abilities = engine.getAbilities("unit-1");
   * // Returns [] until ability system is implemented
   * ```
   */
  getAbilities(cardId: string): string[] {
    // Stub implementation - abilities not yet tracked
    // Will be implemented when ability system is complete
    const _card = this._cardDefinitions.get(cardId);
    // For now, return empty array
    return [];
  }

  /**
   * Get keywords on a unit
   *
   * NOTE: This is a stub implementation. Returns empty array until
   * the keyword system is fully implemented.
   *
   * @param unitId - The unit ID to query
   * @returns Array of keyword strings (e.g., ["Assault 2", "Tank"])
   *
   * @example
   * ```typescript
   * const keywords = engine.getKeywords("unit-1");
   * // Returns [] until keyword system is implemented
   * ```
   */
  getKeywords(unitId: string): string[] {
    // Stub implementation - keywords not yet tracked
    // Will be implemented when keyword system is complete
    const _unit = this._units.get(unitId);
    // For now, return empty array
    return [];
  }

  // ===========================================================================
  // Scoring
  // ===========================================================================

  wasScoredThisTurn(playerId: PlayerId, battlefieldId: string): boolean {
    return this._scoredThisTurn[playerId]?.includes(battlefieldId) ?? false;
  }

  markAsScored(playerId: PlayerId, battlefieldId: string): void {
    if (!this._scoredThisTurn[playerId]) {
      this._scoredThisTurn[playerId] = [];
    }
    this._scoredThisTurn[playerId].push(battlefieldId);
  }

  // ===========================================================================
  // Pending Combats
  // ===========================================================================

  hasPendingCombat(battlefieldId: string): boolean {
    return this._pendingCombats.has(battlefieldId);
  }

  markPendingCombat(battlefieldId: string): void {
    this._pendingCombats.add(battlefieldId);
  }

  clearPendingCombat(battlefieldId: string): void {
    this._pendingCombats.delete(battlefieldId);
  }

  getPendingCombats(): string[] {
    return Array.from(this._pendingCombats);
  }

  // ===========================================================================
  // Cleanup Operations
  // ===========================================================================

  cleanupKillDamagedUnits(): TestUnit[] {
    const killed: TestUnit[] = [];
    for (const unit of this._units.values()) {
      if (unit.meta.damage >= unit.might) {
        killed.push(unit);
        this._units.delete(unit.id);
      }
    }
    return killed;
  }

  cleanupRemoveCombatStatus(): void {
    for (const unit of this._units.values()) {
      unit.meta.combatRole = null;
    }
  }

  cleanupMarkPendingCombats(): void {
    if (this._inShowdown) return;
    for (const battlefield of this._battlefields.values()) {
      if (this.hasOpposingUnits(battlefield.id)) {
        this._pendingCombats.add(battlefield.id);
      }
    }
  }

  performCleanup(): void {
    this.cleanupKillDamagedUnits();
    this.cleanupRemoveCombatStatus();
    if (!this._inShowdown) {
      this.cleanupMarkPendingCombats();
    }
  }

  // ===========================================================================
  // Deck Validation Helpers
  // ===========================================================================

  /**
   * Deck validation result
   */
  static readonly DECK_VALIDATION = {
    VALID: "valid",
    INVALID_SIZE: "invalid_size",
    INVALID_COPY_LIMIT: "invalid_copy_limit",
    INVALID_DOMAIN: "invalid_domain",
    MISSING_CHAMPION: "missing_champion",
    INVALID_SIGNATURE_COUNT: "invalid_signature_count",
    INVALID_RUNE_COUNT: "invalid_rune_count",
  } as const;

  /**
   * Deck card representation for validation
   */
  static createDeckCard(
    name: string,
    options: {
      domain?: Domain | Domain[];
      isChampion?: boolean;
      isSignature?: boolean;
      championTag?: string;
    } = {},
  ): DeckCard {
    return {
      name,
      domain: options.domain,
      isChampion: options.isChampion ?? false,
      isSignature: options.isSignature ?? false,
      championTag: options.championTag,
    };
  }

  /**
   * Validate main deck size (Rule 103.2)
   *
   * Main deck must have at least 40 cards.
   *
   * @param cards - Array of cards in the deck
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const cards = Array(40).fill({ name: "Test Card" });
   * const result = RiftboundTestEngine.validateDeckSize(cards);
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateDeckSize(cards: DeckCard[]): DeckValidationResult {
    const MIN_DECK_SIZE = 40;
    if (cards.length < MIN_DECK_SIZE) {
      return {
        isValid: false,
        error: `Deck has ${cards.length} cards, minimum is ${MIN_DECK_SIZE}`,
        code: RiftboundTestEngine.DECK_VALIDATION.INVALID_SIZE,
      };
    }
    return { isValid: true };
  }

  /**
   * Validate copy limit (Rule 103.2.b)
   *
   * Maximum 3 copies of any named card in the main deck.
   *
   * @param cards - Array of cards in the deck
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const cards = [
   *   { name: "Card A" }, { name: "Card A" }, { name: "Card A" },
   *   { name: "Card B" }, { name: "Card B" },
   * ];
   * const result = RiftboundTestEngine.validateCopyLimit(cards);
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateCopyLimit(cards: DeckCard[]): DeckValidationResult {
    const MAX_COPIES = 3;
    const counts = new Map<string, number>();

    for (const card of cards) {
      const count = (counts.get(card.name) ?? 0) + 1;
      counts.set(card.name, count);

      if (count > MAX_COPIES) {
        return {
          isValid: false,
          error: `Card "${card.name}" has ${count} copies, maximum is ${MAX_COPIES}`,
          code: RiftboundTestEngine.DECK_VALIDATION.INVALID_COPY_LIMIT,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate rune deck size (Rule 103.3)
   *
   * Rune deck must have exactly 12 runes.
   *
   * @param runes - Array of runes in the deck
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const runes = Array(12).fill({ name: "Fury Rune" });
   * const result = RiftboundTestEngine.validateRuneDeckSize(runes);
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateRuneDeckSize(runes: DeckCard[]): DeckValidationResult {
    const REQUIRED_RUNE_COUNT = 12;
    if (runes.length !== REQUIRED_RUNE_COUNT) {
      return {
        isValid: false,
        error: `Rune deck has ${runes.length} runes, must have exactly ${REQUIRED_RUNE_COUNT}`,
        code: RiftboundTestEngine.DECK_VALIDATION.INVALID_RUNE_COUNT,
      };
    }
    return { isValid: true };
  }

  /**
   * Validate domain identity (Rule 103.1.b)
   *
   * All cards must match the legend's domain identity.
   * Multi-domain cards require ALL domains to be in the identity.
   *
   * @param cards - Array of cards in the deck
   * @param legendDomains - Array of domains in the legend's identity
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const cards = [
   *   { name: "Fury Card", domain: "fury" },
   *   { name: "Dual Card", domain: ["fury", "mind"] },
   * ];
   * const result = RiftboundTestEngine.validateDomainIdentity(cards, ["fury", "mind"]);
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateDomainIdentity(
    cards: DeckCard[],
    legendDomains: Domain[],
  ): DeckValidationResult {
    const domainSet = new Set(legendDomains);

    for (const card of cards) {
      if (!card.domain) continue; // Cards without domain are allowed

      const cardDomains = Array.isArray(card.domain)
        ? card.domain
        : [card.domain];

      for (const domain of cardDomains) {
        if (!domainSet.has(domain)) {
          return {
            isValid: false,
            error: `Card "${card.name}" has domain "${domain}" which is not in legend's identity [${legendDomains.join(", ")}]`,
            code: RiftboundTestEngine.DECK_VALIDATION.INVALID_DOMAIN,
          };
        }
      }
    }

    return { isValid: true };
  }

  /**
   * Validate chosen champion (Rule 103.2.a)
   *
   * Deck must have exactly one champion unit with matching tag.
   *
   * @param cards - Array of cards in the deck
   * @param legendTag - The champion tag from the legend
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const cards = [
   *   { name: "Jinx, Rebel", isChampion: true, championTag: "Jinx" },
   *   { name: "Other Card" },
   * ];
   * const result = RiftboundTestEngine.validateChosenChampion(cards, "Jinx");
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateChosenChampion(
    cards: DeckCard[],
    legendTag: string,
  ): DeckValidationResult {
    const champions = cards.filter((c) => c.isChampion);

    if (champions.length === 0) {
      return {
        isValid: false,
        error: "Deck must have a Chosen Champion",
        code: RiftboundTestEngine.DECK_VALIDATION.MISSING_CHAMPION,
      };
    }

    const matchingChampions = champions.filter(
      (c) => c.championTag === legendTag,
    );

    if (matchingChampions.length === 0) {
      return {
        isValid: false,
        error: `No champion with tag "${legendTag}" found in deck`,
        code: RiftboundTestEngine.DECK_VALIDATION.MISSING_CHAMPION,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate signature cards (Rule 103.2.d)
   *
   * Maximum 3 signature cards, all must match legend's champion tag.
   *
   * @param cards - Array of cards in the deck
   * @param legendTag - The champion tag from the legend
   * @returns Validation result with isValid and error message
   *
   * @example
   * ```typescript
   * const cards = [
   *   { name: "Tibbers", isSignature: true, championTag: "Annie" },
   *   { name: "Other Card" },
   * ];
   * const result = RiftboundTestEngine.validateSignatureCards(cards, "Annie");
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateSignatureCards(
    cards: DeckCard[],
    legendTag: string,
  ): DeckValidationResult {
    const MAX_SIGNATURE_CARDS = 3;
    const signatureCards = cards.filter((c) => c.isSignature);

    if (signatureCards.length > MAX_SIGNATURE_CARDS) {
      return {
        isValid: false,
        error: `Deck has ${signatureCards.length} signature cards, maximum is ${MAX_SIGNATURE_CARDS}`,
        code: RiftboundTestEngine.DECK_VALIDATION.INVALID_SIGNATURE_COUNT,
      };
    }

    for (const card of signatureCards) {
      if (card.championTag !== legendTag) {
        return {
          isValid: false,
          error: `Signature card "${card.name}" has tag "${card.championTag}", must match legend tag "${legendTag}"`,
          code: RiftboundTestEngine.DECK_VALIDATION.INVALID_DOMAIN,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validate entire deck (all rules)
   *
   * Runs all deck validation checks and returns combined result.
   *
   * @param config - Deck configuration to validate
   * @returns Validation result with isValid and all errors
   *
   * @example
   * ```typescript
   * const result = RiftboundTestEngine.validateDeck({
   *   mainDeck: cards,
   *   runeDeck: runes,
   *   legendDomains: ["fury"],
   *   legendTag: "Jinx",
   * });
   * expect(result.isValid).toBe(true);
   * ```
   */
  static validateDeck(config: {
    mainDeck: DeckCard[];
    runeDeck: DeckCard[];
    legendDomains: Domain[];
    legendTag: string;
  }): DeckValidationResult {
    const errors: string[] = [];

    // Validate main deck size
    const sizeResult = RiftboundTestEngine.validateDeckSize(config.mainDeck);
    if (!sizeResult.isValid && sizeResult.error) {
      errors.push(sizeResult.error);
    }

    // Validate copy limit
    const copyResult = RiftboundTestEngine.validateCopyLimit(config.mainDeck);
    if (!copyResult.isValid && copyResult.error) {
      errors.push(copyResult.error);
    }

    // Validate rune deck size
    const runeResult = RiftboundTestEngine.validateRuneDeckSize(
      config.runeDeck,
    );
    if (!runeResult.isValid && runeResult.error) {
      errors.push(runeResult.error);
    }

    // Validate domain identity for main deck
    const domainResult = RiftboundTestEngine.validateDomainIdentity(
      config.mainDeck,
      config.legendDomains,
    );
    if (!domainResult.isValid && domainResult.error) {
      errors.push(domainResult.error);
    }

    // Validate domain identity for rune deck
    const runeDomainResult = RiftboundTestEngine.validateDomainIdentity(
      config.runeDeck,
      config.legendDomains,
    );
    if (!runeDomainResult.isValid && runeDomainResult.error) {
      errors.push(runeDomainResult.error);
    }

    // Validate chosen champion
    const championResult = RiftboundTestEngine.validateChosenChampion(
      config.mainDeck,
      config.legendTag,
    );
    if (!championResult.isValid && championResult.error) {
      errors.push(championResult.error);
    }

    // Validate signature cards
    const signatureResult = RiftboundTestEngine.validateSignatureCards(
      config.mainDeck,
      config.legendTag,
    );
    if (!signatureResult.isValid && signatureResult.error) {
      errors.push(signatureResult.error);
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        error: errors.join("; "),
        errors,
      };
    }

    return { isValid: true };
  }

  // ===========================================================================
  // Game Actions - Stub Implementations (Rules 586-619)
  // ===========================================================================

  /**
   * Action type classification
   */
  static readonly ACTION_TYPES = {
    // Discretionary Actions (can be performed at will during Neutral Open)
    DISCRETIONARY: ["play", "standardMove", "hide"] as const,
    // Limited Actions (only when instructed by game effects)
    LIMITED: [
      "draw",
      "exhaust",
      "ready",
      "recycle",
      "move",
      "discard",
      "stun",
      "reveal",
      "counter",
      "buff",
      "banish",
      "kill",
      "add",
      "channel",
      "burnOut",
    ] as const,
  } as const;

  /**
   * Check if an action type is discretionary (Rule 589.1)
   *
   * @param actionType - The action type to check
   * @returns true if the action is discretionary
   */
  isDiscretionaryAction(actionType: string): boolean {
    return (
      RiftboundTestEngine.ACTION_TYPES.DISCRETIONARY as readonly string[]
    ).includes(actionType);
  }

  /**
   * Check if an action type is limited (Rule 589.2)
   *
   * @param actionType - The action type to check
   * @returns true if the action is limited
   */
  isLimitedAction(actionType: string): boolean {
    return (
      RiftboundTestEngine.ACTION_TYPES.LIMITED as readonly string[]
    ).includes(actionType);
  }

  /**
   * Draw cards from deck to hand (Rule 591)
   *
   * NOTE: Stub implementation for test specifications.
   *
   * @param playerId - The player drawing cards
   * @param count - Number of cards to draw (default: 1)
   * @returns Array of drawn card IDs
   */
  drawCards(playerId: PlayerId, count = 1): string[] {
    // TODO: Implement - move cards from mainDeck to hand
    const drawn: string[] = [];
    for (let i = 0; i < count; i++) {
      const deck = this.getZoneContents(playerId, "mainDeck");
      if (deck.length === 0) {
        // Trigger burn out if deck is empty
        this.burnOut(playerId);
        continue;
      }
      const card = deck[0];
      if (card) {
        this.moveCard(playerId, "mainDeck", "hand", card.id);
        drawn.push(card.id);
      }
    }
    return drawn;
  }

  /**
   * Exhaust a unit (Rule 592)
   *
   * @param unitId - The unit to exhaust
   * @returns true if the unit was exhausted, false if already exhausted
   */
  exhaustUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    if (unit.meta.exhausted) return false; // Rule 592.1.b
    unit.meta.exhausted = true;
    return true;
  }

  /**
   * Ready a unit (Rule 593)
   *
   * @param unitId - The unit to ready
   * @returns true if the unit was readied
   */
  readyUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    unit.meta.exhausted = false;
    return true;
  }

  /**
   * Check if a unit is exhausted
   *
   * @param unitId - The unit to check
   * @returns true if the unit is exhausted
   */
  isUnitExhausted(unitId: string): boolean {
    const unit = this._units.get(unitId);
    return unit?.meta.exhausted ?? false;
  }

  /**
   * Recycle a card to the bottom of the deck (Rule 594)
   *
   * @param playerId - The player recycling
   * @param cardId - The card to recycle
   * @param fromZone - The zone to recycle from
   * @returns true if the card was recycled
   */
  recycleCard(playerId: PlayerId, cardId: string, fromZone: ZoneName): boolean {
    const card = this.removeFromZone(playerId, fromZone, cardId);
    if (!card) return false;
    // Add to bottom of main deck
    const key = `${playerId}:mainDeck`;
    const deck = this._zones.get(key) ?? [];
    deck.push(card);
    this._zones.set(key, deck);
    return true;
  }

  /**
   * Play a card from hand (Rule 595)
   *
   * NOTE: Stub implementation for test specifications.
   *
   * @param playerId - The player playing the card
   * @param cardId - The card to play
   * @param options - Play options (location for units, etc.)
   * @returns true if the card was played
   */
  playCard(
    playerId: PlayerId,
    cardId: string,
    _options?: { location?: string },
  ): boolean {
    // TODO: Implement - validate costs, move card, apply effects
    const card = this.removeFromZone(playerId, "hand", cardId);
    if (!card) return false;

    // For now, move to appropriate zone based on card type
    if (card.cardType === "spell") {
      this.addToZone(playerId, "trash", card);
    } else {
      this.addToZone(playerId, "base", card);
    }
    return true;
  }

  /**
   * Check if a player can play a card (validates costs and timing)
   *
   * NOTE: Stub implementation for test specifications.
   *
   * @param playerId - The player attempting to play
   * @param cardId - The card to check
   * @returns true if the card can be played
   */
  canPlayCard(playerId: PlayerId, cardId: string): boolean {
    // TODO: Implement - check phase, priority, costs, etc.
    // For now, check basic conditions
    if (this._activePlayer !== playerId) return false;
    if (this._phase !== "action") return false;
    if (this.getChainState() !== "open") return false;
    if (this.getTurnState() !== "neutral") return false;

    const hand = this.getZoneContents(playerId, "hand");
    return hand.some((c) => c.id === cardId);
  }

  /**
   * Activate an ability on a card (Rule 596-605)
   *
   * NOTE: Stub implementation for test specifications.
   *
   * @param playerId - The player activating
   * @param cardId - The card with the ability
   * @param abilityIndex - Which ability to activate (0-indexed)
   * @returns true if the ability was activated
   */
  activateAbility(
    _playerId: PlayerId,
    cardId: string,
    abilityIndex: number,
  ): boolean {
    // TODO: Implement - validate costs, add to chain, etc.
    const _abilities = this.getAbilities(cardId);
    if (abilityIndex < 0) return false;
    // Stub: just return true for now
    return true;
  }

  /**
   * Check if a player can activate an ability
   *
   * NOTE: Stub implementation for test specifications.
   *
   * @param playerId - The player attempting to activate
   * @param cardId - The card with the ability
   * @param abilityIndex - Which ability to check
   * @returns true if the ability can be activated
   */
  canActivateAbility(
    _playerId: PlayerId,
    cardId: string,
    abilityIndex: number,
  ): boolean {
    // TODO: Implement - check timing, costs, etc.
    const _abilities = this.getAbilities(cardId);
    if (abilityIndex < 0) return false;
    return true;
  }

  /**
   * Move a unit using Standard Move (Rule 596, 611)
   *
   * @param unitId - The unit to move
   * @param destination - The destination battlefield ID
   * @returns true if the unit was moved
   */
  moveUnit(unitId: string, destination: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    if (unit.meta.exhausted) return false; // Standard move requires exhausting

    // Exhaust the unit as cost
    unit.meta.exhausted = true;
    unit.battlefieldId = destination;
    return true;
  }

  /**
   * Check if a unit can move to a destination
   *
   * @param unitId - The unit to check
   * @param destination - The destination battlefield ID
   * @returns true if the move is valid
   */
  canMoveUnit(unitId: string, destination: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    if (unit.meta.exhausted) return false;

    // Check destination validity (Rule 610.2.a)
    const battlefield = this._battlefields.get(destination);
    if (!battlefield) return false;

    // Can't move to battlefield with pending combat from other players
    if (this._pendingCombats.has(destination)) {
      const unitsAtDest = this.getUnitsAtBattlefield(destination);
      const owners = new Set(unitsAtDest.map((u) => u.ownerId));
      if (owners.size >= 2 && !owners.has(unit.ownerId)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Recall a unit to base (Rule 616-618)
   *
   * Recalls are NOT moves and don't trigger move abilities.
   *
   * @param unitId - The unit to recall
   * @returns true if the unit was recalled
   */
  recallUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    unit.battlefieldId = undefined; // Back to base
    return true;
  }

  /**
   * Hide a card at a battlefield (Rule 597)
   *
   * @param playerId - The player hiding the card
   * @param cardId - The card to hide
   * @param battlefieldId - The battlefield to hide at
   * @returns true if the card was hidden
   */
  hideCard(
    playerId: PlayerId,
    cardId: string,
    _battlefieldId: string,
  ): boolean {
    // TODO: Implement - validate battlefield control, pay cost
    const card = this.removeFromZone(playerId, "hand", cardId);
    if (!card) return false;

    // Mark as hidden (would go to facedown zone in real implementation)
    this._cardDefinitions.set(cardId, {
      ...card,
      cardType: "hidden",
    });
    return true;
  }

  /**
   * Discard a card from hand (Rule 598)
   *
   * @param playerId - The player discarding
   * @param cardId - The card to discard
   * @returns true if the card was discarded
   */
  discardCard(playerId: PlayerId, cardId: string): boolean {
    return this.moveCard(playerId, "hand", "trash", cardId);
  }

  /**
   * Stun a unit (Rule 599)
   *
   * @param unitId - The unit to stun
   * @returns true if the unit was stunned (false if already stunned)
   */
  stunUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    if (unit.meta.stunned) return false; // Rule 599.1.a.1
    unit.meta.stunned = true;
    return true;
  }

  /**
   * Remove stun from a unit
   *
   * @param unitId - The unit to unstun
   * @returns true if the unit was unstunned
   */
  unstunUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    unit.meta.stunned = false;
    return true;
  }

  /**
   * Check if a unit is stunned
   *
   * @param unitId - The unit to check
   * @returns true if the unit is stunned
   */
  isUnitStunned(unitId: string): boolean {
    const unit = this._units.get(unitId);
    return unit?.meta.stunned ?? false;
  }

  /**
   * Reveal cards from a zone (Rule 600)
   *
   * @param playerId - The player revealing
   * @param zone - The zone to reveal from
   * @param count - Number of cards to reveal
   * @returns Array of revealed card IDs
   */
  revealCards(playerId: PlayerId, zone: ZoneName, count: number): string[] {
    const zoneContents = this.getZoneContents(playerId, zone);
    return zoneContents.slice(0, count).map((c) => c.id);
  }

  /**
   * Counter a spell on the chain (Rule 601)
   *
   * @param spellId - The spell to counter
   * @returns true if the spell was countered
   */
  counterSpell(spellId: string): boolean {
    const index = this._chain.findIndex((item) => item.id === spellId);
    if (index === -1) return false;
    this._chain.splice(index, 1);
    return true;
  }

  /**
   * Buff a unit (Rule 602)
   *
   * @param unitId - The unit to buff
   * @returns true if the unit was buffed (false if already buffed)
   */
  buffUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    if (unit.meta.buffed) return false; // Rule 602.1.b.1
    unit.meta.buffed = true;
    return true;
  }

  /**
   * Remove buff from a unit
   *
   * @param unitId - The unit to unbuff
   * @returns true if the buff was removed
   */
  unbuffUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;
    unit.meta.buffed = false;
    return true;
  }

  /**
   * Check if a unit is buffed
   *
   * @param unitId - The unit to check
   * @returns true if the unit is buffed
   */
  isUnitBuffed(unitId: string): boolean {
    const unit = this._units.get(unitId);
    return unit?.meta.buffed ?? false;
  }

  /**
   * Banish a card (Rule 603)
   *
   * @param playerId - The player who owns the card
   * @param cardId - The card to banish
   * @param fromZone - The zone to banish from
   * @returns true if the card was banished
   */
  banishCard(playerId: PlayerId, cardId: string, fromZone: ZoneName): boolean {
    return this.moveCard(playerId, fromZone, "banishment", cardId);
  }

  /**
   * Kill a unit (Rule 604)
   *
   * @param unitId - The unit to kill
   * @returns true if the unit was killed
   */
  killUnit(unitId: string): boolean {
    const unit = this._units.get(unitId);
    if (!unit) return false;

    // Move to trash
    this.addToZone(unit.ownerId, "trash", {
      id: unit.id,
      name: `Unit ${unit.id}`,
    });
    this._units.delete(unitId);
    return true;
  }

  /**
   * Add damage to a unit
   *
   * @param unitId - The unit to damage
   * @param amount - Amount of damage to add
   * @returns The new damage total
   */
  addDamage(unitId: string, amount: number): number {
    const unit = this._units.get(unitId);
    if (!unit) return 0;
    unit.meta.damage += amount;
    return unit.meta.damage;
  }

  /**
   * Get damage on a unit
   *
   * @param unitId - The unit to check
   * @returns The current damage on the unit
   */
  getDamage(unitId: string): number {
    const unit = this._units.get(unitId);
    return unit?.meta.damage ?? 0;
  }

  /**
   * Channel runes from rune deck to rune pool (Rule 606)
   *
   * @param playerId - The player channeling
   * @param count - Number of runes to channel
   * @returns Array of channeled rune IDs
   */
  channelRunes(playerId: PlayerId, count: number): string[] {
    const channeled: string[] = [];
    for (let i = 0; i < count; i++) {
      const runeDeck = this.getZoneContents(playerId, "runeDeck");
      if (runeDeck.length === 0) break;
      const rune = runeDeck[0];
      if (rune) {
        this.moveCard(playerId, "runeDeck", "runePool", rune.id);
        channeled.push(rune.id);
      }
    }
    return channeled;
  }

  /**
   * Perform burn out (Rule 607)
   *
   * Shuffles trash into deck, opponent gains 1 point.
   *
   * @param playerId - The player burning out
   * @returns true if burn out was performed
   */
  burnOut(playerId: PlayerId): boolean {
    // Get opponent
    const opponentId = playerId === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;

    // Move all trash to deck
    const trash = this.getZoneContents(playerId, "trash");
    for (const card of [...trash]) {
      this.moveCard(playerId, "trash", "mainDeck", card.id);
    }

    // Opponent gains 1 point
    this.addVictoryPoints(opponentId, 1);

    return true;
  }

  /**
   * Get the might of a unit (for combat calculations)
   *
   * @param unitId - The unit to check
   * @returns The unit's might value
   */
  getUnitMight(unitId: string): number {
    const unit = this._units.get(unitId);
    return unit?.might ?? 0;
  }

  /**
   * Get effective might in combat (accounts for stun)
   *
   * Stunned units contribute 0 might in combat (Rule 599.1.b)
   *
   * @param unitId - The unit to check
   * @returns The effective might (0 if stunned)
   */
  getEffectiveMight(unitId: string): number {
    const unit = this._units.get(unitId);
    if (!unit) return 0;
    if (unit.meta.stunned) return 0; // Rule 599.1.b
    return unit.might;
  }

  /**
   * Add a unit to a battlefield (for test setup)
   *
   * @param config - Unit configuration
   * @param battlefieldId - The battlefield to add to
   * @returns The created unit ID
   */
  addUnit(
    config: TestUnitConfig & { ownerId: PlayerId },
    battlefieldId: string,
  ): string {
    const unitId = config.id ?? `unit-${++this._unitCounter}`;
    this._units.set(unitId, {
      id: unitId,
      ownerId: config.ownerId,
      battlefieldId,
      might: config.might ?? 3,
      meta: {
        damage: config.damage ?? 0,
        buffed: false,
        stunned: false,
        exhausted: config.exhausted ?? false,
        combatRole: config.combatRole ?? null,
        hidden: config.hidden ?? false,
      },
    });
    return unitId;
  }

  /**
   * Add a battlefield (for test setup)
   *
   * @param config - Battlefield configuration
   */
  addBattlefield(config: TestBattlefieldConfig): void {
    this._battlefields.set(config.id, {
      id: config.id,
      controller: config.controller ?? null,
      contested: config.contested ?? false,
      contestedBy: config.contestedBy,
    });
  }
}
