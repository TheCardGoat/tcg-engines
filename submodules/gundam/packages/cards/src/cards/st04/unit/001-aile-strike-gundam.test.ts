import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04AileStrikeGundam001 } from "./001-aile-strike-gundam.ts";

describe("Aile Strike Gundam (ST04-001)", () => {
  describe("<Blocker> and 【When Paired･Lv.4 or Higher Pilot】return enemy HP<=4", () => {
    it("returns the only enemy HP<=4 Unit when paired with a Lv.4 pilot", () => {
      const kira = createMockPilot({ name: "Kira Yamato", level: 4, cost: 1 });
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [kira],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aileId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(kira, aileId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: aileId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getCardsInZone("hand")).toContain(enemyId);
      expect(p2.getCardsInZone("battleArea")).not.toContain(enemyId);
    });

    it("does not return an enemy Unit when paired with a Lv.3 pilot", () => {
      const lowPilot = createMockPilot({ name: "Kira Yamato", level: 3, cost: 1 });
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [lowPilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(lowPilot, st04AileStrikeGundam001));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("uses Blocker to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, st04AileStrikeGundam001] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(blockerId)).toBe(3);
      expect(p2.getDamage(defenderId)).toBe(0);
    });
  });
});
