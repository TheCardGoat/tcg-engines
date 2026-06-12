/**
 * Match initialization logic — creates the initial MatchState from config.
 */

import type {
  ChessClockContext,
  CtxRandom,
  CtxStatus,
  DynamicClockContext,
  MatchState,
  PriorityClockContext,
  TCGCtx,
  TimeContext,
  TimeControlConfig,
} from "../types/match-state.ts";
import type { ZoneRuntimeState } from "../types/zone-types.ts";
import type { ZoneConfig } from "../types/zone-types.ts";
import type { FlowDefinition } from "../types/flow-types.ts";

import type { MatchStaticResources, Player } from "./static-resources.ts";
import { seedFromString } from "./random.ts";

import { gundamZones } from "../gundam/zones.ts";
import { gundamFlow } from "../gundam/flow.ts";
import { createInitialGundamG } from "../gundam/config.ts";
import type { GundamG } from "../gundam/types.ts";

// ── Zone initialization helpers ────────────────────────────────────────────────

/**
 * Initialize zone runtime state from the zone configs.
 * For ownerScoped zones, create per-player zone entries.
 */
function initializeZoneState(
  zones: Record<string, ZoneConfig>,
  players: Player[],
): ZoneRuntimeState {
  const zoneCards: Record<string, string[]> = {};
  const zoneSummaries: Record<
    string,
    {
      revision: number;
      count: number;
      topPublicCardID?: string;
    }
  > = {};

  for (const [zoneId, zoneConfig] of Object.entries(zones)) {
    if (zoneConfig.ownerScoped) {
      // Create a zone entry per player
      for (const player of players) {
        const key = `${zoneId}:${player.id}`;
        zoneCards[key] = [];
        zoneSummaries[key] = { revision: 0, count: 0 };
      }
    } else {
      // Global zone — single entry
      zoneCards[zoneId] = [];
      zoneSummaries[zoneId] = { revision: 0, count: 0 };
    }
  }

  return {
    public: { zoneSummaries },
    private: {
      zoneCards,
      cardIndex: {},
      cardMeta: {},
    },
    reveals: {
      active: {},
      nextId: 1,
    },
  };
}

/**
 * Build the initial time context for all players.
 */
function initializeTimeContext(
  players: Player[],
  timeConfig: TimeControlConfig = { mode: "none" },
  activePlayer?: string,
): TimeContext {
  if (timeConfig.mode === "none") return { mode: "none" };

  const now = Date.now();
  if (timeConfig.mode === "chess") {
    const time: ChessClockContext = {
      mode: "chess",
      running: activePlayer != null,
      activePlayerID: activePlayer,
      startedAtMs: activePlayer != null ? now : undefined,
      pausedReason: activePlayer != null ? undefined : "MATCH_NOT_STARTED",
      players: {},
      config: timeConfig.config,
      activePlayerAccumulatedMs: 0,
    };
    for (const player of players) {
      time.players[String(player.id)] = {
        reserveMsRemaining: timeConfig.config.initialReserveMs,
        totalConsumedMs: 0,
        movesMade: 0,
        lastUpdatedAtMs: now,
        timeoutCount: 0,
        isInNegativeTime: false,
      };
    }
    return time;
  }

  if (timeConfig.mode === "priority") {
    const time: PriorityClockContext = {
      mode: "priority",
      running: activePlayer != null,
      activePlayerID: activePlayer,
      startedAtMs: activePlayer != null ? now : undefined,
      pausedReason: activePlayer != null ? undefined : "MATCH_NOT_STARTED",
      prioritySeq: activePlayer != null ? 1 : 0,
      activeWindow:
        activePlayer != null
          ? {
              playerID: activePlayer,
              prioritySeq: 1,
              windowMs: timeConfig.config.perPriorityWindowMs,
              deadlineMs: now + timeConfig.config.perPriorityWindowMs,
            }
          : undefined,
      players: {},
      config: timeConfig.config,
    };
    for (const player of players) {
      time.players[String(player.id)] = {
        reserveMsRemaining: timeConfig.config.reserveMs,
        totalConsumedMs: 0,
        totalWindowOverageMs: 0,
        movesMade: 0,
        moveBonusMsGranted: 0,
        windowTimeouts: 0,
        lastUpdatedAtMs: now,
      };
    }
    return time;
  }

  const time: DynamicClockContext = {
    mode: "dynamic",
    running: activePlayer != null,
    activePlayerID: activePlayer,
    startedAtMs: activePlayer != null ? now : undefined,
    pausedReason: activePlayer != null ? undefined : "MATCH_NOT_STARTED",
    players: {},
    config: timeConfig.config,
    activePlayerAccumulatedMs: 0,
  };
  for (const player of players) {
    time.players[String(player.id)] = {
      reserveMsRemaining: timeConfig.config.initialReserveMs,
      totalConsumedMs: 0,
      movesMade: 0,
      lastUpdatedAtMs: now,
      timeoutCount: 0,
      isInNegativeTime: false,
      actionBonusMsGranted: 0,
      turnPassBonusMsGranted: 0,
    };
  }
  return time;
}

// ── Main initialization ────────────────────────────────────────────────────────

/**
 * Create the full initial MatchState for a new Gundam game.
 *
 * 1. Creates the initial GundamG state
 * 2. Builds initial TCGCtx with empty zones, turn 0, etc.
 * 3. Initializes zone runtime state from gundamZones
 * 4. Returns the fully initialized state
 */
export function initializeMatchState(
  players: Player[],
  staticResources: MatchStaticResources,
  seed: string,
  initialActivePlayer?: string,
  timeConfig: TimeControlConfig = { mode: "none" },
): MatchState<GundamG> {
  void staticResources; // kept for API symmetry — may be used in future
  const playerIds = players.map((p) => p.id);

  // 1. Create initial G
  const initialG = createInitialGundamG(playerIds as string[]);

  // 2. Initialize zone state using gundamZones
  const zones = initializeZoneState(gundamZones, players);

  // 3. Initialize PRNG state
  const prngState = seedFromString(seed);
  const randomCtx: CtxRandom = {
    seed,
    state: prngState,
    drawCount: 0,
  };

  // 4. Build initial status
  const activePlayer = (initialActivePlayer ??
    players[0]!.id) as import("../types/branded.ts").PlayerId;
  const status: CtxStatus = {
    turn: 0,
    activePlayer,
    gameEnded: false,
    pendingDecision: [],
  };

  const flow: FlowDefinition = gundamFlow;

  // Determine initial game segment
  const segmentIds = Object.keys(flow.gameSegments);
  if (flow.initialGameSegment) {
    status.gameSegment = flow.initialGameSegment;
  } else if (segmentIds.length > 0) {
    // Use the segment with the lowest order
    const sorted = Object.values(flow.gameSegments).sort((a, b) => a.order - b.order);
    status.gameSegment = sorted[0]?.id;
  }

  // Determine initial phase from the initial segment
  if (status.gameSegment) {
    const segment = flow.gameSegments[status.gameSegment];
    if (segment) {
      if (segment.turn.initialPhase) {
        status.phase = segment.turn.initialPhase;
      } else {
        const sortedPhases = Object.values(segment.turn.phases).sort((a, b) => a.order - b.order);
        if (sortedPhases.length > 0) {
          status.phase = sortedPhases[0]!.id;
        }
      }

      // Determine initial step
      if (status.phase) {
        const phase = segment.turn.phases[status.phase];
        if (phase?.steps) {
          const sortedSteps = Object.values(phase.steps).sort((a, b) => a.order - b.order);
          if (sortedSteps.length > 0) {
            status.step = sortedSteps[0]!.id;
          }
        }
      }
    }
  }

  // 5. Build initial time context
  const time = initializeTimeContext(players, timeConfig, String(activePlayer));

  // 6. Assemble initial TCGCtx
  const ctx: TCGCtx = {
    protocolVersion: "1.0.0",
    matchID: `match-${Date.now()}`,
    gameID: "Gundam TCG",
    rulesetHash: "",
    _stateID: 0,
    playerIds,
    zones,
    status,
    time,
    random: randomCtx,
  };

  // 8. Build initial MatchState
  const initialState: MatchState<GundamG> = {
    G: initialG,
    ctx,
  };

  return initialState;
}
