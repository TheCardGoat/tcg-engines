/**
 * Gundam Card Game Integration Example
 *
 * Demonstrates how to build a Gundam TCG engine using @tcg/core framework.
 * This example shows:
 * - Using the new Operations API (zones, cards, registry)
 * - Framework-managed zone and card state
 * - Card definitions with registry access
 * - Resource management and combat mechanics
 */

import type {
  CardId,
  CardZoneConfig,
  GameDefinition,
  MoveContext,
  PlayerId,
} from "../../src";

import { createCardId, createPlayerId, RuleEngine } from "../../src";

// ============================================================================
// ZONE CONFIGURATION
// ============================================================================

/**
 * Gundam Zone IDs
 *
 * The 9 zones in Gundam Card Game
 */
export type GundamZoneId =
  | "deck"
  | "resourceDeck"
  | "hand"
  | "battleArea"
  | "shieldSection"
  | "baseSection"
  | "resourceArea"
  | "trash"
  | "removal";

/**
 * Gundam Zone Configurations
 *
 * Framework-managed zones with appropriate visibility levels.
 */
export const gundamZones: Record<GundamZoneId, CardZoneConfig> = {
  deck: {
    id: "deck" as any,
    name: "Deck",
    visibility: "secret",
    ordered: true,
    faceDown: true,
  },
  resourceDeck: {
    id: "resourceDeck" as any,
    name: "Resource Deck",
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
  battleArea: {
    id: "battleArea" as any,
    name: "Battle Area",
    visibility: "public",
    ordered: false,
    maxSize: 6, // Max 6 units
  },
  shieldSection: {
    id: "shieldSection" as any,
    name: "Shield Section",
    visibility: "secret",
    ordered: true,
    faceDown: true,
  },
  baseSection: {
    id: "baseSection" as any,
    name: "Base Section",
    visibility: "public",
    ordered: false,
    maxSize: 1, // Max 1 base
  },
  resourceArea: {
    id: "resourceArea" as any,
    name: "Resource Area",
    visibility: "public",
    ordered: false,
    maxSize: 15, // Max 15 resources
  },
  trash: {
    id: "trash" as any,
    name: "Trash",
    visibility: "public",
    ordered: true,
  },
  removal: {
    id: "removal" as any,
    name: "Removal",
    visibility: "public",
    ordered: false,
  },
};

// ============================================================================
// CARD DEFINITIONS
// ============================================================================

/**
 * Gundam card types
 */
export type GundamCardType = "unit" | "command" | "base" | "resource";

/**
 * Gundam colors
 */
export type GundamColor = "red" | "blue" | "green" | "white" | "black";

/**
 * Gundam Card Definition
 *
 * Static card properties accessed via context.registry in moves.
 */
export type GundamCard = {
  id: string;
  name: string;
  type: GundamCardType;
  color: GundamColor;

  /** Deployment cost (for units) */
  cost?: number;

  /** Attack power */
  attack?: number;

  /** HP/Defense */
  hp?: number;

  /** Unit features (e.g., "Mobile Suit", "Pilot") */
  features?: string[];

  /** Card text/abilities */
  text?: string;
};

/**
 * Example card definitions
 */
export const gundamCardDefinitions: Record<string, GundamCard> = {
  "rx-78-2": {
    id: "rx-78-2",
    name: "RX-78-2 Gundam",
    type: "unit",
    color: "white",
    cost: 6,
    attack: 6,
    hp: 7,
    features: ["Mobile Suit", "Gundam"],
    text: "When this unit is deployed, you may draw 1 card.",
  },
  "zaku-ii": {
    id: "zaku-ii",
    name: "MS-06 Zaku II",
    type: "unit",
    color: "red",
    cost: 3,
    attack: 3,
    hp: 4,
    features: ["Mobile Suit", "Zeon"],
    text: "",
  },
  jaburo: {
    id: "jaburo",
    name: "Jaburo Base",
    type: "base",
    color: "white",
    text: "At the start of your turn, gain +1 resource.",
  },
};

// ============================================================================
// CARD METADATA
// ============================================================================

/**
 * Card Metadata
 *
 * Dynamic state for cards managed by framework via context.cards.
 */
export type GundamCardMeta = {
  /** Card position (active/rested) */
  position?: "active" | "rested";

  /** Damage counters on this card */
  damage?: number;

  /** Whether card has attacked this turn */
  attackedThisTurn?: boolean;

  /** Temporary modifiers */
  modifiers?: string[];
};

// ============================================================================
// GAME STATE
// ============================================================================

/**
 * Gundam Game Phase
 */
export type GundamPhase =
  | "setup"
  | "start"
  | "draw"
  | "resource"
  | "main"
  | "end"
  | "gameOver";

/**
 * Gundam Game State
 *
 * Only contains game-specific logic state.
 * Framework manages zones, cards, and card metadata internally.
 */
export type GundamState = {
  /** Players in the game */
  players: PlayerId[];

  /** Current player */
  currentPlayer: PlayerId;

  /** Turn number */
  turn: number;

  /** Current phase */
  phase: GundamPhase;

  /** Active (untapped) resources per player */
  activeResources: Record<PlayerId, number>;

  /** Whether player has played a resource this turn */
  hasPlayedResourceThisTurn: Record<PlayerId, boolean>;

  /** Win/loss tracking */
  winner?: PlayerId;
  loser?: PlayerId;
  gameEndReason?: string;
};

// ============================================================================
// MOVE DEFINITIONS
// ============================================================================

/**
 * Gundam Move Types
 */
export type GundamMoves = {
  draw: { count: number };
  deployUnit: { cardId: CardId; position?: number };
  deployBase: { cardId: CardId };
  playResource: { cardId: CardId };
  attack: { attackerId: CardId; targetId?: CardId };
  pass: Record<string, never>;
  concede: Record<string, never>;
};

// ============================================================================
// GAME DEFINITION
// ============================================================================

/**
 * Gundam Card Game Definition
 */
export const gundamGame: GameDefinition<
  GundamState,
  GundamMoves,
  GundamCard,
  GundamCardMeta
> = {
  name: "Gundam Card Game",

  /**
   * Zone configurations
   */
  zones: gundamZones,

  /**
   * Card definitions
   */
  cards: gundamCardDefinitions,

  /**
   * Setup function
   */
  setup: (players) => {
    const playerIds = players.map((p) => createPlayerId(p.id));

    return {
      players: playerIds,
      currentPlayer: playerIds[0],
      turn: 1,
      phase: "setup" as GundamPhase,
      activeResources: Object.fromEntries(
        playerIds.map((id) => [id, 0]),
      ) as Record<PlayerId, number>,
      hasPlayedResourceThisTurn: Object.fromEntries(
        playerIds.map((id) => [id, false]),
      ) as Record<PlayerId, boolean>,
    };
  },

  /**
   * Move definitions using Operations API
   */
  moves: {
    draw: {
      reducer: (draft, context) => {
        const { playerId } = context;
        const count = context.data?.count as number;

        // Draw cards using zones API
        for (let i = 0; i < count; i++) {
          const deckCards = context.zones?.getCardsInZone(
            "deck" as any,
            playerId,
          );
          if (deckCards && deckCards.length > 0) {
            context.zones?.moveCard({
              cardId: deckCards[0],
              targetZoneId: "hand" as any,
            });
          }
        }
      },
    },

    deployUnit: {
      condition: (state, context) => {
        const { playerId } = context;
        const cardId = context.data?.cardId as CardId;

        // Check if card is in hand
        const handCards = context.zones?.getCardsInZone(
          "hand" as any,
          playerId,
        );
        if (!handCards?.includes(cardId)) {
          return false;
        }

        // Get card definition to check cost
        const cardDef = context.registry?.getCard(cardId as string);
        if (!cardDef || cardDef.type !== "unit") {
          return false;
        }

        // Check if player has enough resources
        if ((cardDef.cost ?? 0) > state.activeResources[playerId]) {
          return false;
        }

        // Check battle area isn't full
        const battleArea = context.zones?.getCardsInZone(
          "battleArea" as any,
          playerId,
        );
        if (battleArea && battleArea.length >= 6) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const { playerId } = context;
        const cardId = context.data?.cardId as CardId;

        // Get card definition for cost
        const cardDef = context.registry?.getCard(cardId as string);
        if (!cardDef) return;

        // Move card to battle area
        context.zones?.moveCard({
          cardId,
          targetZoneId: "battleArea" as any,
        });

        // Initialize card metadata
        context.cards?.setCardMeta(cardId, {
          position: "active",
          damage: 0,
          attackedThisTurn: false,
        });

        // Spend resources
        draft.activeResources[playerId] -= cardDef.cost ?? 0;
      },
    },

    deployBase: {
      condition: (state, context) => {
        const { playerId } = context;
        const cardId = context.data?.cardId as CardId;

        // Check if card is in hand
        const handCards = context.zones?.getCardsInZone(
          "hand" as any,
          playerId,
        );
        if (!handCards?.includes(cardId)) {
          return false;
        }

        // Get card definition
        const cardDef = context.registry?.getCard(cardId as string);
        if (!cardDef || cardDef.type !== "base") {
          return false;
        }

        // Check base section is empty
        const baseSection = context.zones?.getCardsInZone(
          "baseSection" as any,
          playerId,
        );
        if (baseSection && baseSection.length > 0) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const cardId = context.data?.cardId as CardId;

        // Move card to base section
        context.zones?.moveCard({
          cardId,
          targetZoneId: "baseSection" as any,
        });

        // Initialize card metadata
        context.cards?.setCardMeta(cardId, {
          position: "active",
        });
      },
    },

    playResource: {
      condition: (state, context) => {
        const { playerId } = context;

        // Can only play one resource per turn
        if (state.hasPlayedResourceThisTurn[playerId]) {
          return false;
        }

        const cardId = context.data?.cardId as CardId;

        // Check if card is in hand
        const handCards = context.zones?.getCardsInZone(
          "hand" as any,
          playerId,
        );
        if (!handCards?.includes(cardId)) {
          return false;
        }

        // Check resource area isn't full
        const resourceArea = context.zones?.getCardsInZone(
          "resourceArea" as any,
          playerId,
        );
        if (resourceArea && resourceArea.length >= 15) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const { playerId } = context;
        const cardId = context.data?.cardId as CardId;

        // Move card to resource area
        context.zones?.moveCard({
          cardId,
          targetZoneId: "resourceArea" as any,
        });

        // Initialize card metadata
        context.cards?.setCardMeta(cardId, {
          position: "active",
        });

        // Increase active resources
        draft.activeResources[playerId] += 1;

        // Mark resource played this turn
        draft.hasPlayedResourceThisTurn[playerId] = true;
      },
    },

    attack: {
      condition: (state, context) => {
        const attackerId = context.data?.attackerId as CardId;

        // Get attacker metadata
        const attackerMeta = context.cards?.getCardMeta(attackerId);
        if (!attackerMeta || attackerMeta.position !== "active") {
          return false;
        }

        // Check if already attacked this turn
        if (attackerMeta.attackedThisTurn) {
          return false;
        }

        return true;
      },

      reducer: (draft, context) => {
        const attackerId = context.data?.attackerId as CardId;
        const targetId = context.data?.targetId as CardId | undefined;

        // Get attacker and target definitions
        const attackerDef = context.registry?.getCard(attackerId as string);
        if (!attackerDef) return;

        if (targetId) {
          // Attack unit
          const targetDef = context.registry?.getCard(targetId as string);
          const targetMeta = context.cards?.getCardMeta(targetId);
          if (!(targetDef && targetMeta)) return;

          // Deal damage
          const newDamage =
            (targetMeta.damage ?? 0) + (attackerDef.attack ?? 0);
          context.cards?.updateCardMeta(targetId, { damage: newDamage });

          // Check if target is destroyed
          if (newDamage >= (targetDef.hp ?? 0)) {
            context.zones?.moveCard({
              cardId: targetId,
              targetZoneId: "trash" as any,
            });
          }
        } else {
          // Direct attack (implement shield/base damage)
        }

        // Rest attacker and mark as attacked
        context.cards?.updateCardMeta(attackerId, {
          position: "rested",
          attackedThisTurn: true,
        });
      },
    },

    pass: {
      reducer: (draft) => {
        // Phase transition logic
        // In a real implementation, this would advance to next phase
      },
    },

    concede: {
      reducer: (draft, context) => {
        const { playerId } = context;
        draft.loser = playerId;
        draft.winner = draft.players.find((p) => p !== playerId);
        draft.gameEndReason = "Player conceded";
        draft.phase = "gameOver";
      },
    },
  },

  /**
   * Game end condition
   */
  endIf: (state) => {
    if (state.winner && state.loser) {
      return {
        winner: state.winner,
        reason: state.gameEndReason ?? "Game ended",
      };
    }
    return undefined;
  },
};

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

export function exampleUsage() {
  // Create game instance
  const engine = new RuleEngine(
    gundamGame,
    [
      { id: "player1", name: "Amuro" },
      { id: "player2", name: "Char" },
    ],
    {
      seed: "game-123",
    },
  );

  // Deploy a unit
  const result = engine.executeMove("deployUnit", {
    playerId: createPlayerId("player1"),
    data: { cardId: createCardId("rx-78-2") },
  });

  if (result.success) {
    console.log("Unit deployed successfully!");
  }

  // Get current state
  const state = engine.getState();
  console.log("Active resources:", state.activeResources);
}

/**
 * Key Takeaways:
 *
 * 1. ✅ Framework manages zones and cards internally
 * 2. ✅ Operations API (zones, cards, registry) in move context
 * 3. ✅ Static card definitions separate from dynamic card state
 * 4. ✅ Game state only contains game logic
 * 5. ✅ Type-safe generics: TState, TMoves, TCardDefinition, TCardMeta
 * 6. ✅ Resource management via game state
 * 7. ✅ Combat mechanics using card definitions and metadata
 * 8. ✅ Position tracking (active/rested) via card metadata
 * 9. ✅ Zone constraints (max sizes) in zone configurations
 * 10. ✅ Clean separation of concerns
 */
