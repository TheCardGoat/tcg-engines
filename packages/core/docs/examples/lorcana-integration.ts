/**
 * Lorcana Integration Example
 *
 * Demonstrates how to build a Lorcana engine using @tcg/core framework.
 * This example shows:
 * - Using the new Operations API (zones, cards, registry)
 * - Framework-managed zone and card state
 * - Card definitions with registry access
 * - Proper type safety with generics
 */

import type {
  CardId,
  CardZoneConfig,
  FlowDefinition,
  GameDefinition,
  MoveContext,
  PlayerId,
} from "@tcg/core";

import { createCardId, createPlayerId, RuleEngine } from "@tcg/core";

// Define AbilityId locally (game-specific type)
export type AbilityId = string;

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
 * Framework-managed zones with 3-tier visibility model:
 * - "secret": Nobody can see (deck, inkwell)
 * - "private": Only owner can see (hand)
 * - "public": Everyone can see (play, discard)
 *
 * The framework manages zone state internally. Games just provide configuration.
 */
export const lorcanaZones: Record<LorcanaZoneId, CardZoneConfig> = {
  deck: {
    id: "deck" as any, // Framework manages zone IDs
    name: "Deck",
    visibility: "secret",
    ordered: true,
    faceDown: true,
  },
  hand: {
    id: "hand" as any,
    name: "Hand",
    visibility: "private",
    ordered: false,
  },
  play: {
    id: "play" as any,
    name: "Play",
    visibility: "public",
    ordered: false,
  },
  discard: {
    id: "discard" as any,
    name: "Discard",
    visibility: "public",
    ordered: true,
  },
  inkwell: {
    id: "inkwell" as any,
    name: "Inkwell",
    visibility: "secret",
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
 * Static card properties (immutable definition data).
 * Accessed via context.registry in moves.
 */
export type LorcanaCard = {
  /** Unique card ID */
  id: string;

  /** Card name */
  name: string;

  /** Card type */
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

  /** Card rarity */
  rarity?: string;

  /** Set code */
  setCode?: string;

  /** Card number */
  cardNumber?: string;
};

/**
 * Example card definitions
 *
 * These are stored in the GameDefinition and accessed via context.registry
 */
export const lorcanaCardDefinitions: Record<string, LorcanaCard> = {
  "tfc-001": {
    id: "tfc-001",
    name: "Mickey Mouse - Brave Little Tailor",
    type: "character",
    cost: 5,
    color: "steel",
    inkwell: true,
    lore: 2,
    strength: 3,
    willpower: 4,
    abilities: [],
    rarity: "common",
    setCode: "TFC",
    cardNumber: "001",
  },
  "tfc-002": {
    id: "tfc-002",
    name: "Elsa - Snow Queen",
    type: "character",
    cost: 8,
    color: "sapphire",
    inkwell: true,
    lore: 3,
    strength: 4,
    willpower: 6,
    abilities: [],
    rarity: "legendary",
    setCode: "TFC",
    cardNumber: "002",
  },
};

// ============================================================================
// CARD METADATA
// ============================================================================

/**
 * Card Metadata
 *
 * Dynamic state for cards (managed by framework via context.cards).
 * Separate from static card definitions (accessed via context.registry).
 *
 * The framework tracks:
 * - Which zone each card is in (via internal state)
 * - Card ownership (via internal state)
 * - Dynamic metadata (via context.cards.getCardMeta / updateCardMeta)
 */
export type LorcanaCardMeta = {
  /** Damage counters on this card */
  damage?: number;

  /** Whether card is exerted (turned sideways) */
  exerted?: boolean;

  /** Whether card was played this turn ("drying") */
  playedThisTurn?: boolean;

  /** Additional modifiers or temporary effects */
  modifiers?: string[];
};

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
 * Only contains game-specific logic state.
 * Framework manages zones, cards, and card metadata internally.
 *
 * Key patterns:
 * 1. Only game logic state (lore, ink, turns)
 * 2. No zone management (framework handles it)
 * 3. No card metadata storage (framework handles via context.cards)
 * 4. Uses Record<PlayerId, T> for per-player data
 */
export type LorcanaState = {
  /** Players in the game */
  players: PlayerId[];

  /** Current player index */
  currentPlayerIndex: number;

  /** Turn number */
  turnNumber: number;

  /** Current phase */
  phase: LorcanaPhase;

  /** Lore totals for each player */
  lore: Record<PlayerId, number>;

  /** Ink management */
  ink: {
    available: Record<PlayerId, number>;
    total: Record<PlayerId, number>;
  };

  /** Turn metadata (reset each turn) */
  turnMetadata: TurnMetadata;

  /** Challenge state (only during challenge) */
  challengeState?: ChallengeState;
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
 * Defines Lorcana's turn structure using the framework's FlowDefinition.
 * Note: Flow hooks don't have access to Operations API yet (future enhancement).
 * Complex turn logic should be handled in moves or with manual context updates.
 */
export const lorcanaFlow: FlowDefinition<LorcanaState> = {
  turn: {
    onBegin: (context) => {
      // Ready step: Ready all cards (via card metadata), replenish ink
      const currentPlayer =
        context.state.players[context.state.currentPlayerIndex];

      // Note: In a real implementation, you'd use a move to handle ready step
      // since moves have access to context.cards for metadata updates

      // Replenish ink
      context.state.ink.available[currentPlayer] =
        context.state.ink.total[currentPlayer];

      // Reset turn metadata
      context.state.turnMetadata = {
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
              // Ready step: Exert all cards
              // In a real implementation, use a move to access context.cards
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
              // In a real implementation, use a move to access context.zones
              // Example: engine.executeMove('drawCard', { playerId: currentPlayer })
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
 * Complete game definition using framework's GameDefinition with generics:
 * - TState: LorcanaState (game logic state)
 * - TMoves: LorcanaMoves (available moves)
 * - TCardDefinition: LorcanaCard (static card data)
 * - TCardMeta: LorcanaCardMeta (dynamic card state)
 */
export const lorcanaGame: GameDefinition<
  LorcanaState,
  LorcanaMoves,
  LorcanaCard,
  LorcanaCardMeta
> = {
  name: "Disney Lorcana",

  /**
   * Zone configurations
   *
   * Framework manages zone state internally. Games just provide config.
   */
  zones: lorcanaZones,

  /**
   * Card definitions
   *
   * Static card data accessed via context.registry in moves.
   */
  cards: lorcanaCardDefinitions,

  /**
   * Setup function
   *
   * Creates initial game state (game logic only, no zones/cards).
   * Framework handles zone/card initialization automatically.
   */
  setup: (players) => {
    const playerIds = players.map((p) => createPlayerId(p.id));

    return {
      // Player management
      players: playerIds,
      currentPlayerIndex: 0,
      turnNumber: 1,
      phase: "beginning" as LorcanaPhase,

      // Game-specific state only
      lore: Object.fromEntries(playerIds.map((id) => [id, 0])) as Record<
        PlayerId,
        number
      >,
      ink: {
        available: Object.fromEntries(playerIds.map((id) => [id, 0])) as Record<
          PlayerId,
          number
        >,
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
    };
  },

  /**
   * Move definitions
   *
   * Each move uses Operations API:
   * - context.zones: Zone management (moveCard, getCardsInZone, etc.)
   * - context.cards: Card metadata (getCardMeta, updateCardMeta, etc.)
   * - context.registry: Card definitions (getCard, queryCards, etc.)
   */
  moves: {
    playCard: {
      condition: (state, context) => {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (context.playerId !== currentPlayer) {
          return false;
        }

        // Check if card is in hand using zones API
        const cardId = context.data?.cardId as CardId;
        const handCards = context.zones?.getCardsInZone(
          "hand" as any,
          currentPlayer,
        );
        if (!handCards?.includes(cardId)) {
          return false;
        }

        // Get card definition to check cost
        const cardDef = context.registry?.getCard(cardId as string);
        if (!cardDef) {
          return false;
        }

        // Check if player has enough ink
        if (state.ink.available[currentPlayer] < cardDef.cost) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const cardId = context.data?.cardId as CardId;

        // Get card definition for cost
        const cardDef = context.registry?.getCard(cardId as string);
        if (!cardDef) return;

        // Move card from hand to play using zones API
        context.zones?.moveCard({
          cardId,
          targetZoneId: "play" as any,
        });

        // Initialize card metadata using cards API
        context.cards?.setCardMeta(cardId, {
          damage: 0,
          exerted: false,
          playedThisTurn: true, // "Drying"
        });

        // Spend ink
        draft.ink.available[currentPlayer] -= cardDef.cost;

        // Track card played this turn
        draft.turnMetadata.cardsPlayedThisTurn.push(cardId);
      },
    },

    quest: {
      condition: (state, context) => {
        const characterId = context.data?.characterId as CardId;

        // Get card metadata using cards API
        const cardMeta = context.cards?.getCardMeta(characterId);

        // Can't quest if drying or exerted
        if (cardMeta?.playedThisTurn || cardMeta?.exerted) {
          return false;
        }

        // Get card definition to check if it can quest
        const cardDef = context.registry?.getCard(characterId as string);
        if (!(cardDef && cardDef.lore)) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const characterId = context.data?.characterId as CardId;

        // Get card definition to get lore value
        const cardDef = context.registry?.getCard(characterId as string);
        if (!cardDef) return;

        // Exert character using cards API
        context.cards?.updateCardMeta(characterId, { exerted: true });

        // Gain lore
        draft.lore[currentPlayer] += cardDef.lore ?? 0;

        // Track questing character
        draft.turnMetadata.charactersQuesting.push(characterId);
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
        if (state.turnMetadata.inkedThisTurn) {
          return false;
        }

        const cardId = context.data?.cardId as CardId;
        const currentPlayer = state.players[state.currentPlayerIndex];

        // Card must be in hand (check using zones API)
        const handCards = context.zones?.getCardsInZone(
          "hand" as any,
          currentPlayer,
        );
        if (!handCards?.includes(cardId)) {
          return false;
        }

        // Card must be inkable (check card definition)
        const cardDef = context.registry?.getCard(cardId as string);
        if (!(cardDef && cardDef.inkwell)) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const currentPlayer = draft.players[draft.currentPlayerIndex];
        const cardId = context.data?.cardId as CardId;

        // Move card to inkwell using zones API
        context.zones?.moveCard({
          cardId,
          targetZoneId: "inkwell" as any,
        });

        // Increase ink totals
        draft.ink.total[currentPlayer] += 1;
        draft.ink.available[currentPlayer] += 1;

        // Mark as inked this turn
        draft.turnMetadata.inkedThisTurn = true;
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
      if (state.lore[playerId] >= 20) {
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
    console.error(
      "Move failed:",
      "error" in result ? result.error : "Unknown error",
    );
  }

  // Get current state
  const state = engine.getState();
  console.log("Current lore:", state.lore);

  // Get player-specific view
  const playerView = engine.getPlayerView("player1");
  console.log("Player 1's view:", playerView);
}

/**
 * Key Takeaways:
 *
 * 1. ✅ Framework manages zones and cards internally
 * 2. ✅ Operations API (zones, cards, registry) in move context
 * 3. ✅ Static card definitions separate from dynamic card state
 * 4. ✅ Game state only contains game logic (no zone/card management)
 * 5. ✅ Type-safe generics: TState, TMoves, TCardDefinition, TCardMeta
 * 6. ✅ Move conditions check card state via context.cards
 * 7. ✅ Move reducers modify card state via context.cards
 * 8. ✅ Card definitions accessed via context.registry
 * 9. ✅ Zone operations via context.zones (moveCard, getCardsInZone, etc.)
 * 10. ✅ Clean separation of concerns: game logic vs infrastructure
 */
