/**
 * Lorcana Integration Example
 *
 * Demonstrates how to build a Lorcana engine using @tcg/core types.
 * This example shows proper extension patterns and type usage.
 */

import type {
  AbilityId,
  CardDefinition,
  CardId,
  CardInstance,
  FlowDefinition,
  GameDefinition,
  GameState,
  MoveContext,
  PlayerId,
  ZoneConfig,
  ZoneId,
  ZoneState,
} from "@tcg/core";

import {
  addCardToZone,
  createCardId,
  createPlayerId,
  createZoneId,
  createZoneState,
  getTopCard,
  moveCardBetweenZones,
  RuleEngine,
} from "@tcg/core";

// ============================================================================
// ZONE CONFIGURATION
// ============================================================================

/**
 * Lorcana Zone IDs
 *
 * The 5 zones in Disney Lorcana (Comprehensive Rules Section 8)
 */
export type LorcanaZoneId = "deck" | "hand" | "play" | "discard" | "inkwell";

/**
 * Lorcana Zone Configurations
 *
 * Uses core's ZoneConfig with 3-tier visibility model:
 * - "secret": Nobody can see (deck, inkwell)
 * - "private": Only owner can see (hand)
 * - "public": Everyone can see (play, discard)
 */
export const lorcanaZones: Record<LorcanaZoneId, ZoneConfig> = {
  deck: {
    id: createZoneId("deck"),
    name: "Deck",
    visibility: "secret", // Core's 3-tier model
    ordered: true,
    faceDown: true,
  },
  hand: {
    id: createZoneId("hand"),
    name: "Hand",
    visibility: "private", // Only owner can see
    ordered: false,
  },
  play: {
    id: createZoneId("play"),
    name: "Play",
    visibility: "public", // Everyone can see
    ordered: false,
  },
  discard: {
    id: createZoneId("discard"),
    name: "Discard",
    visibility: "public", // Everyone can see
    ordered: true,
  },
  inkwell: {
    id: createZoneId("inkwell"),
    name: "Inkwell",
    visibility: "secret", // Nobody can see
    ordered: false,
    faceDown: true,
  },
};

// ============================================================================
// CARD DEFINITIONS
// ============================================================================

/**
 * Lorcana card types
 */
export type LorcanaCardType = "character" | "action" | "item" | "location";

/**
 * Lorcana colors/inks
 */
export type LorcanaColor =
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

/**
 * Lorcana Card Definition
 *
 * Extends core's CardDefinition with Lorcana-specific properties.
 * Uses intersection type for clean extension.
 */
export type LorcanaCard = CardDefinition & {
  /** Card type (overrides core's generic string) */
  type: LorcanaCardType;

  /** Ink cost to play */
  cost: number;

  /** Ink color */
  color: LorcanaColor;

  /** Whether card can be put in inkwell */
  inkwell: boolean;

  /** Lore value (for characters that can quest) */
  lore?: number;

  /** Strength (for characters) */
  strength?: number;

  /** Willpower/health (for characters and locations) */
  willpower?: number;

  /** Ability text */
  abilities?: AbilityId[];
};

/**
 * Example card definition
 */
export const mickeyMouseBraveLittleTailor: LorcanaCard = {
  // Core properties
  id: "tfc-001",
  name: "Mickey Mouse - Brave Little Tailor",
  type: "character",
  baseCost: 5,

  // Lorcana-specific properties
  cost: 5,
  color: "steel",
  inkwell: true,
  lore: 2,
  strength: 3,
  willpower: 4,
  abilities: [],

  // Optional metadata from core
  rarity: "common",
  setCode: "TFC",
  cardNumber: "001",
};

// ============================================================================
// CARD INSTANCES
// ============================================================================

/**
 * Character State
 *
 * Runtime state for character cards in play.
 * Extends core's CardInstance with Lorcana-specific state.
 */
export type CharacterState = {
  /** Damage counters on this character */
  damage: number;

  /** Whether character is exerted (turned sideways) */
  exerted: boolean;

  /** Whether character was played this turn ("drying") */
  playedThisTurn: boolean;
};

/**
 * Lorcana Character Instance
 *
 * Combines core's CardInstance with character-specific state.
 */
export type LorcanaCharacter = CardInstance<CharacterState>;

/**
 * Permanent State (items, locations)
 */
export type PermanentState = {
  /** Damage counters (for locations) */
  damage: number;
};

export type LorcanaPermanent = CardInstance<PermanentState>;

// ============================================================================
// GAME STATE
// ============================================================================

/**
 * Lorcana Phase
 *
 * The 3 main phases in a Lorcana turn (Rule 4.1)
 */
export type LorcanaPhase = "beginning" | "main" | "end";

/**
 * Turn Metadata
 *
 * Tracks actions taken this turn for validation and cleanup.
 */
export type TurnMetadata = {
  cardsPlayedThisTurn: CardId[];
  charactersQuesting: CardId[];
  inkedThisTurn: boolean;
};

/**
 * Challenge State
 *
 * Temporary state during challenge resolution.
 */
export type ChallengeState = {
  attacker: CardId;
  defender: CardId;
  attackerDamage: number;
  defenderDamage: number;
};

/**
 * Lorcana Game State
 *
 * Extends core's GameState with Lorcana-specific properties.
 *
 * Key patterns:
 * 1. Extends GameState via intersection
 * 2. Overrides 'phase' with specific type
 * 3. Nests game-specific state under 'lorcana' property
 * 4. Uses Record<PlayerId, T> for per-player data
 * 5. Uses Record<CardId, T> for per-card data
 */
export type LorcanaState = GameState & {
  /** Override phase with specific type */
  phase: LorcanaPhase;

  /** Game-specific state nested under 'lorcana' */
  lorcana: {
    /** Lore totals for each player */
    lore: Record<PlayerId, number>;

    /** Ink management */
    ink: {
      available: Record<PlayerId, number>;
      total: Record<PlayerId, number>;
    };

    /** Turn metadata (reset each turn) */
    turnMetadata: TurnMetadata;

    /** Character runtime state */
    characterStates: Record<CardId, CharacterState>;

    /** Permanent runtime state (items, locations) */
    permanentStates: Record<CardId, PermanentState>;

    /** Challenge state (only during challenge) */
    challengeState?: ChallengeState;

    /** Zone states (using core's ZoneState utility) */
    zones: {
      deck: ZoneState;
      hand: ZoneState;
      play: ZoneState;
      discard: ZoneState;
      inkwell: ZoneState;
    };
  };
};

// ============================================================================
// MOVE DEFINITIONS
// ============================================================================

/**
 * Lorcana Move Types
 *
 * All possible player actions in Lorcana.
 */
export type LorcanaMoves = {
  /** Play a card from hand */
  playCard: {
    cardId: CardId;
  };

  /** Quest with a character */
  quest: {
    characterId: CardId;
  };

  /** Challenge with a character */
  challenge: {
    attackerId: CardId;
    defenderId: CardId;
  };

  /** Put a card into inkwell */
  inkCard: {
    cardId: CardId;
  };

  /** Activate an ability */
  activateAbility: {
    sourceCardId: CardId;
    abilityId: AbilityId;
    targets?: CardId[];
  };

  /** Pass priority/end phase */
  pass: Record<string, never>;
};

// ============================================================================
// FLOW DEFINITION
// ============================================================================

/**
 * Lorcana Flow Definition
 *
 * Uses core's FlowDefinition to define Lorcana's turn structure:
 * - Beginning phase (3 steps: Ready, Set, Draw)
 * - Main phase (player actions)
 * - End phase (cleanup)
 */
export const lorcanaFlow: FlowDefinition<LorcanaState> = {
  turn: {
    onBegin: (context) => {
      // Ready step: Ready all cards, replenish ink
      const currentPlayer =
        context.state.players[context.state.currentPlayerIndex];

      // Ready all characters
      for (const cardId in context.state.lorcana.characterStates) {
        context.state.lorcana.characterStates[cardId].exerted = false;
        context.state.lorcana.characterStates[cardId].playedThisTurn = false;
      }

      // Replenish ink
      context.state.lorcana.ink.available[currentPlayer] =
        context.state.lorcana.ink.total[currentPlayer];

      // Reset turn metadata
      context.state.lorcana.turnMetadata = {
        cardsPlayedThisTurn: [],
        charactersQuesting: [],
        inkedThisTurn: false,
      };
    },

    phases: {
      beginning: {
        order: 0,
        next: "main",

        segments: {
          ready: {
            order: 0,
            next: "set",
            onBegin: (context) => {
              // Ready step logic (already done in turn.onBegin)
            },
          },
          set: {
            order: 1,
            next: "draw",
            onBegin: (context) => {
              // Set step: Resolve "At the start of your turn" effects
            },
          },
          draw: {
            order: 2,
            onBegin: (context) => {
              // Draw step: Draw a card
              const currentPlayer =
                context.state.players[context.state.currentPlayerIndex];

              // Skip draw on first turn for starting player
              if (
                context.state.turnNumber === 1 &&
                context.state.currentPlayerIndex === 0
              ) {
                return;
              }

              const topCard = getTopCard(
                context.state.lorcana.zones.deck,
                currentPlayer,
              );
              if (topCard) {
                moveCardBetweenZones(
                  context.state.lorcana.zones.deck,
                  context.state.lorcana.zones.hand,
                  currentPlayer,
                  topCard,
                );
              }
            },
          },
        },
      },

      main: {
        order: 1,
        next: "end",
        // Main phase logic handled by moves
      },

      end: {
        order: 2,
        onBegin: (context) => {
          // End phase: Cleanup, trigger end-of-turn effects
        },
      },
    },
  },
};

// ============================================================================
// GAME DEFINITION
// ============================================================================

/**
 * Lorcana Game Definition
 *
 * Complete game definition using core's GameDefinition type.
 * Shows how all pieces come together.
 */
export const lorcanaGame: GameDefinition<LorcanaState, LorcanaMoves> = {
  name: "Disney Lorcana",

  /**
   * Setup function
   *
   * Creates initial game state from player list.
   */
  setup: (players) => {
    const playerIds = players.map((p) => createPlayerId(p.id));

    return {
      // Core state properties
      players: playerIds,
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "beginning" as LorcanaPhase,

      // Lorcana-specific state
      lorcana: {
        lore: Object.fromEntries(playerIds.map((id) => [id, 0])) as Record<
          PlayerId,
          number
        >,
        ink: {
          available: Object.fromEntries(
            playerIds.map((id) => [id, 0]),
          ) as Record<PlayerId, number>,
          total: Object.fromEntries(playerIds.map((id) => [id, 0])) as Record<
            PlayerId,
            number
          >,
        },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: false,
        },
        characterStates: {},
        permanentStates: {},
        zones: {
          deck: createZoneState(playerIds),
          hand: createZoneState(playerIds),
          play: createZoneState(playerIds),
          discard: createZoneState(playerIds),
          inkwell: createZoneState(playerIds),
        },
      },
    };
  },

  /**
   * Move definitions
   *
   * Each move has condition (validation) and reducer (execution).
   */
  moves: {
    playCard: {
      condition: (state, context) => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (context.playerId !== currentPlayer) {
          return false;
        }

        // Check if card is in hand
        const cardId = context.data?.cardId as CardId;
        if (!state.lorcana.zones.hand[currentPlayer]?.includes(cardId)) {
          return false;
        }

        // TODO: Check ink cost, etc.

        return true;
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const cardId = context.data?.cardId as CardId;

        // Move card from hand to play
        moveCardBetweenZones(
          draft.lorcana.zones.hand,
          draft.lorcana.zones.play,
          currentPlayer,
          cardId,
        );

        // Initialize character state if needed
        draft.lorcana.characterStates[cardId] = {
          damage: 0,
          exerted: false,
          playedThisTurn: true, // "Drying"
        };

        // Track card played this turn
        draft.lorcana.turnMetadata.cardsPlayedThisTurn.push(cardId);
      },
    },

    quest: {
      condition: (state, context) => {
        const characterId = context.data?.characterId as CardId;
        const characterState = state.lorcana.characterStates[characterId];

        // Can't quest if drying or exerted
        if (characterState?.playedThisTurn || characterState?.exerted) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const characterId = context.data?.characterId as CardId;

        // Exert character
        draft.lorcana.characterStates[characterId].exerted = true;

        // Gain lore (TODO: get from card definition)
        draft.lorcana.lore[currentPlayer] += 2;

        // Track questing character
        draft.lorcana.turnMetadata.charactersQuesting.push(characterId);
      },
    },

    challenge: {
      condition: (state, context) => {
        // TODO: Implement challenge validation
        return true;
      },

      reducer: (draft, context) => {
        // TODO: Implement challenge logic
      },
    },

    inkCard: {
      condition: (state, context) => {
        // Can only ink once per turn
        if (state.lorcana.turnMetadata.inkedThisTurn) {
          return false;
        }

        const cardId = context.data?.cardId as CardId;
        const currentPlayer = state.players[state.currentPlayerIndex];

        // Card must be in hand
        return (
          state.lorcana.zones.hand[currentPlayer]?.includes(cardId) ?? false
        );
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const cardId = context.data?.cardId as CardId;

        // Move card to inkwell
        moveCardBetweenZones(
          draft.lorcana.zones.hand,
          draft.lorcana.zones.inkwell,
          currentPlayer,
          cardId,
        );

        // Increase ink totals
        draft.lorcana.ink.total[currentPlayer] += 1;
        draft.lorcana.ink.available[currentPlayer] += 1;

        // Mark as inked this turn
        draft.lorcana.turnMetadata.inkedThisTurn = true;
      },
    },

    activateAbility: {
      condition: (state, context) => {
        // TODO: Implement ability validation
        return true;
      },

      reducer: (draft, context) => {
        // TODO: Implement ability execution
      },
    },

    pass: {
      reducer: (draft, context) => {
        // Pass priority
      },
    },
  },

  /**
   * Flow definition
   */
  flow: lorcanaFlow,

  /**
   * Game end condition
   *
   * First to 20 lore wins.
   */
  endIf: (state) => {
    for (const playerId of state.players) {
      if (state.lorcana.lore[playerId] >= 20) {
        return {
          winner: playerId,
          reason: "Reached 20 lore",
        };
      }
    }
    return undefined;
  },

  /**
   * Player view filter
   *
   * Hide private information from opponents.
   */
  playerView: (state, playerId) => {
    // TODO: Implement proper information hiding
    // - Hide opponent hands (show count only)
    // - Hide opponent decks (show count only)
    // - Hide facedown cards in inkwell
    return state;
  },
};

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Example of creating and playing a Lorcana game
 */
export function exampleUsage() {
  // Create game instance
  const engine = new RuleEngine(
    lorcanaGame,
    [
      { id: "player1", name: "Alice" },
      { id: "player2", name: "Bob" },
    ],
    {
      seed: "game-123", // Deterministic gameplay
    },
  );

  // Execute moves
  const result = engine.executeMove("playCard", {
    playerId: createPlayerId("player1"),
    data: { cardId: createCardId("card-1") },
  });

  if (result.success) {
    console.log("Card played successfully!");
  } else {
    console.error("Move failed:", result.error);
  }

  // Get current state
  const state = engine.getState();
  console.log("Current lore:", state.lorcana.lore);

  // Get player-specific view
  const playerView = engine.getPlayerView(createPlayerId("player1"));
  console.log("Player 1's view:", playerView);
}

/**
 * Key Takeaways:
 *
 * 1. ✅ All branded types from @tcg/core
 * 2. ✅ Zone system uses core's 3-tier visibility
 * 3. ✅ ZoneState utility from core
 * 4. ✅ Game state extends core's GameState
 * 5. ✅ Card definitions extend core's CardDefinition
 * 6. ✅ Card instances extend core's CardInstance
 * 7. ✅ Move system uses core's MoveContext
 * 8. ✅ Flow system uses core's FlowDefinition
 * 9. ✅ No type redefinitions
 * 10. ✅ Clear extension patterns via intersection types
 */
