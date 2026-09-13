import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01GundamLfrithThorn035 } from "./035-gundam-lfrith-thorn.ts";

describe("Gundam Lfrith Thorn (EB01-035)", () => {
  /** @behavioral-proof complete: matching deployed Unit gate and visible temporary Breach result. */
  it("gains Breach 1 only when another friendly Lv.3 (G Generation) Unit is deployed", () => {
    const matching = createMockUnit({ level: 3, traits: ["g generation"], cost: 0 });
    const wrongLevel = createMockUnit({ level: 4, traits: ["g generation"], cost: 0 });
    const engine = GundamTestEngine.create({
      play: [eb01GundamLfrithThorn035],
      hand: [matching, wrongLevel],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [matchingId, wrongLevelId] = p1.getHand();

    expectSuccess(p1.deployUnit(wrongLevelId!));
    expect(p1.getVisibleCard(sourceId)?.keywords).not.toContain("Breach");
    expectSuccess(p1.deployUnit(matchingId!));
    expect(p1.getVisibleCard(sourceId)?.keywords).toContain("Breach");
  });
});
