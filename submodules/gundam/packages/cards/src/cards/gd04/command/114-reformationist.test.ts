import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04Reformationist114 } from "./114-reformationist.ts";

describe("Reformationist (GD04-114)", () => {
  it("has the printed command identity", () => {
    expect(gd04Reformationist114.type).toBe("command");
    expect(gd04Reformationist114.cardNumber).toBe("GD04-114");
  });

  describe('【Burst】Choose 1 Unit card with "Trans-Am" in its card name from your trash. Add it to your hand.', () => {
    it('adds a Unit card with "Trans-Am" in its name from trash to hand', () => {
      const transAm = createMockUnit({ name: "Gundam Exia Trans-Am" });
      const engine = GundamTestEngine.create({ deck: [gd04Reformationist114], trash: [transAm] });
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const transAmId = p1.getCardsInZone("trash")[0]!;

      engine.fireShieldBurst(shieldId!);

      expect(p1.getCardsInZone("hand")).toContain(transAmId);
    });

    it('does not add a trash Unit without "Trans-Am" in its name', () => {
      const nonMatch = createMockUnit({ name: "Gundam Exia" });
      const engine = GundamTestEngine.create({ deck: [gd04Reformationist114], trash: [nonMatch] });
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashBefore = p1.getCardsInZone("trash");

      engine.fireShieldBurst(shieldId!);

      expect(p1.getCardsInZone("hand")).not.toContain(trashBefore[0]);
      expect(p1.getCardsInZone("trash")).toContain(trashBefore[0]);
    });
  });

  describe("【Main】/【Action】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.", () => {
    it("deals 1 damage to the chosen friendly Unit and enemy Unit during Main", () => {
      const friendly = createMockUnit({ hp: 3 });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd04Reformationist114], play: [friendly], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04Reformationist114, { targets: [friendlyId, enemyId] }));

      expect(getDamageCounter(engine, friendlyId)).toBe(1);
      expect(getDamageCounter(engine, enemyId)).toBe(1);
    });

    it("deals 1 damage to both targets during Action", () => {
      const friendly = createMockUnit({ hp: 3 });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd04Reformationist114], play: [friendly], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04Reformationist114, { targets: [friendlyId, enemyId] }));

      expect(getDamageCounter(engine, friendlyId)).toBe(1);
      expect(getDamageCounter(engine, enemyId)).toBe(1);
    });

    it("rejects targets that do not include one friendly Unit and one enemy Unit", () => {
      const friendly = createMockUnit({ hp: 3 });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd04Reformationist114], play: [friendly], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd04Reformationist114, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
    });
  });
});
