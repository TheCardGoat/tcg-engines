import type {
  CardZoneConfig,
  FlowDefinition,
  GameDefinition,
  GameMoveDefinitions,
  PlayerId,
  ZoneId,
} from "@tcg/core";
import { standardMoves } from "@tcg/core";
import { useLorcanaOps } from "../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../types/move-params";
import {
  and,
  canChallenge,
  canQuest,
  cardInHand,
  cardInPlay,
  cardOwnedByPlayer,
  hasNotUsedAction,
  isMainPhase,
} from "../validators";

/**
 * Lorcana Move Definitions
 *
 * Improved design with:
 * - Composable validators
 * - Domain-specific operations
 * - Type-safe parameters
 * - Concise implementation
 */
const lorcanaMoves: GameMoveDefinitions<
  LorcanaGameState,
  LorcanaMoveParams,
  LorcanaCardMeta
> = {
  // ===== Setup Moves =====

  /**
   * Choose who goes first
   * Rule 3.1.1: First player determined randomly
   */
  chooseWhoGoesFirstMove: {
    reducer: (_draft, _context) => {
      // Engine handles activePlayer, turn, and phase transitions
      // No manual state management needed
    },
  },

  /**
   * Alter hand (mulligan)
   * Rule 3.1.6: Players may mulligan by putting cards on bottom of deck
   */
  alterHand: {
    reducer: (_draft, context) => {
      const { playerId, cardsToMulligan } = context.params;

      // Put selected cards on bottom of deck, then shuffle and draw 7
      context.zones.mulligan({
        hand: "hand" as ZoneId,
        deck: "deck" as ZoneId,
        drawCount: 7,
        playerId,
      });
    },
  },

  /**
   * Draw cards (utility for effects/testing)
   */
  drawCards: {
    reducer: (_draft, context) => {
      const { playerId, count } = context.params;

      context.zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        count,
        playerId,
      });
    },
  },

  // ===== Resource Moves =====

  /**
   * Put a card into the inkwell
   * Rule 4.3.3: Once per turn, put an inkable card into inkwell
   */
  putACardIntoTheInkwell: {
    condition: and(
      isMainPhase(),
      (state, context) => cardInHand(context.params.cardId)(state, context),
      (state, context) =>
        cardOwnedByPlayer(context.params.cardId)(state, context),
      hasNotUsedAction("hasInked"),
    ),
    reducer: (_draft, context) => {
      const { cardId } = context.params;

      // Move card to inkwell
      context.zones.moveCard({
        cardId,
        targetZoneId: "inkwell" as ZoneId,
      });

      // Mark action as used
      context.trackers?.mark("hasInked", context.playerId);
    },
  },

  // ===== Core Game Moves =====

  /**
   * Play a card from hand
   * Rule 4.3.4: Pay cost and put card into play
   */
  playCard: {
    condition: and(
      isMainPhase(),
      (state, context) => cardInHand(context.params.cardId)(state, context),
      (state, context) =>
        cardOwnedByPlayer(context.params.cardId)(state, context),
    ),
    reducer: (draft, context) => {
      const { cardId, cost } = context.params;
      const ops = useLorcanaOps(context);

      // Handle alternative costs
      if (cost === "shift") {
        // Shift: Banish target character
        const { shiftTarget } = context.params;
        context.zones.moveCard({
          cardId: shiftTarget,
          targetZoneId: "discard" as ZoneId,
        });
      } else if (cost === "sing") {
        // Sing: Exert singer
        const { singer } = context.params;
        ops.exertCard(singer);
      } else if (cost === "singTogether") {
        // Sing Together: Exert all singers
        const { singers } = context.params;
        for (const singer of singers) {
          ops.exertCard(singer);
        }
      }
      // "standard" and "free" costs don't require special handling here

      // Determine target zone (actions go to discard, others to play)
      const cardType = ops.getCardType(cardId);
      const targetZone =
        cardType === "action" ? ("discard" as ZoneId) : ("play" as ZoneId);

      // Move card
      context.zones.moveCard({
        cardId,
        targetZoneId: targetZone,
      });

      // Mark characters as drying
      if (cardType === "character") {
        ops.markAsDrying(cardId);
      }
    },
  },

  /**
   * Quest with a character
   * Rule 4.3.5: Exert character to gain lore
   */
  quest: {
    condition: and(isMainPhase(), (state, context) =>
      canQuest(context.params.cardId)(state, context),
    ),
    reducer: (draft, context) => {
      const { cardId } = context.params;
      const ops = useLorcanaOps(context);

      // Exert the character
      ops.exertCard(cardId);

      // Add lore (simplified - assume 1 lore per quest)
      // In full implementation, would read Lore value from card definition
      ops.addLore(draft, context.playerId, 1);

      // Mark as quested
      context.trackers?.mark(`quested:${cardId}`, context.playerId);
    },
  },

  /**
   * Challenge with a character
   * Rule 4.3.6: Attack another character or location
   */
  challenge: {
    condition: and(
      isMainPhase(),
      (state, context) =>
        canChallenge(context.params.attackerId)(state, context),
      (state, context) => cardInPlay(context.params.defenderId)(state, context),
    ),
    reducer: (_draft, context) => {
      const { attackerId, defenderId } = context.params;
      const ops = useLorcanaOps(context);

      // Exert attacker
      ops.exertCard(attackerId);

      // Deal damage (simplified - assume 1 damage)
      // In full implementation, would calculate based on Strength
      ops.addDamage(attackerId, 1);
      ops.addDamage(defenderId, 1);

      // TODO: Check if characters should be banished (damage >= Willpower)
      // TODO: Add to bag for triggered effects
    },
  },

  /**
   * Sing a song (legacy - prefer playCard with "sing" cost)
   * Rule 6.3.3: Exert character to play song for free
   */
  sing: {
    condition: and(
      isMainPhase(),
      (state, context) => cardInHand(context.params.songId)(state, context),
      (state, context) => cardInPlay(context.params.singerId)(state, context),
      (state, context) =>
        cardOwnedByPlayer(context.params.singerId)(state, context),
    ),
    reducer: (draft, context) => {
      const { singerId, songId } = context.params;
      const ops = useLorcanaOps(context);

      // Exert singer
      ops.exertCard(singerId);

      // Play song to discard (actions go to discard)
      context.zones.moveCard({
        cardId: songId,
        targetZoneId: "discard" as ZoneId,
      });
    },
  },

  /**
   * Sing Together (legacy - prefer playCard with "singTogether" cost)
   * Rule 10.10: Multiple characters exert to sing together
   */
  singTogether: {
    condition: and(isMainPhase(), (state, context) =>
      cardInHand(context.params.songId)(state, context),
    ),
    reducer: (draft, context) => {
      const { singersIds, songId } = context.params;
      const ops = useLorcanaOps(context);

      // Exert all singers
      for (const singerId of singersIds) {
        ops.exertCard(singerId);
      }

      // Play song to discard
      context.zones.moveCard({
        cardId: songId,
        targetZoneId: "discard" as ZoneId,
      });
    },
  },

  /**
   * Move a character to a location
   * Rule 6.5: Characters can move to locations
   */
  moveCharacterToLocation: {
    condition: and(
      isMainPhase(),
      (state, context) =>
        cardInPlay(context.params.characterId)(state, context),
      (state, context) => cardInPlay(context.params.locationId)(state, context),
    ),
    reducer: (_draft, context) => {
      const { characterId, locationId } = context.params;
      const ops = useLorcanaOps(context);

      ops.moveToLocation(characterId, locationId);
    },
  },

  /**
   * Activate an ability
   * Rule 7: Abilities with costs can be activated
   */
  activateAbility: {
    condition: and(isMainPhase()),
    reducer: (_draft, _context) => {
      // TODO: Implement ability activation logic
      // This would require:
      // 1. Looking up the ability from card definition
      // 2. Paying the cost
      // 3. Executing the effect
    },
  },

  // ===== Effect Resolution =====

  /**
   * Resolve an effect from the bag
   * Rule 8.7: Bag system for triggered effects
   */
  resolveBag: {
    reducer: (draft, context) => {
      const { bagId } = context.params;
      draft.bag = draft.bag.filter((b) => b.id !== bagId);
    },
  },

  /**
   * Resolve an effect
   */
  resolveEffect: {
    reducer: (draft, context) => {
      const { effectId } = context.params;
      draft.effects = draft.effects.filter((e) => e.id !== effectId);
    },
  },

  // ===== Manual Actions (Testing/Debug) =====

  /**
   * Manually exert a card (for testing)
   */
  manualExert: {
    reducer: (_draft, context) => {
      const { cardId } = context.params;
      const ops = useLorcanaOps(context);
      ops.exertCard(cardId);
    },
  },

  // ===== Standard Moves =====

  /**
   * Pass turn to next player
   * Rule 4.1.2: Player completes their turn
   */
  passTurn: standardMoves<LorcanaGameState>({
    include: ["pass"],
  }).pass!,

  /**
   * Concede the game
   * Rule 1.9.1.2: Player can concede at any time
   */
  concede: standardMoves<LorcanaGameState>({
    include: ["concede"],
  }).concede!,
};

// Lorcana zones (simplified)
const lorcanaZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 60,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "private",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  inkwell: {
    id: "inkwell" as ZoneId,
    name: "zones.inkwell",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
  play: {
    id: "play" as ZoneId,
    name: "zones.play",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  discard: {
    id: "discard" as ZoneId,
    name: "zones.discard",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Lorcana flow (simplified)
const lorcanaFlow: FlowDefinition<LorcanaGameState> = {
  turn: {
    initialPhase: "beginning",
    phases: {
      beginning: {
        order: 1,
        next: "main",
        onBegin: (_context) => {},
        endIf: () => true,
      },
      main: {
        order: 2,
        next: "end",
        onBegin: (_context) => {},
      },
      end: {
        order: 3,
        next: "beginning",
        onBegin: (_context) => {},
        endIf: () => true,
      },
    },
  },
};

/**
 * Complete Lorcana Game Definition
 *
 * Leverages new architecture:
 * - Engine manages zones, flow, turn/phase state
 * - Trackers auto-reset per-turn actions
 * - Simplified game state (only Lorcana-specific data)
 * - Composable validators and domain operations
 */
export const lorcanaGameDefinition: GameDefinition<
  LorcanaGameState,
  LorcanaMoveParams,
  unknown, // Card definitions (to be added)
  LorcanaCardMeta
> = {
  name: "Disney Lorcana TCG",
  zones: lorcanaZones,
  flow: lorcanaFlow,
  moves: lorcanaMoves,

  /**
   * Tracker Configuration
   *
   * Auto-reset boolean flags for turn actions:
   * - hasInked: Player can only ink once per turn
   * - quested:{cardId}: Each character can only quest once per turn
   */
  trackers: {
    perTurn: ["hasInked"], // Auto-reset at turn end
    perPlayer: true, // Tracked per-player
  },

  /**
   * Game Setup
   *
   * MASSIVELY SIMPLIFIED from old approach:
   * - No manual activePlayerId, turnNumber, gamePhase (engine handles)
   * - No manual zone management (engine handles)
   * - Only Lorcana-specific state initialization
   */
  setup: (players) => {
    const playerIds = players.map((p) => p.id);
    const loreScores: Record<PlayerId, number> = {};

    for (const playerId of playerIds) {
      loreScores[playerId as PlayerId] = 0;
    }

    return {
      loreScores,
      effects: [],
      bag: [],
    };
  },

  /**
   * Win Condition
   *
   * Rule 1.9.1.1: First player to 20 lore wins
   */
  endIf: (state) => {
    for (const [playerId, lore] of Object.entries(state.loreScores)) {
      if (lore >= 20) {
        return {
          winner: playerId,
          reason: "lore_victory",
          metadata: { finalLore: lore },
        };
      }
    }
    return undefined;
  },
};
