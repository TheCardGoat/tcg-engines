import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AwkwardApproach119 } from "./119-awkward-approach.ts";

describe("Awkward Approach (GD03-119)", () => {
  it("sets a rested friendly Base active and gives every enemy Unit AP-1 this turn", () => {
    const enemyA = createMockUnit({ ap: 3, hp: 5 });
    const enemyB = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AwkwardApproach119],
        baseSection: [{ card: createMockBase(), exhausted: true }],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [enemyA, enemyB], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [enemyAId, enemyBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd03AwkwardApproach119, { targets: [baseId] }));

    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p2.getVisibleCard(enemyAId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(enemyBId!)?.effectiveAp).toBe(1);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p2.getVisibleCard(enemyAId!)?.effectiveAp).toBe(3);
    expect(p2.getVisibleCard(enemyBId!)?.effectiveAp).toBe(2);
  });

  it("cannot choose an already active Base", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03AwkwardApproach119],
      baseSection: [createMockBase()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectFailure(p1.playCommand(gd03AwkwardApproach119, { targets: [baseId] }), "INVALID_TARGET");
  });
});
