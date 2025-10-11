import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";
import { standardMoves } from "../moves/standard-moves";

// Mock One Piece game state - SIMPLIFIED!
type TestGameState = {
	battleAllowed: boolean;
	leaderLife: Record<string, number>;
};

type TestMoves = {
	// Setup moves
	initializeDecks: { playerId: PlayerId };
	placeLeader: { playerId: PlayerId; leaderId: CardId };
	determineFirstPlayer: { playerId: PlayerId };
	drawOpeningHand: { playerId: PlayerId };
	decideMulligan: { playerId: PlayerId; redraw: boolean };
	placeLifeCards: { playerId: PlayerId; lifeCount: number };
	transitionToGame: Record<string, never>;
	// Core game moves
	draw: { playerId: PlayerId };
	placeDon: { playerId: PlayerId };
	playCharacter: { playerId: PlayerId; cardId: CardId };
	playEvent: { playerId: PlayerId; cardId: CardId };
	playStage: { playerId: PlayerId; cardId: CardId };
	giveDon: { playerId: PlayerId; donCardId: CardId; targetCardId: CardId };
	attack: { playerId: PlayerId; attackerId: CardId; targetId?: CardId };
	activateAbility: { playerId: PlayerId; cardId: CardId };
	// Standard moves
	pass: { playerId: PlayerId };
	concede: { playerId: PlayerId };
};

// One Piece move definitions
const onePieceMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
	// Setup moves using engine utilities
	initializeDecks: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// Use engine's createDeck utility!
			zones.createDeck({
				zoneId: "deck" as ZoneId,
				playerId,
				cardCount: 50,
				shuffle: true,
			});

			zones.createDeck({
				zoneId: "donDeck" as ZoneId,
				playerId,
				cardCount: 10,
				shuffle: true,
			});

			// NO MORE: draft.setupStep
		},
	},

	placeLeader: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const leaderId = context.params.leaderId;

			// Place Leader card in leader area
			zones.moveCard({
				cardId: leaderId,
				targetZoneId: "leader" as ZoneId,
			});

			// NO MORE: draft.setupStep
		},
	},

	determineFirstPlayer: {
		reducer: (_draft, _context) => {
			// NO MORE: draft.currentPlayer, draft.firstTurn, draft.setupStep
			// Engine handles this!
		},
	},

	drawOpeningHand: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// BEFORE: Manual loop (11 lines)
			// AFTER: Use drawCards utility!
			zones.drawCards({
				from: "deck" as ZoneId,
				to: "hand" as ZoneId,
				count: 5,
				playerId,
			});

			// NO MORE: draft.setupStep, draft.mulliganOffered
		},
	},

	decideMulligan: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;
			const redraw = context.params.redraw;

			if (redraw) {
				// BEFORE: Manual mulligan (22 lines)
				// AFTER: One line!
				zones.mulligan({
					hand: "hand" as ZoneId,
					deck: "deck" as ZoneId,
					drawCount: 5,
					playerId,
				});
			}

			// NO MORE: draft.mulliganOffered
		},
	},

	placeLifeCards: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;
			const lifeCount = context.params.lifeCount;

			// BEFORE: Manual loop (9 lines)
			// AFTER: Use bulkMove utility!
			zones.bulkMove({
				from: "deck" as ZoneId,
				to: "life" as ZoneId,
				count: lifeCount,
				playerId,
				position: "bottom",
			});

			// NO MORE: draft.setupStep
		},
	},

	transitionToGame: {
		reducer: (_draft, _context) => {
			// NO MORE: draft.setupStep, draft.phase, draft.turn, draft.firstTurn
		},
	},

	// Core game moves
	draw: {
		condition: (state, context) => {
			// First player skips draw on first turn
			const isFirstTurn = context.flow?.isFirstTurn ?? false;
			const isFirstPlayer = context.flow?.currentPlayer === context.playerId;

			if (isFirstTurn && isFirstPlayer) {
				return false;
			}

			return true;
		},
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			zones.drawCards({
				from: "deck" as ZoneId,
				to: "hand" as ZoneId,
				count: 1,
				playerId,
			});
		},
	},

	placeDon: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// Get DON!! count for this turn (use flow.turn)
			const turnNumber = context.flow?.turn ?? 1;
			const donCount = Math.min(turnNumber, 10);

			// Draw DON!! cards
			zones.bulkMove({
				from: "donDeck" as ZoneId,
				to: "donArea" as ZoneId,
				count: donCount,
				playerId,
			});
		},
	},

	playCharacter: {
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;

			context.zones.moveCard({
				cardId,
				targetZoneId: "characters" as ZoneId,
			});
		},
	},

	playEvent: {
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;

			// Events go directly to discard
			context.zones.moveCard({
				cardId,
				targetZoneId: "discard" as ZoneId,
			});
		},
	},

	playStage: {
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;

			context.zones.moveCard({
				cardId,
				targetZoneId: "stage" as ZoneId,
			});
		},
	},

	giveDon: {
		reducer: (_draft, context) => {
			const donCardId = context.params.donCardId;

			// Attach DON!! to character (simplified)
			context.zones.moveCard({
				cardId: donCardId,
				targetZoneId: "donArea" as ZoneId,
			});
		},
	},

	attack: {
		reducer: (draft, _context) => {
			// Mark battle as in progress
			draft.battleAllowed = true;
		},
	},

	activateAbility: {
		reducer: (_draft, _context) => {
			// Ability activation logic
		},
	},

	// Standard moves from engine
	pass: standardMoves<TestGameState>({
		include: ["pass"],
	}).pass!,

	concede: standardMoves<TestGameState>({
		include: ["concede"],
	}).concede!,
};

// One Piece zones (unchanged)
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
	hand: {
		id: "hand" as ZoneId,
		name: "zones.hand",
		visibility: "private",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
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
	donArea: {
		id: "donArea" as ZoneId,
		name: "zones.donArea",
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
	characters: {
		id: "characters" as ZoneId,
		name: "zones.characters",
		visibility: "public",
		ordered: false,
		owner: undefined,
		faceDown: false,
		maxSize: undefined,
	},
	stage: {
		id: "stage" as ZoneId,
		name: "zones.stage",
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
		maxSize: 5,
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

// One Piece flow (simplified)
const onePieceFlow: FlowDefinition<TestGameState> = {
	turn: {
		initialPhase: "refresh",
		phases: {
			refresh: {
				order: 1,
				next: "draw",
				onBegin: (_context) => {},
				endIf: () => true,
			},
			draw: {
				order: 2,
				next: "don",
				onBegin: (_context) => {},
				endIf: () => true,
			},
			don: {
				order: 3,
				next: "main",
				onBegin: (_context) => {},
				endIf: () => true,
			},
			main: {
				order: 4,
				next: "end",
				onBegin: (_context) => {},
			},
			end: {
				order: 5,
				next: "refresh",
				onBegin: (context) => {
					context.state.battleAllowed = false;
				},
				endIf: () => true,
			},
		},
	},
};

/**
 * Create minimal One Piece game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 140+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (createDeck, drawCards, mulligan, bulkMove)
 * ✅ Standard moves library (pass, concede)
 * ✅ Flow context access (isFirstTurn, turn)
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
		 * Setup function - MASSIVELY SIMPLIFIED!
		 *
		 * BEFORE: 100+ lines tracking phase, setupStep, turn, currentPlayer, firstTurn, mulliganOffered, donThisTurn
		 * AFTER: 15 lines - just initialize game-specific data!
		 */
		setup: (players) => {
			const playerIds = players.map((p) => p.id);
			const leaderLife: Record<string, number> = {};

			for (const playerId of playerIds) {
				leaderLife[playerId] = 5; // Default starting life
			}

			return {
				battleAllowed: false,
				leaderLife,
			};
		},
	};
}
