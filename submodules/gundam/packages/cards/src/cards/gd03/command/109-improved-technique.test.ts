import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03ImprovedTechnique109 } from "./109-improved-technique.ts";

function improvedTechniqueCopy() {
  return createMockCommand({ name: "Improved Technique" });
}

describe("Improved Technique (GD03-109)", () => {
  it("has the printed command identity", () => {
    expect(gd03ImprovedTechnique109.type).toBe("command");
    expect(gd03ImprovedTechnique109.cardNumber).toBe("GD03-109");
  });

  describe("【Burst】Activate this card's 【Main】.", () => {
    it("activates the Main effect from shield burst", () => {
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [enemy] },
        { deck: [gd03ImprovedTechnique109] },
      );
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const enemyId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

      engine.fireShieldBurst(shieldId!);

      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });
  });

  describe('【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. Deal 3 damage to it. If there are 2 or more cards with "Improved Technique" in their card name in your trash, choose 1 enemy Unit instead.', () => {
    it("deals 3 damage to an enemy Unit that is Lv.4 or lower during Main", () => {
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("deals 3 damage during Action", () => {
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });

    it("rejects an enemy Unit above Lv.4 without two Improved Technique cards in trash", () => {
      const enemy = createMockUnit({ level: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("can target any enemy Unit when two Improved Technique cards are in trash", () => {
      const enemy = createMockUnit({ level: 6, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ImprovedTechnique109],
          trash: [improvedTechniqueCopy(), improvedTechniqueCopy()],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(getDamageCounter(engine, enemyId)).toBe(3);
    });
  });
});
