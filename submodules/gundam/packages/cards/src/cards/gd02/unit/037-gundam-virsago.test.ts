import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02GundamVirsago037 } from "./037-gundam-virsago.ts";
import { gd02OlbaFrost093 } from "../pilot/093-olba-frost.ts";
import { gd02ShagiaFrost092 } from "../pilot/092-shagia-frost.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Virsago (GD02-037)", () => {
  describe("Printed Lv.5 and cost 4", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamVirsago037],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamVirsago037],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(3);
    });
  });

  describe("Link Condition: [Shagia Frost]", () => {
    it("can attack on its deploy turn after Shagia Frost is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamVirsago037, gd02ShagiaFrost092],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamVirsago037));
      const virsagoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02ShagiaFrost092, virsagoId));
      expectSuccess(p1.enterBattle(virsagoId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: virsagoId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamVirsago037, gd02OlbaFrost093],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamVirsago037));
      const virsagoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02OlbaFrost093, virsagoId));

      expectFailure(p1.enterBattle(virsagoId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  it("deals 2 damage to an enemy Unit with 5 AP when the opponent has 3 Shields", () => {
    const enemy = createMockUnit({ ap: 5, hp: 6 });
    const shields = Array.from({ length: 3 }, () => createMockUnit({ name: "Shield" }));
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamVirsago037], resourceArea: activeResources(5) },
      { play: [enemy], shieldArea: shields },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamVirsago037));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getCardZone(gd02GundamVirsago037)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("does not offer deploy damage while the opponent has 4 Shields", () => {
    const enemy = createMockUnit({ ap: 5, hp: 6 });
    const shields = Array.from({ length: 4 }, () => createMockUnit({ name: "Shield" }));
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamVirsago037], resourceArea: activeResources(5) },
      { play: [enemy], shieldArea: shields },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamVirsago037));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("does not offer an enemy Unit with more than 5 AP", () => {
    const highApEnemy = createMockUnit({ ap: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamVirsago037], resourceArea: activeResources(5) },
      { play: [highApEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamVirsago037));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("Breach 1 destroys the opponent's Shield after Virsago wins a battle", () => {
    const defender = createMockUnit({ ap: 0, hp: 4 });
    const shield = createMockUnit({ name: "Shield" });
    const engine = GundamTestEngine.create(
      {
        play: [gd02GundamVirsago037],
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], shieldArea: [shield], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    resolveUnitBattle(engine, PLAYER_ONE, attackerId, defenderId);

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });
});
