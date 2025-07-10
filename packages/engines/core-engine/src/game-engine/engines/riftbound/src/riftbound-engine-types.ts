/**
 * Core type definitions for the Riftbound TCG engine
 * Based on the comprehensive Riftbound rules analysis
 */

// Core zone types that correspond to Riftbound's game zones
export type ZoneType =
  | "deck" // Main Deck Zone - 40+ cards
  | "hand" // Player's hand - private information
  | "resourceDeck" // Rune Deck - 12 rune cards
  | "base" // The Base - player's runes and gear
  | "removalArea" // Banishment - removed cards
  | "trash" // The Trash - discarded/killed cards
  | "legendZone" // Legend Zone - Champion Legend (was shieldBase)
  | "championZone" // Champion Zone - Chosen Champion (was shieldSection)
  | "sideboard"; // Cards not in play but available for swapping

// Battlefield-specific zones (game-level, not per-player)
export type BattlefieldZoneType =
  | "battlefield" // Units at battlefield
  | "facedown"; // Hidden cards (1 per battlefield)

// Game phases based on Riftbound turn structure
export type GamePhase =
  | "awakening" // Awaken Phase - ready all game objects
  | "beginning" // Beginning Phase - scoring and triggers
  | "channel" // Channel Phase - channel 2 runes
  | "draw" // Draw Phase - draw 1 card
  | "action" // Action Phase - main gameplay
  | "ending"; // End of Turn Phase - cleanup

// Game segments for different stages of play
export type GameSegment =
  | "setup" // Initial game setup
  | "mulligan" // Mulligan phase
  | "gamePlay" // Main gameplay
  | "gameEnd"; // Game ending

// Card domains corresponding to Riftbound's six domains
export type Domain =
  | "fury" // Red - aggressive tactics
  | "calm" // Green - nature and growth
  | "mind" // Blue - knowledge and control
  | "body" // Orange - physical strength
  | "chaos" // Purple - unpredictability
  | "order"; // Yellow - structure and unity

// Card types from Riftbound rules
export type CardType =
  | "unit" // Permanents that can move and fight
  | "gear" // Permanents that stay at base
  | "spell" // Non-permanents with immediate effects
  | "rune" // Resource cards (Basic and Advanced)
  | "battlefield" // Location cards for combat
  | "legend"; // Champion Legend cards

// Card rarities
export type CardRarity = "common" | "uncommon" | "rare" | "mythic";

// Resource types for paying costs
export type ResourceType =
  | "energy" // Generic numeric cost
  | "power"; // Domain-specific colored cost

// Game states based on Riftbound rules
export type RiftboundGameStates =
  | "neutral-open" // No showdown, no chain
  | "neutral-closed" // No showdown, chain exists
  | "showdown-open" // Showdown active, no chain
  | "showdown-closed"; // Showdown active, chain exists

// Combat-related types
export type CombatRole = "attacker" | "defender" | "none";

// Status conditions for units
export type StatusCondition =
  | "ready" // Can take actions
  | "exhausted" // Cannot take actions
  | "stunned" // Cannot contribute might to combat
  | "buffed" // Has buff counter (+1 Might)
  | "damaged"; // Has damage marked

// Player-specific game state
export interface PlayerState {
  id: string;
  name: string;

  // Zone card counts
  zones: {
    deck: string[];
    hand: string[];
    resourceDeck: string[];
    base: string[]; // The Base - runes and gear
    removalArea: string[]; // Banishment
    trash: string[]; // The Trash
    legendZone: string[]; // Legend Zone - Champion Legend
    championZone: string[]; // Champion Zone - Chosen Champion
    sideboard: string[]; // Cards available for swapping
  };

  points: number; // Victory points scored
  burnOutCount: number; // Times burned out

  // Resource pools (empty at specific times)
  energyPool: number;
  powerPool: Record<Domain, number>;
  universalPower: number;

  // Combat state
  combatRole: CombatRole;

  // Turn state tracking
  hasPlayedCard: boolean; // For Legion keyword
  hasScored: Set<string>; // Battlefields scored this turn
  focus: boolean; // Has focus (in showdown)

  // Additional Riftbound-specific properties
  isRelevantPlayer: boolean; // Relevant in current showdown
  domainIdentity: Domain[]; // Domain identity (chosen at game start)
  chosenChampion?: string; // Chosen Champion instance ID
  championLegend?: string; // Champion Legend instance ID
}

// Battlefield structure - represents a single battlefield location
export interface Battlefield {
  id: string; // Unique battlefield identifier
  owner: string; // Player who contributed this battlefield
  controller?: string; // Player who currently controls it (if any)
  contested: boolean; // Whether multiple players have units here

  // Units present at this battlefield (by player)
  units: Record<string, string[]>; // playerId -> unit instance IDs

  // Facedown zone associated with this battlefield
  facedownZone: {
    cardId?: string; // Only one card allowed (Hidden mechanic)
    controller?: string; // Player who placed the card
  };

  // Battlefield card instance (the battlefield card itself)
  battlefieldCard: string; // Instance ID of the battlefield card

  // Combat state
  combatState: "none" | "pending" | "active" | "resolved";

  // Point value for conquest (from battlefield card)
  pointValue: number;
}

// Main game state interface
export interface RiftboundGameState {
  // Game state
  gameState: RiftboundGameStates;

  // Battlefield system - game-level zones for combat
  battlefields: Record<string, Battlefield>; // battlefieldId -> Battlefield

  // Victory conditions
  victoryScore: number; // Points needed to win (mode-dependent)
  gameMode: string; // 1v1, FFA3, FFA4, 2v2
  teamMode?: boolean; // True for 2v2 mode
  teams?: Record<string, string[]>; // Team assignments for 2v2

  // Combat tracking
  pendingCombats: string[]; // Battlefield IDs with pending combat
  currentCombat?: {
    battlefieldId: string;
    attacker: string;
    defender: string;
    attackers: string[]; // Unit instance IDs
    defenders: string[]; // Unit instance IDs
  };

  // Chain/Showdown state
  chain: Array<{
    type: "spell" | "ability";
    controller: string;
    source?: string; // Card instance ID
    targets?: string[];
  }>;

  showdown?: {
    battlefieldId: string;
    relevantPlayers: string[];
    focusPlayer: string;
  };

  // Battlefield control tracking
  battlefieldControl: Record<string, string | null>;
  contestedBattlefields: Set<string>;
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
  damage: number; // Damage marked on units
  buffs: number; // Number of buff counters
  statusConditions: Set<StatusCondition>;

  // Temporary modifications
  mightModifier: number; // Temporary might changes
  costModifier: {
    energy: number;
    power: Record<Domain, number>;
  };

  // Keywords and abilities granted this turn
  temporaryKeywords: string[];
  temporaryAbilities: string[];

  // Combat state
  combatRole: CombatRole;
  combatDamageAssigned: number;

  // Location tracking for units
  location?: string; // Battlefield ID or "base"

  // Hidden card state
  isHidden?: boolean;
  hiddenAt?: string; // Battlefield ID where hidden

  // Attachment tracking
  attachedTo?: string; // Instance ID of attached card
  attachments: string[]; // Instance IDs of attached cards
}

// Move result type for game actions
export interface MoveResult {
  success: boolean;
  error?: string;
  gameState?: RiftboundGameState;
  logs?: string[];
}

// Export default interface for external compatibility
export interface GameState extends RiftboundGameState {}
