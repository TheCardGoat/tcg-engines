import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamKyrios034 } from "./034-gundam-kyrios.ts";

describe("Gundam Kyrios (GD04-034)", () => {
  it("<First Strike> destroys the defender before it can deal battle damage", () => {
    const defender = createMockUnit({ name: "Lethal Defender", ap: 5, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamKyrios034] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const kyriosId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(kyriosId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getDamage(kyriosId)).toBe(0);
  });

  describe("【During Link】This Unit gets AP+2 for each of your rested (CB) Units.", () => {
    it("gets AP+2 for each rested friendly CB Unit while linked", () => {
      const restedCb = createMockUnit({ name: "Rested CB", traits: ["cb"], ap: 2, hp: 3 });
      const activeCb = createMockUnit({ name: "Active CB", traits: ["cb"], ap: 2, hp: 3 });
      const restedNonCb = createMockUnit({ name: "Rested Other", traits: ["zaft"], ap: 2, hp: 3 });
      const allelujah = createMockPilot({
        name: "Allelujah Haptism",
        apBonus: 0,
        hpBonus: 0,
      });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [allelujah],
          play: [
            gd04GundamKyrios034,
            { card: restedCb, exhausted: true },
            activeCb,
            { card: restedNonCb, exhausted: true },
          ],
          resourceArea: activeResources(1),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const kyriosId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(allelujah, kyriosId));
      expectSuccess(p1.enterBattle(kyriosId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(5);
    });

    it("does not get the rested-CB AP bonus while unlinked", () => {
      const restedCb = createMockUnit({ name: "Rested CB", traits: ["cb"], ap: 2, hp: 3 });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd04GundamKyrios034, { card: restedCb, exhausted: true }] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const kyriosId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(kyriosId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(enemyId)).toBe(1);
    });
  });
});
