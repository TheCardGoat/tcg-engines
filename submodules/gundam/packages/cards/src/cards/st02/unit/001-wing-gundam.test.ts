import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st02WingGundam001 } from "./001-wing-gundam.ts";

describe("Wing Gundam (ST02-001)", () => {
  describe("<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)", () => {
    it("deals 5 damage to the enemy Base after destroying an enemy Unit with battle damage", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001] },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const wingId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expect(p1.getVisibleCard(wingId)?.keywords).toContain("Breach");
      expectSuccess(p1.enterBattle(wingId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(5);
    });

    it("does not create a direct-player damage event when the opponent has no shield-area card", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001], deck: 5 },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const wingId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(wingId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("This Unit may choose an active enemy Unit that is Lv.4 or lower as its attack target.", () => {
    it("can attack an active enemy Unit at the Lv.4 boundary", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5, level: 4 });
      const engine = GundamTestEngine.create({ play: [st02WingGundam001] }, { play: [enemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wingId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(wingId, enemyId));
    });

    it("cannot attack an active enemy Unit above Lv.4", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5, level: 5 });
      const engine = GundamTestEngine.create({ play: [st02WingGundam001] }, { play: [enemy] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wingId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(wingId, enemyId), "INVALID_TARGET");
      expect(p1.isExhausted(wingId)).toBe(false);
    });

    it("can attack a rested enemy Unit above Lv.4 under the normal attack rules", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5, level: 6 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const wingId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(wingId, enemyId));
    });

    it("does not grant the active-target option to another friendly Unit", () => {
      const otherFriendly = createMockUnit({ ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 2, hp: 5, level: 4 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001, otherFriendly] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(otherFriendlyId!, enemyId), "INVALID_TARGET");
      expect(p1.isExhausted(otherFriendlyId!)).toBe(false);
    });
  });

  it("deploys to the battle area after paying its printed cost", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundam001],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const wingId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(wingId));

    expect(p1.getCardZone(wingId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
  });

  it("cannot be deployed below its printed Lv.6 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundam001],
      resourceArea: activeResources(5),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st02WingGundam001),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot pay its printed deployment cost with only three active Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundam001],
      resourceArea: [
        ...activeResources(3),
        ...activeResources(3).map((entry) => ({ ...entry, exhausted: true })),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(st02WingGundam001), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(st02WingGundam001)).toBe(`hand:${PLAYER_ONE}`);
  });
});
