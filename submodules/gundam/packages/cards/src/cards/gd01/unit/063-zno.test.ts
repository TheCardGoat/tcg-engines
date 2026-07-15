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
import { gd01Zno063 } from "./063-zno.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function completeBattle(
  attacker: ReturnType<GundamTestEngine["asPlayer"]>,
  defender: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(defender.passBlock());
  expectSuccess(defender.passBattleAction());
  expectSuccess(attacker.passBattleAction());
}

describe("ZnO (GD01-063)", () => {
  it("links with a ZAFT Pilot and gains First Strike while battling a Lv.2 enemy on its turn", () => {
    const zaftPilot = createMockPilot({ traits: ["zaft"], level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 2, level: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Zno063, zaftPilot],
        deck: 2,
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd01Zno063));
    const znoId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(zaftPilot, znoId));
    expectSuccess(p1.enterBattle(znoId, enemyId));

    expect(p1.getVisibleCard(znoId)?.keywords).toContain("FirstStrike");
    completeBattle(p1, p2);
    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(znoId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(znoId)).toBe(0);
  });

  it("does not gain First Strike while battling an enemy above Lv.2", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2, level: 3 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01Zno063],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const znoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(znoId, enemyId));
    expect(p1.getVisibleCard(znoId)?.keywords).not.toContain("FirstStrike");
    completeBattle(p1, p2);

    expect(p1.getCardZone(znoId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not gain First Strike while being attacked on the opponent's turn", () => {
    const enemy = createMockUnit({ ap: 1, hp: 2, level: 2 });
    const engine = GundamTestEngine.create(
      { play: [gd01Zno063], deck: 5 },
      {
        play: [enemy],
        deck: 5,
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const znoId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [znoId]);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expectSuccess(p2.enterBattle(enemyId, znoId));

    expect(p1.getVisibleCard(znoId)?.keywords).not.toContain("FirstStrike");
    completeBattle(p2, p1);
    expect(p1.getCardZone(znoId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
  });
});
