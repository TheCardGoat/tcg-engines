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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st04Vesalius016 } from "./016-vesalius.ts";

describe("Vesalius (ST04-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("offers the revealed Shield's owner and deploys the accepted physical card", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04Vesalius016] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Vesalius's visible Burst choice");
      const revealedId = burst.sourceCardId;
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Deploy this card.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(revealedId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("moves the revealed Shield to trash when its owner declines", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04Vesalius016] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Vesalius's visible Burst choice");
      const revealedId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(revealedId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves one Shield to hand while Vesalius enters the Base section", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Vesalius016],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore);
    });

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Vesalius016],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    });

    it("cannot deploy below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Vesalius016],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectFailure(p1.deployBase(baseId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(baseId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost 1 with only rested Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Vesalius016],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectFailure(p1.deployBase(baseId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(baseId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Activate･Main】Rest this Base：Choose 1 friendly Unit. It gets AP+1 during this turn.", () => {
    it("rests Vesalius and gives only the chosen friendly Unit AP+1", () => {
      const chosen = createMockUnit({ name: "Chosen Unit", ap: 2, hp: 4 });
      const other = createMockUnit({ name: "Other Unit", ap: 3, hp: 4 });
      const engine = GundamTestEngine.create({
        baseSection: [st04Vesalius016],
        play: [chosen, other],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [chosenId, otherId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(baseId, { targets: [chosenId!] }));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getVisibleCard(chosenId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(otherId!)?.effectiveAp).toBe(3);
    });

    it("publishes an exact-one choice containing every friendly Unit", () => {
      const first = createMockUnit({ name: "First Unit" });
      const second = createMockUnit({ name: "Second Unit" });
      const engine = GundamTestEngine.create({
        baseSection: [st04Vesalius016],
        play: [first, second],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(baseId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        legalTargetIds: [firstId, secondId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(2);
      expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(3);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects an enemy Unit", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const enemy = createMockUnit({ name: "Enemy" });
      const engine = GundamTestEngine.create(
        { baseSection: [st04Vesalius016], play: [friendly] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateBaseAbility(baseId, { targets: [enemyId] }), "ILLEGAL_TARGET");

      expect(p1.isExhausted(baseId)).toBe(false);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    });

    it("cannot activate without a legal friendly Unit", () => {
      const engine = GundamTestEngine.create({ baseSection: [st04Vesalius016] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectFailure(p1.activateBaseAbility(baseId), "NO_LEGAL_TARGETS");
      expect(p1.isExhausted(baseId)).toBe(false);
    });

    it("cannot pay the rest cost while Vesalius is already rested", () => {
      const target = createMockUnit({ name: "Target" });
      const engine = GundamTestEngine.create({
        baseSection: [{ card: st04Vesalius016, exhausted: true }],
        play: [target],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st04Vesalius016, { targets: [targetId] }),
        "CARD_EXHAUSTED",
      );
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(2);
    });

    it("cannot activate outside Main timing", () => {
      const target = createMockUnit({ name: "Target" });
      const engine = GundamTestEngine.create(
        { baseSection: [st04Vesalius016], play: [target] },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(
        p1.activateBaseAbility(st04Vesalius016, { targets: [targetId] }),
        "WRONG_PHASE",
      );
    });

    it("removes the AP increase when the turn ends", () => {
      const target = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st04Vesalius016],
          play: [target],
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(st04Vesalius016, { targets: [targetId] }));
      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(3);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(2);
    });
  });
});
