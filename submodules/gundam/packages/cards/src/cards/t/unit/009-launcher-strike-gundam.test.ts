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
import { tLauncherStrikeGundam009 } from "./009-launcher-strike-gundam.ts";

const LAUNCHER_STRIKE_OPTION = 1;

describe("Launcher Strike Gundam (T-009)", () => {
  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("is deployed by Striker Pack as the active AP2/HP4 T-009 Blocker token", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: LAUNCHER_STRIKE_OPTION } }));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 2,
        effectiveHp: 4,
        exhausted: false,
      });
      expect(p1.getVisibleCard(tokenId)?.keywords).toContain("Blocker");
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rests and redirects a direct attack to itself", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tLauncherStrikeGundam009, isToken: true }] },
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
            { card: tLauncherStrikeGundam009, exhausted: true, isToken: true },
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
            { card: tLauncherStrikeGundam009, isToken: true },
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
        { play: [{ card: tLauncherStrikeGundam009, exhausted: true, isToken: true }] },
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
    it("cannot attack during the turn it was deployed", () => {
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [st04StrikerPack012],
          resourceArea: activeResources(4),
        },
        { shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: LAUNCHER_STRIKE_OPTION } }));
      const tokenId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.enterBattle(tokenId, "direct"), "CANNOT_ATTACK");
      expect(p1.isExhausted(tokenId)).toBe(false);
    });

    it("is removed from the game instead of remaining in trash when destroyed", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: tLauncherStrikeGundam009, isToken: true }] },
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
        play: [{ card: tLauncherStrikeGundam009, isToken: true }],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const tokenId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, tokenId));

      expect(p1.getPilotId(tokenId)).toBeDefined();
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    });
  });
});
