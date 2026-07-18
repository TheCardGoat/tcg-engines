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
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02DaughtressCommand044 } from "./044-daughtress-command.ts";

describe("Daughtress Command (GD02-044)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02DaughtressCommand044],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment rests the active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02DaughtressCommand044],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Destroyed】If you have another (New UNE) Unit in play, deploy 1 rested [Daughtress] Unit token.", () => {
    it("deploys a visible rested Daughtress token after being destroyed in battle", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const ally = createMockUnit({ traits: ["new une"], hp: 4 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
        { play: [gd02DaughtressCommand044, ally], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [daughtressId, allyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [daughtressId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, attackerId, daughtressId!);

      expect(p2.getCardZone(daughtressId!)).toBe(`trash:${PLAYER_TWO}`);
      const tokenId = p2.getCardsInZone("battleArea").find((id) => id !== allyId);
      expect(tokenId).toBeDefined();
      expect(p2.isExhausted(tokenId!)).toBe(true);
    });

    it("does not deploy a token when the only other friendly Unit has another trait", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const outsider = createMockUnit({ traits: ["vulture"], hp: 4 });
      const openingShield = createMockUnit({ name: "Opening Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker], shieldArea: [openingShield], deck: 5 },
        { play: [gd02DaughtressCommand044, outsider], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [daughtressId, outsiderId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [daughtressId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, attackerId, daughtressId!);

      expect(p2.getCardZone(daughtressId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("battleArea")).toEqual([outsiderId]);
    });
  });
});
