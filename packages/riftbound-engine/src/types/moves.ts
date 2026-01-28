/**
 * Riftbound Move Types
 *
 * Type definitions for all manual moves in the Riftbound tabletop simulator.
 * These moves handle card movement, counters/tokens, and phase tracking
 * without rule validation (players enforce rules themselves).
 */

/**
 * Player identifier type
 */
export type PlayerId = string;

/**
 * Card identifier type
 */
export type CardId = string;

/**
 * Zone identifier type
 */
export type ZoneId = string;

/**
 * Location identifier - can be a player's base or a battlefield
 */
export type LocationId = ZoneId;

/**
 * Domain types for Riftbound's six domains
 */
export type Domain = "fury" | "calm" | "mind" | "body" | "chaos" | "order";

/**
 * Domain power - partial record of domain to amount
 */
export type DomainPower = Partial<Record<Domain, number>>;

/**
 * Scoring method for victory points
 */
export type ScoringMethod = "conquer" | "hold";

/**
 * All Riftbound move parameter types
 *
 * This type defines the parameters for every move in the game.
 * Each key is a move name, and the value is the parameter type for that move.
 */
export type RiftboundMoves = {
  // ============================================
  // Setup Moves
  // ============================================

  /** Place Champion Legend in Legend Zone */
  placeLegend: { playerId: PlayerId; legendId: CardId };

  /** Place Chosen Champion in Champion Zone */
  placeChampion: { playerId: PlayerId; championId: CardId };

  /** Place battlefields in play */
  placeBattlefields: { battlefieldIds: CardId[] };

  /** Create main deck with cards */
  initializeMainDeck: { playerId: PlayerId; cardIds: CardId[] };

  /** Create rune deck */
  initializeRuneDeck: { playerId: PlayerId; runeIds: CardId[] };

  /** Shuffle both decks */
  shuffleDecks: { playerId: PlayerId };

  /** Draw starting hand (6 cards) */
  drawInitialHand: { playerId: PlayerId };

  /** Return hand, shuffle, redraw */
  mulligan: { playerId: PlayerId; keepCards?: CardId[] };

  // ============================================
  // Turn Structure Moves
  // ============================================

  /** Move to next phase */
  advancePhase: { playerId: PlayerId };

  /** End current turn */
  endTurn: { playerId: PlayerId };

  /** Pass priority */
  pass: { playerId: PlayerId };

  /** Forfeit the game */
  concede: { playerId: PlayerId };

  /** Ready all game objects (Awaken phase) */
  readyAll: { playerId: PlayerId };

  /** Clear rune pool resources */
  emptyRunePool: { playerId: PlayerId };

  // ============================================
  // Card Play Moves
  // ============================================

  /** Play unit to Base or Battlefield */
  playUnit: { playerId: PlayerId; cardId: CardId; location: LocationId };

  /** Play gear to Base */
  playGear: { playerId: PlayerId; cardId: CardId };

  /** Play spell (goes to trash after) */
  playSpell: { playerId: PlayerId; cardId: CardId; targets?: CardId[] };

  /** Place Hidden card facedown */
  hideCard: { playerId: PlayerId; cardId: CardId; battlefieldId: CardId };

  /** Reveal and play hidden card */
  revealHidden: { playerId: PlayerId; cardId: CardId };

  /** Play Chosen Champion from Champion Zone */
  playFromChampionZone: { playerId: PlayerId; location: LocationId };

  // ============================================
  // Movement Moves
  // ============================================

  /** Exhaust unit(s) to move */
  standardMove: {
    playerId: PlayerId;
    unitIds: CardId[];
    destination: LocationId;
  };

  /** Move between battlefields (Ganking) */
  gankingMove: { playerId: PlayerId; unitId: CardId; toBattlefield: CardId };

  /** Return unit to base (non-move) */
  recallUnit: { playerId: PlayerId; unitId: CardId };

  /** Return gear to base */
  recallGear: { playerId: PlayerId; gearId: CardId };

  // ============================================
  // Resource Moves
  // ============================================

  /** Channel runes from deck */
  channelRunes: { playerId: PlayerId; count: number };

  /** Tap rune for energy */
  exhaustRune: { playerId: PlayerId; runeId: CardId };

  /** Recycle rune for power */
  recycleRune: { playerId: PlayerId; runeId: CardId; domain: Domain };

  /** Add energy/power to pool */
  addResources: { playerId: PlayerId; energy?: number; power?: DomainPower };

  /** Spend from rune pool */
  spendResources: { playerId: PlayerId; energy?: number; power?: DomainPower };

  // ============================================
  // Combat Moves
  // ============================================

  /** Mark battlefield as contested */
  contestBattlefield: { playerId: PlayerId; battlefieldId: CardId };

  /** Designate unit as attacker */
  assignAttacker: { playerId: PlayerId; unitId: CardId };

  /** Designate unit as defender */
  assignDefender: { playerId: PlayerId; unitId: CardId };

  /** Assign combat damage to unit */
  assignDamage: { playerId: PlayerId; targetId: CardId; amount: number };

  /** End combat, determine outcome */
  resolveCombat: { battlefieldId: CardId };

  /** Take control of battlefield */
  conquerBattlefield: { playerId: PlayerId; battlefieldId: CardId };

  /** Award victory point */
  scorePoint: { playerId: PlayerId; method: ScoringMethod };

  /** Reset combat designations */
  clearCombatState: { battlefieldId: CardId };

  // ============================================
  // Counter/Token Moves
  // ============================================

  /** Mark card as exhausted */
  exhaustCard: { cardId: CardId };

  /** Mark card as ready */
  readyCard: { cardId: CardId };

  /** Add damage to unit */
  addDamage: { cardId: CardId; amount: number };

  /** Remove damage from unit */
  removeDamage: { cardId: CardId; amount: number };

  /** Clear all damage from unit */
  clearDamage: { cardId: CardId };

  /** Add buff counter to unit */
  addBuff: { cardId: CardId };

  /** Remove buff counter */
  removeBuff: { cardId: CardId };

  /** Mark unit as stunned */
  stunUnit: { cardId: CardId };

  /** Remove stunned status */
  unstunUnit: { cardId: CardId };

  // ============================================
  // Discard/Trash Moves
  // ============================================

  /** Discard from hand */
  discardCard: { playerId: PlayerId; cardId: CardId };

  /** Send unit to trash */
  killUnit: { cardId: CardId };

  /** Send card to banishment */
  banishCard: { cardId: CardId };

  /** Return card to deck bottom */
  recycleCard: { cardId: CardId };

  // ============================================
  // Draw Moves
  // ============================================

  /** Draw from main deck */
  drawCard: { playerId: PlayerId; count?: number };

  /** Shuffle trash into deck, opponent scores */
  burnOut: { playerId: PlayerId; opponentId: PlayerId };
};
