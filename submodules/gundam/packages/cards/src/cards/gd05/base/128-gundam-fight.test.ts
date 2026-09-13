import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05GundamFight128 } from "./128-gundam-fight.ts";

describe("Gundam Fight (GD05-128)", () => {
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(gd05GundamFight128);
  });

  it("rests for its activated cost even when no friendly MF Link Unit is in play", () => {
    const target = createMockUnit({ ap: 3 });
    const engine = GundamTestEngine.create({ baseSection: [gd05GundamFight128], play: [target] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateBaseAbility(baseId));

    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(3);
  });

  it("chooses and buffs a friendly Unit when an MF Link Unit is in play", () => {
    const pilot = createMockPilot({ name: "MF Pilot", level: 1, cost: 0 });
    const linkUnit = createMockUnit({ ap: 3, traits: ["mf"], linkCondition: "[MF Pilot]" });
    const target = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      baseSection: [gd05GundamFight128],
      play: [linkUnit, target],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [linkUnitId, targetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(pilot, linkUnitId!));
    expectSuccess(p1.activateBaseAbility(baseId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([linkUnitId, targetId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p1.getVisibleCard(targetId!)?.effectiveAp).toBe(4);
  });
});
