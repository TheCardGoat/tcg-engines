import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";

// Mock One Piece game state
type TestGameState = {
  phase: "setup" | "refresh" | "draw" | "don" | "main" | "end" | "gameOver";
  setupStep?:
    | "initializing"
    | "shuffling"
    | "firstPlayer"
    | "drawHand"
    | "mulligan"
    | "placeLife"
    | "complete";
  turn: number;
  currentPlayer: string;
  firstTurn: boolean;
  battleAllowed: boolean;
  donThisTurn: Record<string, number>;
  mulliganOffered: Record<string, boolean>;
  leaderLife: Record<string, number>;
};

type TestMoves = {
  // Setup moves
  initializeDecks: { playerId: string };
  placeLeader: { playerId: string; leaderId: string };
  determineFirstPlayer: { playerId: string };
  drawOpeningHand: { playerId: string };
  decideMulligan: { playerId: string; redraw: boolean };
  placeLifeCards: { playerId: string; lifeCount: number };
  transitionToGame: Record<string, never>;
  // Core game moves
  draw: { playerId: string };
  placeDon: { playerId: string };
  playCharacter: { playerId: string; cardId: string };
  playEvent: { playerId: string; cardId: string };
  playStage: { playerId: string; cardId: string };
  giveDon: { playerId: string; donCardId: string; targetCardId: string };
  attack: { playerId: string; attackerId: string; targetId?: string };
  activateAbility: { playerId: string; cardId: string };
  pass: { playerId: string };
  concede: { playerId: string };
};

// One Piece move definitions
const onePieceMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
  // Setup moves
  initializeDecks: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;

      // Create 50-card main deck
      for (let i = 0; i < 50; i++) {
        const cardId = `${playerId}-deck-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "deck" as ZoneId,
          position: "bottom",
        });
      }

      // Create 10 DON!! deck cards
      for (let i = 0; i < 10; i++) {
        const cardId = `${playerId}-don-${i}` as CardId;
        zones.moveCard({
          cardId,
          targetZoneId: "donDeck" as ZoneId,
          position: "bottom",
        });
      }

      // Shuffle both decks
      zones.shuffleZone("deck" as ZoneId, playerId);
      zones.shuffleZone("donDeck" as ZoneId, playerId);

      draft.setupStep = "shuffling";
    },
  },

  placeLeader: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const leaderId = context.params.leaderId as CardId;

      // Place Leader card in leader area
      zones.moveCard({
        cardId: leaderId,
        targetZoneId: "leader" as ZoneId,
        position: "bottom",
      });

      draft.setupStep = "firstPlayer";
    },
  },

  determineFirstPlayer: {
    reducer: (draft, context) => {
      const playerId = context.params.playerId;

      // Set first player (in real game, would be random)
      draft.currentPlayer = playerId;
      draft.setupStep = "drawHand";
    },
  },

  drawOpeningHand: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Draw 5 cards from deck to hand
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

      draft.setupStep = "mulligan";
      draft.mulliganOffered[playerId] = true;
    },
  },

  decideMulligan: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const redraw = context.params.redraw;

      if (redraw) {
        // Get all cards in hand
        const handCards = zones.getCardsInZone("hand" as ZoneId, playerId);

        // Move all hand cards back to deck
        for (const cardId of handCards) {
          zones.moveCard({
            cardId,
            targetZoneId: "deck" as ZoneId,
            position: "bottom",
          });
        }

        // Shuffle deck
        zones.shuffleZone("deck" as ZoneId, playerId);

        // Draw 5 new cards
        const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);
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
      }

      // Mark mulligan as complete for this player
      draft.mulliganOffered[playerId] = false;
      draft.setupStep = "placeLife";
    },
  },

  placeLifeCards: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const lifeCount = context.params.lifeCount;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Move life cards from top of deck to life area
      for (let i = 0; i < lifeCount; i++) {
        const cardId = deckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "life" as ZoneId,
            position: "bottom",
          });
        }
      }

      // Track leader life
      draft.leaderLife[playerId] = lifeCount;
    },
  },

  transitionToGame: {
    reducer: (draft) => {
      draft.setupStep = "complete";
      draft.phase = "refresh";
      draft.firstTurn = true;
      draft.battleAllowed = false;
    },
  },

  // Core game moves
  draw: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const deckCards = zones.getCardsInZone("deck" as ZoneId, playerId);

      // Draw 1 card from deck to hand
      const cardId = deckCards[0];
      if (cardId) {
        zones.moveCard({
          cardId,
          targetZoneId: "hand" as ZoneId,
          position: "bottom",
        });
      }
    },
  },

  placeDon: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const playerId = context.params.playerId as PlayerId;
      const donDeckCards = zones.getCardsInZone("donDeck" as ZoneId, playerId);

      // Determine how many DON!! cards to place
      // First player's first turn: 1 card, otherwise: 2 cards
      const isFirstPlayer = draft.currentPlayer === playerId;
      const donCount = draft.firstTurn && isFirstPlayer ? 1 : 2;

      // Move DON!! cards from DON!! deck to cost area
      for (let i = 0; i < donCount && i < donDeckCards.length; i++) {
        const cardId = donDeckCards[i];
        if (cardId) {
          zones.moveCard({
            cardId,
            targetZoneId: "costArea" as ZoneId,
            position: "bottom",
          });
        }
      }

      draft.donThisTurn[playerId] = donCount;
    },
  },

  playCharacter: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Move character card from hand to character area
      zones.moveCard({
        cardId,
        targetZoneId: "characterArea" as ZoneId,
        position: "bottom",
      });
    },
  },

  playEvent: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Move event card from hand to trash (events are one-time use)
      zones.moveCard({
        cardId,
        targetZoneId: "trash" as ZoneId,
        position: "bottom",
      });
    },
  },

  playStage: {
    reducer: (draft, context) => {
      const { zones } = context;
      if (!zones) {
        throw new Error("Zone operations not available");
      }

      const cardId = context.params.cardId as CardId;

      // Move stage card from hand to stage area
      zones.moveCard({
        cardId,
        targetZoneId: "stageArea" as ZoneId,
        position: "bottom",
      });
    },
  },

  giveDon: {
    reducer: () => {
      // Attach DON!! card to character for +1000 power
      // In full implementation, would modify card metadata
    },
  },

  attack: {
    reducer: () => {
      // Declare attack with Leader or Character
      // In full implementation, would initiate battle sequence
    },
  },

  activateAbility: {
    reducer: () => {
      // Activate card ability
      // In full implementation, would resolve ability effects
    },
  },

  pass: {
    reducer: () => {
      // Pass priority or end phase
    },
  },

  concede: {
    reducer: (draft) => {
      draft.phase = "gameOver";
    },
  },
};

// One Piece zones configuration
const onePieceZones: Record<string, CardZoneConfig> = {
  deck: {
    id: "deck" as ZoneId,
    name: "zones.deck",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 50,
  },
  donDeck: {
    id: "donDeck" as ZoneId,
    name: "zones.donDeck",
    visibility: "public",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: 10,
  },
  hand: {
    id: "hand" as ZoneId,
    name: "zones.hand",
    visibility: "secret",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
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
  leader: {
    id: "leader" as ZoneId,
    name: "zones.leader",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  characterArea: {
    id: "characterArea" as ZoneId,
    name: "zones.characterArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 5,
  },
  stageArea: {
    id: "stageArea" as ZoneId,
    name: "zones.stageArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: 1,
  },
  costArea: {
    id: "costArea" as ZoneId,
    name: "zones.costArea",
    visibility: "public",
    ordered: false,
    owner: undefined,
    faceDown: false,
    maxSize: undefined,
  },
  life: {
    id: "life" as ZoneId,
    name: "zones.life",
    visibility: "secret",
    ordered: true,
    owner: undefined,
    faceDown: true,
    maxSize: undefined,
  },
};

// One Piece flow definition
const onePieceFlow: FlowDefinition<TestGameState> = {
  turn: {
    initialPhase: "refresh",
    onBegin: (_context) => {
      // Turn begins
    },
    onEnd: (_context) => {
      // Turn cleanup
    },
    phases: {
      refresh: {
        order: 0,
        next: "draw",
        onBegin: (_context) => {
          // End "until start of turn" effects
          // Return DON!! cards to cost area
          // Ready all rested cards
        },
        endIf: () => true, // Auto-advance
      },
      draw: {
        order: 1,
        next: "don",
        onBegin: (context) => {
          // Draw 1 card (skip first player's first turn)
          const state = context.state as TestGameState;
          if (state.firstTurn && state.turn === 1) {
            // Skip draw on first player's first turn
            return;
          }
        },
        endIf: () => true, // Auto-advance
      },
      don: {
        order: 2,
        next: "main",
        onBegin: (_context) => {
          // Place 2 DON!! cards (1 on first player's first turn)
        },
        endIf: () => true, // Auto-advance
      },
      main: {
        order: 3,
        next: "end",
        onBegin: (context) => {
          // Main phase - play cards, activate abilities, give DON!!, battle
          const state = context.state as TestGameState;
          // Battle not allowed on first turn
          if (state.turn === 1) {
            state.battleAllowed = false;
          } else {
            state.battleAllowed = true;
          }
        },
        // No auto-end - player must pass
      },
      end: {
        order: 4,
        next: "refresh",
        onBegin: (context) => {
          // Trigger end-of-turn effects
          const state = context.state as TestGameState;
          if (state.firstTurn) {
            state.firstTurn = false;
          }
          state.turn += 1;
        },
        endIf: () => true, // Auto-advance
      },
    },
  },
};

/**
 * Create minimal One Piece game definition for testing
 *
 * This demonstrates how the core engine handles One Piece's unique game start:
 * - Dual deck system (50-card deck + 10-card DON!! deck)
 * - Leader card placement (determines Life count)
 * - Opening hand (5 cards with optional mulligan)
 * - Life card placement (face-down from deck)
 * - First turn special rules (1 DON!!, no draw, no battle)
 */
export function createMockOnePieceGame(): GameDefinition<
  TestGameState,
  TestMoves
> {
  return {
    name: "Test One Piece Game",
    zones: onePieceZones,
    flow: onePieceFlow,
    moves: onePieceMoves,
    /**
     * Setup function - called once at game initialization
     *
     * In a full implementation, this would:
     * 1. Prepare and shuffle 50-card deck
     * 2. Prepare 10-card DON!! deck
     * 3. Place Leader card in Leader area
     * 4. Determine first player randomly
     * 5. Draw 5 cards as opening hand
     * 6. Offer mulligan option (redraw once)
     * 7. Place Life cards equal to Leader's Life value
     * 8. First player begins with special first turn rules:
     *    - No draw phase
     *    - Place only 1 DON!! card (instead of 2)
     *    - Cannot battle
     *
     * For this minimal test, we just set the initial game state.
     */
    setup: (players) => {
      // Initialize player-specific data
      const playerIds = players.map((p) => p.id);
      const donThisTurn: Record<string, number> = {};
      const mulliganOffered: Record<string, boolean> = {};
      const leaderLife: Record<string, number> = {};

      for (const playerId of playerIds) {
        donThisTurn[playerId] = 0;
        mulliganOffered[playerId] = false;
        leaderLife[playerId] = 0;
      }

      return {
        phase: "setup",
        setupStep: "initializing",
        turn: 1,
        currentPlayer: playerIds[0] || "p1",
        firstTurn: true,
        battleAllowed: false,
        donThisTurn,
        mulliganOffered,
        leaderLife,
      };
    },
  };
}

