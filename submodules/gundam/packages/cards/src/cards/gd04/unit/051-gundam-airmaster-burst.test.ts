import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  buildTargetResolutionContext,
  createMockUnit,
  evaluateTargetFilter,
} from "@tcg/gundam-engine";
import type { EffectDirective } from "@tcg/gundam-types";
import { gd04GundamAirmasterBurst051 } from "./051-gundam-airmaster-burst.ts";

describe("Gundam Airmaster Burst (GD04-051)", () => {
  const effect = gd04GundamAirmasterBurst051.effects![0]!;
  const directive = effect.directives[0] as EffectDirective;
  const action = directive.action;

  it("requires During Pair and 7 or more cards in trash", () => {
    expect(effect.activation.conditions).toEqual([
      { type: "duringPair" },
      {
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        comparison: "gte",
        count: 7,
      },
    ]);
  });

  it("grants this Unit an active enemy Unit with any keyword effect as an attack option", () => {
    expect(action).toMatchObject({
      action: "chooseAttackTarget",
      unit: {
        owner: "self",
        cardType: "unit",
        count: 1,
      },
      attackTarget: {
        owner: "opponent",
        cardType: "unit",
        state: "active",
        hasAnyKeyword: true,
      },
    });
  });

  it("hasAnyKeyword target filtering matches keyword-bearing enemies only", () => {
    if (action.action !== "chooseAttackTarget") throw new Error("expected chooseAttackTarget");
    const keywordEnemy = createMockUnit({
      name: "Keyword Enemy",
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const vanillaEnemy = createMockUnit({ name: "Vanilla Enemy", ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamAirmasterBurst051] },
      { play: [keywordEnemy, vanillaEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [keywordEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
      sourceCardId: unitId,
    });
    const candidates = engine
      .asPlayer(PLAYER_TWO)
      .getCardsInZone("battleArea")
      .map((id) => framework.cards.get(id)!);

    expect(evaluateTargetFilter(action.attackTarget, candidates, ctx)).toEqual([keywordEnemyId]);
  });
});
