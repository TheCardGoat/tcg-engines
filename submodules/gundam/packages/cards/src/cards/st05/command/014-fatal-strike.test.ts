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
import { st05FatalStrike014 } from "./014-fatal-strike.ts";
describe("Fatal Strike (ST05-014)", () => {
  it("【Burst】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ deck: [st05FatalStrike014] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st05FatalStrike014.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(getDamageCounter(engine, enemyId!)).toBe(1);
  });

  describe("【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.", () => {
    it("destroys a Lv.3 or lower enemy unit", () => {
      const lowLevelEnemy = createMockUnit({ level: 3, ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [lowLevelEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st05FatalStrike014, { targets: [enemyId!] }));

      expectCardInTrash(engine, enemyId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with Lv > 3", () => {
      const bigEnemy = createMockUnit({ level: 5, ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st05FatalStrike014], resourceArea: activeResources(4) },
        { play: [bigEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st05FatalStrike014, { targets: [enemyId!] }), "INVALID_TARGET");
    });
  });
});
