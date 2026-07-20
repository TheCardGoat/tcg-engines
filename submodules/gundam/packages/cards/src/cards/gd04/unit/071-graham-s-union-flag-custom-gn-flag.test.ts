import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GrahamSUnionFlagCustomGnFlag071 } from "./071-graham-s-union-flag-custom-gn-flag.ts";

describe("Graham's Union Flag Custom Ⅱ (GN Flag) (GD04-071)", () => {
  describe("【Burst】If an enemy (CB) Unit is in play, add this card to your hand.", () => {
    it("moves from Shield to hand after a CB Unit's direct attack destroys it", () => {
      const cbAttacker = createMockUnit({ ap: 1, hp: 5, traits: ["cb"] });
      const engine = GundamTestEngine.create(
        { play: [cbAttacker] },
        { shieldArea: [gd04GrahamSUnionFlagCustomGnFlag071] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        controllerId: PLAYER_TWO,
        sourceCardId: expect.any(String),
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getCardZone(gd04GrahamSUnionFlagCustomGnFlag071)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(1);
    });

    it("moves to trash when no enemy CB Unit is in play", () => {
      const nonCbAttacker = createMockUnit({ ap: 1, hp: 5, traits: ["zeon"] });
      const engine = GundamTestEngine.create(
        { play: [nonCbAttacker] },
        { shieldArea: [gd04GrahamSUnionFlagCustomGnFlag071] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardZone(gd04GrahamSUnionFlagCustomGnFlag071)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Activate･Main】Choose 1 (Superpower Bloc) card and 1 (UN) card from your trash. Exile them from the game. If you do, set this Unit as active. It can't attack during this turn.", () => {
    it("exiles both cards, readies itself, and rejects an attack this turn", () => {
      const superpowerA = createMockUnit({ name: "Superpower A", traits: ["superpower bloc"] });
      const superpowerB = createMockUnit({ name: "Superpower B", traits: ["superpower bloc"] });
      const un = createMockUnit({ traits: ["un"] });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
        trash: [superpowerA, superpowerB, un],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [superpowerAId, superpowerBId, unId] = p1.getCardsInZone("trash");

      expectSuccess(p1.activateAbility(unitId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: unitId,
        minTargets: 2,
        maxTargets: 2,
        legalTargetIds: [superpowerAId, superpowerBId, unId],
        groups: [
          {
            minTargets: 1,
            maxTargets: 1,
            legalTargetIds: [superpowerAId, superpowerBId],
          },
          { minTargets: 1, maxTargets: 1, legalTargetIds: [unId] },
        ],
      });
      expectSuccess(p1.resolveEffect({ targets: [superpowerBId!, unId!] }));

      expect(p1.getCardZone(superpowerAId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(superpowerBId!)).toBe("removalArea");
      expect(p1.getCardZone(unId!)).toBe("removalArea");
      expect(p1.isExhausted(unitId)).toBe(false);
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });

    it("lets one dual-trait card fill exactly one of the two printed choices", () => {
      const dualTrait = createMockUnit({
        name: "Superpower UN liaison",
        traits: ["superpower bloc", "un"],
      });
      const superpowerOnly = createMockUnit({
        name: "Superpower-only card",
        traits: ["superpower bloc"],
      });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
        trash: [dualTrait, superpowerOnly],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [dualTraitId, superpowerOnlyId] = p1.getCardsInZone("trash");

      expectSuccess(p1.activateAbility(unitId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        minTargets: 2,
        maxTargets: 2,
      });

      // Select the flexible card first, exactly as a human may click it.
      // The engine must assign it to (UN), leaving the other card for
      // (Superpower Bloc), rather than counting the dual-trait card twice.
      expectSuccess(p1.resolveEffect({ targets: [dualTraitId!, superpowerOnlyId!] }));

      expect(p1.getCardZone(dualTraitId!)).toBe("removalArea");
      expect(p1.getCardZone(superpowerOnlyId!)).toBe("removalArea");
      expect(p1.isExhausted(unitId)).toBe(false);
      expectFailure(p1.enterBattle(unitId, "direct"), "CANNOT_ATTACK");
    });

    it("uses two different cards when both choices have both required traits", () => {
      const firstDual = createMockUnit({
        name: "First dual-trait card",
        traits: ["superpower bloc", "un"],
      });
      const secondDual = createMockUnit({
        name: "Second dual-trait card",
        traits: ["superpower bloc", "un"],
      });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
        trash: [firstDual, secondDual],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const dualTraitIds = p1.getCardsInZone("trash");

      expectSuccess(p1.activateAbility(unitId, 0));
      expectSuccess(p1.resolveEffect({ targets: dualTraitIds }));

      expect(p1.getCardsInZone("trash")).not.toEqual(expect.arrayContaining(dualTraitIds));
      for (const cardId of dualTraitIds) {
        expect(p1.getCardZone(cardId)).toBe("removalArea");
      }
      expect(p1.isExhausted(unitId)).toBe(false);
    });

    it("rejects one dual-trait card because each printed choice needs a distinct card", () => {
      const dualTrait = createMockUnit({
        name: "Single dual-trait card",
        traits: ["superpower bloc", "un"],
      });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
        trash: [dualTrait],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const dualTraitId = p1.getCardsInZone("trash")[0]!;

      expectFailure(p1.activateAbility(unitId, 0), "WRONG_TARGET_COUNT");

      expect(p1.getCardZone(dualTraitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(unitId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects a partial choice atomically when the UN trash card is missing", () => {
      const superpower = createMockUnit({ traits: ["superpower bloc"] });
      const engine = GundamTestEngine.create({
        play: [{ card: gd04GrahamSUnionFlagCustomGnFlag071, exhausted: true }],
        trash: [superpower],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const superpowerId = p1.getCardsInZone("trash")[0]!;

      expectFailure(
        p1.activateAbility(unitId, 0, { targets: [superpowerId] }),
        "WRONG_TARGET_COUNT",
      );

      expect(p1.getCardZone(superpowerId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.isExhausted(unitId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
