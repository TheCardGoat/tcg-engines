/**
 * Spec → tests: ../specs/01-game-overview.md (fluent API)
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
  expectWinnerIs,
  resolveBattle,
  expectFailure,
  expectPublicLog,
} from "../../index.ts";
import { st01Gundam001 } from "../../../../../cards/src/cards/st01/unit/001-gundam.ts";
import { st01Gm005 } from "../../../../../cards/src/cards/st01/unit/005-gm.ts";
import { st01AmuroRay010 } from "../../../../../cards/src/cards/st01/pilot/010-amuro-ray.ts";

function millSelfEffect(count: number): CardEffect {
  return {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [{ action: { action: "millDeck", count, owner: "self" } }],
    sourceText: `【Activate･Main】Place the top ${count} cards of your deck into your trash.`,
  };
}

function restEnemyEffect(): CardEffect {
  return {
    type: "command",
    activation: { timing: ["main"] },
    directives: [
      {
        action: {
          action: "rest",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: "【Main】Choose 1 enemy Unit. Rest it.",
  };
}

describe("Section 1 — Game Overview (specs/01-game-overview.md)", () => {
  it("1-1-1: fixture is a two-player game only", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001], deck: 5 },
      { play: [st01Gm005], deck: 5 },
    );
    const playerIds = Object.keys(engine.asPlayer(PLAYER_ONE).getBoardView().players);
    expect(playerIds).toEqual(expect.arrayContaining([PLAYER_ONE, PLAYER_TWO]));
    expect(playerIds).toHaveLength(2);
  });

  it("1-2-2-1 / 8-5-2-2 / 11-2-1-1: battle damage with empty shield area defeats the defender", () => {
    const engine = GundamTestEngine.create({ play: [st01Gundam001], deck: 5 }, { deck: 5 });
    resolveBattle(engine, st01Gundam001, "direct");
    expectWinnerIs(engine, PLAYER_ONE);
  });

  it("1-2-2-2 / 11-2-1-2: emptying the deck awards the game to the opponent", () => {
    const miller = createMockUnit({ effects: [millSelfEffect(5)] });
    const engine = GundamTestEngine.create({ play: [miller], deck: 1 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.activateAbility(miller, 0);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    expectWinnerIs(engine, PLAYER_TWO);
  });

  it("1-2-4: concede immediately ends the game for the conceding player", () => {
    const engine = GundamTestEngine.create(
      { play: [st01Gundam001], deck: 5 },
      { play: [st01Gm005], deck: 5 },
    );
    engine.asPlayer(PLAYER_ONE).must.concede();
    expectWinnerIs(engine, PLAYER_TWO);
    expectPublicLog(engine, "gundam.move.concede", { playerId: PLAYER_ONE });
  });

  it("1-3-2-1: resting an already-rested Unit is a no-op (entity stays rested)", () => {
    const restCmd = createMockCommand({
      level: 0,
      cost: 0,
      effects: [restEnemyEffect()],
    });
    const restedEnemy = createMockUnit({ ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [restCmd], deck: 5 },
      { play: [{ card: restedEnemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectCard(p2, restedEnemy).toBeRested();
    p1.must.playCommand(restCmd, { targets: [restedEnemy] });
    expectCard(p2, restedEnemy).toBeRested();
  });

  it("1-3-1 / 3-2-6-3: card text precedence — Link Unit may attack the turn it is deployed", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [st01Gundam001, st01AmuroRay010],
        resourceArea: activeResources(8),
        deck: 5,
      },
      { shieldArea: [st01Gm005], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gundam001);
    p1.must.assignPilot(st01AmuroRay010, st01Gundam001);
    p1.must.attack(st01Gundam001).into("direct");
    expectCard(p1, st01Gundam001).toBeRested();
  });

  it("1-3-1 negative: non-Link newly deployed Unit still cannot attack (3-2-4)", () => {
    const engine = GundamTestEngine.create(
      { hand: [st01Gm005], resourceArea: activeResources(3), deck: 5 },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.must.deployUnit(st01Gm005);
    expectFailure(p1.enterBattle(st01Gm005, "direct"), "CANNOT_ATTACK");
  });
});
