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
  markAsLinkUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02AllRangeAttack107 } from "./107-all-range-attack.ts";
describe("All-Range Attack (GD02-107)", () => {
  it("【Burst】Choose 1 enemy Unit. Deal 1 damage to it.", () => {
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({ deck: [gd02AllRangeAttack107] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd02AllRangeAttack107.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(getDamageCounter(engine, enemyId!)).toBe(1);
  });

  describe("【Main】Deal 1 damage to all enemy Units other than Link Units.", () => {
    it("deals 1 damage to every non-Link enemy unit", () => {
      const plainA = createMockUnit({ ap: 2, hp: 5 });
      const plainB = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd02AllRangeAttack107], resourceArea: activeResources(4) },
        { play: [plainA, plainB] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aId, bId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02AllRangeAttack107));

      expect(getDamageCounter(engine, aId!)).toBe(1);
      expect(getDamageCounter(engine, bId!)).toBe(1);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("skips Link Units", () => {
      const plain = createMockUnit({ ap: 2, hp: 5 });
      const linked = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd02AllRangeAttack107], resourceArea: activeResources(4) },
        { play: [plain, linked] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [plainId, linkedId] = p2.getCardsInZone("battleArea");
      markAsLinkUnit(engine, linkedId!);

      expectSuccess(p1.playCommand(gd02AllRangeAttack107));

      expect(getDamageCounter(engine, plainId!)).toBe(1);
      expect(getDamageCounter(engine, linkedId!) ?? 0).toBe(0);
    });
  });
});
