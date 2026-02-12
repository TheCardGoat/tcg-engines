/**
 * Lorcana Game State Types
 *
 * Complete type definition for Disney Lorcana game state following official rules:
 * - Lore tracking for win condition (Rule 1.9.1.1 - win at 20 lore)
 * - Ink management (total capacity and available per turn)
 * - Character states (drying status, damage, exerted)
 * - Turn metadata (cards played, characters questing, ink used)
 * - Challenge state for combat resolution
 * - Location and item states
 *
 * References:
 * - Rule 3.1.4 (Lore starts at 0)
 * - Rule 4.2.2.1 (Drying characters)
 * - Rule 4.3.3 (Inkwell - once per turn)
 * - Rule 4.3.6 (Challenge mechanics)
 * - Rule 9 (Damage counters)
 */

import type { CardId, PlayerId } from "@tcg/core";

/**
 * Lorcana Phase
 *
 * Three-phase turn structure (Rule 4.1.1):
 * - beginning: Ready, Set, Draw steps
 * - main: Player can take turn actions
 * - end: End of turn cleanup
 */
export type LorcanaPhase = "beginning" | "main" | "end";

/**
 * Character State
 *
 * Runtime state for a character card in play.
 * Tracks damage, exerted status, and "drying" state.
 *
 * Rule 4.2.2.1: Characters are "drying" the turn they're played
 * Rule 6.1.4: Must be dry to quest, challenge, or exert
 * Rule 9: Damage represented by counters
 */
export interface CharacterState {
  /**
   * "Drying" status - true if played this turn
   *
   * Characters that are "drying" cannot:
   * - Quest (Rule 4.3.5)
   * - Challenge (Rule 4.3.6.6)
   * - Be exerted to pay costs (Rule 6.1.4)
   *
   * Becomes false at Set step of next turn (Rule 4.2.2.1)
   */
  playedThisTurn: boolean;

  /**
   * Damage counters on this character
   *
   * Rule 9.1: Each counter represents 1 damage
   * Rule 1.9.1.3: Banished when damage >= Willpower
   */
  damage: number;

  /**
   * Exerted status - true if turned sideways
   *
   * Rule 5.1.2: Exerted cards turned sideways
   * Rule 4.2.1.1: Readied at start of turn
   */
  exerted: boolean;
}

/**
 * Permanent State
 *
 * Runtime state for locations and items in play.
 * Currently only tracks damage (for locations).
 */
export interface PermanentState {
  /**
   * Damage counters (for locations)
   *
   * Rule 4.3.6.19-22: Locations can be challenged
   * Rule 6.5: Locations have Willpower
   */
  damage: number;
}

/**
 * Challenge State
 *
 * Temporary state during challenge resolution.
 *
 * Rule 4.3.6: Challenge mechanics
 * - Attacker declared and exerted
 * - Defender chosen
 * - Damage calculated and dealt
 * - Challenge ends
 */
export interface ChallengeState {
  /**
   * Attacking character
   */
  attacker: CardId;

  /**
   * Defending character or location
   */
  defender: CardId;

  /**
   * Calculated damage attacker will deal
   *
   * Rule 4.3.6.14: Based on Strength with modifiers
   * Rule 10.3: Challenger +N applies
   */
  attackerDamage: number;

  /**
   * Calculated damage defender will deal
   *
   * Rule 4.3.6.14: Based on Strength with modifiers
   * Rule 4.3.6.22: Locations deal no damage
   */
  defenderDamage: number;
}

/**
 * Turn Metadata
 *
 * Tracks actions taken this turn for validation and cleanup.
 * Reset at start of each turn.
 */
export interface TurnMetadata {
  /**
   * Cards played this turn
   *
   * Tracked for effects that reference "cards played this turn"
   */
  cardsPlayedThisTurn: CardId[];

  /**
   * Characters that quested this turn
   *
   * Rule 4.3.5: Each character can quest once per turn
   * Tracked for effects that reference "whenever quests"
   */
  charactersQuesting: CardId[];

  /**
   * Whether player has put a card into inkwell this turn
   *
   * Rule 4.3.3: Limited to once per turn
   */
  inkedThisTurn: boolean;
}

/**
 * Lorcana-specific Game State
 *
 * Complete game state for Disney Lorcana extending base game state structure.
 * All Lorcana-specific data nested under `lorcana` property.
 */
export interface LorcanaState {
  /**
   * Players in the game
   *
   * Rule 2.1: Standard format is 2 players
   */
  players: PlayerId[];

  /**
   * Current player index (into players array)
   *
   * Rule 1.3: Active player takes their turn
   */
  currentPlayerIndex: number;

  /**
   * Turn number (starts at 1)
   *
   * Rule 3.1: First turn determined randomly
   * Rule 4.2.3.2: Starting player skips draw on turn 1
   */
  turnNumber: number;

  /**
   * Current phase
   *
   * Rule 4.1: Three phases - Beginning, Main, End
   */
  phase: LorcanaPhase;

  /**
   * Lorcana-specific game state
   */
  lorcana: {
    /**
     * Lore totals for each player
     *
     * Rule 1.9.1.1: Win condition - first to 20 lore
     * Rule 3.1.4: Starts at 0
     * Rule 4.2.2.2: Gained from locations during Set step
     * Rule 4.3.5.8: Gained from questing
     */
    lore: Record<PlayerId, number>;

    /**
     * Ink management
     *
     * Rule 4.3.3: Put card into inkwell once per turn
     * Rule 8.5.1: Each ink card represents 1 ink
     */
    ink: {
      /**
       * Available ink this turn (can be spent)
       *
       * Replenished when cards readied at start of turn
       */
      available: Record<PlayerId, number>;

      /**
       * Total ink capacity (total cards in inkwell)
       *
       * Never decreases, only increases when inking
       */
      total: Record<PlayerId, number>;
    };

    /**
     * Turn metadata - reset each turn
     *
     * Tracks what actions player has taken this turn
     */
    turnMetadata: TurnMetadata;

    /**
     * Character states
     *
     * Keyed by CardId, tracks runtime state of each character in play
     */
    characterStates: Record<CardId, CharacterState>;

    /**
     * Permanent states (locations and items)
     *
     * Keyed by CardId, tracks runtime state of non-character permanents
     */
    permanentStates: Record<CardId, PermanentState>;

    /**
     * Challenge state (only present during challenge)
     *
     * Rule 4.3.6: Challenge mechanics
     * Optional - only set during challenge resolution
     */
    challengeState?: ChallengeState;
  };
}
