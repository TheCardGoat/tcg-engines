import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { eb01GundamAstarothRinascimentoEx029 } from "./029-gundam-astaroth-rinascimento-ex.ts";

describe("Gundam Astaroth Rinascimento (EX) (EB01-029)", () => {
  it("【Deploy】 with five enemies deals 2 only to all Blockers at Lv.4 or lower", () => {
    const blocker = (level: number) =>
      createMockUnit({ level, hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const friendlyBlocker = blocker(4);
    const enemyCards = [
      blocker(4),
      blocker(5),
      createMockUnit({ level: 4, hp: 5 }),
      createMockUnit(),
      createMockUnit(),
    ];
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamAstarothRinascimentoEx029],
        play: [friendlyBlocker],
        resourceArea: activeResources(6),
      },
      { play: enemyCards },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, highLevelId, nonBlockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(eb01GundamAstarothRinascimentoEx029));

    expect(p1.getDamage(friendlyId)).toBe(2);
    expect(p2.getDamage(eligibleId!)).toBe(2);
    expect(p2.getDamage(highLevelId!)).toBe(0);
    expect(p2.getDamage(nonBlockerId!)).toBe(0);
  });

  it("does not deal damage when fewer than five enemy Units are in play", () => {
    const blocker = createMockUnit({ level: 4, hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create(
      { hand: [eb01GundamAstarothRinascimentoEx029], resourceArea: activeResources(6) },
      { play: [blocker, createMockUnit(), createMockUnit(), createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamAstarothRinascimentoEx029));
    expect(p2.getDamage(blockerId)).toBe(0);
  });
});
