import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01BattleOfAces111 } from "./111-battle-of-aces.ts";
describe("Battle of Aces (GD01-111)", () => {
  it("【Burst】Choose 1 enemy Unit. Deal 2 damage to it.", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ deck: [gd01BattleOfAces111] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01BattleOfAces111.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(getDamageCounter(engine, enemyId!)).toBe(2);
  });

  describe("【Main】/【Action】Choose 1 damaged enemy Unit. Deal 3 damage to it.", () => {
    it("deals 3 damage to a damaged enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01BattleOfAces111], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      // Seed damage so the unit qualifies as "damaged"
      engine.getG().damage[enemyId!] = 1;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01BattleOfAces111, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(4);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an undamaged enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01BattleOfAces111], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd01BattleOfAces111, { targets: [enemyId!] }), "INVALID_TARGET");
    });

    it("deals 3 damage to a damaged enemy unit during action-phase", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01BattleOfAces111], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      engine.getG().damage[enemyId!] = 1;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01BattleOfAces111, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(4);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
