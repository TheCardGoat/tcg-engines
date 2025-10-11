import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock Riftbound game state
type TestGameState = {
  phase:
    | "setup"
    | "awaken"
    | "beginning"
    | "channel"
    | "draw"
    | "action"
    | "ending"
    | "gameOver";
  setupStep?:
    | "initializing"
    | "placeLegend"
    | "placeChampion"
    | "placeBattlefields"
    | "shuffleDecks"
    | "drawInitialHand"
    | "complete";
  turn: number;
  activePlayer: string;
  // Track player victory points
  victoryPoints: Record<string, number>;
  // Track battlefield control
  battlefieldControl: Record<string, string | null>; // battlefield id -> player id
  // Track rune pools (energy + power)
  runePools: Record<
    string,
    {
      energy: number;
      power: Record<string, number>; // domain -> count
    }
  >;
  // Track if player has drawn this turn
  hasDrawnThisTurn: Record<string, boolean>;
  // Track conquered battlefields this turn (for scoring)
  conqueredThisTurn: Record<string, string[]>; // playerId -> battlefield ids
};

type TestMoves = {
  // Setup moves
  initializeDecks: { playerId: string };
  placeLegend: { playerId: string; legendId: string };
  placeChampion: { playerId: string; championId: string };
  placeBattlefields: { battlefieldIds: string[] };
  shuffleDecks: { playerId: string };
  drawInitialHand: { playerId: string };
  transitionToPlay: Record<string, never>;

  // Regular game moves
  channelRunes: { playerId: string; count: number };
  drawCard: { playerId: string };
  playUnit: { playerId: string; cardId: string };
  playGear: { playerId: string; cardId: string };
  playSpell: { playerId: string; cardId: string; targets?: string[] };
  moveUnit: { playerId: string; unitId: string; targetLocation: string };
  initiateCombat: { playerId: string; battlefieldId: string };
  pass: { playerId: string };
  concede: { playerId: string };
};

// Riftbound move definitions
const riftboundMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves
  initializeDecks: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Create 40 main deck cards (minimum deck size)
      for (let i = 0; i < 40; i++) {
        const cardId = `${playerId}-main-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "mainDeck" as ZoneId,
          position: "bottom",
        });
      }

      // Create 12 rune cards
      for (let i = 0; i < 12; i++) {
        const cardId = `${playerId}-rune-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "runeDeck" as ZoneId,
          position: "bottom",
        });
      }

      draft.setupStep = "placeLegend";
    },
  },

  placeLegend: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const legendId = context.params.legendId as CardId;

      // Place champion legend in legend zone
      zones.moveCard({
        cardId: legendId,
        targetZoneId: "legendZone" as ZoneId,
        position: "bottom",
      });

      draft.setupStep = "placeChampion";
    },
  },

  placeChampion: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const championId = context.params.championId as CardId;

      // Place chosen champion in champion zone
      zones.moveCard({
        cardId: championId,
        targetZoneId: "championZone" as ZoneId,
        position: "bottom",
      });

      draft.setupStep = "placeBattlefields";
    },
  },

  placeBattlefields: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const battlefieldIds = context.params.battlefieldIds;

      // Place battlefields in battlefield zone (shared zone)
      for (const battlefieldId of battlefieldIds) {
        zones.moveCard({
          cardId: battlefieldId as CardId,
          targetZoneId: "battlefieldZone" as ZoneId,
          position: "bottom",
        });

        // Initialize battlefield control to null (uncontrolled)
        draft.battlefieldControl[battlefieldId] = null;
      }

      draft.setupStep = "shuffleDecks";
    },
  },

  shuffleDecks: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Shuffle both main deck and rune deck
      zones.shuffleZone("mainDeck" as ZoneId, playerId);
      zones.shuffleZone("runeDeck" as ZoneId, playerId);

      draft.setupStep = "drawInitialHand";
    },
  },

  drawInitialHand: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("mainDeck" as ZoneId, playerId);

      // Draw 5 cards from main deck to hand (standard opening hand size)
      for (let i = 0; i < 5; i++) {
        const cardId = deckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "hand" as ZoneId,
            position: "bottom",
          });
        }
      }
    },
  },

  transitionToPlay: {
    reducer: (draft) => {
      draft.setupStep = "complete";
      draft.phase = "awaken";
    },
  },

  // Regular game moves
  channelRunes: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId;
      const count = context.params.count;
      const runeCards = zones.getCardsInZone(
        "runeDeck" as ZoneId,
        playerId as PlayerId,
      );

      // Initialize rune pool if it doesn't exist
      if (!draft.runePools[playerId]) {
        draft.runePools[playerId] = {
          energy: 0,
          power: {},
        };
      }

      // Channel runes from top of rune deck to rune pool
      for (let i = 0; i < count && i < runeCards.length; i++) {
        const cardId = runeCards[i];
        if (cardId) {
          // In real implementation, this would parse rune card and add to pool
          // For mock, we just add generic energy
          draft.runePools[playerId].energy += 1;
        }
      }
    },
  },

  drawCard: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId;
      const deckCards = zones.getCardsInZone(
        "mainDeck" as ZoneId,
        playerId as PlayerId,
      );

      // Draw 1 card from main deck
      const cardId = deckCards[0];
      if (cardId) {
        zones.moveCard({
          cardId,
          targetZoneId: "hand" as ZoneId,
          position: "bottom",
        });
        draft.hasDrawnThisTurn[playerId] = true;
      }
    },
  },

  playUnit: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Play unit from hand to base (units enter exhausted)
      zones.moveCard({
        cardId,
        targetZoneId: "base" as ZoneId,
        position: "bottom",
      });
    },
  },

  playGear: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Play gear from hand to base (gear can only be played to base)
      zones.moveCard({
        cardId,
        targetZoneId: "base" as ZoneId,
        position: "bottom",
      });
    },
  },

  playSpell: {
    reducer: (_draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Spells go directly to trash after resolving
      zones.moveCard({
        cardId,
        targetZoneId: "trash" as ZoneId,
        position: "top",
      });
    },
  },

  moveUnit: {
    reducer: (_draft, _context) => {
      // Unit movement logic (Base <-> Battlefield, or Battlefield <-> Battlefield with Ganking)
    },
  },

  initiateCombat: {
    reducer: (_draft, _context) => {
      // Combat initiation logic
    },
  },

  pass: {
    reducer: (_draft, _context) => {
      // Pass priority
    },
  },

  concede: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId;
      draft.phase = "gameOver";
      console.log(`${playerId} has conceded`);
    },
  },
};

// Riftbound zones configuration
const riftboundZones: Record<string, CardZoneConfig> = {
  mainDeck: {
    id: "mainDeck" as ZoneId,
    name: "zones.mainDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: undefined, // 40+ cards
  },
  runeDeck: {
    id: "runeDeck" as ZoneId,
    name: "zones.runeDeck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 12,
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
  base: {
    id: "base" as ZoneId,
    name: "zones.base",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  legendZone: {
    id: "legendZone" as ZoneId,
    name: "zones.legendZone",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Only 1 Champion Legend
  },
  championZone: {
    id: "championZone" as ZoneId,
    name: "zones.championZone",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1, // Only 1 Chosen Champion
  },
  battlefieldZone: {
    id: "battlefieldZone" as ZoneId,
    name: "zones.battlefieldZone",
    visibility: "public",
    ordered: false,
    owner: undefined, // Shared zone
    faceDown: false,
    maxSize: undefined, // Varies by mode of play
  },
  trash: {
    id: "trash" as ZoneId,
    name: "zones.trash",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  banishment: {
    id: "banishment" as ZoneId,
    name: "zones.banishment",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
};

// Riftbound flow definition
const riftboundFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "awaken",
    onBegin: (_context) => {
      // Turn begins
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      awaken: {
        order: 0,
        next: "beginning",
        onBegin: (_context) => {
          // Ready all exhausted cards
        },
        endIf: () => true, // Auto-advance
      },
      beginning: {
        order: 1,
        next: "channel",
        onBegin: (_context) => {
          // Check battlefield control for "Hold" scoring
        },
        endIf: () => true, // Auto-advance
      },
      channel: {
        order: 2,
        next: "draw",
        onBegin: (_context) => {
          // Channel 2 runes from top of rune deck
        },
        endIf: () => true, // Auto-advance after channeling
      },
      draw: {
        order: 3,
        next: "action",
        onBegin: (_context) => {
          // Draw 1 card from main deck
          // Empty rune pool at end of draw phase
        },
        endIf: () => true, // Auto-advance after draw
      },
      action: {
        order: 4,
        next: "ending",
        // Main action phase - play cards, move units, initiate combat
        // No auto-end - player must pass
      },
      ending: {
        order: 5,
        next: "awaken", // Loop back to awaken for next turn
        segments: {
          endingStep: {
            order: 1,
            next: "expirationStep",
            onBegin: (_context) => {
              // End of turn triggers
            },
            endIf: () => true, // Auto-advance
          },
          expirationStep: {
            order: 2,
            next: "cleanupStep",
            onBegin: (_context) => {
              // Clear damage, expire "this turn" effects
              // Empty rune pool
            },
            endIf: () => true, // Auto-advance
          },
          cleanupStep: {
            order: 3,
            onBegin: (_context) => {
              // Recall gear at battlefields to base
              // Clear temporary effects
            },
            endIf: () => true, // Auto-advance, ends turn
          },
        },
      },
    },
  },
};

/**
 * Create minimal Riftbound game definition for testing
 *
 * This demonstrates how the core engine handles Riftbound's unique features:
 * - Dual deck system (40+ card main deck + 12 rune deck)
 * - Pre-game setup (Champion Legend, Chosen Champion, Battlefields)
 * - Rune pool system (energy + domain power)
 * - Battlefield control and victory point scoring
 * - Turn structure with Awaken/Beginning/Channel/Draw/Action/Ending phases
 */
export function createMockRiftboundGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test Riftbound Game",
    zones: riftboundZones,
    flow: riftboundFlow,
    moves: riftboundMoves,
    /**
     * Setup function - called once at game initialization
     *
     * In a full implementation, this would:
     * 1. Place Champion Legend in Legend Zone
     * 2. Place Chosen Champion Unit in Champion Zone
     * 3. Place Battlefields in Battlefield Zone (varies by mode)
     * 4. Shuffle Main Deck (40+ cards) and Rune Deck (12 cards)
     * 5. Draw 5 cards to each player's hand
     * 6. Randomly determine first player
     * 7. Transition to "awaken" phase for first turn
     *
     * For this minimal test, we just set the initial game state.
     */
    setup: (players) => {
      // Initialize player-specific data
      const playerIds = players.map((p) => p.id);
      const victoryPoints: Record<string, number> = {};
      const runePools: Record<
        string,
        { energy: number; power: Record<string, number> }
      > = {};
      const hasDrawnThisTurn: Record<string, boolean> = {};
      const conqueredThisTurn: Record<string, string[]> = {};

      for (const playerId of playerIds) {
        victoryPoints[playerId] = 0;
        runePools[playerId] = { energy: 0, power: {} };
        hasDrawnThisTurn[playerId] = false;
        conqueredThisTurn[playerId] = [];
      }

      return {
        phase: "setup",
        setupStep: "initializing",
        turn: 1,
        activePlayer: playerIds[0] || "p1",
        victoryPoints,
        battlefieldControl: {},
        runePools,
        hasDrawnThisTurn,
        conqueredThisTurn,
      };
    },
  };
}
