import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st02SimultaneousFire012 } from "./012-simultaneous-fire.ts";

describe("Simultaneous Fire (ST02-012)", () => {
  describe("【Main】Choose 1 of your Units. It gains <Breach 3> during this turn.", () => {
    it("asks which friendly Unit gains Breach 3 and moves the resolved Command to trash", () => {
      const first = createMockUnit({ name: "First Unit", ap: 3, hp: 3 });
      const second = createMockUnit({ name: "Second Unit", ap: 3, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [first, second],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getVisibleCard(firstId!)?.keywords).not.toContain("Breach");
      expect(p1.getVisibleCard(secondId!)?.keywords).toContain("Breach");
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deals exactly 3 Breach damage after the chosen Unit destroys an enemy Unit in battle", () => {
      const attacker = createMockUnit({ ap: 3, hp: 4 });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02SimultaneousFire012],
          play: [attacker],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.playCommand(st02SimultaneousFire012, { targets: [attackerId] }));
      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(3);
      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
    });

    it("removes the granted Breach keyword when the turn ends", () => {
      const unit = createMockUnit({ ap: 3, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st02SimultaneousFire012, { targets: [unitId] }));
      expect(p1.getVisibleCard(unitId)?.keywords).toContain("Breach");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Breach");
    });

    it("rejects an enemy Unit", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st02SimultaneousFire012], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st02SimultaneousFire012, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(st02SimultaneousFire012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when there is no friendly Unit to choose", () => {
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SimultaneousFire012), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st02SimultaneousFire012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played during a legally reached Action step", () => {
      const unit = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(st02SimultaneousFire012), "WRONG_TIMING");

      expect(p1.getCardZone(st02SimultaneousFire012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [createMockUnit()],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SimultaneousFire012), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st02SimultaneousFire012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [createMockUnit()],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SimultaneousFire012), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st02SimultaneousFire012)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Trowa Barton]", () => {
    it("pairs as Trowa Barton and applies AP+1 and HP+1 to the host Unit", () => {
      const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Trowa Barton]" });
      const engine = GundamTestEngine.create({
        hand: [st02SimultaneousFire012],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    });
  });
});
