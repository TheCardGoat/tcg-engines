/**
 * MatchRuntime.validateMove / onStateUpdate / onGameEvent
 *
 * Proves that UI clients can pre-validate commands and subscribe to state +
 * game-event notifications without reaching into engine internals.
 */

import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import type { CommandEnvelope } from "../types/command.ts";
import type { PublishedGameEvent } from "../types/game-events.ts";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, createMockResource } from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

describe("MatchRuntime.validateMove", () => {
  it("returns valid=true for a legal move", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const cardId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
    const runtime = engine.getRuntime();

    const envelope: CommandEnvelope = {
      commandID: "test-1",
      move: "deployUnit",
      prevStateID: runtime.state.ctx._stateID,
      actorRole: "player",
      args: { cardId },
    };

    const result = runtime.validateMove(envelope, PLAYER_ONE as PlayerId);
    expect(result.valid).toBe(true);
  });

  it("returns a structured failure for unknown moves", () => {
    const engine = GundamTestEngine.create({});
    const runtime = engine.getRuntime();

    const envelope: CommandEnvelope = {
      commandID: "test-2",
      move: "notAMove",
      prevStateID: runtime.state.ctx._stateID,
      actorRole: "player",
      args: {},
    };

    const result = runtime.validateMove(envelope, PLAYER_ONE as PlayerId);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errorCode).toBeTruthy();
  });

  it("rejects deployUnit for a card not in hand", () => {
    const engine = GundamTestEngine.create({ resourceArea: resources(2) });
    const runtime = engine.getRuntime();

    const envelope: CommandEnvelope = {
      commandID: "test-3",
      move: "deployUnit",
      prevStateID: runtime.state.ctx._stateID,
      actorRole: "player",
      args: { cardId: "nonexistent-card-id" },
    };

    const result = runtime.validateMove(envelope, PLAYER_ONE as PlayerId);
    expect(result.valid).toBe(false);
  });

  it("does not mutate state", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const cardId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
    const runtime = engine.getRuntime();

    const stateIdBefore = runtime.state.ctx._stateID;
    runtime.validateMove(
      {
        commandID: "test-4",
        move: "deployUnit",
        prevStateID: stateIdBefore,
        actorRole: "player",
        args: { cardId },
      },
      PLAYER_ONE as PlayerId,
    );
    expect(runtime.state.ctx._stateID).toBe(stateIdBefore);
  });
});

describe("MatchRuntime.onStateUpdate", () => {
  it("fires after a successful command", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const runtime = engine.getRuntime();

    const calls: number[] = [];
    const unsub = runtime.onStateUpdate((id) => calls.push(id));

    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls.at(-1)).toBe(runtime.state.ctx._stateID);
    unsub();
  });

  it("stops firing after unsubscribe", () => {
    const engine = GundamTestEngine.create({ hand: [], resourceArea: resources(2) });
    const runtime = engine.getRuntime();

    const calls: number[] = [];
    const unsub = runtime.onStateUpdate((id) => calls.push(id));
    unsub();

    runtime.executeCommand(
      {
        commandID: "pass-1",
        move: "passTurn",
        prevStateID: runtime.state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      PLAYER_ONE as PlayerId,
    );
    expect(calls.length).toBe(0);
  });
});

describe("MatchRuntime.onGameEvent", () => {
  it("fires once per published event after a command", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const runtime = engine.getRuntime();

    const received: PublishedGameEvent[] = [];
    runtime.onGameEvent(undefined, (e) => received.push(e));

    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    const deployEvent = received.find((e) => e.event.type === "UNIT_DEPLOYED");
    expect(deployEvent).toBeDefined();
  });

  it("respects the filter predicate", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const runtime = engine.getRuntime();

    const received: PublishedGameEvent[] = [];
    runtime.onGameEvent(
      (e) => e.event.type === "UNIT_DEPLOYED",
      (e) => received.push(e),
    );

    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    expect(received.length).toBeGreaterThan(0);
    for (const e of received) {
      expect(e.event.type).toBe("UNIT_DEPLOYED");
    }
  });
});
