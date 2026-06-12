import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  evaluateTargetFilter,
  buildTargetResolutionContext,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02HeartSetOnRevenge118 } from "./118-heart-set-on-revenge.ts";

describe("Heart Set on Revenge (GD02-118)", () => {
  // 【Action】Choose 1 enemy Unit with 4 or less HP battling a friendly
  // Unit with <Blocker>. Return it to its owner's hand.
  //
  // The card text combines TWO attribute narrows (HP ≤ 4 on the enemy
  // candidate) with ONE relational narrow (the enemy is battling a
  // friendly Unit with <Blocker>). The relational narrow is modelled
  // via `isBattling.opponentMatches` — the <Blocker> keyword lives on
  // the OTHER combatant, not on the enemy candidate.

  function setup() {
    const blocker = createMockUnit({
      name: "Friendly Blocker",
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const nonBlocker = createMockUnit({ name: "Friendly Plain", ap: 2, hp: 3 });
    const weakEnemy = createMockUnit({ name: "Weak Enemy", ap: 3, hp: 3 });
    const beefyEnemy = createMockUnit({ name: "Beefy Enemy", ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [blocker, nonBlocker] },
      { play: [weakEnemy, beefyEnemy] },
    );
    const rt = engine.getRuntime();
    const blockerId = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, blocker.cardNumber)!;
    const nonBlockerId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      nonBlocker.cardNumber,
    )!;
    const weakEnemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, weakEnemy.cardNumber)!;
    const beefyEnemyId = rt.getInstanceIdByDefinition(
      PLAYER_TWO as PlayerId,
      beefyEnemy.cardNumber,
    )!;
    return { engine, rt, blockerId, nonBlockerId, weakEnemyId, beefyEnemyId };
  }

  function allBattleAreaCards(rt: ReturnType<GundamTestEngine["getRuntime"]>) {
    const fw = rt.getFrameworkReadAPI();
    return [
      ...fw.zones.getCards({ zone: "battleArea", playerId: PLAYER_ONE }),
      ...fw.zones.getCards({ zone: "battleArea", playerId: PLAYER_TWO }),
    ]
      .map((id) => fw.cards.get(id))
      .filter(<T>(c: T | undefined): c is T => c !== undefined);
  }

  it("positive: enemy HP≤4 battling a friendly <Blocker> → candidate matches", () => {
    const { engine, rt, blockerId, weakEnemyId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: weakEnemyId,
      attackerPlayerId: PLAYER_TWO,
      target: blockerId,
    };

    const fw = rt.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, fw, { sourceCardId: blockerId });
    const target = gd02HeartSetOnRevenge118.effects?.[0]?.directives[0];
    if (!target || !("action" in target) || target.action.action !== "returnToHand") {
      throw new Error("Unexpected directive shape");
    }
    const matched = evaluateTargetFilter(target.action.target, allBattleAreaCards(rt), ctx);
    expect(matched).toEqual([weakEnemyId]);
  });

  it("negative: enemy battling a NON-blocker friendly → no match", () => {
    const { engine, rt, nonBlockerId, weakEnemyId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: weakEnemyId,
      attackerPlayerId: PLAYER_TWO,
      target: nonBlockerId,
    };

    const fw = rt.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, fw, { sourceCardId: nonBlockerId });
    const target = gd02HeartSetOnRevenge118.effects?.[0]?.directives[0];
    if (!target || !("action" in target) || target.action.action !== "returnToHand") {
      throw new Error("Unexpected directive shape");
    }
    const matched = evaluateTargetFilter(target.action.target, allBattleAreaCards(rt), ctx);
    expect(matched).toEqual([]);
  });

  it("negative: enemy HP>4 even when battling blocker → no match", () => {
    const { engine, rt, blockerId, beefyEnemyId } = setup();
    const g = engine.getG();
    g.turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: beefyEnemyId,
      attackerPlayerId: PLAYER_TWO,
      target: blockerId,
    };

    const fw = rt.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, fw, { sourceCardId: blockerId });
    const target = gd02HeartSetOnRevenge118.effects?.[0]?.directives[0];
    if (!target || !("action" in target) || target.action.action !== "returnToHand") {
      throw new Error("Unexpected directive shape");
    }
    const matched = evaluateTargetFilter(target.action.target, allBattleAreaCards(rt), ctx);
    expect(matched).toEqual([]);
  });

  it("no active combat → no candidate", () => {
    const { engine, rt, blockerId } = setup();
    const g = engine.getG();
    expect(g.turnMetadata.pendingCombat).toBeUndefined();
    const fw = rt.getFrameworkReadAPI();
    const ctx = buildTargetResolutionContext(g, PLAYER_ONE, fw, { sourceCardId: blockerId });
    const target = gd02HeartSetOnRevenge118.effects?.[0]?.directives[0];
    if (!target || !("action" in target) || target.action.action !== "returnToHand") {
      throw new Error("Unexpected directive shape");
    }
    const matched = evaluateTargetFilter(target.action.target, allBattleAreaCards(rt), ctx);
    expect(matched).toEqual([]);
  });
});
