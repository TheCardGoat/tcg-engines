import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st06CloseCombat013 } from "./013-close-combat.ts";
describe("Close Combat (ST03-013-p3 / ST06 reprint)", () => {
  it("【Burst】Activate this card's 【Main】 — deals 2 damage to an enemy Unit.", () => {
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ deck: [st06CloseCombat013] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st06CloseCombat013.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(getDamageCounter(engine, enemyId!)).toBe(2);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to the chosen enemy unit", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st06CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st06CloseCombat013, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
