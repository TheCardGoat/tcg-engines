import { z } from "zod";

import type { GameType } from "./ids.js";
import { replayStepPosition, type ReplayPlaybackV1, type ReplayReversal } from "./replay.js";
import { materializeReplayStateAtCursor } from "./replay-materializer.js";
import { GameTypeSchema } from "./schemas.js";

export const SIMULATOR_DEBUG_EXPORT_VERSION = 1 as const;

export type SimulatorDebugExportEnvironment = "development" | "staging" | "test" | "unknown";

export interface SimulatorDebugExportMoveV1 {
  index: number;
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  commandId?: string;
  input?: unknown;
  processedCommand?: unknown;
  timestamp: number;
}

export interface SimulatorDebugExportDomainEventV1 {
  stateVersion: number;
  commandId?: string;
  timestamp: number;
  event: unknown;
}

export interface SimulatorDebugExportWarningV1 {
  code:
    | "initial_state_unavailable"
    | "range_start_state_unavailable"
    | "moves_unavailable"
    | "domain_events_unavailable"
    | "patches_unavailable"
    | "patch_application_failed";
  message: string;
  stateVersion?: number;
}

export interface SimulatorDebugExportV1 {
  schemaVersion: typeof SIMULATOR_DEBUG_EXPORT_VERSION;
  exportedAt: string;
  environment: SimulatorDebugExportEnvironment;
  releaseSha?: string;
  game: {
    slug: GameType;
    gameId: string;
    matchId: string;
    seed?: string;
  };
  range: {
    startMove: number;
    endMove: number;
    startStateVersion: number;
    endStateVersion: number;
    totalMoves: number;
  };
  originalInitialState: unknown;
  stateBeforeRange: unknown;
  moves: SimulatorDebugExportMoveV1[];
  domainEvents: SimulatorDebugExportDomainEventV1[];
  warnings: SimulatorDebugExportWarningV1[];
}

export interface SimulatorDebugExportRangeRequest {
  startMove: number;
  endMove: number;
}

export interface SimulatorDebugExportBuildMetadata {
  exportedAt?: string;
  environment: SimulatorDebugExportEnvironment;
  releaseSha?: string;
}

/** Optional authoritative audit fields layered over canonical replay steps. */
export type SimulatorDebugReplayAuditStep = { logs: readonly unknown[] } & (
  | { acceptedMove: SimulatorDebugAcceptedAudit; reversal?: never }
  | { acceptedMove: null; reversal: ReplayReversal }
);

interface SimulatorDebugAcceptedAudit {
  stateVersion: number;
  turnNumber: number;
  actorId: string;
  moveId: string;
  input?: unknown;
  commandId?: string;
  processedCommand?: unknown;
  timestamp: number;
}

export class SimulatorDebugExportRangeError extends Error {
  readonly code = "invalid_debug_export_range";

  constructor(message: string) {
    super(message);
    this.name = "SimulatorDebugExportRangeError";
  }
}

const jsonValue = z.json();
const optionalJsonValue = jsonValue.optional();

export const SimulatorDebugExportMoveV1Schema = z
  .object({
    index: z.number().int().positive(),
    stateVersion: z.number().int().nonnegative(),
    turnNumber: z.number().int().nonnegative(),
    actorId: z.string().min(1),
    moveId: z.string().min(1),
    commandId: z.string().min(1).optional(),
    input: optionalJsonValue,
    processedCommand: optionalJsonValue,
    timestamp: z.number().finite(),
  })
  .strict();

export const SimulatorDebugExportDomainEventV1Schema = z
  .object({
    stateVersion: z.number().int().nonnegative(),
    commandId: z.string().min(1).optional(),
    timestamp: z.number().finite(),
    event: jsonValue,
  })
  .strict();

export const SimulatorDebugExportWarningV1Schema = z
  .object({
    code: z.enum([
      "initial_state_unavailable",
      "range_start_state_unavailable",
      "moves_unavailable",
      "domain_events_unavailable",
      "patches_unavailable",
      "patch_application_failed",
    ]),
    message: z.string().min(1),
    stateVersion: z.number().int().nonnegative().optional(),
  })
  .strict();

export const SimulatorDebugExportV1Schema = z
  .object({
    schemaVersion: z.literal(SIMULATOR_DEBUG_EXPORT_VERSION),
    exportedAt: z.iso.datetime(),
    environment: z.enum(["development", "staging", "test", "unknown"]),
    releaseSha: z.string().min(1).optional(),
    game: z
      .object({
        slug: GameTypeSchema,
        gameId: z.string().min(1),
        matchId: z.string().min(1),
        seed: z.string().optional(),
      })
      .strict(),
    range: z
      .object({
        startMove: z.number().int().positive(),
        endMove: z.number().int().positive(),
        startStateVersion: z.number().int().nonnegative(),
        endStateVersion: z.number().int().nonnegative(),
        totalMoves: z.number().int().nonnegative(),
      })
      .strict()
      .refine((range) => range.startMove <= range.endMove, {
        message: "startMove must be less than or equal to endMove",
      }),
    originalInitialState: jsonValue,
    stateBeforeRange: jsonValue,
    moves: z.array(SimulatorDebugExportMoveV1Schema),
    domainEvents: z.array(SimulatorDebugExportDomainEventV1Schema),
    warnings: z.array(SimulatorDebugExportWarningV1Schema),
  })
  .strict()
  .superRefine((value, context) => {
    const expectedMoveCount = value.range.endMove - value.range.startMove + 1;
    if (value.range.endMove > value.range.totalMoves) {
      context.addIssue({
        code: "custom",
        path: ["range", "endMove"],
        message: "endMove must not exceed totalMoves",
      });
    }
    if (value.moves.length !== expectedMoveCount) {
      context.addIssue({
        code: "custom",
        path: ["moves"],
        message: `moves must contain exactly ${expectedMoveCount} entries for the selected range`,
      });
    }
    value.moves.forEach((move, offset) => {
      if (move.index !== value.range.startMove + offset) {
        context.addIssue({
          code: "custom",
          path: ["moves", offset, "index"],
          message: "move indexes must exactly match the inclusive selected range",
        });
      }
    });
    if (value.moves[0]?.stateVersion !== value.range.startStateVersion) {
      context.addIssue({
        code: "custom",
        path: ["range", "startStateVersion"],
        message: "startStateVersion must match the first selected move",
      });
    }
    if (value.moves.at(-1)?.stateVersion !== value.range.endStateVersion) {
      context.addIssue({
        code: "custom",
        path: ["range", "endStateVersion"],
        message: "endStateVersion must match the last selected move",
      });
    }
  });

export function stringifySimulatorDebugExport(value: SimulatorDebugExportV1): string {
  return `${JSON.stringify(SimulatorDebugExportV1Schema.parse(value), null, 2)}\n`;
}

/**
 * Build a debug envelope from the same ReplayPlaybackV1 consumed by replay
 * playback and replay forks. State reconstruction delegates to the canonical
 * replay cursor materializer; audit steps only enrich moves and opaque logs.
 */
export function buildSimulatorDebugExportFromReplay(
  playback: ReplayPlaybackV1,
  query: SimulatorDebugExportRangeRequest,
  metadata: SimulatorDebugExportBuildMetadata,
  auditSteps?: readonly SimulatorDebugReplayAuditStep[],
  initialWarnings: readonly SimulatorDebugExportWarningV1[] = [],
): SimulatorDebugExportV1 {
  const replay = playback.replay;
  validateDebugExportRange(query, replay.steps.length);
  const warnings = [...initialWarnings];
  const originalInitialState = jsonValueOrNull(
    replay.initialState,
    warnings,
    "initial_state_unavailable",
    "The replay initial state cannot be represented as JSON.",
  );
  let stateBeforeRange: unknown = null;
  try {
    stateBeforeRange = jsonValueOrNull(
      materializeReplayStateAtCursor(replay, query.startMove - 1),
      warnings,
      "range_start_state_unavailable",
      "The replay state before the selected range cannot be represented as JSON.",
    );
  } catch (error) {
    warnings.push({
      code: "patch_application_failed",
      message: `Replay reconstruction failed before move ${query.startMove}: ${error instanceof Error ? error.message : String(error)}`,
    });
  }

  const selectedReplaySteps = replay.steps.slice(query.startMove - 1, query.endMove);
  let warnedAboutMissingCommands = false;
  const moves = selectedReplaySteps.flatMap((step, offset) => {
    if (step.acceptedMove === null) return [];
    const index = query.startMove + offset;
    const audit = auditSteps?.[index - 1];
    const accepted = audit?.acceptedMove ?? {
      ...step.acceptedMove,
      input: step.acceptedMove.payload,
    };
    const input = optionalJsonValueOrUndefined(accepted.input);
    const processedCommand = optionalJsonValueOrUndefined(accepted.processedCommand);
    if (accepted.input !== undefined && input === undefined) {
      warnings.push({
        code: "moves_unavailable",
        message: `Move ${index} has an input that cannot be represented as JSON.`,
        stateVersion: accepted.stateVersion,
      });
    }
    if (accepted.processedCommand !== undefined && processedCommand === undefined) {
      warnings.push({
        code: "moves_unavailable",
        message: `Move ${index} has a processed command that cannot be represented as JSON.`,
        stateVersion: accepted.stateVersion,
      });
    } else if (accepted.processedCommand === undefined && !warnedAboutMissingCommands) {
      warnings.push({
        code: "moves_unavailable",
        message:
          "Processed commands are unavailable in this replay history; accepted replay moves remain complete.",
      });
      warnedAboutMissingCommands = true;
    }
    const commandId =
      accepted.commandId ?? commandIdFromUnknown(processedCommand) ?? commandIdFromUnknown(input);
    return [
      {
        index,
        stateVersion: accepted.stateVersion,
        turnNumber: accepted.turnNumber,
        actorId: accepted.actorId,
        moveId: accepted.moveId,
        ...(commandId ? { commandId } : {}),
        ...(input !== undefined ? { input } : {}),
        ...(processedCommand !== undefined ? { processedCommand } : {}),
        timestamp: accepted.timestamp,
      },
    ];
  });

  const domainEvents = selectedReplaySteps.flatMap((step, offset) => {
    const index = query.startMove + offset;
    const audit = auditSteps?.[index - 1];
    const records = audit?.logs ?? step.logs.map((log) => log.data ?? log);
    return records.flatMap((event) => {
      const jsonEvent = optionalJsonValueOrUndefined(event);
      const stateVersion =
        audit?.acceptedMove?.stateVersion ?? replayStepPosition(step).stateVersion;
      if (jsonEvent === undefined) {
        warnings.push({
          code: "domain_events_unavailable",
          message: `A domain event at state version ${stateVersion} cannot be represented as JSON.`,
          stateVersion,
        });
        return [];
      }
      const commandId = commandIdFromUnknown(event) ?? audit?.acceptedMove?.commandId;
      return [
        {
          stateVersion,
          ...(commandId ? { commandId } : {}),
          timestamp:
            timestampFromUnknown(event) ??
            audit?.acceptedMove?.timestamp ??
            replayStepPosition(step).timestamp,
          event: jsonEvent,
        },
      ];
    });
  });

  const selectedFirst = replayStepPosition(selectedReplaySteps[0]!);
  const selectedLast = replayStepPosition(selectedReplaySteps.at(-1)!);
  return SimulatorDebugExportV1Schema.parse({
    schemaVersion: SIMULATOR_DEBUG_EXPORT_VERSION,
    exportedAt: metadata.exportedAt ?? new Date().toISOString(),
    environment: metadata.environment,
    ...(metadata.releaseSha ? { releaseSha: metadata.releaseSha } : {}),
    game: {
      slug: replay.gameType,
      gameId: replay.gameId,
      matchId: replay.matchId,
      ...(replay.seed ? { seed: replay.seed } : {}),
    },
    range: {
      startMove: query.startMove,
      endMove: query.endMove,
      startStateVersion: selectedFirst.stateVersion,
      endStateVersion: selectedLast.stateVersion,
      totalMoves: replay.steps.length,
    },
    originalInitialState,
    stateBeforeRange,
    moves,
    domainEvents,
    warnings,
  });
}

function validateDebugExportRange(
  query: SimulatorDebugExportRangeRequest,
  totalMoves: number,
): void {
  if (!Number.isSafeInteger(query.startMove) || query.startMove < 1) {
    throw new SimulatorDebugExportRangeError("startMove must be a positive integer");
  }
  if (!Number.isSafeInteger(query.endMove) || query.endMove < query.startMove) {
    throw new SimulatorDebugExportRangeError(
      "endMove must be an integer greater than or equal to startMove",
    );
  }
  if (query.endMove > totalMoves) {
    throw new SimulatorDebugExportRangeError(
      `endMove ${query.endMove} exceeds the available move count ${totalMoves}`,
    );
  }
}

function jsonValueOrNull(
  value: unknown,
  warnings: SimulatorDebugExportWarningV1[],
  code: SimulatorDebugExportWarningV1["code"],
  message: string,
): unknown {
  const result = jsonValue.safeParse(value);
  if (result.success) return result.data;
  warnings.push({ code, message });
  return null;
}

function optionalJsonValueOrUndefined(value: unknown): unknown {
  if (value === undefined) return undefined;
  const result = jsonValue.safeParse(value);
  return result.success ? result.data : undefined;
}

function commandIdFromUnknown(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;
  if (typeof value.commandId === "string") return value.commandId;
  if (typeof value.commandID === "string") return value.commandID;
  return isRecord(value.execution) && typeof value.execution.commandId === "string"
    ? value.execution.commandId
    : undefined;
}

function timestampFromUnknown(value: unknown): number | undefined {
  if (!isRecord(value)) return undefined;
  return typeof value.timestamp === "number" && Number.isFinite(value.timestamp)
    ? value.timestamp
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
