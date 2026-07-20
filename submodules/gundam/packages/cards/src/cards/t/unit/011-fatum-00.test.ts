import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectAttackRedirectedTo,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01JusticeGundam066 } from "../../gd01/unit/066-justice-gundam.ts";
import { tFatum00011 } from "./011-fatum-00.ts";

describe("Fatum-00 (T-011)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("is deployed by Justice Gundam as the active AP2/HP2 T-011 Blocker token", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01JusticeGundam066],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd01JusticeGundam066));

      const [justiceId, tokenId] = p1.getCardsInZone("battleArea");
      expect(p1.getVisibleCard(justiceId!)).toMatchObject({ definitionId: "GD01-066" });
      expect(p1.getVisibleCard(tokenId!)).toMatchObject({
        effectiveAp: 2,
        effectiveHp: 2,
        exhausted: false,
      });
      expect(p1.getVisibleCard(tokenId!)?.keywords).toContain("Blocker");
    });

    it("rests and redirects a direct attack to itself", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tFatum00011, isToken: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(tokenId));

      expectAttackRedirectedTo(engine, tokenId);
      expect(p2.isExhausted(tokenId)).toBe(true);
    });

    it("cannot block while already rested", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const target = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: target, exhausted: true },
            { card: tFatum00011, exhausted: true, isToken: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [targetId, tokenId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, targetId!));
      expectFailure(p2.declareBlock(tokenId!), "CANNOT_BLOCK");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: targetId });
      expect(p2.isExhausted(tokenId!)).toBe(true);
    });

    it("cannot block an attacker with High-Maneuver", () => {
      const attacker = createMockUnit({
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const target = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: target, exhausted: true },
            { card: tFatum00011, isToken: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [targetId, tokenId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, targetId!));
      expectFailure(p2.declareBlock(tokenId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: targetId });
      expect(p2.isExhausted(tokenId!)).toBe(false);
    });

    it("cannot activate Blocker when it is already the attack target", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tFatum00011, exhausted: true, isToken: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, tokenId));
      expectFailure(p2.declareBlock(tokenId), "BLOCKER_IS_TARGET");
    });
  });

  describe("Unit token rules", () => {
    it("cannot attack during the turn Justice Gundam deployed it", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01JusticeGundam066],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd01JusticeGundam066));
      const tokenId = p1.getCardsInZone("battleArea")[1]!;

      expectFailure(p1.enterBattle(tokenId, "direct"), "CANNOT_ATTACK");
      expect(p1.isExhausted(tokenId)).toBe(false);
    });

    it("is removed from the game instead of remaining in trash when destroyed", () => {
      const attacker = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tFatum00011, isToken: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(tokenId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(tokenId)).toBeUndefined();
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(0);
    });

    it("can pair with a Pilot like another Unit", () => {
      const pilot = createMockPilot({
        name: "Token Pilot",
        level: 1,
        cost: 1,
        apBonus: 1,
        hpBonus: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [{ card: tFatum00011, isToken: true }],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, tokenId));

      expect(p1.getPilotId(tokenId)).toBe(pilotId);
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    });
  });
});
