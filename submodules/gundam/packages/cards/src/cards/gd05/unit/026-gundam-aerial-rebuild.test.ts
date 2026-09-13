import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05GundamAerialRebuild026 } from "./026-gundam-aerial-rebuild.ts";

describe("Gundam Aerial Rebuild (GD05-026)", () => {
  /** @behavioral-proof complete: dynamic friendly-name ceiling and both rested/active outcomes. */
  it("deploys enemy Units rested only through 1 plus its friendly Lfrith/Gundnode count", () => {
    const lfrith = createMockUnit({ name: "Gundam Lfrith", level: 2 });
    const lowLevelEnemy = createMockUnit({ name: "Eligible Enemy", level: 2, cost: 0 });
    const highLevelEnemy = createMockUnit({ name: "Ineligible Enemy", level: 3, cost: 0 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamAerialRebuild026, lfrith], deck: 5 },
      {
        hand: [lowLevelEnemy, highLevelEnemy],
        resourceArea: activeResources(3),
        deck: 5,
      },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [eligibleId, ineligibleId] = p2.getHand();

    engine.endTurn();
    expectSuccess(p2.deployUnit(eligibleId!));
    expect(p2.isExhausted(eligibleId!)).toBe(true);
    expectSuccess(p2.deployUnit(ineligibleId!));
    expect(p2.isExhausted(ineligibleId!)).toBe(false);
    expect(engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")).toHaveLength(2);
  });

  it("does not rest its controller's qualifying Unit", () => {
    const lfrith = createMockUnit({ name: "Gundam Lfrith", level: 2 });
    const friendlyUnit = createMockUnit({ name: "Eligible Friendly", level: 2, cost: 0 });
    const engine = GundamTestEngine.create(
      {
        play: [gd05GundamAerialRebuild026, lfrith],
        hand: [friendlyUnit],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(friendlyId));
    expect(p1.isExhausted(friendlyId)).toBe(false);
  });
});
