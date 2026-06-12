/**
 * getMoveProcedure — UI-facing multi-step picker driver.
 */

import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  createMockPilot,
  createMockResource,
  getMoveProcedure,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
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

  it("assignPilot: returns [] once both pilotId and unitId are set", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resources(2),
    });
    const pilotId = engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0]!;
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, "assignPilot", { pilotId, unitId });
    expect(steps).toEqual([]);
  });
});
