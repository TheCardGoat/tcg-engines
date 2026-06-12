import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import { takeAutomatedActionWithFallback } from "./planner.ts";
import type { BotDecisionRecord } from "./types.ts";

/**
 * The planner's `decisionSink` callback is the one place outside the
 * planner where structured bot telemetry is emitted. These tests pin
 * its contract: invoked exactly once per planner call, never throws
 * (sink errors are swallowed), and the record carries enough context
 * for replay reconstruction (turn, state IDs, per-attempt errorCodes,
 * timestamp).
 */
describe("decisionSink: invocation", () => {
  it("fires once per planner call", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "Guncannon" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker], resourceArea: [createMockResource(), createMockResource()] },
      { play: [{ card: target, exhausted: true }] },
    );
    const records: BotDecisionRecord[] = [];

    takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
      { decisionSink: (record) => records.push(record) },
    );

    expect(records).toHaveLength(1);
  });

  it("fires even when the match has already ended", () => {
    const engine = GundamTestEngine.create({}, {});
    engine.runtime.getState().ctx.status.gameEnded = true;
    const records: BotDecisionRecord[] = [];

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
      { decisionSink: (record) => records.push(record) },
    );

    expect(result.outcome).toBe("game-ended");
    expect(records).toHaveLength(1);
    expect(records[0]?.outcome).toBe("game-ended");
    expect(records[0]?.attemptDetails).toEqual([]);
  });
});

describe("decisionSink: record shape", () => {
  it("carries turn number, state IDs, and timestamp", () => {
    const engine = GundamTestEngine.create({}, {});
    let captured: BotDecisionRecord | null = null;

    const before = Date.now();
    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
      {
        decisionSink: (record) => {
          captured = record;
        },
      },
    );
    const after = Date.now();

    expect(captured).not.toBeNull();
    const record = captured!;
    expect(record.playerId).toBe(PLAYER_ONE);
    expect(record.outcome).toBe(result.outcome);
    expect(record.turnNumber).toBe(engine.runtime.getState().ctx.status.turn);
    expect(record.stateIdAfter).toBeGreaterThanOrEqual(record.stateIdBefore);
    expect(record.timestampMs).toBeGreaterThanOrEqual(before);
    expect(record.timestampMs).toBeLessThanOrEqual(after);
  });

  it("attemptDetails record success + errorCode for each submission", () => {
    // Force a fallback by handing the planner a strategy that returns
    // an obviously illegal candidate so the planner falls through to
    // pass / concede. Each attempt must show up with its result.
    const engine = GundamTestEngine.create({}, {});
    const illegalThenPass = {
      name: "illegal-then-pass",
      selectCandidates: () => [
        { family: "enterBattle", attackerId: "no-such-unit", target: "no-such-target" } as const,
      ],
    };

    let captured: BotDecisionRecord | null = null;
    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      illegalThenPass,
      engine.runtime.getStaticResources(),
      {
        decisionSink: (record) => {
          captured = record;
        },
      },
    );

    expect(captured).not.toBeNull();
    const record = captured!;
    expect(record.attemptDetails.length).toBeGreaterThan(0);
    // First attempt is the illegal enterBattle — must be a typed failure.
    const first = record.attemptDetails[0];
    expect(first?.success).toBe(false);
    expect(typeof first?.errorCode).toBe("string");
    // The succeeded attempt (whatever the planner used) must be marked
    // success: true. If everything failed (concede-failed outcome),
    // there's no successful attempt.
    if (result.outcome !== "candidate-failed-pass-failed-concede-failed") {
      const successful = record.attemptDetails.find((a) => a.success);
      expect(successful).toBeDefined();
    }
  });
});

describe("decisionSink: error containment", () => {
  it("a throwing sink does not abort the planner", () => {
    const engine = GundamTestEngine.create({}, {});
    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
      {
        decisionSink: () => {
          throw new Error("sink boom");
        },
      },
    );
    // Planner returned normally — telemetry boom didn't propagate.
    expect(typeof result.outcome).toBe("string");
  });
});

describe("attemptDetails: backwards-compat with attemptedCandidates", () => {
  it("attemptDetails has the same length as attemptedCandidates", () => {
    const engine = GundamTestEngine.create({}, {});
    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
    );
    expect(result.attemptDetails).toHaveLength(result.attemptedCandidates.length);
    for (let i = 0; i < result.attemptedCandidates.length; i++) {
      expect(result.attemptDetails[i]?.candidate).toEqual(result.attemptedCandidates[i]);
    }
  });
});
