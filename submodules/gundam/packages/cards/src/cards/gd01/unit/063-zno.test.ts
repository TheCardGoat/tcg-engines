import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd01Zno063 } from "./063-zno.ts";

describe("ZnO (GD01-063)", () => {
  // During your turn, while this Unit is battling an enemy Unit that is
  // Lv.2 or lower, it gains <First Strike>.
  //
  // Three gates modelled in card data:
  //   - `isTurn: friendly` — active-turn check on the grantKeyword effect.
  //   - `isBattling.opponentMatches: { owner: "opponent", level<=2 }` on
  //     the `owner: "self"` target — ZnO must be battling AND the other
  //     combatant must be an enemy Unit at Lv.≤2.

  it("positive: during friendly turn, while ZnO is battling Lv.≤2 enemy → gains <First Strike>", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 2, hp: 3, level: 2 });
    const engine = GundamTestEngine.create({ play: [gd01Zno063] }, { play: [enemy] });
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;

    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01Zno063.cardNumber)!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: uid,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("FirstStrike");
  });

  it("narrow: battling Lv.>2 enemy → grant does NOT apply", () => {
    const enemy = createMockUnit({ name: "Beefy Enemy", ap: 3, hp: 4, level: 4 });
    const engine = GundamTestEngine.create({ play: [gd01Zno063] }, { play: [enemy] });
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;

    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01Zno063.cardNumber)!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: uid,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("no active combat: during friendly turn → isBattling gate fails → no grant", () => {
    const engine = GundamTestEngine.create({ play: [gd01Zno063] }, { deck: 5 });
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;
    expect(engine.getG().turnMetadata.pendingCombat).toBeUndefined();

    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01Zno063.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("negative: during opponent's turn → isTurn gate fails → no grant", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ play: [gd01Zno063] }, { play: [enemy] });
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;

    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01Zno063.cardNumber)!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;
    // Even with ZnO in combat, the isTurn gate blocks.
    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: enemyId,
      attackerPlayerId: PLAYER_TWO,
      target: uid,
    };

    const fw = rt.getFrameworkReadAPI();
    const stats = getEffectiveStats(uid, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("transition: switching active player between reads flips the grant", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ play: [gd01Zno063] }, { play: [enemy] });
    const state = engine.getState();
    const rt = engine.getRuntime();
    const uid = rt.getInstanceIdByDefinition(PLAYER_ONE as PlayerId, gd01Zno063.cardNumber)!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemy.cardNumber)!;
    const fw = rt.getFrameworkReadAPI();

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: uid,
      attackerPlayerId: PLAYER_ONE,
      target: enemyId,
    };

    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;
    expect(getEffectiveStats(uid, engine.getG(), fw.cards, fw).keywords).not.toContain(
      "FirstStrike",
    );

    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;
    expect(getEffectiveStats(uid, engine.getG(), fw.cards, fw).keywords).toContain("FirstStrike");
  });
});
