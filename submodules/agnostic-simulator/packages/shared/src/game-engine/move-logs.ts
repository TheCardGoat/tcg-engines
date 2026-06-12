export type EngineLogMessageValue =
  | string
  | number
  | boolean
  | null
  | readonly EngineLogMessageValue[]
  | { readonly [key: string]: EngineLogMessageValue };

export interface EngineLogMessage {
  readonly key: string;
  readonly values?: Record<string, EngineLogMessageValue>;
  readonly defaultMessage?: string;
}

export interface CanonicalEngineMoveLog {
  readonly moveType: string;
  readonly playerId: string;
  readonly timestamp: number;
  readonly turnNumber?: number;
  readonly public: readonly EngineLogMessage[];
  readonly privateByPlayerId?: Partial<Record<string, readonly EngineLogMessage[]>>;
}

interface PrivateFieldLike {
  readonly __private: true;
  readonly value: unknown;
  readonly visibleTo: readonly string[];
}

export function isCanonicalEngineMoveLog(log: unknown): log is CanonicalEngineMoveLog {
  return (
    typeof log === "object" &&
    log !== null &&
    typeof (log as { moveType?: unknown }).moveType === "string" &&
    Array.isArray((log as { public?: unknown }).public)
  );
}

export function composeCanonicalMoveLogForViewer(
  log: CanonicalEngineMoveLog,
  viewerId: string | null,
): CanonicalEngineMoveLog {
  const privateMessages = viewerId ? (log.privateByPlayerId?.[viewerId] ?? []) : [];
  const { privateByPlayerId: _privateByPlayerId, ...publicLog } = log;

  return {
    ...publicLog,
    public: [...log.public, ...privateMessages],
  };
}

export function selectVisibleEngineLogForViewer(log: unknown, viewerId: string | null): unknown {
  if (isCanonicalEngineMoveLog(log)) {
    return composeCanonicalMoveLogForViewer(log, viewerId);
  }

  return stripPrivateFieldsForViewer(log, viewerId);
}

export function createCanonicalEngineMoveLog(args: {
  moveType: string;
  playerId: string;
  timestamp: number;
  turnNumber?: number;
  messages: readonly EngineLogMessage[];
}): CanonicalEngineMoveLog {
  const publicMessages: EngineLogMessage[] = [];
  const privateByPlayerId: Record<string, EngineLogMessage[]> = {};

  for (const message of args.messages) {
    const split = splitPrivateMessageValues(message);
    publicMessages.push(split.publicMessage);

    for (const [playerId, privateMessage] of Object.entries(split.privateMessagesByPlayerId)) {
      privateByPlayerId[playerId] ??= [];
      privateByPlayerId[playerId].push(privateMessage);
    }
  }

  const privateAppendix = Object.keys(privateByPlayerId).length > 0 ? { privateByPlayerId } : {};

  return {
    moveType: args.moveType,
    playerId: args.playerId,
    timestamp: args.timestamp,
    ...(args.turnNumber === undefined ? {} : { turnNumber: args.turnNumber }),
    public: publicMessages,
    ...privateAppendix,
  };
}

export function createEngineLogMessage(args: {
  key: string;
  values?: Record<string, unknown>;
  defaultMessage?: string;
}): EngineLogMessage {
  const values = args.values ? toMessageValues(args.values) : undefined;
  return {
    key: args.key,
    ...(values ? { values } : {}),
    ...(args.defaultMessage ? { defaultMessage: args.defaultMessage } : {}),
  };
}

function splitPrivateMessageValues(message: EngineLogMessage): {
  publicMessage: EngineLogMessage;
  privateMessagesByPlayerId: Record<string, EngineLogMessage>;
} {
  if (!message.values) {
    return { publicMessage: message, privateMessagesByPlayerId: {} };
  }

  const split = splitPrivateValue(message.values);
  const publicValues =
    split.publicValue && typeof split.publicValue === "object" && !Array.isArray(split.publicValue)
      ? (split.publicValue as Record<string, EngineLogMessageValue>)
      : {};
  const privateMessagesByPlayerId: Record<string, EngineLogMessage> = {};

  for (const [playerId, value] of Object.entries(split.privateValueByPlayerId)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    privateMessagesByPlayerId[playerId] = {
      key: message.key,
      values: { ...publicValues, ...(value as Record<string, EngineLogMessageValue>) },
      ...(message.defaultMessage ? { defaultMessage: message.defaultMessage } : {}),
    };
  }

  return {
    publicMessage: {
      key: message.key,
      ...(Object.keys(publicValues).length > 0 ? { values: publicValues } : {}),
      ...(message.defaultMessage ? { defaultMessage: message.defaultMessage } : {}),
    },
    privateMessagesByPlayerId,
  };
}

function splitPrivateValue(value: unknown): {
  publicValue: EngineLogMessageValue | undefined;
  privateValueByPlayerId: Record<string, EngineLogMessageValue>;
} {
  if (isPrivateFieldLike(value)) {
    const privateValue = toMessageValue(value.value);
    const privateValueByPlayerId: Record<string, EngineLogMessageValue> = {};
    for (const playerId of value.visibleTo) {
      privateValueByPlayerId[playerId] = privateValue;
    }
    return { publicValue: undefined, privateValueByPlayerId };
  }

  if (Array.isArray(value)) {
    const publicItems: EngineLogMessageValue[] = [];
    const privateItemsByPlayerId: Record<string, EngineLogMessageValue[]> = {};
    for (const item of value) {
      const split = splitPrivateValue(item);
      if (split.publicValue !== undefined) publicItems.push(split.publicValue);
      for (const [playerId, privateItem] of Object.entries(split.privateValueByPlayerId)) {
        privateItemsByPlayerId[playerId] ??= [];
        privateItemsByPlayerId[playerId].push(privateItem);
      }
    }

    return {
      publicValue: publicItems,
      privateValueByPlayerId: privateItemsByPlayerId,
    };
  }

  if (value && typeof value === "object") {
    const publicObject: Record<string, EngineLogMessageValue> = {};
    const privateObjectsByPlayerId: Record<string, Record<string, EngineLogMessageValue>> = {};

    for (const [key, nestedValue] of Object.entries(value)) {
      const split = splitPrivateValue(nestedValue);
      if (split.publicValue !== undefined) {
        publicObject[key] = split.publicValue;
      }
      for (const [playerId, privateValue] of Object.entries(split.privateValueByPlayerId)) {
        privateObjectsByPlayerId[playerId] ??= {};
        privateObjectsByPlayerId[playerId][key] = privateValue;
      }
    }

    return {
      publicValue: publicObject,
      privateValueByPlayerId: privateObjectsByPlayerId,
    };
  }

  return { publicValue: toMessageValue(value), privateValueByPlayerId: {} };
}

function stripPrivateFieldsForViewer(value: unknown, viewerId: string | null): unknown {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (isPrivateFieldLike(value)) {
    return viewerId !== null && value.visibleTo.includes(viewerId) ? value.value : undefined;
  }

  if (Array.isArray(value)) {
    return value.map((item) => stripPrivateFieldsForViewer(item, viewerId));
  }

  const out: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    const stripped = stripPrivateFieldsForViewer(nestedValue, viewerId);
    if (stripped === undefined && isPrivateFieldLike(nestedValue)) continue;
    out[key] = stripped;
  }
  return out;
}

function isPrivateFieldLike(value: unknown): value is PrivateFieldLike {
  const candidate = value as { __private?: unknown; visibleTo?: unknown };
  return (
    typeof value === "object" &&
    value !== null &&
    candidate.__private === true &&
    "value" in value &&
    Array.isArray(candidate.visibleTo) &&
    candidate.visibleTo.every((entry) => typeof entry === "string")
  );
}

function toMessageValues(values: Record<string, unknown>): Record<string, EngineLogMessageValue> {
  const out: Record<string, EngineLogMessageValue> = {};
  for (const [key, value] of Object.entries(values)) {
    out[key] = toMessageValue(value);
  }
  return out;
}

function toMessageValue(value: unknown): EngineLogMessageValue {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => toMessageValue(item));
  }

  if (value && typeof value === "object") {
    const out: Record<string, EngineLogMessageValue> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      out[key] = toMessageValue(nestedValue);
    }
    return out;
  }

  // Remaining types: undefined, bigint, symbol, function
  return String(value as string | number | boolean | bigint | symbol | undefined);
}
