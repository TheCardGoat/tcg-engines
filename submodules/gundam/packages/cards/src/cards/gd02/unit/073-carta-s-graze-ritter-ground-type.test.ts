import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd02CartaSGrazeRitterGroundType073 } from "./073-carta-s-graze-ritter-ground-type.ts";

describe("Carta's Graze Ritter (Ground Type) (GD02-073)", () => {
  // During your opponent's turn, the enemy Unit BATTLING this Unit gains
  // <First Strike>. Both gates must hold — `isTurn: opponent` AND the
  // opponent in question is the one currently in combat with Carta.
  // Narrowing is modelled via `TargetFilter.isBattling: true` on the
  // grantKeyword target (opponent unit + battling the source).

  it("positive: during opponent's turn + opponent is battling Carta → grant applies", () => {
    const enemyUnit = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [enemyUnit] },
    );
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;

    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const cartaId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02CartaSGrazeRitterGroundType073.cardNumber,
    )!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemyUnit.cardNumber)!;

    // Enemy is attacking Carta during their (PLAYER_TWO's) turn.
    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: enemyId,
      attackerPlayerId: PLAYER_TWO,
      target: cartaId,
    };

    const stats = getEffectiveStats(enemyId, engine.getG(), fw.cards, fw);
    expect(stats.keywords).toContain("FirstStrike");
  });

  it("narrowed: during opponent's turn, non-battling enemy Unit does NOT gain FirstStrike", () => {
    const battler = createMockUnit({ name: "Battler", ap: 2, hp: 3 });
    const bystander = createMockUnit({ name: "Bystander", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [battler, bystander] },
    );
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;

    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const cartaId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02CartaSGrazeRitterGroundType073.cardNumber,
    )!;
    const battlerId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, battler.cardNumber)!;
    const bystanderId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, bystander.cardNumber)!;

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: battlerId,
      attackerPlayerId: PLAYER_TWO,
      target: cartaId,
    };

    expect(getEffectiveStats(battlerId, engine.getG(), fw.cards, fw).keywords).toContain(
      "FirstStrike",
    );
    expect(getEffectiveStats(bystanderId, engine.getG(), fw.cards, fw).keywords).not.toContain(
      "FirstStrike",
    );
  });

  it("no active combat → even during opponent's turn, nobody gets the grant", () => {
    const enemyUnit = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [enemyUnit] },
    );
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;

    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemyUnit.cardNumber)!;
    expect(engine.getG().turnMetadata.pendingCombat).toBeUndefined();

    const stats = getEffectiveStats(enemyId, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("negative: during Carta-controller's own turn, isTurn gate fails → no grant", () => {
    const enemyUnit = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [enemyUnit] },
    );
    const state = engine.getState();
    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;

    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemyUnit.cardNumber)!;
    const stats = getEffectiveStats(enemyId, engine.getG(), fw.cards, fw);
    expect(stats.keywords).not.toContain("FirstStrike");
  });

  it("transition: active-player switch flips the grant on without cache (with active combat)", () => {
    const enemyUnit = createMockUnit({ name: "Enemy", ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd02CartaSGrazeRitterGroundType073] },
      { play: [enemyUnit] },
    );
    const state = engine.getState();
    const rt = engine.getRuntime();
    const fw = rt.getFrameworkReadAPI();
    const cartaId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd02CartaSGrazeRitterGroundType073.cardNumber,
    )!;
    const enemyId = rt.getInstanceIdByDefinition(PLAYER_TWO as PlayerId, enemyUnit.cardNumber)!;

    engine.getG().turnMetadata.pendingCombat = {
      stage: "attack-step",
      attackerId: enemyId,
      attackerPlayerId: PLAYER_TWO,
      target: cartaId,
    };

    state.ctx.status.activePlayer = PLAYER_ONE as PlayerId;
    expect(getEffectiveStats(enemyId, engine.getG(), fw.cards, fw).keywords).not.toContain(
      "FirstStrike",
    );

    state.ctx.status.activePlayer = PLAYER_TWO as PlayerId;
    expect(getEffectiveStats(enemyId, engine.getG(), fw.cards, fw).keywords).toContain(
      "FirstStrike",
    );
  });
});
