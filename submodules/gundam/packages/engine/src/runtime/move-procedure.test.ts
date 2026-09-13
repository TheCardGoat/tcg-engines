/**
 * getMoveProcedure — UI-facing multi-step picker driver.
 */

import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  createMockUnit,
  createMockPilot,
  createMockBase,
  createMockCommand,
  createMockResource,
  getMoveProcedure,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

function resourcesWithEx() {
  return [
    createMockResource(),
    { card: createMockResource({ name: "EX Resource" }), exhausted: false, isToken: true },
  ];
}

function procedure(
  engine: GundamTestEngine,
  moveName: string,
  partial: Record<string, unknown> = {},
) {
  const runtime = engine.getRuntime() as unknown as {
    state: Parameters<typeof getMoveProcedure>[0];
    staticResources: Parameters<typeof getMoveProcedure>[1];
  };
  return getMoveProcedure(
    runtime.state,
    runtime.staticResources,
    PLAYER_ONE as PlayerId,
    moveName,
    partial,
  );
}

describe("getMoveProcedure", () => {
  it("returns undefined for unknown moves", () => {
    const engine = GundamTestEngine.create({});
    expect(procedure(engine, "notAMove")).toBeUndefined();
  });

  it("returns [] for moves without describeProcedure (auto-submit)", () => {
    // Moves that don't define `describeProcedure` are considered
    // trivially submittable — the seed input is the entire input.
    // The UI auto-submits on this empty step list.
    const engine = GundamTestEngine.create({});
    const steps = procedure(engine, "passTurn");
    expect(steps).toEqual([]);
  });

  it("assignPilot: returns [] before pilotId is set", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resources(2),
    });

    const steps = procedure(engine, "assignPilot", {});
    expect(steps).toEqual([]);
  });

  it("assignPilot: returns selectTarget once pilotId is set", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resources(2),
    });
    const pilotId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, "assignPilot", { pilotId })!;
    expect(steps.length).toBe(1);
    expect(steps[0]!.kind).toBe("selectTarget");
    if (steps[0]!.kind === "selectTarget") {
      expect(steps[0]!.role).toBe("unit");
      expect(steps[0]!.candidateIds).toContain(unitId);
      expect(steps[0]!.minTargets).toBe(1);
      expect(steps[0]!.maxTargets).toBe(1);
    }
  });

  it("assignPilot: asks which Resource to spend when an EX Resource is active", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resourcesWithEx(),
    });
    const pilotId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const resourceIds = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea");
    const exResourceId = resourceIds[1]!;
    expect(procedure(engine, "assignPilot", { pilotId, unitId })).toEqual([
      {
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expectSuccess(
      engine
        .asPlayer(PLAYER_ONE)
        .assignPilot(pilotId, unitId, { paymentResourceIds: [exResourceId] }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(exResourceId)).toBeUndefined();
  });

  it("playCommandAsPilot: asks which Resource to spend when an EX Resource is active", () => {
    const commandPilot = createMockCommand({ level: 1, cost: 1, pilotName: "Test Pilot" });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [commandPilot],
      play: [unit],
      resourceArea: resourcesWithEx(),
    });
    const commandPilotId = engine.asPlayer(PLAYER_ONE).getHand()[0]!;
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const resourceIds = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea");
    const exResourceId = resourceIds[1]!;

    expect(procedure(engine, "playCommandAsPilot", { cardId: commandPilotId, unitId })).toEqual([
      {
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expectSuccess(
      engine
        .asPlayer(PLAYER_ONE)
        .playCommandAsPilot(commandPilotId, unitId, { paymentResourceIds: [exResourceId] }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(exResourceId)).toBeUndefined();
  });

  it("keeps active regular Resources selectable after a partial payment selection", () => {
    const unit = createMockUnit({ level: 2, cost: 2 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const unitId = engine.asPlayer(PLAYER_ONE).getHand()[0]!;
    const resourceIds = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea");

    expect(
      procedure(engine, "deployUnit", { cardId: unitId, paymentResourceIds: [resourceIds[0]] }),
    ).toEqual([
      {
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 2,
        maxTargets: 2,
      },
    ]);
  });

  it("deployBase: asks which Resource to spend when an EX Resource is active", () => {
    const base = createMockBase({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [base],
      resourceArea: resourcesWithEx(),
    });
    const baseId = engine.asPlayer(PLAYER_ONE).getHand()[0]!;

    const resourceIds = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea");
    const exResourceId = resourceIds[1]!;
    expect(procedure(engine, "deployBase", { cardId: baseId })).toEqual([
      {
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expectSuccess(
      engine.asPlayer(PLAYER_ONE).deployBase(baseId, { paymentResourceIds: [exResourceId] }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(exResourceId)).toBeUndefined();
  });

  it("activateAbility: asks which Resource to spend when an EX Resource is active", () => {
    const paidAbility: CardEffect = {
      type: "activated",
      activation: { timing: ["activate:main"] },
      cost: { payResources: 1 },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Activate·Main】①: Draw 1.",
    };
    const unit = createMockUnit({ effects: [paidAbility] });
    const engine = GundamTestEngine.create({
      play: [unit],
      resourceArea: resourcesWithEx(),
      deck: 1,
    });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const resourceIds = engine.asPlayer(PLAYER_ONE).getCardsInZone("resourceArea");
    const exResourceId = resourceIds[1]!;
    expect(procedure(engine, "activateAbility", { cardId: unitId, effectIndex: 0 })).toEqual([
      {
        kind: "selectTarget",
        role: "resource",
        candidateIds: resourceIds,
        minTargets: 1,
        maxTargets: 1,
      },
    ]);
    expectSuccess(
      engine
        .asPlayer(PLAYER_ONE)
        .activateAbility(unitId, 0, { paymentResourceIds: [exResourceId] }),
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(exResourceId)).toBeUndefined();
  });
});
