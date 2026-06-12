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
  expectCardInHand,
  getDamageCounter,
  isCardExhausted,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01TheWitchAndTheBride117 } from "./117-the-witch-and-the-bride.ts";

describe("The Witch and the Bride (GD01-117)", () => {
  it("【Burst】Activate this card's 【Main】 — bounces an HP ≤ 5 enemy Unit", () => {
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { deck: [gd01TheWitchAndTheBride117] },
      { play: [enemy] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(
        shieldId,
        gd01TheWitchAndTheBride117.cardNumber,
        asPlayerId(PLAYER_ONE),
      );

    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId, { targets: [enemyId!] });

    expectCardInHand(engine, enemyId!, p2.playerId);
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner's hand.", () => {
    it("bounces an HP ≤ 5 enemy unit back to its owner's hand", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01TheWitchAndTheBride117, { targets: [enemyId!] }));

      expectCardInHand(engine, enemyId!, p2.playerId);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("is playable at action-phase timing too", () => {
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01TheWitchAndTheBride117, { targets: [enemyId!] }));
      expectCardInHand(engine, enemyId!, p2.playerId);
    });

    it("cannot target an enemy unit with more than 5 HP", () => {
      const tough = createMockUnit({ ap: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
        { play: [tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [toughId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01TheWitchAndTheBride117, { targets: [toughId!] }),
        "INVALID_TARGET",
      );
    });

    it("cleans up damage and exhaustion when the unit is returned to hand", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      engine.getG().damage[enemyId!] = 3;
      engine.getG().exhausted[enemyId!] = true;
      expect(getDamageCounter(engine, enemyId!)).toBe(3);
      expect(isCardExhausted(engine, enemyId!)).toBe(true);

      expectSuccess(p1.playCommand(gd01TheWitchAndTheBride117, { targets: [enemyId!] }));

      expectCardInHand(engine, enemyId!, p2.playerId);
      expect(getDamageCounter(engine, enemyId!)).toBe(0);
      expect(isCardExhausted(engine, enemyId!)).toBe(false);
    });
  });
});
