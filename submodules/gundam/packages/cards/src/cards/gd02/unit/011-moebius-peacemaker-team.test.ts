import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  buildTargetResolutionContext,
  createMockUnit,
  evaluateTargetFilter,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { CardInstanceId, PlayerId, RuntimeCard } from "@tcg/gundam-engine";
import type { TargetFilter } from "@tcg/gundam-types";
import { gd02MoebiusPeacemakerTeam011 } from "./011-moebius-peacemaker-team.ts";
import { gd02Gwadan125 } from "../base/125-gwadan.ts";

describe("Moebius (Peacemaker Team) (GD02-011)", () => {
  // Printed: 【Activate·Action】Destroy this Unit：Choose 1 enemy Base/enemy
  // Shield this Unit is battling. Deal 6 damage to it.
  //
  // The "is battling" qualifier reaches into pendingCombat. For direct
  // attacks (the only way bases/shields participate in combat today)
  // buildTargetResolutionContext.currentBattleParticipantIds includes the
  // defender's baseSection card and every shieldArea card so a TargetFilter
  // with `isBattling: true` can match them.
  //
  // The printed cost "Destroy this Unit：" is now modelled via
  // `EffectCost.destroySelf` — paid up-front in `payCost`, which
  // sends the source card to its owner's trash before the directive
  // body runs. The end-to-end cost-payment is covered below; the
  // directive-level targeting (the "Choose 1 enemy Base/Shield this
  // Unit is battling" narrow) is exercised further down.

  const damageDirective = gd02MoebiusPeacemakerTeam011.effects![0]!.directives[0]!;
  const damageFilter = (damageDirective as { action: { target: TargetFilter } }).action
    .target as TargetFilter;

  it("printed cost: the activated ability's EffectCost carries destroySelf:true", () => {
    // Card-data lock: any regression that drops the destroy-self cost
    // flips this assertion immediately. Paired with the engine-level
    // `activate-ability.test.ts` case that verifies destroySelf
    // actually moves the source to trash when paid, this locks the
    // full conversion: card-data populates the cost, engine consumes
    // it in `payCost`.
    const effect = gd02MoebiusPeacemakerTeam011.effects![0]!;
    expect(effect.cost?.destroySelf).toBe(true);
  });

  it("pay cost end-to-end: activating the ability sends Moebius to p1's trash", () => {
    // Focused cost-payment check. We don't need the 6-damage directive to
    // resolve (that requires a battling Base/Shield to exist and targets
    // to be pre-committed), only that the `destroySelf` cost is paid
    // up-front in `payCost` and Moebius leaves the battle area. The
    // damage directive will halt awaiting target selection — expected;
    // the cost has already been paid by then, which is the contract.
    const engine = GundamTestEngine.create({ play: [gd02MoebiusPeacemakerTeam011] }, { deck: 4 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const moebiusId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(gd02MoebiusPeacemakerTeam011, 0, {}));

    expect(engine.getCardsInZone({ zone: "battleArea", playerId: PLAYER_ONE })).not.toContain(
      moebiusId,
    );
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).toContain(moebiusId);
  });

  function allTargetableCards(
    framework: ReturnType<ReturnType<GundamTestEngine["getRuntime"]>["getFrameworkReadAPI"]>,
  ): readonly RuntimeCard[] {
    const zones = ["battleArea", "baseSection", "shieldArea"] as const;
    const out: RuntimeCard[] = [];
    for (const pid of [PLAYER_ONE, PLAYER_TWO]) {
      for (const zone of zones) {
        for (const id of framework.zones.getCards({ zone, playerId: pid })) {
          const c = framework.cards.get(id);
          if (c) out.push(c);
        }
      }
    }
    return out;
  }

  it("base attack: Moebius's direct attack puts the defender's Base into the battling set", () => {
    // Seed Gwadan into p2's deck so its definition is registered in the
    // catalog; `giveCard` + `registerCardInstance` then places a distinct
    // instance directly into baseSection.
    const engine = GundamTestEngine.create(
      { play: [gd02MoebiusPeacemakerTeam011] },
      { deck: [gd02Gwadan125, gd02Gwadan125, gd02Gwadan125, gd02Gwadan125, gd02Gwadan125] },
    );
    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const moebiusId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02MoebiusPeacemakerTeam011.cardNumber,
    )!;
    const baseId = engine.giveCard(PLAYER_TWO as PlayerId, gd02Gwadan125.cardNumber, {
      zone: "baseSection",
      playerId: PLAYER_TWO as PlayerId,
    });
    rt.registerCardInstance(baseId, gd02Gwadan125.cardNumber, PLAYER_TWO as PlayerId);

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: moebiusId,
      attackerPlayerId: PLAYER_ONE,
      target: "direct",
    };

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, fw, {
      sourceCardId: moebiusId,
    });
    expect(ctx.currentBattleParticipantIds?.has(baseId as CardInstanceId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(moebiusId as CardInstanceId)).toBe(true);

    // End-to-end: the card's own damage-directive filter should resolve to
    // exactly the defender's battling Base — not Moebius itself (excluded by
    // owner:"opponent"), not any non-battling base/shield.
    const matched = evaluateTargetFilter(damageFilter, allTargetableCards(fw), ctx);
    expect(matched).toEqual([baseId]);
  });

  it("shield attack: defender's shieldArea cards count as battling on a direct attack", () => {
    const engine = GundamTestEngine.create({ play: [gd02MoebiusPeacemakerTeam011] }, { deck: 4 });
    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const moebiusId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02MoebiusPeacemakerTeam011.cardNumber,
    )!;
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_TWO, 2);

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: moebiusId,
      attackerPlayerId: PLAYER_ONE,
      target: "direct",
    };

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, fw, {
      sourceCardId: moebiusId,
    });
    for (const sid of shieldIds) {
      expect(ctx.currentBattleParticipantIds?.has(sid as CardInstanceId)).toBe(true);
    }

    // End-to-end: the damage-directive filter resolves to exactly the
    // defender's shield cards. The zone-OR attribute filter accepts both
    // `baseSection` and `shieldArea`; owner:"opponent" and isBattling:true
    // narrow the set to the combat-participant shields.
    const matched = evaluateTargetFilter(damageFilter, allTargetableCards(fw), ctx);
    expect(matched.length).toBe(shieldIds.length);
    for (const sid of shieldIds) {
      expect(matched).toContain(sid);
    }
  });

  it("non-direct unit-vs-unit combat: bases/shields are NOT in the battling set", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd02MoebiusPeacemakerTeam011] },
      { play: [enemy], deck: 5 },
    );
    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const moebiusId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02MoebiusPeacemakerTeam011.cardNumber,
    )!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;
    const baseId = engine.giveCard(PLAYER_TWO as PlayerId, gd02Gwadan125.cardNumber, {
      zone: "baseSection",
      playerId: PLAYER_TWO as PlayerId,
    });
    rt.registerCardInstance(baseId, gd02Gwadan125.cardNumber, PLAYER_TWO as PlayerId);
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_TWO, 1);

    // Moebius attacks the enemy unit (not direct).
    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: moebiusId,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, fw, {
      sourceCardId: moebiusId,
    });
    expect(ctx.currentBattleParticipantIds?.has(moebiusId as CardInstanceId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(enemyId as CardInstanceId)).toBe(true);
    expect(ctx.currentBattleParticipantIds?.has(baseId as CardInstanceId)).toBe(false);
    for (const sid of shieldIds) {
      expect(ctx.currentBattleParticipantIds?.has(sid as CardInstanceId)).toBe(false);
    }

    // End-to-end: with no base/shield in the battling set, the damage
    // directive's filter has zero legal targets — the ability can't resolve
    // its choice and (once destroy-self-as-cost is modelled) would be
    // ineligible to activate per rule 10-3-3.
    const matched = evaluateTargetFilter(damageFilter, allTargetableCards(fw), ctx);
    expect(matched).toEqual([]);
  });
});
