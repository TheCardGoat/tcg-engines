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
import { gd01SignsOfARevolution104 } from "./104-signs-of-a-revolution.ts";
describe("Signs of a Revolution (GD01-104)", () => {
  it("【Burst】Draw 1.", () => {
    const engine = GundamTestEngine.create({
      deck: [gd01SignsOfARevolution104, gd01SignsOfARevolution104, gd01SignsOfARevolution104],
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01SignsOfARevolution104.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getCardsInZone("deck").length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand().length).toBe(handBefore + 1);
    expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
  });

  describe("【Main】Choose 1 rested enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to a rested enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01SignsOfARevolution104], resourceArea: activeResources(4) },
        { play: [{ card: enemyUnit, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01SignsOfARevolution104, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an active (un-rested) enemy unit", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01SignsOfARevolution104], resourceArea: activeResources(4) },
        { play: [enemyUnit] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01SignsOfARevolution104, { targets: [enemyId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played during action-phase (main-only timing)", () => {
      const enemyUnit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01SignsOfARevolution104], resourceArea: activeResources(4) },
        { play: [{ card: enemyUnit, exhausted: true }] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01SignsOfARevolution104, { targets: [enemyId!] }),
        "WRONG_TIMING",
      );
    });
  });
});
