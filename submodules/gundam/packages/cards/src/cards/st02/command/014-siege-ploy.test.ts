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
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st02SiegePloy014 } from "./014-siege-ploy.ts";
describe("Siege Ploy (ST02-014)", () => {
  it("【Burst】Activate this card's 【Main】 — rests an HP ≤ 5 enemy Unit.", () => {
    const enemy = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create({ deck: [st02SiegePloy014] }, { play: [enemy] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, st02SiegePloy014.cardNumber, asPlayerId(PLAYER_ONE));

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    expect(engine.getG().exhausted[enemyId!]).toBe(true);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("rests an enemy unit whose HP ≤ 5", () => {
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st02SiegePloy014, { targets: [enemyId!] }));

      if (!engine.getG().exhausted[enemyId!]) {
        throw new Error("Expected enemy unit to be rested");
      }
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an enemy unit with more than 5 HP", () => {
      const tough = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st02SiegePloy014, { targets: [toughId!] }), "INVALID_TARGET");
    });
  });
});
