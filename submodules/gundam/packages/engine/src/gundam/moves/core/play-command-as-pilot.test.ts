/**
 * Tests for `playCommandAsPilot` (rule 3-4-6-2): playing a Command
 * card that has the 【Pilot】 keyword as a Pilot instead of activating
 * its command effect.
 *
 * What we cover:
 *   - Enumeration: only main-phase, only commands with `pilotName`,
 *     only when at least one unpaired friendly unit exists.
 *   - Execution: the card moves to battleArea, `pilotAssignments` is
 *     updated, and PILOT_ASSIGNED is emitted.
 *   - Cohabitation: when the same dual-mode card is also a legal
 *     `playCommand` candidate, both moves enumerate the card. The UI
 *     uses this to detect the dual-mode decision point.
 *   - Phase gating: pairing is main-phase only (3-4-6 + 7-5-2-1);
 *     during action-step the move is unavailable, while `playCommand`
 *     is still available so the card stays playable as a command.
 *     This is what makes the simulator's "Pilot Only" auto-route fall
 *     out of the gates — when only command timing matches, the dual-
 *     mode detection finds a single legal mode and skips the picker.
 *   - Pilot rules apply (3-4-6-4 → 3-3-4): can't pair onto a unit that
 *     already has a pilot.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockCommand,
  createMockUnit,
  createMockResource,
  getEffectiveStats,
} from "../../index.ts";
import type { TestCardEntry } from "../../testing/test-engine.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { enumerateAvailableMovesDetailed } from "../../../runtime/match-runtime.queries.ts";

/**
 * Trivial main/action command effect with no required targets — picks
 * up `enumerateCandidates` for `playCommand` without forcing the test
 * to thread real card data through.
 */
const trivialDrawOne: CardEffect = {
  type: "command",
  activation: { timing: ["main", "action"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Main】/【Action】 Draw 1.",
};

function resources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

function selectableFor(
  engine: GundamTestEngine,
  moveName: string,
  playerId: string,
): readonly string[] {
  // `staticResources` is private on MatchRuntime; tests reach it via the
  // same untyped escape hatch the existing enumerate-detailed tests use.
  const runtime = engine.getRuntime() as unknown as {
    state: unknown;
    staticResources: unknown;
  };
  const detailed = enumerateAvailableMovesDetailed(
    runtime.state as Parameters<typeof enumerateAvailableMovesDetailed>[0],
    playerId as PlayerId,
    runtime.staticResources as Parameters<typeof enumerateAvailableMovesDetailed>[2],
  );
  return detailed.find((m) => m.moveName === moveName)?.selectableCardIds ?? [];
}

/**
 * Resolve a card's runtime instance ID from its definition. Walks the
 * player's hand + battleArea looking for the first instance whose
 * definition matches `cardNumber`. Mirrors the lookup the player-action
 * helpers do internally — exposed here so the test can compare against
 * `selectableCardIds` (which are instance IDs, not definition IDs).
 */
function findInstance(engine: GundamTestEngine, playerId: string, cardNumber: string): string {
  const found = engine.findCard(
    (id, zoneKey) =>
      zoneKey.endsWith(`:${playerId}`) &&
      id.includes(cardNumber) &&
      (zoneKey.startsWith("hand:") || zoneKey.startsWith("battleArea:")),
  );
  if (!found) throw new Error(`No instance of ${cardNumber} for ${playerId}`);
  return found;
}

describe("playCommandAsPilot — rule 3-4-6-2", () => {
  it("pairs a Command-with-Pilot card onto a friendly Unit", () => {
    const unit = createMockUnit({ level: 1, cost: 1, ap: 2, hp: 2 });
    const cmd = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
    });

    const engine = GundamTestEngine.create({ hand: [unit, cmd], resourceArea: resources(5) }, {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.playCommandAsPilot(cmd, unit));

    const cmdInstance = findInstance(engine, PLAYER_ONE, cmd.cardNumber);
    const unitInstance = findInstance(engine, PLAYER_ONE, unit.cardNumber);

    // Card landed in battleArea, not trash (rule 3-4-6-3 — a "Command card"
    // becomes a "Pilot" while paired).
    const battle = engine.getCardsInZone({ zone: "battleArea", playerId: PLAYER_ONE });
    expect(battle).toContain(cmdInstance);

    // Pairing recorded.
    const g = engine.runtime.getState().G as { pilotAssignments: Record<string, string> };
    expect(g.pilotAssignments[unitInstance]).toBe(cmdInstance);
  });

  it("applies command-as-pilot AP/HP modifiers to effective stats", () => {
    const unit = createMockUnit({ level: 1, cost: 1, ap: 3, hp: 1 });
    const cmd = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 2,
      hpBonus: 1,
    });

    const engine = GundamTestEngine.create({ hand: [unit, cmd], resourceArea: resources(5) }, {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.playCommandAsPilot(cmd, unit));

    const unitInstance = findInstance(engine, PLAYER_ONE, unit.cardNumber);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(unitInstance, engine.getG(), framework.cards, framework);
    expect(stats.ap).toBe(5);
    expect(stats.hp).toBe(2);
  });

  it("rejects a Command without the [Pilot] keyword", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const cmd = createMockCommand({ level: 1, cost: 1 });

    const engine = GundamTestEngine.create({ hand: [unit, cmd], resourceArea: resources(5) }, {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    const result = p1.playCommandAsPilot(cmd, unit);
    expectFailure(result, "NO_PILOT_KEYWORD");
  });

  it("rejects pairing onto a unit that already has a pilot", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const firstPilot = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
    });
    const secondPilot = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
    });

    const engine = GundamTestEngine.create(
      { hand: [unit, firstPilot, secondPilot], resourceArea: resources(5) },
      {},
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.playCommandAsPilot(firstPilot, unit));
    expectFailure(p1.playCommandAsPilot(secondPilot, unit), "UNIT_ALREADY_HAS_PILOT");
  });

  it("does not enumerate the card when no unpaired friendly unit exists", () => {
    const cmd = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
    });

    const engine = GundamTestEngine.create({ hand: [cmd], resourceArea: resources(5) }, {});

    const ids = selectableFor(engine, "playCommandAsPilot", PLAYER_ONE);
    const cmdInstance = findInstance(engine, PLAYER_ONE, cmd.cardNumber);
    expect(ids).not.toContain(cmdInstance);
  });

  it("does not enumerate during action-step (pairing is main-phase only)", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const dualMode = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
      effects: [trivialDrawOne],
    });

    const engine = GundamTestEngine.create(
      { hand: [dualMode], play: [unit], resourceArea: resources(5) },
      {},
    );

    // Force the action-step under end-phase, the simulator's "Action"
    // timing window. `playCommand` accepts main+action timings;
    // `playCommandAsPilot` should disappear from enumeration entirely.
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    const pilotIds = selectableFor(engine, "playCommandAsPilot", PLAYER_ONE);
    expect(pilotIds).toEqual([]);
  });

  it("playCommand stays available during action-step for dual-mode cards", () => {
    // The "Pilot Only" auto-route in the simulator only works because
    // the converse also holds: when pairing is gated off, the command
    // path still enumerates the same card so the click resolves to
    // a single legal mode (which the dispatcher silently routes).
    const unit = createMockUnit({ level: 1, cost: 1 });
    const dualMode = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
      effects: [trivialDrawOne],
    });

    const engine = GundamTestEngine.create(
      { hand: [dualMode], play: [unit], resourceArea: resources(5) },
      {},
    );
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    const cmdIds = selectableFor(engine, "playCommand", PLAYER_ONE);
    const dualId = findInstance(engine, PLAYER_ONE, dualMode.cardNumber);
    expect(cmdIds).toContain(dualId);
  });

  it("enumerates a dual-mode card under both playCommand and playCommandAsPilot", () => {
    // The dual-mode card is the load-bearing case for the new UX flow.
    // The UI detects "this card has both moves available" by intersecting
    // each move's selectableCardIds; that detection only works if both
    // moves enumerate the card.
    const unit = createMockUnit({ level: 1, cost: 1 });
    const dualMode = createMockCommand({
      level: 1,
      cost: 1,
      pilotName: "Test Pilot",
      apBonus: 1,
      hpBonus: 0,
      effects: [trivialDrawOne],
    });

    const engine = GundamTestEngine.create(
      { hand: [unit, dualMode], resourceArea: resources(5) },
      {},
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployUnit(unit));

    const cmdIds = selectableFor(engine, "playCommand", PLAYER_ONE);
    const pilotIds = selectableFor(engine, "playCommandAsPilot", PLAYER_ONE);
    const dualId = findInstance(engine, PLAYER_ONE, dualMode.cardNumber);
    expect(cmdIds).toContain(dualId);
    expect(pilotIds).toContain(dualId);
  });
});
