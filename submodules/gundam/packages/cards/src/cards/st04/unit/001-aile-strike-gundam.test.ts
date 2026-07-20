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
  restedResources,
} from "@tcg/gundam-engine";
import { st04AileStrikeGundam001 } from "./001-aile-strike-gundam.ts";

describe("Aile Strike Gundam (ST04-001)", () => {
  describe("Printed Lv.5 and cost 4", () => {
    it("deploys from hand to the battle area with its visible printed stats and Blocker", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AileStrikeGundam001],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(unitId));

      expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
      expect(p1.getVisibleCard(unitId)?.keywords).toContain("Blocker");
    });

    it("cannot be deployed below its printed Lv.5 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AileStrikeGundam001],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st04AileStrikeGundam001), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st04AileStrikeGundam001)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without four active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04AileStrikeGundam001],
        resourceArea: restedResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st04AileStrikeGundam001), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st04AileStrikeGundam001)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed by the standby player during the opponent's Main Phase", () => {
      const engine = GundamTestEngine.create(
        { hand: [st04AileStrikeGundam001], resourceArea: activeResources(5) },
        {},
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st04AileStrikeGundam001), "NOT_ACTIVE_PLAYER");
      expect(p1.getCardZone(st04AileStrikeGundam001)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("<Blocker> (Rest this Unit to change the attack target to it.)", () => {
    it("rests Aile Strike Gundam and redirects a Unit attack to it", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st04AileStrikeGundam001] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectSuccess(p2.declareBlock(blockerId!));

      expectAttackRedirectedTo(engine, blockerId!);
      expect(p2.isExhausted(blockerId!)).toBe(true);
      expect(p2.getDamage(originalTargetId!)).toBe(0);
    });

    it("redirects a direct attack and prevents damage to the player", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [st04AileStrikeGundam001] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));
      expectAttackRedirectedTo(engine, blockerId);
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().winner).toBeUndefined();
    });

    it("cannot block while already rested", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          play: [
            { card: originalTarget, exhausted: true },
            { card: st04AileStrikeGundam001, exhausted: true },
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(blockerId!), "CANNOT_BLOCK");

      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });

    it("cannot block when it was the original attack target", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st04AileStrikeGundam001, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, blockerId));
      expectFailure(p2.declareBlock(blockerId), "BLOCKER_IS_TARGET");
    });

    it("cannot block an attacker with High-Maneuver", () => {
      const attacker = createMockUnit({
        ap: 1,
        hp: 5,
        keywordEffects: [{ keyword: "HighManeuver" }],
      });
      const originalTarget = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: originalTarget, exhausted: true }, st04AileStrikeGundam001] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [originalTargetId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, originalTargetId!));
      expectFailure(p2.declareBlock(blockerId!), "CANNOT_BLOCK_HIGH_MANEUVER");

      expect(p2.isExhausted(blockerId!)).toBe(false);
      expect(p1.getBoardView().pendingCombat).toMatchObject({ target: originalTargetId });
    });
  });

  describe("【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.", () => {
    it("returns an enemy Unit with exactly 4 HP when paired with a Lv.4 Pilot", () => {
      const pilot = createMockPilot({ name: "Kira Yamato", level: 4, cost: 1 });
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aileId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, aileId));
      expect(p1.getPilotId(aileId)).toBe(p1.getCardsInZone("battleArea")[1]);
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected an eligible enemy choice");
      expect(choice).toMatchObject({
        sourceCardId: aileId,
        legalTargetIds: [enemyId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("also triggers for a Pilot above the Lv.4 threshold", () => {
      const pilot = createMockPilot({ level: 5, cost: 1 });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, st04AileStrikeGundam001));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(engine.asPlayer(PLAYER_TWO).getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("does not trigger for a Lv.3 Pilot", () => {
      const pilot = createMockPilot({ level: 3, cost: 1 });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, st04AileStrikeGundam001));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(engine.asPlayer(PLAYER_TWO).getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("excludes enemy Units with 5 HP from the prompt", () => {
      const pilot = createMockPilot({ level: 4, cost: 1 });
      const eligible = createMockUnit({ name: "Eligible", hp: 4 });
      const tooDurable = createMockUnit({ name: "Too Durable", hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [eligible, tooDurable] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const eligibleId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, st04AileStrikeGundam001));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected an eligible enemy choice");
      expect(choice.legalTargetIds).toEqual([eligibleId]);
    });

    it("rejects a friendly Unit target", () => {
      const pilot = createMockPilot({ level: 4, cost: 1 });
      const friendly = createMockUnit({ hp: 4 });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001, friendly],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [aileId, friendlyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, aileId!));
      expectFailure(p1.resolveEffect({ targets: [friendlyId!] }), "ILLEGAL_TARGET");

      expect(p1.getCardZone(friendlyId!)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("resolves without a prompt when no enemy Unit has 4 or less HP", () => {
      const pilot = createMockPilot({ level: 4, cost: 1 });
      const tooDurable = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
        },
        { play: [tooDurable] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, st04AileStrikeGundam001));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(engine.asPlayer(PLAYER_TWO).getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("returns the chosen enemy Unit and its paired Pilot to their owner's hand", () => {
      const kira = createMockPilot({ name: "Kira Yamato", level: 4, cost: 1 });
      const enemyPilot = createMockPilot({
        name: "Enemy Pilot",
        level: 1,
        cost: 1,
        apBonus: 0,
        hpBonus: 0,
      });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [kira],
          play: [st04AileStrikeGundam001],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { hand: [enemyPilot], play: [enemy], resourceArea: activeResources(1), deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const enemyPilotId = p2.getHand()[0]!;

      expectSuccess(p2.assignPilot(enemyPilotId, enemyId));
      expect(p2.getPilotId(enemyId)).toBe(enemyPilotId);
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.assignPilot(kira, st04AileStrikeGundam001));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getCardZone(enemyPilotId)).toBe(`hand:${PLAYER_TWO}`);
    });
  });
});
