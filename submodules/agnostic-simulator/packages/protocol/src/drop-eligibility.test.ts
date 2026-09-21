import { describe, expect, it } from "vite-plus/test";
import {
  DISCONNECT_DROP_THRESHOLD_MS,
  DROP_GATEWAY_ERROR_CODES,
  DropEligibilitySchema,
  composeDisconnectChannel,
  composeDropEligibility,
  deriveDropControl,
  dropGatewayError,
  evaluateReserveTimeoutDrop,
  unsupportedTimeoutChannel,
  type TimeoutChannelInput,
} from "./drop-eligibility.js";

const NOW = 1_700_000_000_000;

function gracePending(remainingMs = 9_000): TimeoutChannelInput {
  return {
    allowed: false,
    reason: "timeout_grace_pending",
    eligibleAtMs: NOW + remainingMs,
    remainingMs,
    facts: {
      source: "adapter",
      mode: "dynamic",
      effectiveReserveMs: remainingMs - 15_000,
      graceMs: 15_000,
      graceRemainingMs: remainingMs,
      isActive: true,
    },
  };
}

function timeoutAllowed(): TimeoutChannelInput {
  return {
    allowed: true,
    reason: "timeout_allowed",
    remainingMs: 0,
    facts: { source: "adapter", mode: "dynamic", effectiveReserveMs: -15_000, graceMs: 15_000 },
  };
}

describe("composeDropEligibility", () => {
  it("lets a disconnect claim win over a simultaneous timeout", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: timeoutAllowed(),
      disconnect: { connected: false, disconnectedAtMs: NOW - DISCONNECT_DROP_THRESHOLD_MS },
    });
    expect(eligibility.allowed).toBe(true);
    expect(eligibility.reason).toBe("disconnect_allowed");
    expect(eligibility.recovery.intent).toBe("claim_disconnect");
    expect(eligibility.disconnect.facts.disconnectedAt).toBe(new Date(NOW - 30_000).toISOString());
  });

  it("allows a timeout drop while the opponent is still connected", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: timeoutAllowed(),
      disconnect: { connected: true },
    });
    expect(eligibility).toMatchObject({
      allowed: true,
      reason: "timeout_allowed",
      timeout: { allowed: true },
      disconnect: { allowed: false, reason: "opponent_connected" },
    });
  });

  it("prefers timeout grace over a disconnect countdown", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: gracePending(9_000),
      disconnect: { connected: false, disconnectedAtMs: NOW - 21_000 },
    });
    expect(eligibility.allowed).toBe(false);
    expect(eligibility.reason).toBe("timeout_grace_pending");
    expect(eligibility.recovery).toMatchObject({
      intent: "wait_timeout_grace",
      messageParams: { seconds: 9 },
    });
    expect(dropGatewayError(eligibility).code).toBe("timeout_grace_pending");
    expect(dropGatewayError(eligibility).message).toContain("9 seconds");
  });

  it("explains the 30-second disconnect wait", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 21_200 },
    });
    expect(eligibility.reason).toBe("disconnect_countdown");
    expect(eligibility.disconnect.remainingMs).toBe(8_800);
    expect(eligibility.disconnect.eligibleAtMs).toBe(NOW - 21_200 + 30_000);
    expect(dropGatewayError(eligibility)).toEqual({
      code: "too_early",
      message:
        "Your opponent must be disconnected for 30 seconds before you can drop them. Try again in 9 seconds.",
    });
  });

  it("does not invent a disconnect timestamp", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false },
    });
    expect(eligibility.reason).toBe("disconnect_timestamp_missing");
    expect(eligibility.disconnect.facts.disconnectedAt).toBeUndefined();
    expect(eligibility.recovery.intent).toBe("wait_presence_timestamp");
  });

  it("cancels disconnect eligibility on reconnect", () => {
    const disconnected = composeDisconnectChannel(
      { connected: false, disconnectedAtMs: NOW - 40_000 },
      NOW,
    );
    expect(disconnected.allowed).toBe(true);
    const reconnected = composeDisconnectChannel({ connected: true }, NOW);
    expect(reconnected.allowed).toBe(false);
    expect(reconnected.reason).toBe("opponent_connected");
    expect(reconnected.facts.disconnectedAt).toBeUndefined();
  });

  it("records clockless games as unsupported rather than expired", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: true },
    });
    expect(eligibility.reason).toBe("opponent_connected");
    expect(eligibility.timeout.facts.source).toBe("none");
    expect(eligibility.timeout.reason).toBe("clock_unsupported");
  });
});

describe("evaluateReserveTimeoutDrop", () => {
  it("starts grace when reserve is exactly zero", () => {
    expect(
      evaluateReserveTimeoutDrop({
        nowMs: NOW,
        graceMs: 15_000,
        effectiveReserveMs: 0,
        isActive: true,
      }),
    ).toMatchObject({
      allowed: false,
      reason: "timeout_grace_pending",
      remainingMs: 15_000,
      eligibleAtMs: NOW + 15_000,
    });
  });

  it("allows immediately at zero when grace is zero", () => {
    expect(
      evaluateReserveTimeoutDrop({
        nowMs: NOW,
        graceMs: 0,
        effectiveReserveMs: 0,
        isActive: true,
      }),
    ).toMatchObject({ allowed: true, reason: "timeout_allowed", remainingMs: 0 });
  });

  it("projects the drop gate while the opponent is still within reserve", () => {
    expect(
      evaluateReserveTimeoutDrop({
        nowMs: NOW,
        graceMs: 15_000,
        effectiveReserveMs: 60_000,
        isActive: true,
      }),
    ).toMatchObject({
      allowed: false,
      reason: "timeout_within_limit",
      remainingMs: 75_000,
      eligibleAtMs: NOW + 75_000,
    });
  });
});

describe("deriveDropControl", () => {
  it("keeps Drop disabled during grace and enables it at eligibleAt", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: gracePending(9_000),
      disconnect: { connected: true },
    });
    expect(deriveDropControl(eligibility, NOW + 8_999)).toMatchObject({
      enabled: false,
      reason: "timeout_grace_pending",
      remainingMs: 1,
      remainingSeconds: 1,
    });
    expect(deriveDropControl(eligibility, NOW + 9_000)).toMatchObject({
      enabled: true,
      reason: "timeout_allowed",
    });
  });

  it("enables disconnect Drop from server-anchored remaining, not from a raw device clock", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 25_000 },
    });
    expect(deriveDropControl(eligibility, NOW)).toMatchObject({
      enabled: false,
      remainingSeconds: 5,
    });
    expect(deriveDropControl(eligibility, NOW + 5_000)).toMatchObject({
      enabled: true,
      reason: "disconnect_allowed",
    });
  });

  it("walks a within-limit snapshot through grace into an enabled Drop", () => {
    const drop = evaluateReserveTimeoutDrop({
      nowMs: NOW,
      graceMs: 15_000,
      effectiveReserveMs: 10_000,
      isActive: true,
      mode: "dynamic",
    });
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: { ...drop, facts: { ...drop.facts, source: "adapter" } },
      disconnect: { connected: true },
    });
    expect(eligibility.timeout.reason).toBe("timeout_within_limit");
    expect(DropEligibilitySchema.parse(eligibility).timeout.eligibleAtMs).toBe(NOW + 25_000);
    expect(deriveDropControl(eligibility, NOW + 9_000)).toMatchObject({
      enabled: false,
      reason: "opponent_connected",
    });
    expect(deriveDropControl(eligibility, NOW + 10_000)).toMatchObject({
      enabled: false,
      reason: "timeout_grace_pending",
      remainingSeconds: 15,
    });
    expect(deriveDropControl(eligibility, NOW + 25_000)).toMatchObject({
      enabled: true,
      reason: "timeout_allowed",
    });
  });

  it("enables Drop when the disconnect countdown elapses", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: false, disconnectedAtMs: NOW - 29_000 },
    });
    expect(deriveDropControl(eligibility, NOW).enabled).toBe(false);
    expect(deriveDropControl(eligibility, NOW + 1_000)).toMatchObject({
      enabled: true,
      reason: "disconnect_allowed",
    });
  });
});

describe("DropEligibilitySchema", () => {
  it("accepts a composed projection and rejects a missing timeout channel", () => {
    const eligibility = composeDropEligibility({
      nowMs: NOW,
      timeout: unsupportedTimeoutChannel(),
      disconnect: { connected: true },
    });
    expect(DropEligibilitySchema.parse(eligibility)).toEqual(eligibility);
    expect(
      DropEligibilitySchema.safeParse({
        ...eligibility,
        timeout: { allowed: false, reason: "clock_unsupported" },
      }).success,
    ).toBe(false);
  });
});

describe("DROP_GATEWAY_ERROR_CODES", () => {
  it("covers specific reasons and the legacy toast-suppression codes", () => {
    expect(DROP_GATEWAY_ERROR_CODES.has("timeout_grace_pending")).toBe(true);
    expect(DROP_GATEWAY_ERROR_CODES.has("player_connected")).toBe(true);
    expect(DROP_GATEWAY_ERROR_CODES.has("too_early")).toBe(true);
    expect(DROP_GATEWAY_ERROR_CODES.has("drop_not_allowed")).toBe(true);
  });
});
