import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import type { CommandCard } from "@tcg/gundam-types";
import { st10TacticalTraining013 } from "./013-tactical-training.ts";

const generationUnit = (overrides = {}) =>
  createMockUnit({ level: 5, ap: 4, hp: 6, traits: ["g generation"], ...overrides });

function damageFriendlyUnit(): CommandCard {
  return createMockCommand({
    name: "Training Damage",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Deal 2 damage to it.",
      },
    ],
  });
}

describe("Tactical Training (ST10-013)", () => {
  describe("【Main】/【Action】Choose 1 (G Generation) Unit that is Lv.5 or higher. It recovers 2 HP and gets AP+2 during this turn.", () => {
    it("recovers two damage, grants AP+2, and moves the Command to trash", () => {
      const engine = GundamTestEngine.create({
        hand: [damageFriendlyUnit(), st10TacticalTraining013],
        play: [generationUnit()],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [damageCommandId, tacticalId] = p1.getHand();
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(damageCommandId!));
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));
      expect(p1.getDamage(unitId)).toBe(2);

      expectSuccess(p1.playCommand(tacticalId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [unitId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(0);
      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 6 });
      expect(p1.getCardZone(tacticalId!)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can target an opponent's qualifying G Generation Unit", () => {
      const engine = GundamTestEngine.create(
        { hand: [st10TacticalTraining013], resourceArea: activeResources(3) },
        { play: [generationUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st10TacticalTraining013));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getVisibleCard(enemyId)).toMatchObject({ effectiveAp: 6 });
    });

    it("rejects a G Generation Unit below Lv.5", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        play: [generationUnit({ level: 4 })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      expectFailure(p1.playCommand(st10TacticalTraining013), "NO_LEGAL_TARGETS");
    });

    it("rejects a Lv.5 Unit without G Generation", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        play: [createMockUnit({ level: 5, traits: ["zeon"] })],
        resourceArea: activeResources(3),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st10TacticalTraining013),
        "NO_LEGAL_TARGETS",
      );
    });

    it("fails cleanly when no Unit is a legal target", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        resourceArea: activeResources(3),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st10TacticalTraining013),
        "NO_LEGAL_TARGETS",
      );
    });

    it("resolves at a legally reached battle Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        play: [generationUnit()],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st10TacticalTraining013));
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 6 });
    });

    it("requires the printed Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        play: [generationUnit()],
        resourceArea: activeResources(2),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st10TacticalTraining013),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("requires one active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st10TacticalTraining013],
        play: [generationUnit()],
        resourceArea: restedResources(3),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st10TacticalTraining013),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  describe("【Burst】Add this card to your hand.", () => {
    it("offers the Burst and moves the revealed Command to its owner's hand", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1 })] },
        { shieldArea: [st10TacticalTraining013] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p2.getBoardView().pendingChoice;
      if (choice?.kind !== "optional") throw new Error("Expected Tactical Training Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: true } }));

      expect(p2.getCardZone(choice.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });
  });
});
