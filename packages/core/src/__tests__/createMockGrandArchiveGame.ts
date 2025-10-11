import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";
import { standardMoves } from "../moves/standard-moves";

// Mock Grand Archive game state - SIMPLIFIED!
// Engine now handles: phase, turn, currentPlayer, setupStep
type TestGameState = {
	opportunityPlayer: PlayerId | null; // Who has Opportunity to act
	champions: Record<
		string,
		{
			id: string;
			level: number;
			damage: number;
		}
	>;
};

type TestMoves = {
	// Setup moves
	initializeGame: { playerId: PlayerId };
	chooseFirstPlayer: { playerId: PlayerId };
	shuffleDecks: { playerId: PlayerId };
	drawStartingHand: { playerId: PlayerId; count: number };
	// Gameplay moves
	materializeCard: { cardId: CardId };
	playCard: { cardId: CardId; targets?: CardId[] };
	declareAttack: { attackerId: CardId; targetId: CardId };
	declareRetaliation: { defenderId: CardId };
	activateAbility: { cardId: CardId; abilityIndex?: number };
	passOpportunity: Record<string, never>;
	endPhase: Record<string, never>;
	// Standard moves
	concede: { playerId: PlayerId };
};

// Grand Archive move definitions
const grandArchiveMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
	// Setup moves - using engine utilities!
	initializeGame: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// Use engine's createDeck utility (instead of manual loop)
			zones.createDeck({
				zoneId: "mainDeck" as ZoneId,
				playerId,
				cardCount: 40,
				shuffle: false,
			});

			zones.createDeck({
				zoneId: "materialDeck" as ZoneId,
				playerId,
				cardCount: 15,
				shuffle: false,
			});
		},
	},

	chooseFirstPlayer: {
		reducer: (_draft, context) => {
			// NO MORE: draft.currentPlayer, draft.phase, draft.turn
			// Engine handles this via flow!
		},
	},

	shuffleDecks: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// Shuffle both decks
			zones.shuffleZone("mainDeck" as ZoneId, playerId);
			zones.shuffleZone("materialDeck" as ZoneId, playerId);
		},
	},

	drawStartingHand: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;
			const count = context.params.count;

			// BEFORE: Manual loop (11 lines)
			// AFTER: Use engine's drawCards utility!
			zones.drawCards({
				from: "mainDeck" as ZoneId,
				to: "hand" as ZoneId,
				count,
				playerId,
			});
		},
	},

	// Gameplay moves enhanced with engine features
	materializeCard: {
		condition: (state, context) => {
			const playerId = context.playerId;
			// Use engine's tracker system!
			return !context.trackers?.check("hasMaterialized", playerId);
		},
		reducer: (draft, context) => {
			const cardId = context.params.cardId;
			const playerId = context.playerId;

			// Move from material deck to memory
			context.zones.moveCard({
				cardId,
				targetZoneId: "memory" as ZoneId,
			});

			// Mark as materialized this turn
			context.trackers?.mark("hasMaterialized", playerId);
		},
	},

	playCard: {
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;

			// Play card to field
			context.zones.moveCard({
				cardId,
				targetZoneId: "field" as ZoneId,
			});
		},
	},

	declareAttack: {
		reducer: (_draft, _context) => {
			// Attack logic
		},
	},

	declareRetaliation: {
		reducer: (_draft, _context) => {
			// Retaliation logic
		},
	},

	activateAbility: {
		reducer: (_draft, _context) => {
			// Ability activation logic
		},
	},

	passOpportunity: {
		reducer: (draft, _context) => {
			// Pass opportunity to next player
			draft.opportunityPlayer = null;
		},
	},

	endPhase: {
		reducer: (draft, _context) => {
			// End current phase
			draft.opportunityPlayer = null;
		},
	},

	// Standard moves from engine library
	concede: standardMoves<TestGameState>({
		include: ["concede"],
	}).concede!,
};

// Grand Archive zones configuration (unchanged)
const grandArchiveZones: Record<string, CardZoneConfig> = {
	hand: {
		id: "hand" as ZoneId,
		name: "zones.hand",
		visibility: "private",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
	mainDeck: {
		id: "mainDeck" as ZoneId,
		name: "zones.mainDeck",
		visibility: "secret",
		ordered: true,
		owner: undefined,
		faceDown: true,
		maxSize: 40,
	},
	materialDeck: {
		id: "materialDeck" as ZoneId,
		name: "zones.materialDeck",
		visibility: "secret",
		ordered: true,
		owner: undefined,
		faceDown: true,
		maxSize: 15,
	},
	memory: {
		id: "memory" as ZoneId,
		name: "zones.memory",
		visibility: "private",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
	field: {
		id: "field" as ZoneId,
		name: "zones.field",
		visibility: "public",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
	graveyard: {
		id: "graveyard" as ZoneId,
		name: "zones.graveyard",
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
	effectsStack: {
		id: "effectsStack" as ZoneId,
		name: "zones.effectsStack",
		visibility: "public",
		ordered: true,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
	intent: {
		id: "intent" as ZoneId,
		name: "zones.intent",
		visibility: "public",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
};

// Grand Archive flow definition (simplified)
const grandArchiveFlow: FlowDefinition<TestGameState> = {
	turn: {
		initialPhase: "wakeUp",
		onBegin: (_context) => {},
		onEnd: (_context) => {},
		phases: {
			wakeUp: {
				order: 1,
				next: "materialize",
				onBegin: (context) => {
					context.state.opportunityPlayer = null;
				},
				endIf: () => true,
			},
			materialize: {
				order: 2,
				next: "recollection",
				onBegin: (context) => {
					context.state.opportunityPlayer = null;
				},
				endIf: () => true,
			},
			recollection: {
				order: 3,
				next: "draw",
				onBegin: (context) => {
					// Grant Opportunity using flow context!
					const currentPlayer = context.getCurrentPlayer();
					context.state.opportunityPlayer = currentPlayer as PlayerId;
				},
			},
			draw: {
				order: 4,
				next: "main",
				onBegin: (context) => {
					context.state.opportunityPlayer = null;
				},
				endIf: () => true,
			},
			main: {
				order: 5,
				next: "end",
				onBegin: (context) => {
					const currentPlayer = context.getCurrentPlayer();
					context.state.opportunityPlayer = currentPlayer as PlayerId;
				},
			},
			end: {
				order: 6,
				next: "wakeUp",
				onBegin: (context) => {
					const currentPlayer = context.getCurrentPlayer();
					context.state.opportunityPlayer = currentPlayer as PlayerId;
				},
				endIf: (_context) => {
					return true;
				},
			},
		},
	},
};

/**
 * Create minimal Grand Archive game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 70+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards)
 * ✅ Tracker system for per-turn flags (hasMaterialized, hasDrawn)
 * ✅ Standard moves library (concede)
 * ✅ Flow context access in phase hooks
 */
export function createMockGrandArchiveGame(): GameDefinition<
	TestGameState,
	TestMoves
> {
	return {
		name: "Test Grand Archive Game",
		zones: grandArchiveZones,
		flow: grandArchiveFlow,
		moves: grandArchiveMoves,

		// Configure engine's tracker system
		trackers: {
			perTurn: ["hasMaterialized", "hasDrawn"],
			perPlayer: true,
		},

		/**
		 * Setup function - MASSIVELY SIMPLIFIED!
		 *
		 * BEFORE: 60+ lines tracking phase, turn, currentPlayer, hasDrawnThisTurn, hasMaterializedThisTurn
		 * AFTER: 20 lines - just initialize game-specific data!
		 */
		setup: (players) => {
			const playerIds = players.map((p) => p.id);
			const champions: Record<
				string,
				{ id: string; level: number; damage: number }
			> = {};

			for (const playerId of playerIds) {
				champions[playerId] = {
					id: `${playerId}-champion`,
					level: 0,
					damage: 0,
				};
			}

			return {
				opportunityPlayer: null,
				champions,
			};
		},
	};
}
