import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamVirsagoGundamAshtaron040 } from "./040-gundam-virsago-gundam-ashtaron.ts";

describe("Gundam Virsago & Gundam Ashtaron (GD03-040)", () => {
  it("【During Link】 prevents an enemy Blocker from intercepting its attack", () => {
    const shagia = createMockPilot({ name: "Shagia Frost" });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [shagia],
        play: [gd03GundamVirsagoGundamAshtaron040],
        resourceArea: activeResources(5),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(shagia, unitId));
    expectSuccess(p1.enterBattle(unitId, "direct"));

    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
    expect(p2.isExhausted(blockerId)).toBe(false);
  });

  it("allows an enemy Blocker to intercept when the paired Pilot does not satisfy the link condition", () => {
    const nonLinkPilot = createMockPilot({ name: "Garrod Ran" });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      {
        hand: [nonLinkPilot],
        play: [gd03GundamVirsagoGundamAshtaron040],
        resourceArea: activeResources(5),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(nonLinkPilot, unitId));
    expectSuccess(p1.enterBattle(unitId, "direct"));
    expectSuccess(p2.declareBlock(blockerId));

    expect(p2.isExhausted(blockerId)).toBe(true);
  });
});
