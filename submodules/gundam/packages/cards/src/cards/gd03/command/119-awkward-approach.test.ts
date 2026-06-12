import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd03AwkwardApproach119 } from "./119-awkward-approach.ts";

describe("Awkward Approach (GD03-119)", () => {
  it("【Main】 sets a rested friendly Base active", () => {
    const base = { card: createMockBase(), exhausted: true };
    const enemyA = createMockUnit({ ap: 3 });
    const enemyB = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AwkwardApproach119],
        baseSection: [base],
        resourceArea: activeResources(3),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd03AwkwardApproach119, { targets: [baseId] }));

    expect(engine.getG().exhausted[baseId]).not.toBe(true);
    expect(enemyIds.length).toBe(2);
  });

  it("behavior: if the Base is set active, all enemy Units get AP-1 during this turn", () => {
    const base = { card: createMockBase(), exhausted: true };
    const enemyA = createMockUnit({ ap: 3 });
    const enemyB = createMockUnit({ ap: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AwkwardApproach119],
        baseSection: [base],
        resourceArea: activeResources(3),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd03AwkwardApproach119, { targets: [baseId] }));

    expect(findStatModifier(engine, enemyIds[0]!, "ap")?.modifier).toBe(-1);
    expect(findStatModifier(engine, enemyIds[1]!, "ap")?.modifier).toBe(-1);
  });
});
