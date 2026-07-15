import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockBase,
  createMockPilot,
  expectSuccess,
  asPlayerId,
} from "@tcg/gundam-engine";
import { gd02GundamMkIiAeug071 } from "./071-gundam-mk-ii-aeug.ts";

describe("Gundam Mk-II (AEUG) (GD02-071)", () => {
  it("card data encodes friendlyBaseInPlay in activation.conditions (moved from ConditionalDirective)", () => {
    const effect = gd02GundamMkIiAeug071.effects?.[0];
    expect(effect?.activation.conditions).toEqual([{ type: "friendlyBaseInPlay", color: "white" }]);
    // biome-ignore lint/suspicious/noExplicitAny: structural assertion
    const directive = (effect as any)?.directives?.[0];
    expect(directive?.action?.action).toBe("pairPilot");
    // No ConditionalDirective wrapping.
    expect(directive?.condition).toBeUndefined();
  });

  it("deploy pairPilot e2e - pairs chosen pilot with the deployed unit", () => {
    const whiteBase = createMockBase({ color: "white" });
    const aeugPilot = createMockPilot({ traits: ["aeug"], color: "white" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamMkIiAeug071, aeugPilot],
        play: [],
        baseSection: [whiteBase],
        resourceArea: activeResources(4),
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const pid = asPlayerId(PLAYER_ONE);
    const runtime = engine.getRuntime();

    // Resolve instance IDs via the runtime.
    const pilotId = runtime.getInstanceIdByDefinition(pid, aeugPilot.cardNumber)!;
    expect(pilotId).toBeDefined();

    // Deploy with the pilot as the chosen target.
    expectSuccess(p1.deployUnit(gd02GundamMkIiAeug071, { targets: [pilotId] }));

    // The pilot should now be paired with the unit.
    const unitId = runtime.getInstanceIdByDefinition(pid, gd02GundamMkIiAeug071.cardNumber)!;
    const g = engine.getG();
    expect(g.pilotAssignments[unitId]).toBe(pilotId);
  });
});
