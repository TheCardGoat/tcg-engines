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
  it("【Deploy】 may rest exactly 1 eligible enemy Unit", () => {
    const chosen = createMockUnit({ hp: 3 });
    const unchosen = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03PenelopeMiddleForm006], resourceArea: activeResources(6) },
      { play: [chosen, unchosen] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, unchosenId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd03PenelopeMiddleForm006, { targets: [chosenId!] }));

    expect(p2.isExhausted(chosenId!)).toBe(true);
    expect(p2.isExhausted(unchosenId!)).toBe(false);
  });

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

    const p2 = engine.asPlayer(PLAYER_TWO);
    expect(p2.isExhausted(weakAId!)).toBe(true);
    expect(p2.isExhausted(weakBId!)).toBe(true);
    expect(p2.isExhausted(sturdyId!)).toBe(false);
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
