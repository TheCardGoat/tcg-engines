import type { CardZoneConfig } from "../zones";
import type { CardId, PlayerId, ZoneId } from "./index";

/**
 * Internal State - Managed by the Framework
 *
 * This state contains infrastructure concerns that the framework handles:
 * - Zone management (which card is in which zone)
 * - Card instance tracking (instance ID, owner, location)
 * - Card metadata (dynamic properties, counters, effects)
 *
 * Games cannot directly modify internal state. They must use the operations API
 * provided in move context.
 *
 * @template TCardDefinition - Static card definition type (game-specific)
 * @template TCardMeta - Dynamic card metadata type (game-specific)
 */
export type InternalState<TCardDefinition = any, TCardMeta = any> = {
  /**
   * Zone registry - Maps zone ID to zone data
   *
   * Each zone contains:
   * - config: Zone configuration (visibility, ordering, etc.)
   * - cardIds: Array of card instance IDs in this zone
   *
   * The framework maintains this mapping and ensures consistency.
   */
  zones: {
    [zoneId: string]: {
      config: CardZoneConfig;
      cardIds: CardId[];
    };
  };

  /**
   * Card instance registry - Maps card instance ID to card data
   *
   * Each card instance contains:
   * - definitionId: Reference to the static card definition
   * - ownerId: Player who owns this card
   * - zoneId: Current zone containing this card
   * - position: Optional position in zone (for ordered zones like decks)
   *
   * Card instances are created during game setup or through game actions.
   */
  cards: {
    [cardId: string]: {
      /** Reference to card definition (static properties) */
      definitionId: string;
      /** Player who owns this card */
      ownerId: PlayerId;
      /** Current zone containing this card */
      zoneId: ZoneId;
      /** Position in zone (for ordered zones) */
      position?: number;
    };
  };

  /**
   * Card metadata registry - Maps card instance ID to dynamic metadata
   *
   * Stores mutable, game-specific card properties:
   * - Damage/counters
   * - Status effects (e.g., poisoned, stunned)
   * - Gained abilities
   * - Temporary modifications
   *
   * Metadata type is generic to allow game-specific structures.
   */
  cardMetas: {
    [cardId: string]: TCardMeta;
  };

  /**
   * On The Play (OTP) - Player who goes first
   *
   * Universal TCG concept. The OTP player typically goes first
   * and may have different rules (e.g., no draw on first turn).
   */
  otp?: PlayerId;

  /**
   * Players pending mulligan decision
   *
   * Tracks which players still need to decide whether to mulligan.
   * Typically initialized with all players at game start.
   */
  pendingMulligan?: PlayerId[];
};

/**
 * Complete Game State
 *
 * Separates framework-managed state (internal) from game-specific state (external).
 *
 * - internal: Zone/card management handled by framework
 * - external: Game-specific state defined by game developers
 *
 * Moves receive operations API to modify internal state.
 * Moves receive Immer draft of external state for direct modification.
 *
 * @template TState - Game-specific state type
 * @template TCardDefinition - Static card definition type
 * @template TCardMeta - Dynamic card metadata type
 *
 * @example
 * ```typescript
 * type MyGameState = { turnCount: number; currentPlayer: string };
 * type MyCardDef = { id: string; name: string; cost: number };
 * type MyCardMeta = { damage?: number; effects?: string[] };
 *
 * const state: IState<MyGameState, MyCardDef, MyCardMeta> = {
 *   internal: {
 *     zones: { ... },
 *     cards: { ... },
 *     cardMetas: { ... }
 *   },
 *   external: {
 *     turnCount: 1,
 *     currentPlayer: "player-1"
 *   }
 * };
 * ```
 */
export type IState<TState, TCardDefinition = any, TCardMeta = any> = {
  /**
   * Framework-managed state
   * Contains zone/card infrastructure
   * Modified only through operations API
   */
  internal: InternalState<TCardDefinition, TCardMeta>;

  /**
   * Game-specific state
   * Contains game logic state
   * Modified directly via Immer draft in move reducers
   */
  external: TState;
};
