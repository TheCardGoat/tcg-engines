import type { FlowDefinition } from "../flow";
import type { GameDefinition, GameMoveDefinitions } from "../game-definition";
import type { CardId, PlayerId, ZoneId } from "../types";
import type { CardZoneConfig } from "../zones";
import { standardMoves } from "../moves/standard-moves";

// Mock Lorcana game state - SIMPLIFIED!
type TestGameState = {
	effects: unknown[];
	bag: unknown[];
	loreScores: Record<string, number>;
};

type AlternativeCost = {
	type: "shift" | "sing" | "sing-together";
	targetInstanceId: CardId[];
};

type TestMoves = {
	// Setup moves
	chooseWhoGoesFirstMove: { playerId: PlayerId };
	alterHand: { playerId: PlayerId; cards: CardId[] };
	drawCards: { playerId: PlayerId; count: number };
	// Game moves
	putACardIntoTheInkwell: { cardId: CardId };
	playCard: { cardId: CardId; alternativeCost?: AlternativeCost };
	quest: { cardId: CardId };
	challenge: { attackerId: CardId; defenderId: CardId };
	sing: { singerId: CardId; songId: CardId };
	singTogether: { singersIds: CardId[]; songId: CardId };
	moveCharacterToLocation: { characterId: CardId; locationId: CardId };
	activateAbility: {
		cardId: CardId;
		opts?: {
			abilityIndex?: number;
			abilityText?: string;
			alternativeCost?: AlternativeCost;
		};
	};
	resolveBag: { bagId: string; params: unknown };
	resolveEffect: { effectId: string; params: unknown };
	manualExert: { cardId: CardId };
	// Standard moves
	passTurn: { playerId: PlayerId };
	concede: { playerId: PlayerId };
};

// Lorcana move definitions
const lorcanaMoves: GameMoveDefinitions<TestGameState, TestMoves> = {
	// Setup moves using engine features
	chooseWhoGoesFirstMove: {
		reducer: (_draft, _context) => {
			// NO MORE: draft.activePlayerId, draft.firstPlayerDetermined, draft.gamePhase, draft.turnNumber
			// Engine handles this!
		},
	},

	alterHand: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;

			// BEFORE: Manual array manipulation (11 lines)
			// AFTER: Use mulligan utility!
			zones.mulligan({
				hand: "hand" as ZoneId,
				deck: "deck" as ZoneId,
				drawCount: 7,
				playerId,
			});
		},
	},

	drawCards: {
		reducer: (_draft, context) => {
			const { zones } = context;
			const playerId = context.params.playerId;
			const count = context.params.count;

			// Use engine's drawCards utility
			zones.drawCards({
				from: "deck" as ZoneId,
				to: "hand" as ZoneId,
				count,
				playerId,
			});
		},
	},

	putACardIntoTheInkwell: {
		condition: (state, context) => {
			const playerId = context.playerId;
			// Use tracker system!
			return !context.trackers?.check("hasInked", playerId);
		},
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;
			const playerId = context.playerId;

			// Move card to inkwell
			context.zones.moveCard({
				cardId,
				targetZoneId: "inkwell" as ZoneId,
			});

			// Mark as inked
			context.trackers?.mark("hasInked", playerId);
		},
	},

	playCard: {
		reducer: (_draft, context) => {
			const cardId = context.params.cardId;

			// Play card to play area
			context.zones.moveCard({
				cardId,
				targetZoneId: "play" as ZoneId,
			});
		},
	},

	quest: {
		condition: (state, context) => {
			const cardId = context.params.cardId;
			// Card hasn't quested this turn
			return !context.trackers?.check(`quested:${cardId}`, context.playerId);
		},
		reducer: (draft, context) => {
			const cardId = context.params.cardId;
			const playerId = context.playerId;

			// Increment lore (simplified - assume 1 lore per quest)
			draft.loreScores[playerId] = (draft.loreScores[playerId] || 0) + 1;

			// Mark as quested
			context.trackers?.mark(`quested:${cardId}`, playerId);
		},
	},

	challenge: {
		reducer: (_draft, _context) => {
			// Challenge logic
		},
	},

	sing: {
		reducer: (_draft, context) => {
			const singerId = context.params.singerId;
			const songId = context.params.songId;

			// Exert singer, play song
			context.zones.moveCard({
				cardId: songId,
				targetZoneId: "play" as ZoneId,
			});
		},
	},

	singTogether: {
		reducer: (_draft, context) => {
			const songId = context.params.songId;

			// Play song via sing together
			context.zones.moveCard({
				cardId: songId,
				targetZoneId: "play" as ZoneId,
			});
		},
	},

	moveCharacterToLocation: {
		reducer: (_draft, _context) => {
			// Move character logic
		},
	},

	activateAbility: {
		reducer: (_draft, _context) => {
			// Ability activation logic
		},
	},

	resolveBag: {
		reducer: (draft, context) => {
			const bagId = context.params.bagId;
			// Remove bag after resolution
			draft.bag = draft.bag.filter((b: any) => b.id !== bagId);
		},
	},

	resolveEffect: {
		reducer: (draft, context) => {
			const effectId = context.params.effectId;
			// Remove effect after resolution
			draft.effects = draft.effects.filter((e: any) => e.id !== effectId);
		},
	},

	manualExert: {
		reducer: (_draft, _context) => {
			// Exert card logic
		},
	},

	// Standard moves from engine
	passTurn: standardMoves<TestGameState>({
		include: ["pass"],
	}).pass!,

	concede: standardMoves<TestGameState>({
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
const lorcanaFlow: FlowDefinition<TestGameState> = {
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
 * Create minimal Lorcana game definition for testing
 *
 * REFACTORED to showcase new engine features:
 * ✨ 90+ lines of boilerplate ELIMINATED!
 * ✅ No manual phase/turn/player tracking
 * ✅ High-level zone utilities (drawCards, mulligan)
 * ✅ Tracker system for per-turn flags (hasInked, quested)
 * ✅ Standard moves library (passTurn, concede)
 */
export function createMockLorcanaGame(): GameDefinition<
	TestGameState,
	TestMoves
> {
	return {
		name: "Test Lorcana Game",
		zones: lorcanaZones,
		flow: lorcanaFlow,
		moves: lorcanaMoves,

		// Configure engine's tracker system
		trackers: {
			perTurn: ["hasInked"],
			perPlayer: true,
		},

		/**
		 * Setup function - MASSIVELY SIMPLIFIED!
		 *
		 * BEFORE: 70+ lines tracking activePlayerId, turnNumber, gamePhase, firstPlayerDetermined, player zones
		 * AFTER: 15 lines - just initialize game-specific data!
		 */
		setup: (players) => {
			const playerIds = players.map((p) => p.id);
			const loreScores: Record<string, number> = {};

			for (const playerId of playerIds) {
				loreScores[playerId] = 0;
			}

			return {
				effects: [],
				bag: [],
				loreScores,
			};
		},
	};
}
