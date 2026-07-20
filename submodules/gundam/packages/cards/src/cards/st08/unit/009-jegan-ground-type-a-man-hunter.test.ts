import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08JeganGroundTypeAManHunter009 } from "./009-jegan-ground-type-a-man-hunter.ts";

describe("Jegan Ground Type-A (Man Hunter) (ST08-009)", () => {
  describe("Printed Lv.1 and cost 1", () => {
    it("deploys for one active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st08JeganGroundTypeAManHunter009],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectSuccess(p1.deployUnit(st08JeganGroundTypeAManHunter009));
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").every((id) => p1.isExhausted(id))).toBe(true);
    });

    it("cannot pay its cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st08JeganGroundTypeAManHunter009],
        resourceArea: [{ card: createMockResource(), exhausted: true }],
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st08JeganGroundTypeAManHunter009),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  describe("【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won't be set as active during the start phase of your opponent's next turn.", () => {
    it("prevents the chosen rested enemy Lv.2 Unit from becoming active next start phase", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3, level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(3), deck: 5 },
        {
          play: [{ card: enemy, exhausted: true }],
          deck: 5,
          resourceArea: activeResources(3),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(st08JeganGroundTypeAManHunter009));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p2.getBoardView().activePlayer).toBe(PLAYER_TWO);
      expect(p2.isExhausted(enemyId!)).toBe(true);
    });

    it("rejects an active enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3, level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.deployUnit(st08JeganGroundTypeAManHunter009, { targets: [enemyId!] }),
        "INVALID_TARGET",
      );
    });

    it("rejects a rested enemy Unit above Lv.2", () => {
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(1) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      expectFailure(
        p1.deployUnit(st08JeganGroundTypeAManHunter009, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("does not prevent the Unit from becoming active on later start phases", () => {
      const enemy = createMockUnit({ level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(1), deck: 8 },
        { play: [{ card: enemy, exhausted: true }], deck: 8, resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.deployUnit(st08JeganGroundTypeAManHunter009, { targets: [enemyId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expect(p2.isExhausted(enemyId)).toBe(true);
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expect(p2.isExhausted(enemyId)).toBe(false);
    });
  });
});
