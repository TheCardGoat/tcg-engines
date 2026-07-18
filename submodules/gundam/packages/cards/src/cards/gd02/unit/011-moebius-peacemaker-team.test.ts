import { describe, expect, it } from "vite-plus/test";
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
import { gd02MoebiusPeacemakerTeam011 } from "./011-moebius-peacemaker-team.ts";
import { gd02Freeden127 } from "../base/127-freeden.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Moebius (Peacemaker Team) (GD02-011)", () => {
  describe("Printed Lv.4 and cost 2", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02MoebiusPeacemakerTeam011],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02MoebiusPeacemakerTeam011],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Activate･Action】Destroy this Unit：Choose 1 enemy Base/enemy Shield this Unit is battling. Deal 6 damage to it.", () => {
    it("destroys itself as the cost and lets the player choose the battling enemy Base", () => {
      const base = createMockBase({ hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));

      expect(p1.getCardZone(moebiusId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(6);
    });

    it("lets the player choose the anonymous Shield being battled and destroys it", () => {
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { shieldArea: [createMockUnit({ name: "Face-down Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected a visible choice for the battling Shield");
      }
      expect(choice.legalTargetIds).toHaveLength(1);
      expectSuccess(p1.resolveEffect({ targets: [choice.legalTargetIds[0]!] }));

      expect(p1.getCardZone(moebiusId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 1);
      expect(p2.getCardsInZone("trash")).toHaveLength(1);
    });

    it("does not activate the hidden card's Unit effects while it is a Shield", () => {
      const hiddenReactiveUnit = createMockUnit({
        name: "Hidden Reactive Unit",
        effects: [
          {
            type: "triggered",
            activation: {
              timing: ["onEffectDamageReceived"],
              conditions: [{ type: "eventCardIsSelf" }],
            },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "When this Unit receives effect damage, draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { shieldArea: [hiddenReactiveUnit], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p2.getBoardView().players[PLAYER_TWO]!.deckCount;
      const handBefore = p2.getHand().length;

      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected a visible choice for the battling Shield");
      }
      expectSuccess(p1.resolveEffect({ targets: [choice.legalTargetIds[0]!] }));

      expect(p2.getBoardView().players[PLAYER_TWO]!.deckCount).toBe(deckBefore);
      expect(p2.getHand()).toHaveLength(handBefore);
      expect(p2.getCardsInZone("trash")).toHaveLength(1);
    });

    it("reveals an effect-destroyed Shield and lets its owner activate Burst", () => {
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { shieldArea: [gd02Freeden127] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));
      const targetChoice = p1.getBoardView().pendingChoice;
      if (targetChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible choice for the battling Shield");
      }
      const revealedShieldId = targetChoice.legalTargetIds[0]!;
      expectSuccess(p1.resolveEffect({ targets: [revealedShieldId] }));

      const burstChoice = p2.getBoardView().pendingChoice;
      if (burstChoice?.kind !== "optional") {
        throw new Error("Expected a visible Burst choice");
      }
      expect(burstChoice).toMatchObject({
        controllerId: PLAYER_TWO,
        sourceCardId: revealedShieldId,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstChoice.directiveIndex]: true } }));

      expect(p1.getCardZone(moebiusId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(revealedShieldId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
    });

    it("destroys the battling Base when 6 damage reaches its HP", () => {
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));

      expect(p1.getCardZone(moebiusId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(baseId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("moves its paired Pilot to trash when destroying itself as the cost", () => {
      const pilot = createMockPilot({ name: "Paired Pilot", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02MoebiusPeacemakerTeam011],
          resourceArea: activeResources(1),
        },
        { baseSection: [createMockBase({ hp: 8 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(pilot, moebiusId));
      const pilotId = p1.getPilotId(moebiusId)!;
      expectSuccess(p1.enterBattle(moebiusId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(moebiusId, 0));

      expect(p1.getCardZone(moebiusId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pilotId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [baseId],
      });
      expectSuccess(p1.resolveEffect({ targets: [baseId] }));
      expect(p2.getDamage(baseId)).toBe(6);
    });

    it("cannot activate during the Main Phase before it is battling", () => {
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011] },
        { baseSection: [createMockBase({ hp: 8 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(moebiusId, 0), "WRONG_PHASE");

      expect(p1.getCardZone(moebiusId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.isExhausted(moebiusId)).toBe(false);
    });

    it("cannot activate while battling an enemy Unit because no Base or Shield is battling", () => {
      const enemy = createMockUnit({ ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd02MoebiusPeacemakerTeam011], shieldArea: [createMockUnit()], deck: 5 },
        { play: [enemy], baseSection: [createMockBase({ hp: 8 })], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const moebiusId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(moebiusId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectFailure(p1.activateAbility(moebiusId, 0), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(moebiusId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
