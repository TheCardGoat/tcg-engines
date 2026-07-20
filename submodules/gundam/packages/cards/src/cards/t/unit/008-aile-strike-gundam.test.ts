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
import { st04StrikerPack012 } from "../../st04/command/012-striker-pack.ts";
import { tAileStrikeGundam008 } from "./008-aile-strike-gundam.ts";

describe("Aile Strike Gundam (T-008)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("is deployed by Striker Pack as the active AP3/HP3 T-008 Blocker token", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Striker Pack's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      const tokenId = p2.getCardsInZone("battleArea")[0]!;
      expect(p2.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 3,
        exhausted: false,
      });
      expect(p2.getVisibleCard(tokenId)?.keywords).toContain("Blocker");
      expect(p2.getCardZone(st04StrikerPack012)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("rests and redirects a direct attack to itself", () => {
      const firstAttacker = createMockUnit({ name: "Burst Attacker", ap: 1, hp: 4 });
      const secondAttacker = createMockUnit({ name: "Blocked Attacker", ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [firstAttacker, secondAttacker] },
        { shieldArea: [st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Striker Pack's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(secondAttackerId!, "direct"));
      expectSuccess(p2.declareBlock(tokenId));

      expectAttackRedirectedTo(engine, tokenId);
      expect(p2.isExhausted(tokenId)).toBe(true);
    });

    it("cannot block another attack after paying its rest cost", () => {
      const firstAttacker = createMockUnit({ ap: 1, hp: 5 });
      const secondAttacker = createMockUnit({ ap: 1, hp: 5 });
      const thirdAttacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [firstAttacker, secondAttacker, thirdAttacker] },
        { shieldArea: [st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, secondAttackerId, thirdAttackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Striker Pack's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(secondAttackerId!, "direct"));
      expectSuccess(p2.declareBlock(tokenId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.enterBattle(thirdAttackerId!, "direct"));

      expectFailure(p2.declareBlock(tokenId), "CANNOT_BLOCK");
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: "direct" });
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
            { card: tAileStrikeGundam008, isToken: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [targetId, tokenId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, targetId!));
      expectFailure(p2.declareBlock(tokenId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(tokenId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: targetId });
    });

    it("cannot activate Blocker when it is already the attack target", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tAileStrikeGundam008, exhausted: true, isToken: true }] },
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
    it("is removed from the game instead of remaining in trash when destroyed", () => {
      const firstAttacker = createMockUnit({ name: "Burst Attacker", ap: 1, hp: 4 });
      const destroyingAttacker = createMockUnit({ name: "Destroyer", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [firstAttacker, destroyingAttacker] },
        { shieldArea: [st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, destroyingAttackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Striker Pack's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(destroyingAttackerId!, "direct"));
      expectSuccess(p2.declareBlock(tokenId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(tokenId)).toBeUndefined();
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });

    it("can pair with a Pilot like another Unit token", () => {
      const pilot = createMockPilot({
        name: "Token Pilot",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [{ card: tAileStrikeGundam008, isToken: true }],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, tokenId));

      expect(p1.getPilotId(tokenId)).toBeDefined();
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    });
  });
});
