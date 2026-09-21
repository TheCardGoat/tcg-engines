/**
 * Game-agnostic drop-claim eligibility.
 *
 * Platform composes timeout facts from a game adapter with disconnect facts
 * from presence. Clients interpolate countdowns from `projectedAtMs` /
 * `eligibleAtMs` using a server-clock offset. They never invent
 * `disconnectedAt` and never treat local wall time as authority.
 */

import { z } from "zod";

export const DISCONNECT_DROP_THRESHOLD_MS = 30_000;

export const DROP_REASON_CODES = [
  "timeout_allowed",
  "disconnect_allowed",
  "opponent_connected",
  "disconnect_countdown",
  "disconnect_timestamp_missing",
  "timeout_grace_pending",
  "timeout_first_decision",
  "timeout_within_limit",
  "timeout_requester_has_priority",
  "clock_unsupported",
  "clock_unavailable",
  "no_time_control",
  "game_completed",
  "not_a_player",
] as const;

export type DropReasonCode = (typeof DROP_REASON_CODES)[number];

export const DROP_RECOVERY_INTENTS = [
  "claim_timeout",
  "claim_disconnect",
  "wait_timeout_grace",
  "wait_disconnect_threshold",
  "wait_presence_timestamp",
  "continue_playing",
  "skip_then_wait",
] as const;

export type DropRecoveryIntent = (typeof DROP_RECOVERY_INTENTS)[number];

export const DROP_MESSAGE_KEYS = {
  timeoutAllowed: "drop.timeout.allowed",
  timeoutGracePending: "drop.timeout.grace_pending",
  timeoutFirstDecision: "drop.timeout.first_decision",
  disconnectAllowed: "drop.disconnect.allowed",
  disconnectCountdown: "drop.disconnect.countdown",
  disconnectTimestampMissing: "drop.disconnect.timestamp_missing",
  opponentConnected: "drop.opponent.connected",
  clockUnsupported: "drop.clock.unsupported",
  clockUnavailable: "drop.clock.unavailable",
  noTimeControl: "drop.clock.none",
  withinLimit: "drop.timeout.within_limit",
  requesterHasPriority: "drop.timeout.requester_has_priority",
  gameCompleted: "drop.game.completed",
  notAPlayer: "drop.player.invalid",
} as const;

export type DropMessageKey = (typeof DROP_MESSAGE_KEYS)[keyof typeof DROP_MESSAGE_KEYS];

/** Gateway codes that must not be forwarded as a generic engine invalid-move toast. */
export const DROP_GATEWAY_ERROR_CODES: ReadonlySet<string> = new Set([
  ...DROP_REASON_CODES,
  "player_connected",
  "too_early",
  "drop_not_allowed",
]);

export type TimeoutEvalSource = "adapter" | "legacy_clock" | "none";

export interface TimeoutFacts {
  source: TimeoutEvalSource;
  mode?: string;
  reserveMsRemaining?: number;
  effectiveReserveMs?: number;
  graceMs?: number;
  graceRemainingMs?: number;
  timeoutCount?: number;
  isActive?: boolean;
  decisionCapExceeded?: boolean;
  skipAllowed?: boolean;
}

export interface DisconnectFacts {
  connected: boolean;
  disconnectedAt?: string;
  thresholdMs: number;
  elapsedMs?: number;
}

export interface DropChannel {
  allowed: boolean;
  reason: DropReasonCode;
  eligibleAtMs?: number;
  remainingMs?: number;
}

export interface DropRecovery {
  intent: DropRecoveryIntent;
  messageKey: DropMessageKey;
  messageParams?: Record<string, string | number>;
}

export interface DropEligibility {
  allowed: boolean;
  reason: DropReasonCode;
  projectedAtMs: number;
  timeout: DropChannel & { facts: TimeoutFacts };
  disconnect: DropChannel & { facts: DisconnectFacts };
  recovery: DropRecovery;
}

export interface TimeoutChannelInput {
  allowed: boolean;
  reason: DropReasonCode;
  eligibleAtMs?: number;
  remainingMs?: number;
  facts: TimeoutFacts;
}

export interface DisconnectChannelInput {
  connected: boolean;
  disconnectedAtMs?: number;
}

const INELIGIBLE_PRIORITY: readonly DropReasonCode[] = [
  "timeout_grace_pending",
  "disconnect_countdown",
  "disconnect_timestamp_missing",
  "timeout_first_decision",
  "opponent_connected",
  "timeout_requester_has_priority",
  "timeout_within_limit",
  "no_time_control",
  "clock_unavailable",
  "clock_unsupported",
  "game_completed",
  "not_a_player",
];

export function evaluateReserveTimeoutDrop(input: {
  nowMs: number;
  mode?: string;
  graceMs: number;
  effectiveReserveMs: number;
  isActive: boolean;
  isInNegativeTime?: boolean;
  timeoutCount?: number;
  decisionCapExceeded?: boolean;
  skipSupported?: boolean;
}): {
  allowed: boolean;
  reason: DropReasonCode;
  eligibleAtMs?: number;
  remainingMs?: number;
  facts: Omit<TimeoutFacts, "source">;
} {
  const graceMs = Math.max(0, input.graceMs);
  const timeoutCount = input.timeoutCount ?? 0;
  const onClock = input.isActive || input.isInNegativeTime === true;
  const graceRemainingMs = onClock ? input.effectiveReserveMs + graceMs : undefined;
  const facts: Omit<TimeoutFacts, "source"> = {
    ...(input.mode ? { mode: input.mode } : {}),
    effectiveReserveMs: input.effectiveReserveMs,
    graceMs,
    ...(graceRemainingMs !== undefined ? { graceRemainingMs: Math.max(0, graceRemainingMs) } : {}),
    timeoutCount,
    isActive: input.isActive,
    decisionCapExceeded: input.decisionCapExceeded === true,
    skipAllowed:
      input.skipSupported === true && input.decisionCapExceeded === true && timeoutCount < 1,
  };

  if (onClock && input.effectiveReserveMs <= -graceMs) {
    return { allowed: true, reason: "timeout_allowed", remainingMs: 0, facts };
  }
  if (onClock && input.effectiveReserveMs <= 0) {
    const remainingMs = Math.max(0, graceRemainingMs ?? 0);
    return {
      allowed: false,
      reason: "timeout_grace_pending",
      eligibleAtMs: input.nowMs + remainingMs,
      remainingMs,
      facts,
    };
  }
  if (input.decisionCapExceeded === true && timeoutCount >= 1) {
    return { allowed: true, reason: "timeout_allowed", remainingMs: 0, facts };
  }
  if (input.decisionCapExceeded === true) {
    return {
      allowed: false,
      reason: "timeout_first_decision",
      facts: { ...facts, skipAllowed: input.skipSupported !== false },
    };
  }
  if (onClock) {
    const remainingMs = Math.max(0, input.effectiveReserveMs) + graceMs;
    return {
      allowed: false,
      reason: "timeout_within_limit",
      eligibleAtMs: input.nowMs + remainingMs,
      remainingMs,
      facts,
    };
  }
  return { allowed: false, reason: "timeout_within_limit", facts };
}

export function unsupportedTimeoutChannel(): TimeoutChannelInput {
  return {
    allowed: false,
    reason: "clock_unsupported",
    facts: { source: "none" },
  };
}

export function unavailableTimeoutChannel(): TimeoutChannelInput {
  return {
    allowed: false,
    reason: "clock_unavailable",
    facts: { source: "none" },
  };
}

export function composeDisconnectChannel(
  input: DisconnectChannelInput,
  nowMs: number,
  thresholdMs: number = DISCONNECT_DROP_THRESHOLD_MS,
): DropChannel & { facts: DisconnectFacts } {
  if (input.connected) {
    return {
      allowed: false,
      reason: "opponent_connected",
      facts: { connected: true, thresholdMs },
    };
  }
  if (input.disconnectedAtMs === undefined) {
    return {
      allowed: false,
      reason: "disconnect_timestamp_missing",
      facts: { connected: false, thresholdMs },
    };
  }
  const elapsedMs = Math.max(0, nowMs - input.disconnectedAtMs);
  const remainingMs = Math.max(0, thresholdMs - elapsedMs);
  const disconnectedAt = new Date(input.disconnectedAtMs).toISOString();
  if (remainingMs > 0) {
    return {
      allowed: false,
      reason: "disconnect_countdown",
      eligibleAtMs: input.disconnectedAtMs + thresholdMs,
      remainingMs,
      facts: { connected: false, disconnectedAt, thresholdMs, elapsedMs },
    };
  }
  return {
    allowed: true,
    reason: "disconnect_allowed",
    eligibleAtMs: input.disconnectedAtMs + thresholdMs,
    remainingMs: 0,
    facts: { connected: false, disconnectedAt, thresholdMs, elapsedMs },
  };
}

export function composeDropEligibility(input: {
  nowMs: number;
  timeout: TimeoutChannelInput;
  disconnect: DisconnectChannelInput;
}): DropEligibility {
  const timeout: DropChannel & { facts: TimeoutFacts } = {
    allowed: input.timeout.allowed,
    reason: input.timeout.reason,
    ...(input.timeout.eligibleAtMs !== undefined
      ? { eligibleAtMs: input.timeout.eligibleAtMs }
      : {}),
    ...(input.timeout.remainingMs !== undefined ? { remainingMs: input.timeout.remainingMs } : {}),
    facts: input.timeout.facts,
  };
  const disconnect = composeDisconnectChannel(input.disconnect, input.nowMs);

  if (disconnect.allowed) {
    return {
      allowed: true,
      reason: "disconnect_allowed",
      projectedAtMs: input.nowMs,
      timeout,
      disconnect,
      recovery: recoveryFor("disconnect_allowed"),
    };
  }
  if (timeout.allowed) {
    return {
      allowed: true,
      reason: "timeout_allowed",
      projectedAtMs: input.nowMs,
      timeout,
      disconnect,
      recovery: recoveryFor("timeout_allowed"),
    };
  }

  const reason = pickIneligibleReason(timeout.reason, disconnect.reason);
  const recovery = recoveryFor(reason, {
    seconds: secondsFromRemaining(
      reason === "timeout_grace_pending" || reason === "timeout_within_limit"
        ? timeout.remainingMs
        : disconnect.remainingMs,
    ),
  });
  return {
    allowed: false,
    reason,
    projectedAtMs: input.nowMs,
    timeout,
    disconnect,
    recovery,
  };
}

export interface DropControlView {
  enabled: boolean;
  reason: DropReasonCode;
  remainingMs?: number;
  remainingSeconds?: number;
  recoveryIntent: DropRecoveryIntent;
  messageKey: DropMessageKey;
  messageParams?: Record<string, string | number>;
  label: string;
}

/**
 * Client presentation helper. `serverNowMs` must be anchored to server time
 * (`projectedAtMs + localElapsed` or ping/pong offset). Device wall clock
 * must not be compared to `disconnectedAt` directly.
 */
export function deriveDropControl(
  eligibility: DropEligibility,
  serverNowMs: number,
): DropControlView {
  const timeoutRemainingMs = interpolateChannel(
    eligibility.timeout,
    eligibility.projectedAtMs,
    serverNowMs,
  );
  const disconnectRemainingMs = interpolateChannel(
    eligibility.disconnect,
    eligibility.projectedAtMs,
    serverNowMs,
  );
  const resolved = resolveInterpolatedReason(
    eligibility,
    timeoutRemainingMs,
    disconnectRemainingMs,
  );
  const remainingMs =
    resolved.reason === "disconnect_countdown" || resolved.reason === "disconnect_allowed"
      ? disconnectRemainingMs
      : resolved.reason === "timeout_grace_pending" ||
          resolved.reason === "timeout_allowed" ||
          resolved.reason === "timeout_within_limit"
        ? timeoutRemainingMs
        : interpolateRemaining(eligibility, serverNowMs);
  const recovery = recoveryFor(
    resolved.reason,
    remainingMs !== undefined ? { seconds: secondsFromRemaining(remainingMs) } : undefined,
  );
  return {
    enabled: resolved.enabled,
    reason: resolved.reason,
    ...(remainingMs !== undefined ? { remainingMs: Math.max(0, remainingMs) } : {}),
    ...(remainingMs !== undefined ? { remainingSeconds: secondsFromRemaining(remainingMs) } : {}),
    recoveryIntent: recovery.intent,
    messageKey: recovery.messageKey,
    ...(recovery.messageParams ? { messageParams: recovery.messageParams } : {}),
    label: formatDropCopy(recovery.messageKey, recovery.messageParams),
  };
}

export function formatDropCopy(
  messageKey: DropMessageKey,
  params?: Record<string, string | number>,
): string {
  const seconds = typeof params?.seconds === "number" ? params.seconds : 1;
  switch (messageKey) {
    case DROP_MESSAGE_KEYS.timeoutAllowed:
      return "Opponent timed out. You can drop them.";
    case DROP_MESSAGE_KEYS.timeoutGracePending:
      return `Your opponent's clock is still in its grace period. Try again in ${seconds} seconds.`;
    case DROP_MESSAGE_KEYS.timeoutFirstDecision:
      return "Your opponent stalled once. Skip their turn, or wait for a second timeout to drop.";
    case DROP_MESSAGE_KEYS.disconnectAllowed:
      return "Opponent disconnected. You can drop them.";
    case DROP_MESSAGE_KEYS.disconnectCountdown:
      return `Your opponent must be disconnected for 30 seconds before you can drop them. Try again in ${seconds} seconds.`;
    case DROP_MESSAGE_KEYS.disconnectTimestampMissing:
      return "We couldn't confirm when your opponent disconnected. Wait a moment, then try again.";
    case DROP_MESSAGE_KEYS.opponentConnected:
      return "Your opponent is connected and has not timed out. Continue playing or wait for their clock to expire.";
    case DROP_MESSAGE_KEYS.clockUnsupported:
      return "This game has no timeout drop. You can still drop a disconnected opponent after 30 seconds.";
    case DROP_MESSAGE_KEYS.clockUnavailable:
      return "We couldn't read the opponent's clock. Wait a moment, then try again.";
    case DROP_MESSAGE_KEYS.noTimeControl:
      return "This match has no time control. You can still drop a disconnected opponent after 30 seconds.";
    case DROP_MESSAGE_KEYS.withinLimit:
      return "Your opponent has not timed out or been disconnected long enough to drop. Continue playing or try again later.";
    case DROP_MESSAGE_KEYS.requesterHasPriority:
      return "You currently hold priority. Continue playing or wait for the opponent's clock to expire.";
    case DROP_MESSAGE_KEYS.gameCompleted:
      return "Game has already ended";
    case DROP_MESSAGE_KEYS.notAPlayer:
      return "You are not a player in this game";
  }
}

export function dropGatewayError(eligibility: DropEligibility): {
  code: DropReasonCode | "player_connected" | "too_early" | "drop_not_allowed";
  message: string;
} {
  const message = formatDropCopy(
    eligibility.recovery.messageKey,
    eligibility.recovery.messageParams,
  );
  if (eligibility.reason === "opponent_connected") {
    return { code: "player_connected", message };
  }
  if (eligibility.reason === "disconnect_countdown") {
    return { code: "too_early", message };
  }
  return { code: eligibility.reason, message };
}

function pickIneligibleReason(
  timeoutReason: DropReasonCode,
  disconnectReason: DropReasonCode,
): DropReasonCode {
  for (const code of INELIGIBLE_PRIORITY) {
    if (code === timeoutReason || code === disconnectReason) return code;
  }
  return timeoutReason;
}

function recoveryFor(reason: DropReasonCode, params?: { seconds?: number }): DropRecovery {
  const seconds = params?.seconds;
  switch (reason) {
    case "timeout_allowed":
      return { intent: "claim_timeout", messageKey: DROP_MESSAGE_KEYS.timeoutAllowed };
    case "disconnect_allowed":
      return { intent: "claim_disconnect", messageKey: DROP_MESSAGE_KEYS.disconnectAllowed };
    case "timeout_grace_pending":
      return {
        intent: "wait_timeout_grace",
        messageKey: DROP_MESSAGE_KEYS.timeoutGracePending,
        messageParams: { seconds: seconds ?? 1 },
      };
    case "disconnect_countdown":
      return {
        intent: "wait_disconnect_threshold",
        messageKey: DROP_MESSAGE_KEYS.disconnectCountdown,
        messageParams: { seconds: seconds ?? 1 },
      };
    case "disconnect_timestamp_missing":
      return {
        intent: "wait_presence_timestamp",
        messageKey: DROP_MESSAGE_KEYS.disconnectTimestampMissing,
      };
    case "timeout_first_decision":
      return { intent: "skip_then_wait", messageKey: DROP_MESSAGE_KEYS.timeoutFirstDecision };
    case "opponent_connected":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.opponentConnected };
    case "timeout_requester_has_priority":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.requesterHasPriority };
    case "timeout_within_limit":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.withinLimit };
    case "no_time_control":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.noTimeControl };
    case "clock_unavailable":
      return { intent: "wait_presence_timestamp", messageKey: DROP_MESSAGE_KEYS.clockUnavailable };
    case "clock_unsupported":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.clockUnsupported };
    case "game_completed":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.gameCompleted };
    case "not_a_player":
      return { intent: "continue_playing", messageKey: DROP_MESSAGE_KEYS.notAPlayer };
  }
}

function resolveInterpolatedReason(
  eligibility: DropEligibility,
  timeoutRemainingMs: number | undefined,
  disconnectRemainingMs: number | undefined,
): { enabled: boolean; reason: DropReasonCode } {
  if (eligibility.allowed) return { enabled: true, reason: eligibility.reason };
  if (
    eligibility.disconnect.reason === "disconnect_countdown" &&
    disconnectRemainingMs !== undefined &&
    disconnectRemainingMs <= 0
  ) {
    return { enabled: true, reason: "disconnect_allowed" };
  }
  if (
    timeoutRemainingMs !== undefined &&
    timeoutRemainingMs <= 0 &&
    (eligibility.timeout.reason === "timeout_within_limit" ||
      eligibility.timeout.reason === "timeout_grace_pending")
  ) {
    return { enabled: true, reason: "timeout_allowed" };
  }
  const graceMs = eligibility.timeout.facts.graceMs ?? 0;
  if (
    timeoutRemainingMs !== undefined &&
    graceMs > 0 &&
    timeoutRemainingMs <= graceMs &&
    eligibility.timeout.reason === "timeout_within_limit"
  ) {
    return { enabled: false, reason: "timeout_grace_pending" };
  }
  if (eligibility.timeout.reason === "timeout_grace_pending") {
    return { enabled: false, reason: "timeout_grace_pending" };
  }
  return { enabled: false, reason: eligibility.reason };
}

function interpolateChannel(
  channel: DropChannel,
  projectedAtMs: number,
  serverNowMs: number,
): number | undefined {
  if (channel.eligibleAtMs !== undefined) return channel.eligibleAtMs - serverNowMs;
  if (channel.remainingMs !== undefined) return channel.remainingMs - (serverNowMs - projectedAtMs);
  return undefined;
}

function interpolateRemaining(
  eligibility: DropEligibility,
  serverNowMs: number,
): number | undefined {
  const channel =
    eligibility.reason === "disconnect_countdown" || eligibility.reason === "disconnect_allowed"
      ? eligibility.disconnect
      : eligibility.reason === "timeout_grace_pending" || eligibility.reason === "timeout_allowed"
        ? eligibility.timeout
        : eligibility.timeout.remainingMs !== undefined
          ? eligibility.timeout
          : eligibility.disconnect.remainingMs !== undefined
            ? eligibility.disconnect
            : undefined;
  if (!channel) return undefined;
  if (channel.eligibleAtMs !== undefined) return channel.eligibleAtMs - serverNowMs;
  if (channel.remainingMs !== undefined) {
    return channel.remainingMs - (serverNowMs - eligibility.projectedAtMs);
  }
  return undefined;
}

function secondsFromRemaining(remainingMs: number | undefined): number {
  if (remainingMs === undefined) return 1;
  return Math.max(1, Math.ceil(Math.max(0, remainingMs) / 1_000));
}

const DROP_MESSAGE_KEY_VALUES = Object.values(DROP_MESSAGE_KEYS) as [
  DropMessageKey,
  ...DropMessageKey[],
];

export const DropReasonCodeSchema = z.enum(DROP_REASON_CODES);
export const DropRecoveryIntentSchema = z.enum(DROP_RECOVERY_INTENTS);
export const DropMessageKeySchema = z.enum(DROP_MESSAGE_KEY_VALUES);
export const TimeoutEvalSourceSchema = z.enum(["adapter", "legacy_clock", "none"]);

export const TimeoutFactsSchema = z
  .object({
    source: TimeoutEvalSourceSchema,
    mode: z.string().optional(),
    reserveMsRemaining: z.number().optional(),
    effectiveReserveMs: z.number().optional(),
    graceMs: z.number().optional(),
    graceRemainingMs: z.number().optional(),
    timeoutCount: z.number().optional(),
    isActive: z.boolean().optional(),
    decisionCapExceeded: z.boolean().optional(),
    skipAllowed: z.boolean().optional(),
  })
  .strict();

export const DisconnectFactsSchema = z
  .object({
    connected: z.boolean(),
    disconnectedAt: z.string().optional(),
    thresholdMs: z.number(),
    elapsedMs: z.number().optional(),
  })
  .strict();

const DropChannelFields = {
  allowed: z.boolean(),
  reason: DropReasonCodeSchema,
  eligibleAtMs: z.number().optional(),
  remainingMs: z.number().optional(),
};

export const TimeoutChannelSchema = z
  .object({
    ...DropChannelFields,
    facts: TimeoutFactsSchema,
  })
  .strict();

export const DisconnectChannelSchema = z
  .object({
    ...DropChannelFields,
    facts: DisconnectFactsSchema,
  })
  .strict();

export const DropRecoverySchema = z
  .object({
    intent: DropRecoveryIntentSchema,
    messageKey: DropMessageKeySchema,
    messageParams: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  })
  .strict();

export const DropEligibilitySchema = z
  .object({
    allowed: z.boolean(),
    reason: DropReasonCodeSchema,
    projectedAtMs: z.number(),
    timeout: TimeoutChannelSchema,
    disconnect: DisconnectChannelSchema,
    recovery: DropRecoverySchema,
  })
  .strict();
