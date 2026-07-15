import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01DuelGundam054 } from "./054-duel-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Duel Gundam (GD01-054)", () => {
  it("links with a ZAFT Pilot, reaches 5 AP, gains Breach, and can attack on its deployment turn", () => {
    const zaftPilot = createMockPilot({
      traits: ["zaft"],
      apBonus: 2,
      hpBonus: 0,
      level: 1,
      cost: 1,
    });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01DuelGundam054, zaftPilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01DuelGundam054));
    const duelId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(duelId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    expectSuccess(p1.assignPilot(zaftPilot, duelId));

    expect(p1.getVisibleCard(duelId)?.effectiveAp).toBe(5);
    expect(p1.getVisibleCard(duelId)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(duelId)?.keywordEffects).toContainEqual({
      keyword: "Breach",
      value: 3,
    });
    expectSuccess(p1.enterBattle(duelId, enemyId));
  });

  it("does not show Breach while its effective AP is below 5", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01DuelGundam054],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd01DuelGundam054));
    const duelId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(duelId)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(duelId)?.keywords).not.toContain("Breach");
    expect(p1.getVisibleCard(duelId)?.keywordEffects).not.toContainEqual({
      keyword: "Breach",
      value: 3,
    });
  });
});
