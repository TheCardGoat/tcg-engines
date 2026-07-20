import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03Gouf009 } from "./009-gouf.ts";

describe("Gouf (ST03-009)", () => {
  describe("【Deploy】Deploy 1 rested [Zaku Ⅱ]((Zeon)·AP1·HP1) Unit token.", () => {
    it("deploys exactly one rested Zaku Ⅱ token for its controller", () => {
      const engine = GundamTestEngine.create(
        { hand: [st03Gouf009], resourceArea: activeResources(3) },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const goufId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(goufId));

      const battleCards = p1.getCardsInZone("battleArea");
      const tokenIds = battleCards.filter((id) => id !== goufId);
      expect(tokenIds).toHaveLength(1);
      expect(p1.getVisibleCard(tokenIds[0]!)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        exhausted: true,
      });
      expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("leaves the Gouf active while the created token is rested", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const goufId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(goufId));
      const tokenId = p1.getCardsInZone("battleArea").find((id) => id !== goufId)!;

      expect(p1.isExhausted(goufId)).toBe(false);
      expect(p1.isExhausted(tokenId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not create a token when Gouf merely begins in play", () => {
      const engine = GundamTestEngine.create({ play: [st03Gouf009] });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.passPhase());

      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getVisibleCard(p1.getCardsInZone("battleArea")[0]!)?.definitionId).toBe("ST03-009");
    });

    it("creates another token for each separately deployed Gouf", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009, st03Gouf009],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstGoufId, secondGoufId] = p1.getHand();

      expectSuccess(p1.deployUnit(firstGoufId!));
      expectSuccess(p1.deployUnit(secondGoufId!));

      const tokenIds = p1
        .getCardsInZone("battleArea")
        .filter((id) => id !== firstGoufId && id !== secondGoufId);
      expect(tokenIds).toHaveLength(2);
      expect(tokenIds.every((id) => p1.isExhausted(id))).toBe(true);
    });
  });

  describe("deploying Gouf", () => {
    it("pays its printed cost and moves Gouf from hand to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const goufId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(goufId));

      expect(p1.getCardZone(goufId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(goufId)).toMatchObject({ effectiveAp: 2, effectiveHp: 3 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("cannot be deployed below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03Gouf009), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03Gouf009)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot pay its printed cost without active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03Gouf009), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03Gouf009)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st03Gouf009],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st03Gouf009), "WRONG_PHASE");

      expect(p1.getCardZone(st03Gouf009)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });
});
