/**
 * Spec → tests: ../specs/08-attacking-and-battles.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectWinnerIs,
  expectFailure,
  resolveBattle,
  expectPublicLog,
  expectLogType,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01WhiteBase015 } from "../../../../../cards/src/cards/st01/base/015-white-base.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";
import { gd05DestinyGundam055 } from "../../../../../cards/src/cards/gd05/unit/055-destiny-gundam.ts";

describe("Section 8 — Attacking and Battles (specs/08-attacking-and-battles.md)", () => {
  it("8-2-1: declaring an attack rests the attacking Unit", () => {
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into(defender);
    expectCard(p1, st01Gundam001).toBeRested();
    expectPlayer(p1).toBeInPhase("battle-phase");
    expectPublicLog(engine, "gundam.move.attackDeclared", {
      attackerPlayerId: PLAYER_ONE,
      targetId: p2.unit(defender).instanceId,
    });
  });

  it("8-2-1: cannot attack an active (non-rested) enemy Unit", () => {
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [st01Gundam001] }, { play: [defender] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectFailure(p1.enterBattle(st01Gundam001, defender));
  });

  it("8-3-1 / 13-1-4: Blocker rests and redirects a direct attack", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [st10MobileWorkerTekkadan010] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into("direct");
    p2.must.declareBlock(st10MobileWorkerTekkadan010);
    expectCard(p2, st10MobileWorkerTekkadan010).toBeRested();
    expect(p1.getBoardView().pendingCombat).toMatchObject({
      blockerId: p2.unit(st10MobileWorkerTekkadan010).instanceId,
    });
  });

  it("8-3-3: original attack target cannot activate its own Blocker", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: st10MobileWorkerTekkadan010, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into(st10MobileWorkerTekkadan010);
    expectFailure(p2.declareBlock(st10MobileWorkerTekkadan010));
  });

  it("8-5-3-2: Units deal simultaneous battle damage equal to AP", () => {
    const defender = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, st01Gundam001, defender);
    expectCard(p2, defender).toHaveDamage(st01Gundam001.ap);
    expectCard(p1, st01Gundam001).toHaveDamage(2);
    expectPlayer(p1).toBeInPhase("main-phase");
    // Combat outcomes are public (both players see damage).
    expectLogType(engine, "gundam.combat.damageDealt", { min: 2 });
    expectLogType(engine, "gundam.combat.resolved", { min: 1 });
  });

  it("8-5-2-3: direct attack destroys the top Shield when no Base is present", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { shieldArea: [st10MobileWorkerTekkadan010, st10MobileWorkerTekkadan010] },
    );
    resolveBattle(engine, st01Gundam001, "direct");
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(1);
    expectWinnerIs(engine, undefined);
    expectLogType(engine, "gundam.combat.shieldRemoved", { min: 1 });
  });

  it("8-5-2-4 / 3-5-3: damage hits the Base before Shields", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      {
        baseSection: [st01WhiteBase015],
        shieldArea: [st10MobileWorkerTekkadan010, st10MobileWorkerTekkadan010],
      },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, st01Gundam001, "direct");
    expectCard(p2, st01WhiteBase015).toHaveDamage(st01Gundam001.ap);
    expectPlayer(p2).toHaveShieldCount(2);
  });

  it("8-5-2-2: empty shield area direct attack defeats the player", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001] }, { deck: 5 });
    resolveBattle(engine, st01Gundam001, "direct");
    expectWinnerIs(engine, PLAYER_ONE);
  });

  it("8-5-3-2-2 / 13-1-5: First Strike prevents return damage when lethal", () => {
    const defender = createMockUnit({ ap: 10, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05DestinyGundam055] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, gd05DestinyGundam055, defender);
    expectCard(p2, defender).toBeIn("trash");
    expectCard(p1, gd05DestinyGundam055).toBeIn("battleArea").toHaveDamage(0);
  });
});
