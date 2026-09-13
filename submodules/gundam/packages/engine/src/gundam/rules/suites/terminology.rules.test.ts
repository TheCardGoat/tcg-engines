/**
 * Spec → tests: ../specs/05-terminology.md (fluent API)
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectCard,
  expectPlayer,
  resolveBattle,
  endTurn,
  expectPublicLog,
} from "../../index.ts";
import { asPlayerId } from "../../../types/branded.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01AmuroRay010 } from "../../../../../cards/src/cards/st01/pilot/010-amuro-ray.ts";
import { st01WhiteBase015 } from "../../../../../cards/src/cards/st01/base/015-white-base.ts";
import { st10MobileWorkerTekkadan010 } from "../../../../../cards/src/cards/st10/unit/010-mobile-worker-tekkadan.ts";

function damageCommand(amount: number) {
  return createMockCommand({
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Deal ${amount} damage to one friendly Unit.`,
      } satisfies CardEffect,
    ],
  });
}

describe("Section 5 — Essential Terminology (specs/05-terminology.md)", () => {
  it("5-4-1 / 8-2-1: declaring an attack rests the attacking Unit", () => {
    const defender = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.attack(st01Gundam001).into(defender);
    expectCard(p1, st01Gundam001).toBeRested();
  });

  it("5-5-2 / 11-3-1: damage ≥ HP destroys the defender", () => {
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, st01Gundam001, defender);
    expectCard(p2, defender).toBeIn("trash");
    // Attacker survives when return damage is non-lethal.
    expectCard(p1, st01Gundam001).toBeIn("battleArea");
  });

  it("5-5-2 / 11-3-1: mutual lethal damage destroys both Units", () => {
    const attacker = createMockUnit({ ap: 4, hp: 3, cardNumber: "TERM-ATK" });
    const defender = createMockUnit({ ap: 4, hp: 3, cardNumber: "TERM-DEF" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, attacker, defender);
    expectCard(p1, attacker).toBeIn("trash");
    expectCard(p2, defender).toBeIn("trash");
  });

  it("5-5-5: zero AP deals no damage", () => {
    const attacker = createMockUnit({ ap: 0, hp: 5 });
    const defender = createMockUnit({ ap: 0, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    resolveBattle(engine, attacker, defender);
    expectCard(p2, defender).toHaveDamage(0).toBeIn("battleArea");
  });

  it("5-5-6: excess damage on a Shield does not spill to another Shield", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      {
        shieldArea: [st10MobileWorkerTekkadan010, st10MobileWorkerTekkadan010],
      },
    );
    resolveBattle(engine, st01Gundam001, "direct");
    expectPlayer(engine.asPlayer(PLAYER_TWO)).toHaveShieldCount(1);
  });

  it("5-6-1 / 5-6-2 / 13-1-1: HP recovery does not go below zero damage", () => {
    const damage = damageCommand(1);
    const engine = GundamTestEngine.create(
      { hand: [damage], play: [st01Gundam001], deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.playCommand(damage);
    p1.must.resolveTargets(st01Gundam001);
    expectCard(p1, st01Gundam001).toHaveDamage(1);
    endTurn(engine);
    expectCard(p1, st01Gundam001).toHaveDamage(0);
  });

  it("5-9-1: pair places a Pilot under a Unit (bidirectional link)", () => {
    const engine = GundamTestEngine.create({
      play: [st01Gundam001],
      hand: [st01AmuroRay010],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.assignPilot(st01AmuroRay010, st01Gundam001);

    // Unit → pilot: assignment + visible projection name the same pilot.
    expectCard(p1, st01Gundam001).toHavePilot(st01AmuroRay010);
    expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });

    // Pilot → unit: reverse lookup from the paired pilot instance finds this Unit.
    const unitId = p1.unit(st01Gundam001).instanceId;
    const pilotId = p1.getPilotId(unitId)!;
    expect(p1.getVisibleCard(pilotId)?.definitionId).toBe(st01AmuroRay010.cardNumber);
    const reverseUnitId = p1
      .getCardsInZone("battleArea")
      .find((id) => p1.getVisibleCard(id)?.pilotId === pilotId);
    expect(reverseUnitId).toBe(unitId);
  });

  it("5-10-3 / 13-2-5: declining a 【Burst】 Shield sends it to trash", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { shieldArea: [st01WhiteBase015], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into("direct");
    p2.must.passBlock().passBattleAction();
    p1.must.passBattleAction();

    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected a Burst optional choice");
    p2.must.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } });
    expectCard(p2, st01WhiteBase015).toBeIn("trash");
  });

  it("5-10-3 / 13-2-5: accepting a 【Burst】 deploys the Shield and resolves 【Deploy】", () => {
    const spareShield = createMockUnit({ name: "Returned Shield", cardNumber: "TERM-SHIELD" });
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001] },
      { shieldArea: [st01WhiteBase015, spareShield], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    p1.must.attack(st01Gundam001).into("direct");
    p2.must.passBlock().passBattleAction();
    p1.must.passBattleAction();

    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected a Burst optional choice");
    p2.must.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } });

    // White Base Burst: Deploy this card → base section; Deploy adds a Shield to hand.
    expectCard(p2, st01WhiteBase015).toBeIn("baseSection");
    expectCard(p2, spareShield).toBeIn("hand");
  });

  it("5-14-1 / 7-3-1: draw phase adds one card to hand", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 8 }, { deck: 8 });
    const p2 = engine.asPlayer(PLAYER_TWO);
    const handBefore = p2.handCount();
    endTurn(engine);
    expectPlayer(p2).toHaveHandCount(handBefore + 1);
  });

  it("5-17-3 / 6-2-3 / 6-2-4: setup places EX Base for both; EX Resource only for second player", () => {
    const engine = GundamTestEngine.create(
      { deck: 13, resourceDeck: 10 },
      { deck: 13, resourceDeck: 10 },
      { skipToMainPhase: false },
    );

    engine.doMove("chooseFirstPlayer", asPlayerId(PLAYER_ONE), { playerId: PLAYER_ONE });
    engine.doMove("alterHand", asPlayerId(PLAYER_ONE), { wantsRedraw: false });
    engine.doMove("alterHand", asPlayerId(PLAYER_TWO), { wantsRedraw: false });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    // Both players receive an EX Base token (6-2-3). Setup registers them as
    // `ex-base-token:<playerId>` (token instance identity is public on the board).
    expectPlayer(p1).toHaveZoneCount("baseSection", 1);
    expectPlayer(p2).toHaveZoneCount("baseSection", 1);
    expect(p1.getCardsInZone("baseSection")[0]).toBe(`ex-base-token:${PLAYER_ONE}`);
    expect(p2.getCardsInZone("baseSection")[0]).toBe(`ex-base-token:${PLAYER_TWO}`);

    // After setup, turn cycle advances: first player places one Resource from the
    // resource deck (not an EX Resource). Second player has only the EX Resource (6-2-4).
    expectPlayer(p1).toHaveResourceCount(1);
    expectPlayer(p2).toHaveResourceCount(1);

    const p1ResourceId = p1.getCardsInZone("resourceArea")[0]!;
    const p2ResourceId = p2.getCardsInZone("resourceArea")[0]!;
    expect(p1ResourceId).not.toMatch(/^ex-resource-token:/);
    expect(p2ResourceId).toBe(`ex-resource-token:${PLAYER_TWO}`);
  });
});
