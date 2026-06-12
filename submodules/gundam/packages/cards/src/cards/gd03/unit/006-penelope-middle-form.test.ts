import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03PenelopeMiddleForm006 } from "./006-penelope-middle-form.ts";

describe("Penelope (Middle Form) (GD03-006)", () => {
  it("【Deploy】 rests 1 to 2 enemy Units with 3 or less HP", () => {
    const weakA = createMockUnit({ hp: 3 });
    const weakB = createMockUnit({ hp: 3 });
    const sturdy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03PenelopeMiddleForm006], resourceArea: activeResources(6) },
      { play: [weakA, weakB, sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [weakAId, weakBId, sturdyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd03PenelopeMiddleForm006, { targets: [weakAId!, weakBId!] }));

    expect(engine.getG().exhausted[weakAId!]).toBe(true);
    expect(engine.getG().exhausted[weakBId!]).toBe(true);
    expect(engine.getG().exhausted[sturdyId!]).not.toBe(true);
  });

  it("【Deploy】 rejects an enemy Unit with more than 3 HP", () => {
    const sturdy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03PenelopeMiddleForm006], resourceArea: activeResources(6) },
      { play: [sturdy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sturdyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03PenelopeMiddleForm006, { targets: [sturdyId] }),
      "INVALID_TARGET",
    );
  });
});
