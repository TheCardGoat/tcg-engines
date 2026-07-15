import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundvLva025 } from "./025-gundv-lva.ts";

describe("Gundvölva (GD04-025)", () => {
  describe("【Destroyed】During your turn, if you have another (Dawn of Fold) Unit in play, place 1 EX Resource.", () => {
    it("places an active EX Resource when it is destroyed in battle during your turn beside another Dawn of Fold Unit", () => {
      const otherDawnOfFold = createMockUnit({
        name: "Other Dawn of Fold Unit",
        traits: ["dawn of fold"],
      });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [gd04GundvLva025, otherDawnOfFold],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundvLvaId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.enterBattle(gundvLvaId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const exResourceId = resourcesAfter.find((cardId) => !resourcesBefore.includes(cardId));
      expect(p1.getCardsInZone("trash")).toContain(gundvLvaId);
      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(exResourceId).toBeDefined();
      expect(p1.isExhausted(exResourceId!)).toBe(false);
    });

    it("does not place an EX Resource without another Dawn of Fold Unit", () => {
      const nonDawnOfFold = createMockUnit({ name: "Other Unit", traits: ["academy"] });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [gd04GundvLva025, nonDawnOfFold],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundvLvaId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getResourceCount();

      expectSuccess(p1.enterBattle(gundvLvaId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getCardsInZone("trash")).toContain(gundvLvaId);
      expect(p1.getResourceCount()).toBe(resourcesBefore);
    });

    it("does not place an EX Resource when destroyed during the opponent's turn", () => {
      const otherDawnOfFold = createMockUnit({
        name: "Other Dawn of Fold Unit",
        traits: ["dawn of fold"],
      });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: gd04GundvLva025, exhausted: true }, otherDawnOfFold],
          resourceArea: activeResources(3),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundvLvaId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getResourceCount();

      expectSuccess(p2.enterBattle(attackerId, gundvLvaId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardsInZone("trash")).toContain(gundvLvaId);
      expect(p1.getResourceCount()).toBe(resourcesBefore);
    });
  });
});
