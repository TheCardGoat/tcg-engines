import { projectGrandArchiveCombatView } from "./combat.ts";
import * as combatProcedure from "../procedures/combat/combat.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { describe, expect, it, vi } from "vitest";
import {
  portSmuggler,
  spiritOfWind,
  woodlandSquirrels,
  deflectingEdge,
  trainingSword,
} from "@tcg/grand-archive-cards";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";

function setup() {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfWind, zones: { field: [portSmuggler] } },
    playerTwo: { id: "p2", champion: spiritOfWind, zones: { field: [portSmuggler] } },
  });
  const attacker = engine.player("p1").card(portSmuggler, { zone: "field" });
  const defender = engine.player("p2").card(portSmuggler, { zone: "field" });
  engine.player("p1").declareAttack(attacker, defender);
  return { engine, attacker, defender };
}

function passWindow(engine: GrandArchiveTestEngine) {
  const holder = engine.state.opportunity?.holderId;
  if (!holder) throw new Error("Expected a combat Opportunity");
  engine.player(holder).pass();
}

function chooseRetaliation(engine: GrandArchiveTestEngine, ids: readonly string[]) {
  while (!engine.state.decision) passWindow(engine);
  const decision = engine.state.decision;
  if (decision.kind !== "choose-retaliators") throw new Error("Expected retaliation choice");
  engine.player(decision.playerId).execute({
    move: "answer-decision",
    decisionId: decision.id,
    stateVersion: decision.stateVersion,
    answer: ids,
  });
}

describe("viewer combat forecast", () => {
  it("shares a forecast across viewers but invalidates it for new snapshots and programs", () => {
    const { engine, defender } = setup();
    chooseRetaliation(engine, [defender.objectId]);
    const first = engine.player("p1").view().combatView;
    expect(engine.player("p2").view().combatView).toBe(first);
    expect(projectGrandArchiveCombatView({ ...engine.program }, engine.state)).not.toBe(first);
    passWindow(engine);
    expect(engine.player("p1").view().combatView).not.toBe(first);
  });

  it("contains unexpected forecast failures without mutating or breaking the viewer", () => {
    const { engine, defender } = setup();
    chooseRetaliation(engine, [defender.objectId]);
    const before = structuredClone(engine.state);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const proposal = vi
      .spyOn(combatProcedure, "proposeGrandArchiveCombatDamage")
      .mockImplementation(() => {
        throw new Error("Unsupported hypothetical damage");
      });
    try {
      expect(engine.player("p1").view().combatView?.damage).toEqual({
        kind: "pending",
        reason: "unavailable",
      });
      expect(engine.state).toEqual(before);
      expect(warn).toHaveBeenCalledOnce();
      engine.player("p2").view();
      expect(proposal).toHaveBeenCalledOnce();
    } finally {
      proposal.mockRestore();
      warn.mockRestore();
    }
  });

  it("retains the confirmed retaliation order after combat ends", () => {
    const { engine, defender } = setup();
    const champion = engine.player("p2").card(spiritOfWind, { zone: "field" });
    const ordered = [defender.objectId, champion.objectId];
    const state = new GrandArchiveTransactionKernel().transact(engine.state, [
      { type: "combat-step-changed", step: "damage", retaliatorIds: ordered },
      { type: "combat-retaliators-ordered", retaliatorIds: ordered },
      { type: "combat-ended" },
    ]).state;
    const view = projectGrandArchiveCombatView(engine.program, state);
    expect(view?.active).toBe(false);
    expect(view?.combat.retaliatorIds).toEqual(ordered);
    expect(view?.combat.retaliationOrderConfirmed).toBe(true);
  });

  it("keeps retaliation unknown until committed, then matches actual damage in both directions without mutating play", () => {
    const { engine, attacker, defender } = setup();
    expect(engine.player("p1").view().combatView?.retaliationPending).toBe(true);
    chooseRetaliation(engine, [defender.objectId]);
    const before = structuredClone(engine.state);
    const forecast = engine.player("p1").view().combatView;
    expect(engine.state).toEqual(before);
    expect(forecast?.retaliationPending).toBe(false);
    expect(forecast?.damage.kind).toBe("projected");
    if (forecast?.damage.kind !== "projected") throw new Error("Expected forecast");
    expect(forecast.damage.amounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceId: attacker.objectId,
          recipientId: defender.objectId,
          amount: 1,
        }),
        expect.objectContaining({
          sourceId: defender.objectId,
          recipientId: attacker.objectId,
          amount: 1,
        }),
      ]),
    );
    while (engine.state.combat) passWindow(engine);
    expect(engine.player("p1").view().combatView?.damage).toEqual({
      kind: "dealt",
      amounts: forecast.damage.amounts,
    });
    expect(engine.player("p2").view().combatView?.damage).toEqual({
      kind: "dealt",
      amounts: forecast.damage.amounts,
    });
  });

  it("shows zero retaliation only after it is declined", () => {
    const { engine, defender } = setup();
    chooseRetaliation(engine, []);
    const view = engine.player("p1").view().combatView;
    expect(view?.retaliationPending).toBe(false);
    expect(view?.damage.kind).toBe("projected");
    if (view?.damage.kind !== "projected") throw new Error("Expected forecast");
    expect(view.damage.amounts.some((entry) => entry.sourceId === defender.objectId)).toBe(false);
    engine.resolveCombatWithoutRetaliation();
    expect(engine.player("p1").view().combatView?.active).toBe(false);
  });
  it("uses resolved prevention without spending the real prevention effect", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWind,
        zones: { field: [woodlandSquirrels, trainingSword], hand: [deflectingEdge] },
      },
      playerTwo: { id: "p2", champion: spiritOfWind, zones: { field: [woodlandSquirrels] } },
    });
    const attacker = engine.player("p1").card(woodlandSquirrels, { zone: "field" });
    const defender = engine.player("p2").card(woodlandSquirrels, { zone: "field" });
    engine.player("p1").declareAttack(attacker, defender);
    engine.player("p1").activate(deflectingEdge, { targets: { "target-1": [attacker.objectId] } });
    expect(engine.player("p1").view().combatView?.damage).toEqual({
      kind: "pending",
      reason: "effects",
    });
    while (engine.state.stack.length) passWindow(engine);
    chooseRetaliation(engine, [defender.objectId]);
    const forecast = engine.player("p1").view().combatView;
    expect(forecast?.damage).toEqual({
      kind: "projected",
      amounts: [{ sourceId: attacker.objectId, recipientId: defender.objectId, amount: 1 }],
    });
    while (engine.state.combat) passWindow(engine);
    expect(engine.player("p1").view().combatView?.damage).toEqual({
      kind: "dealt",
      amounts: [{ sourceId: attacker.objectId, recipientId: defender.objectId, amount: 1 }],
    });
    expect(engine.player("p1").card(attacker).objectId).toBe(attacker.objectId);
    expect(
      engine
        .player("p2")
        .zone("graveyard")
        .map((card) => card.objectId),
    ).toContain(defender.objectId);
  });

  it("forecasts retaliation even when both combatants receive lethal damage", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion: spiritOfWind, zones: { field: [woodlandSquirrels] } },
      playerTwo: { id: "p2", champion: spiritOfWind, zones: { field: [woodlandSquirrels] } },
    });
    const attacker = engine.player("p1").card(woodlandSquirrels, { zone: "field" });
    const defender = engine.player("p2").card(woodlandSquirrels, { zone: "field" });
    engine.player("p1").declareAttack(attacker, defender);
    chooseRetaliation(engine, [defender.objectId]);
    const amounts = [
      { sourceId: attacker.objectId, recipientId: defender.objectId, amount: 1 },
      { sourceId: defender.objectId, recipientId: attacker.objectId, amount: 1 },
    ];
    expect(engine.player("p1").view().combatView?.damage).toEqual({ kind: "projected", amounts });
    while (engine.state.combat) passWindow(engine);
    expect(
      engine
        .player("p1")
        .zone("graveyard")
        .map((card) => card.objectId),
    ).toContain(attacker.objectId);
    expect(
      engine
        .player("p2")
        .zone("graveyard")
        .map((card) => card.objectId),
    ).toContain(defender.objectId);
    expect(engine.player("p1").view().combatView?.damage).toEqual({ kind: "dealt", amounts });
  });
});
