import type { CommandEnvelope } from "../types/command.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameLogEntry } from "../types/game-events.ts";
import type {
  AttackLog,
  AssignPilotLog,
  BlockLog,
  DeployBaseLog,
  DeployUnitLog,
  GameEndLog,
  GundamMoveLog,
  GundamMoveOutcomes,
  PassLog,
  PlayCommandLog,
  ResolveEffectLog,
  TurnStartLog,
} from "../types/move-log.ts";
import type { GundamActionLogMessageKey } from "../gundam/logging.ts";
import { GundamMoveOutcomeAccumulator } from "./move-outcome-accumulator.ts";

const ACTION_LOG_MESSAGE_KEYS = {
  "gundam.move.deployUnit": true,
  "gundam.move.deployBase": true,
  "gundam.move.playCommand": true,
  "gundam.move.assignPilot": true,
  "gundam.move.attackDeclared": true,
  "gundam.move.blockDeclared": true,
  "gundam.move.activateAbility": true,
  "gundam.move.pass": true,
  "gundam.move.concede": true,
  "gundam.turn.started": true,
  "gundam.system.gameOver": true,
} as const satisfies Record<GundamActionLogMessageKey, true>;

function isActionLogMessageKey(key: string): key is GundamActionLogMessageKey {
  return Object.hasOwn(ACTION_LOG_MESSAGE_KEYS, key);
}

function valuesOf(entry: GameLogEntry): Record<string, unknown> {
  return ((entry.data as { values?: Record<string, unknown> } | undefined)?.values ?? {}) as Record<
    string,
    unknown
  >;
}

function categoryOf(entry: GameLogEntry): string | undefined {
  return (entry.data as { category?: string } | undefined)?.category;
}

function asCardId(value: unknown): CardInstanceId | undefined {
  return typeof value === "string" && value.length > 0 ? (value as CardInstanceId) : undefined;
}

function asPlayer(value: unknown): PlayerId | undefined {
  return typeof value === "string" && value.length > 0 ? (value as PlayerId) : undefined;
}

function base(entry: GameLogEntry, command: CommandEnvelope, playerId: PlayerId) {
  return {
    playerId,
    timestamp: entry.timestamp,
    stateID: entry.stateID,
    commandID: command.commandID,
  };
}

function attachOutcomes<T extends { outcomes?: GundamMoveOutcomes }>(
  log: Omit<T, "outcomes">,
  outcomes: GundamMoveOutcomes | undefined,
): T {
  return (outcomes ? { ...log, outcomes } : log) as T;
}

export function buildGundamMoveLog(args: {
  command: CommandEnvelope;
  playerId: PlayerId;
  logEntries: readonly GameLogEntry[];
  timestamp: number;
}): GundamMoveLog | undefined {
  const accumulator = new GundamMoveOutcomeAccumulator();
  for (const entry of args.logEntries) {
    accumulator.accumulate(entry);
  }
  const outcomes = accumulator.flush();

  const actionEntry =
    args.logEntries.find(
      (entry) => isActionLogMessageKey(entry.type) && categoryOf(entry) === "action",
    ) ?? args.logEntries.find((entry) => isActionLogMessageKey(entry.type));

  if (!actionEntry) {
    return buildFromCommand(args.command, args.playerId, args.timestamp, outcomes);
  }

  return convertActionEntry(actionEntry, args.command, args.playerId, outcomes);
}

export function projectGundamMoveLogs(args: {
  command: CommandEnvelope;
  playerId: PlayerId;
  logEntries: readonly GameLogEntry[];
  timestamp: number;
}): GundamMoveLog[] {
  const log = buildGundamMoveLog(args);
  return log ? [log] : [];
}

function buildFromCommand(
  command: CommandEnvelope,
  playerId: PlayerId,
  timestamp: number,
  outcomes?: GundamMoveOutcomes,
): GundamMoveLog | undefined {
  if (command.move === "passActionStep") {
    return {
      type: "pass",
      playerId,
      timestamp,
      commandID: command.commandID,
      context: "action-step",
    };
  }
  if (command.move === "passBattleAction") {
    return { type: "pass", playerId, timestamp, commandID: command.commandID, context: "battle" };
  }
  if (command.move === "passBlock") {
    return { type: "pass", playerId, timestamp, commandID: command.commandID, context: "block" };
  }
  if (command.move === "passTurn") {
    return { type: "pass", playerId, timestamp, commandID: command.commandID, context: "turn" };
  }
  if (command.move === "resolveEffect" && outcomes?.effectsResolved?.[0]) {
    const resolved = outcomes.effectsResolved[0];
    return {
      type: "resolveEffect",
      playerId,
      timestamp,
      commandID: command.commandID,
      sourceCardId: resolved.sourceCardId,
      effectId: resolved.effectId,
      outcomes,
    };
  }
  return undefined;
}

function convertActionEntry(
  entry: GameLogEntry,
  command: CommandEnvelope,
  fallbackPlayerId: PlayerId,
  outcomes?: GundamMoveOutcomes,
): GundamMoveLog | undefined {
  const values = valuesOf(entry);

  switch (entry.type as GundamActionLogMessageKey) {
    case "gundam.move.deployUnit": {
      const cardId = asCardId(values.cardId);
      if (!cardId) return undefined;
      return attachOutcomes<DeployUnitLog>(
        {
          type: "deployUnit",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          cardId,
          cost: typeof values.cost === "number" ? values.cost : 0,
        },
        outcomes,
      );
    }
    case "gundam.move.deployBase": {
      const cardId = asCardId(values.cardId);
      if (!cardId) return undefined;
      return attachOutcomes<DeployBaseLog>(
        {
          type: "deployBase",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          cardId,
          cost: typeof values.cost === "number" ? values.cost : 0,
        },
        outcomes,
      );
    }
    case "gundam.move.playCommand": {
      const cardId = asCardId(values.cardId);
      if (!cardId) return undefined;
      return attachOutcomes<PlayCommandLog>(
        {
          type: "playCommand",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          cardId,
          cost: typeof values.cost === "number" ? values.cost : 0,
        },
        outcomes,
      );
    }
    case "gundam.move.assignPilot": {
      const pilotId = asCardId(values.pilotId);
      const unitId = asCardId(values.unitId);
      if (!pilotId || !unitId) return undefined;
      return attachOutcomes<AssignPilotLog>(
        {
          type: "assignPilot",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          pilotId,
          unitId,
        },
        outcomes,
      );
    }
    case "gundam.move.attackDeclared": {
      const attackerId = asCardId(values.attackerId);
      const targetId = values.targetId === "direct" ? "direct" : asCardId(values.targetId);
      if (!attackerId || !targetId) return undefined;
      return attachOutcomes<AttackLog>(
        {
          type: "attack",
          ...base(entry, command, asPlayer(values.attackerPlayerId) || fallbackPlayerId),
          attackerId,
          targetId,
        },
        outcomes,
      );
    }
    case "gundam.move.blockDeclared": {
      const blockerId = asCardId(values.blockerId);
      const attackerId = asCardId(values.attackerId);
      if (!blockerId || !attackerId) return undefined;
      return attachOutcomes<BlockLog>(
        {
          type: "block",
          ...base(entry, command, asPlayer(values.blockerPlayerId) || fallbackPlayerId),
          blockerId,
          attackerId,
        },
        outcomes,
      );
    }
    case "gundam.move.activateAbility": {
      const sourceCardId = asCardId(values.cardId);
      if (!sourceCardId) return undefined;
      return attachOutcomes<ResolveEffectLog>(
        {
          type: "resolveEffect",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          sourceCardId,
          effectIndex: typeof values.effectIndex === "number" ? values.effectIndex : undefined,
          resolution: { kind: "automatic" },
        },
        outcomes,
      );
    }
    case "gundam.move.pass":
      return attachOutcomes<PassLog>(
        {
          type: "pass",
          ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
          context:
            values.context === "block" ||
            values.context === "battle" ||
            values.context === "turn" ||
            values.context === "action-step"
              ? values.context
              : "action-step",
        },
        outcomes,
      );
    case "gundam.move.concede":
      return {
        type: "gameEnd",
        ...base(entry, command, fallbackPlayerId),
        reason: "concede",
      } satisfies GameEndLog;
    case "gundam.turn.started":
      return {
        type: "turnStart",
        ...base(entry, command, asPlayer(values.playerId) || fallbackPlayerId),
        turnNumber: typeof values.turnNumber === "number" ? values.turnNumber : 0,
        activePlayerId: asPlayer(values.playerId) || fallbackPlayerId,
      } satisfies TurnStartLog;
    case "gundam.system.gameOver":
      return {
        type: "gameEnd",
        ...base(entry, command, asPlayer(values.winnerId) || fallbackPlayerId),
        ...(typeof values.winnerId === "string" ? { winnerId: asPlayer(values.winnerId) } : {}),
        reason: typeof values.reason === "string" ? values.reason : "",
      } satisfies GameEndLog;
    default:
      return undefined;
  }
}
