import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st03Sinanju001 } from "./001-sinanju.ts";

describe("Sinanju (ST03-001)", () => {
  describe("Lv.6 / cost 5 Unit", () => {
    it("deploys with its printed AP and HP after paying five active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Sinanju001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st03Sinanju001));

      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardZone(sinanjuId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(sinanjuId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(5);
    });

    it("cannot deploy below its printed Lv.6", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Sinanju001],
        resourceArea: activeResources(5),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st03Sinanju001),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot deploy without five active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Sinanju001],
        resourceArea: activeResources(6).map((entry, index) => ({
          ...entry,
          exhausted: index >= 4,
        })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03Sinanju001), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03Sinanju001)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【During Pair】This Unit gains <High-Maneuver>.", () => {
    it("gains High-Maneuver while paired", () => {
      const fullFrontal = createMockPilot({ name: "Full Frontal", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [fullFrontal],
        play: [st03Sinanju001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sinanjuId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(fullFrontal, st03Sinanju001));

      expect(p1.getVisibleCard(sinanjuId!)?.keywords).toContain("HighManeuver");
    });

    it("does not gain High-Maneuver while unpaired", () => {
      const engine = GundamTestEngine.create({ play: [st03Sinanju001] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sinanjuId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.passPhase());

      expect(p1.getVisibleCard(sinanjuId!)?.keywords).not.toContain("HighManeuver");
    });

    it("gains High-Maneuver with a non-link Pilot because During Pair has no qualification", () => {
      const ordinaryPilot = createMockPilot({
        name: "Ordinary Pilot",
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [ordinaryPilot],
        play: [st03Sinanju001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(ordinaryPilot, sinanjuId));

      expect(p1.getPilotId(sinanjuId)).toBeDefined();
      expect(p1.getVisibleCard(sinanjuId)?.keywords).toContain("HighManeuver");
    });

    it("prevents an enemy Blocker from redirecting Sinanju while it attacks", () => {
      const pilot = createMockPilot({ name: "Pair Pilot", level: 1, cost: 1 });
      const blocker = createMockUnit({
        ap: 2,
        hp: 4,
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const shield = createMockUnit({ name: "Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st03Sinanju001],
          resourceArea: activeResources(6),
        },
        { play: [blocker], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(pilot, sinanjuId));

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));

      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
      expect(p2.isExhausted(blockerId)).toBe(false);
    });
  });

  describe("During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals 2 damage to an enemy Unit after direct battle damage destroys a shield", () => {
      const enemy = createMockUnit({ hp: 5 });
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sinanjuId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("also triggers when battle damage destroys an enemy Base in the shield area", () => {
      const enemy = createMockUnit({ hp: 5 });
      const base = createMockBase({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { baseSection: [base], play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: sinanjuId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("does not trigger when Sinanju destroys an enemy Unit instead of a shield-area card", () => {
      const enemy = createMockUnit({ hp: 1 });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardsInZone("trash")).toContain(enemyId);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("offers only enemy Units as legal damage targets", () => {
      const friendly = createMockUnit({ hp: 5 });
      const enemy = createMockUnit({ hp: 5 });
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001, friendly] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [sinanjuId, friendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection", legalTargetIds: [enemyId] });
      if (choice?.kind !== "targetSelection") throw new Error("Expected enemy Unit target choice");
      expect(choice.legalTargetIds).not.toContain(friendlyId);
      expectFailure(p1.resolveEffect({ targets: [friendlyId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      expect(p2.getDamage(enemyId)).toBe(2);
    });

    it("destroys an enemy Unit with 2 HP after dealing exactly 2 effect damage", () => {
      const enemy = createMockUnit({ hp: 2 });
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not trigger when another friendly Unit destroys the Shield", () => {
      const otherAttacker = createMockUnit({ ap: 2, hp: 3 });
      const enemy = createMockUnit({ hp: 5 });
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create(
        { play: [st03Sinanju001, otherAttacker] },
        { play: [enemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const otherAttackerId = p1.getCardsInZone("battleArea")[1]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(otherAttackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("resolves without a target prompt when the opponent has no Unit", () => {
      const shield = createMockUnit({ name: "Shield Card" });
      const engine = GundamTestEngine.create({ play: [st03Sinanju001] }, { shieldArea: [shield] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sinanjuId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(sinanjuId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });
  });
});
