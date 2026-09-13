import {
  MatchRuntime,
  DEFAULT_DYNAMIC_CLOCK_CONFIG,
  asPlayerId,
  createStaticResources,
  type CandidateStrategy,
  type BotDecisionSink,
  type MatchStaticResources,
  type Player,
  type PlayerId,
  type TakeAutomatedActionWithFallbackResult,
} from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import type { GundamCardMeta } from "@tcg/gundam-engine";
import { defaultGundamSetupCards } from "@tcg/gundam-token-data";
import { exbExBase001, exrExResource001 } from "@tcg/gundam-cards";

import { asViewerId, type ViewerId } from "./types.ts";
import {
  realMainDeckCards,
  realResourceCards,
  realShieldCards,
  resolveVisualFixtureCard,
} from "./fixtures/real-cards.ts";

export const DEV_PLAYER_ONE = "player_one" as const;
export const DEV_PLAYER_TWO = "player_two" as const;

export type DevPlayerId = typeof DEV_PLAYER_ONE | typeof DEV_PLAYER_TWO;

export interface DevCardEntry {
  readonly card: Card;
  readonly exhausted?: boolean;
  readonly damage?: number;
}

export interface DevPlayerFixture {
  readonly hand?: ReadonlyArray<Card | DevCardEntry>;
  readonly deck?: ReadonlyArray<Card | DevCardEntry> | number;
  readonly resourceDeck?: ReadonlyArray<Card | DevCardEntry> | number;
  readonly resourceArea?: ReadonlyArray<Card | DevCardEntry>;
  readonly battleArea?: ReadonlyArray<Card | DevCardEntry>;
  readonly baseSection?: ReadonlyArray<Card | DevCardEntry>;
  readonly trash?: ReadonlyArray<Card | DevCardEntry>;
  /**
   * Shield area cards. Fixtures that `skipToMainPhase` bypass the
   * setup-phase shield-fill (see `lifecycle/setup/setup-flow.test.ts`),
   * so any spec that reads opponent shields has to seed them here.
   * Accepts either `Card | DevCardEntry` entries or a number (real,
   * deterministic shield cards auto-generated).
   */
  readonly shieldArea?: ReadonlyArray<Card | DevCardEntry> | number;
}

export interface DevRuntimeConfig {
  readonly p1?: DevPlayerFixture;
  readonly p2?: DevPlayerFixture;
  readonly seed?: string;
  readonly skipToMainPhase?: boolean;
  readonly initialActivePlayer?: DevPlayerId;
  /** Optional visual-lab reserve. Defaults to the production-like dynamic clock. */
  readonly clockReserveMs?: number;
  /** Engine-unit-test escape hatch. Visual fixture factories must never enable it. */
  readonly allowSyntheticCards?: boolean;
}

/**
 * Opaque handle shape attached to fixtures that run a strategy bot.
 * Defined here (structurally, no direct import) to avoid a cycle
 * between `dev-runtime` and `bot/strategy-bot`, which itself depends
 * on the engine. The concrete shape comes from
 * `src/games/gundam/src/game/bot/strategy-bot.ts::StrategyBotHandle`.
 */
export interface DevRuntimeBotHandle {
  getMode(): "auto" | "step" | "paused";
  getSpeed(): "fast" | "balanced" | "slow";
  getStrategyName(): string;
  setMode(mode: "auto" | "step" | "paused"): void;
  setSpeed(speed: "fast" | "balanced" | "slow"): void;
  setStrategy(strategy: CandidateStrategy): void;
  subscribeDecisions(listener: BotDecisionSink): () => void;
  stepOnce(): TakeAutomatedActionWithFallbackResult | undefined;
  dispose(): void;
}

export interface DevRuntime {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly p1Id: ViewerId;
  readonly p2Id: ViewerId;
  /**
   * Set by fixtures that attach a vs-AI bot. When present, the App
   * wraps the tree in `VsAiProvider` so control-panel UI can bind to
   * the handle. Left undefined for all existing fixtures.
   */
  readonly bot?: DevRuntimeBotHandle;
}

interface PlacedCard {
  readonly instanceId: string;
  readonly card: Card;
  readonly zone: string;
  readonly meta: GundamCardMeta;
  readonly damage: number;
}

let instanceCounter = 0;

export function resetDevRuntimeInstanceCounter(): void {
  instanceCounter = 0;
}

function isEntry(v: Card | DevCardEntry): v is DevCardEntry {
  return "card" in v;
}

function expandDeck(
  v: ReadonlyArray<Card | DevCardEntry> | number | undefined,
  fill: (count: number) => readonly Card[],
): ReadonlyArray<Card | DevCardEntry> {
  if (typeof v === "number") return fill(v);
  return v ?? [];
}

function toPlaced(
  playerId: string,
  entry: Card | DevCardEntry,
  zone: string,
  allowSyntheticCards: boolean,
): PlacedCard {
  const inputCard = isEntry(entry) ? entry.card : entry;
  const card = allowSyntheticCards ? inputCard : resolveVisualFixtureCard(inputCard);
  const meta: GundamCardMeta = {
    exhausted: isEntry(entry) ? (entry.exhausted ?? false) : false,
  };
  return {
    instanceId: `${playerId}_${card.cardNumber}_${++instanceCounter}`,
    card,
    zone,
    meta,
    damage: isEntry(entry) ? (entry.damage ?? 0) : 0,
  };
}

function collectPlayer(
  playerId: string,
  fixture: DevPlayerFixture | undefined,
  allowSyntheticCards: boolean,
): PlacedCard[] {
  const f = fixture ?? {};
  const out: PlacedCard[] = [];
  for (const e of f.hand ?? []) out.push(toPlaced(playerId, e, "hand", allowSyntheticCards));
  for (const e of expandDeck(f.deck, realMainDeckCards)) {
    out.push(toPlaced(playerId, e, "deck", allowSyntheticCards));
  }
  for (const e of expandDeck(f.resourceDeck, realResourceCards)) {
    out.push(toPlaced(playerId, e, "resourceDeck", allowSyntheticCards));
  }
  for (const e of f.resourceArea ?? []) {
    out.push(toPlaced(playerId, e, "resourceArea", allowSyntheticCards));
  }
  for (const e of f.battleArea ?? []) {
    out.push(toPlaced(playerId, e, "battleArea", allowSyntheticCards));
  }
  for (const e of f.baseSection ?? []) {
    out.push(toPlaced(playerId, e, "baseSection", allowSyntheticCards));
  }
  for (const e of f.trash ?? []) out.push(toPlaced(playerId, e, "trash", allowSyntheticCards));
  for (const e of expandDeck(f.shieldArea, realShieldCards)) {
    out.push(toPlaced(playerId, e, "shieldArea", allowSyntheticCards));
  }
  return out;
}

function placeIntoRuntime(
  runtime: MatchRuntime,
  playerId: DevPlayerId,
  cards: readonly PlacedCard[],
): void {
  const state = runtime.getState();
  for (const { instanceId, card, zone, meta, damage } of cards) {
    const zoneKey = `${zone}:${playerId}`;
    runtime.registerCardInstance(instanceId, card.cardNumber, asPlayerId(playerId));

    if (!state.ctx.zones.private.zoneCards[zoneKey]) {
      state.ctx.zones.private.zoneCards[zoneKey] = [];
    }
    state.ctx.zones.private.zoneCards[zoneKey].push(instanceId);

    state.ctx.zones.private.cardIndex[instanceId] = {
      zoneKey,
      index: state.ctx.zones.private.zoneCards[zoneKey].length - 1,
      ownerID: asPlayerId(playerId),
      controllerID: asPlayerId(playerId),
    };

    state.ctx.zones.private.cardMeta[instanceId] = meta;

    if (!state.ctx.zones.public.zoneSummaries[zoneKey]) {
      state.ctx.zones.public.zoneSummaries[zoneKey] = { revision: 0, count: 0 };
    }
    state.ctx.zones.public.zoneSummaries[zoneKey].count++;
    state.ctx.zones.public.zoneSummaries[zoneKey].revision++;

    if (meta.exhausted) {
      (state.G as { exhausted: Record<string, boolean> }).exhausted[instanceId] = true;
    }

    if (damage > 0) {
      (state.G as { damage: Record<string, number> }).damage[instanceId] = damage;
    }
  }
}

function skipToMainPhase(runtime: MatchRuntime): void {
  const state = runtime.getState();
  state.ctx.status.gameSegment = "turnCycle";
  state.ctx.status.phase = "main-phase";
  state.ctx.status.pendingDecision = [];
  if (!state.ctx.status.turnPlayer) {
    state.ctx.status.turnPlayer = state.ctx.status.activePlayer;
  }
}

/**
 * Jump past main-phase straight into the end-phase hand-step. Used by
 * fixtures that want to exercise `discardToHandLimit` from the UI —
 * the move's `validate` gates on `phase === "end-phase" && step ===
 * "hand-step"`, and there's no pass-turn path from setup to that state
 * without running the full turn-cycle flow runner.
 *
 * Flipping these fields by hand bypasses onEnter hooks, so this is
 * strictly a test-scaffold shortcut — a real turn transition would
 * also run the drawing / resource / end-phase triggers.
 */
export function skipToEndPhaseHandStep(runtime: MatchRuntime): void {
  const state = runtime.getState();
  state.ctx.status.gameSegment = "turnCycle";
  state.ctx.status.phase = "end-phase";
  state.ctx.status.step = "hand-step";
  state.ctx.status.pendingDecision = [state.ctx.status.activePlayer];
  if (!state.ctx.status.turnPlayer) {
    state.ctx.status.turnPlayer = state.ctx.status.activePlayer;
  }
  // `passTurn` normally seeds `nextTurnPlayer` before end-phase so the
  // turn runner knows where to hand control once end-phase wraps.
  // Since we're jumping in mid-turn (bypassing passTurn), seed it
  // manually — otherwise the post-discard flow-runner has no target
  // for the next turn and spins into the 50-iteration guard.
  const opponentId = state.ctx.playerIds.find((id) => id !== state.ctx.status.activePlayer);
  if (opponentId && !state.ctx.status.nextTurnPlayer) {
    state.ctx.status.nextTurnPlayer = opponentId;
  }
}

export function createDevRuntime(config: DevRuntimeConfig = {}): DevRuntime {
  const {
    p1,
    p2,
    seed = "dev-seed",
    skipToMainPhase: skip = false,
    initialActivePlayer,
    clockReserveMs,
    allowSyntheticCards = false,
  } = config;

  const p1Cards = collectPlayer(DEV_PLAYER_ONE, p1, allowSyntheticCards);
  const p2Cards = collectPlayer(DEV_PLAYER_TWO, p2, allowSyntheticCards);

  const catalog = new Map<string, Card>();
  for (const { card } of [...p1Cards, ...p2Cards]) {
    catalog.set(card.cardNumber, card);
  }
  // Setup tokens (EX Base, EX Resource) are spawned by the engine in
  // `mulligan.ts` and never appear in a player's deck, so the loop above
  // never adds them. The view filter resolves card defs through this same
  // catalog, so without these entries the tokens render as face-down
  // (no name, no image, no stats) once they hit base/resource zones.
  //
  // The host default injects the normal booster tokens (EXB-001 /
  // EXR-001), so those defs must resolve; matches
  // `defaultGundamSetupCards` in @tcg/gundam-token-data.
  catalog.set(exbExBase001.cardNumber, exbExBase001);
  catalog.set(exrExResource001.cardNumber, exrExResource001);

  const p1Player: Player = {
    id: asPlayerId(DEV_PLAYER_ONE),
    name: "Player One",
    deck: p1Cards.filter((c) => c.zone === "deck").map((c) => c.card.cardNumber),
    resourceDeck: p1Cards.filter((c) => c.zone === "resourceDeck").map((c) => c.card.cardNumber),
  };
  const p2Player: Player = {
    id: asPlayerId(DEV_PLAYER_TWO),
    name: "Player Two",
    deck: p2Cards.filter((c) => c.zone === "deck").map((c) => c.card.cardNumber),
    resourceDeck: p2Cards.filter((c) => c.zone === "resourceDeck").map((c) => c.card.cardNumber),
  };

  const staticResources = createStaticResources(
    [p1Player, p2Player],
    catalog,
    defaultGundamSetupCards([p1Player.id, p2Player.id]),
  );
  const runtime = new MatchRuntime(staticResources);
  runtime.initialize(
    [p1Player, p2Player],
    seed,
    (initialActivePlayer ?? DEV_PLAYER_ONE) as PlayerId,
    {
      mode: "dynamic",
      config:
        clockReserveMs === undefined
          ? DEFAULT_DYNAMIC_CLOCK_CONFIG
          : {
              ...DEFAULT_DYNAMIC_CLOCK_CONFIG,
              initialReserveMs: clockReserveMs,
              reserveCapMs: Math.max(clockReserveMs, DEFAULT_DYNAMIC_CLOCK_CONFIG.reserveCapMs),
            },
    },
  );

  placeIntoRuntime(runtime, DEV_PLAYER_ONE, p1Cards);
  placeIntoRuntime(runtime, DEV_PLAYER_TWO, p2Cards);

  if (skip) skipToMainPhase(runtime);

  return {
    runtime,
    staticResources,
    p1Id: asViewerId(DEV_PLAYER_ONE),
    p2Id: asViewerId(DEV_PLAYER_TWO),
  };
}
