/**
 * Core type definitions for the One Piece TCG engine
 * Based on the comprehensive One Piece TCG rules
 */

// Core zone types that correspond to One Piece's game areas
export type ZoneType =
  | "deck" // Main deck - 50 cards
  | "hand" // Player's hand - secret area
  | "donDeck" // DON!! deck - 10 cards
  | "costArea" // Cost area - DON!! cards for paying costs
  | "lifeArea" // Life area - cards equal to Leader's life value
  | "trash" // Trash - face-up discarded cards
  | "leaderArea" // Leader area - Leader card
  | "characterArea" // Character area - up to 5 Character cards
  | "stageArea"; // Stage area - up to 1 Stage card

// Card categories from One Piece rules
export type CardCategory =
  | "leader" // Leader card
  | "character" // Character card
  | "event" // Event card
  | "stage" // Stage card
  | "don"; // DON!! card

// Card colors from One Piece rules
export type CardColor =
  | "red" // Upper right in hexagon
  | "green" // Right in hexagon
  | "blue" // Lower right in hexagon
  | "purple" // Lower left in hexagon
  | "black" // Left in hexagon
  | "yellow"; // Upper left in hexagon

// Attributes for Leader and Character cards
export type CardAttribute =
  | "slash" // Slash attribute
  | "strike" // Strike attribute
  | "ranged" // Ranged attribute
  | "special" // Special attribute
  | "wisdom"; // Wisdom attribute

// Card states for cards in play
export type CardState =
  | "active" // Card positioned vertically
  | "rested"; // Card positioned horizontally

// Game phases from One Piece turn structure
export type GamePhase =
  | "refreshPhase" // Refresh Phase - start of turn
  | "drawPhase" // Draw Phase - draw 1 card
  | "donPhase" // DON!! Phase - place DON!! cards
  | "mainPhase" // Main Phase - main gameplay
  | "endPhase"; // End Phase - end of turn

// Game segments for different stages of play
export type GameSegment =
  | "preGame" // Pre-game setup
  | "gamePlay" // Main gameplay
  | "gameEnd"; // Game ending

// Game states for the current game condition
export type OnePieceGameCondition =
  | "normal" // Normal gameplay
  | "gameOver"; // Game has ended

// Rarity types for cards
export type CardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super-rare"
  | "secret-rare";

// Defeat conditions from One Piece rules
export type DefeatCondition =
  | "noLife" // 0 Life cards and Leader takes damage
  | "noDeck" // 0 cards in deck
  | "concede" // Player concedes
  | "cardEffect"; // Card effect causes win/loss

// Player-specific game state
export interface PlayerState {
  id: string;
  name: string;

  // Zone card tracking
  zones: {
    deck: string[];
    hand: string[];
    donDeck: string[];
    costArea: string[];
    lifeArea: string[];
    trash: string[];
    leaderArea: string[];
    characterArea: string[]; // Max 5 cards
    stageArea: string[]; // Max 1 card
  };

  // Game state tracking
  isFirstPlayer: boolean;
  hasDrawnFirstTurn: boolean; // First player doesn't draw on first turn
  hasPlacedDonFirstTurn: boolean; // First player places only 1 DON!! on first turn

  // Defeat condition tracking
  defeatCondition?: DefeatCondition;
  hasLost: boolean;
}

// Main game state interface
export interface OnePieceGameState {
  foo?: string;
}

// Card instance state for tracking cards in play
export interface CardInstanceState {
  instanceId: string;
  cardId: string;
  owner: string;
  controller: string;
  zone: ZoneType;
  position?: number; // For ordered zones

  // Card state modifiers
  state: CardState; // Active or rested
  power?: number; // Modified power for Leader/Character cards

  // DON!! cards given to this card
  attachedDon: string[]; // DON!! card instance IDs

  // Temporary modifications
  powerModifier: number; // Temporary power changes

  // Turn-based state
  canAttack: boolean; // Can attack this turn
  hasAttacked: boolean; // Has attacked this turn
  playedThisTurn: boolean; // Was played this turn
}

// Move result type for game actions
export interface MoveResult {
  success: boolean;
  error?: string;
  gameState?: OnePieceGameState;
  logs?: string[];
}

// Battle information for combat resolution
export interface BattleInfo {
  attacker: string; // Card instance ID
  target: string; // Card instance ID or "leader"
  attackerPower: number;
  targetPower: number;
  battleResult: "attackerWins" | "targetWins" | "noResult";
}

// Damage processing information
export interface DamageInfo {
  target: string; // Player ID
  amount: number;
  source?: string; // Card instance ID that dealt damage
  triggerActivated?: boolean; // Was a trigger activated
}

// Type alias for cards mapping
export type GameCards = Record<string, Record<string, string>>;
