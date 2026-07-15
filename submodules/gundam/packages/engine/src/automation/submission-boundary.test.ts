import { describe, expect, it } from "vite-plus/test";

import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope } from "../types/command.ts";

import { candidateToCommand, type GundamBotCandidate } from "./candidate-types.ts";
import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";

/**
 * The AI submission path must run through the same boundary every
 * human player does — `runtime.executeCommand(envelope)`. This test
 * pins the contract: every candidate the enumerator emits round-trips
 * through `candidateToCommand` and then through the runtime, with
 * either a `success: true` result or a structured `success: false`
 * carrying a typed `errorCode`. The runtime must never throw on a
 * legal-shaped candidate, and the candidate must never bypass
 * validation.
 *
 * If a future refactor lets the AI dispatch via a private internal
 * method that skips `validateCommand`, this test still passes — that's
 * a separate ESLint / boundary-import concern. What this test catches
 * is the inverse: a candidate shape the runtime rejects with an
 * exception (which would surface as a 500 in production rather than a
 * structured rejection the UI/bot can react to).
 */
describe("submission boundary: candidate → executeCommand", () => {
  it("every enumerated candidate produces a structured CommandResult", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }] },
    );

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    expect(candidates.length).toBeGreaterThan(0);

    // Walk each candidate, render to envelope, submit. A successful
    // submission ends the loop — subsequent candidates are evaluated
    // against the next state. A rejection just means the strategy's
    // ranker picks a different head; both outcomes are well-typed.
    for (const candidate of candidates) {
      const result = submitOnce(engine, candidate, PLAYER_ONE as PlayerId);
      if (result.success) {
        expect(typeof result.stateID).toBe("number");
        return;
      }
      expect(typeof result.errorCode).toBe("string");
      expect(typeof result.error).toBe("string");
    }
  });

  it("fabricated illegal candidates fail with typed errorCode, never throw", () => {
    // Synthesise a candidate the enumerator would never produce — an
    // enterBattle with a non-existent attacker. The runtime must
    // reject it through the structured path, not via an exception.
    const engine = GundamTestEngine.create({}, {});
    const result = submitOnce(
      engine,
      { family: "enterBattle", attackerId: "nope", target: "also-nope" },
      PLAYER_ONE as PlayerId,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(typeof result.errorCode).toBe("string");
    }
  });

  it("unknown moves can't slip in through hand-built envelopes", () => {
    // Defence in depth: even if a caller bypasses `candidateToCommand`
    // and constructs an envelope with an unregistered move name, the
    // runtime returns UNKNOWN_MOVE rather than crashing.
    const engine = GundamTestEngine.create({}, {});
    const envelope: CommandEnvelope = {
      commandID: "test-unknown",
      move: "thisIsNotARealMove",
      prevStateID: engine.runtime.getState().ctx._stateID,
      actorRole: "player",
      args: {},
    };
    const result = engine.runtime.executeCommand(envelope, PLAYER_ONE as PlayerId);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("UNKNOWN_MOVE");
    }
  });

  it("malformed args fail with typed errorCode, never throw", () => {
    const engine = GundamTestEngine.create({}, {});
    const envelope: CommandEnvelope = {
      commandID: "test-invalid-args",
      move: "passTurn",
      prevStateID: engine.runtime.getState().ctx._stateID,
      actorRole: "player",
      args: null,
    };
    const result = engine.runtime.executeCommand(envelope, PLAYER_ONE as PlayerId);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_ARGS");
    }
  });
});

function submitOnce(engine: GundamTestEngine, candidate: GundamBotCandidate, playerId: PlayerId) {
  const { move, args } = candidateToCommand(candidate);
  const stateId = engine.runtime.getState().ctx._stateID;
  const envelope: CommandEnvelope = {
    commandID: `boundary-test-${stateId}-${move}`,
    move,
    prevStateID: stateId,
    actorRole: "player",
    args,
  };
  return engine.runtime.executeCommand(envelope, playerId);
}
