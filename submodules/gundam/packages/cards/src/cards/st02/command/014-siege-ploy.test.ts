import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st02SiegePloy014 } from "./014-siege-ploy.ts";

describe("Siege Ploy (ST02-014)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("offers only an eligible enemy Unit and rests the chosen Unit without paying the Command cost", () => {
      const attacker = createMockUnit({ name: "Ineligible Attacker", ap: 1, hp: 6 });
      const eligible = createMockUnit({ name: "Eligible Unit", hp: 5 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st02SiegePloy014] },
        { play: [attacker, eligible] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, eligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Siege Ploy's Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: burst.sourceCardId,
        legalTargetIds: [eligibleId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.isExhausted(eligibleId!)).toBe(true);
      expect(p1.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getResourceCount()).toBe(0);
    });

    it("moves the revealed Command to trash without resting another Unit when Burst is declined", () => {
      const attacker = createMockUnit({ ap: 1, hp: 6 });
      const eligible = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st02SiegePloy014] },
        { play: [attacker, eligible] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, eligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Siege Ploy's Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.isExhausted(eligibleId!)).toBe(false);
      expect(p1.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    it("asks which eligible enemy Unit to rest during Main and moves the resolved Command to trash", () => {
      const first = createMockUnit({ name: "First Enemy", hp: 5 });
      const second = createMockUnit({ name: "Second Enemy", hp: 4 });
      const tooTough = createMockUnit({ name: "Too Tough", hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [first, second, tooTough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstId, secondId, tooToughId] = p2.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 1,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection")
        throw new Error("Expected Siege Ploy's target choice");
      expect(choice.legalTargetIds).not.toContain(tooToughId);
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p2.isExhausted(firstId!)).toBe(false);
      expect(p2.isExhausted(secondId!)).toBe(true);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("rests an eligible enemy Unit during a legally reached Action step", () => {
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st02SiegePloy014, { targets: [enemyId] }));

      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getCardsInZone("trash")).toHaveLength(1);
    });

    it("rejects an enemy Unit with more than 5 HP", () => {
      const enemy = createMockUnit({ hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(st02SiegePloy014, { targets: [enemyId] }), "INVALID_TARGET");
      expect(p1.getCardZone(st02SiegePloy014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a friendly Unit even when it has 5 or less HP", () => {
      const friendly = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st02SiegePloy014],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(st02SiegePloy014, { targets: [friendlyId] }), "INVALID_TARGET");
      expect(p1.isExhausted(friendlyId)).toBe(false);
    });

    it("cannot be played when no eligible enemy Unit can be chosen", () => {
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(3) },
        { play: [createMockUnit({ hp: 6 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SiegePloy014), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st02SiegePloy014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: activeResources(2) },
        { play: [createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SiegePloy014), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st02SiegePloy014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create(
        { hand: [st02SiegePloy014], resourceArea: restedResources(3) },
        { play: [createMockUnit({ hp: 5 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02SiegePloy014), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st02SiegePloy014)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
