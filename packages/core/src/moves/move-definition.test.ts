import { describe, expect, it } from "bun:test";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type {
  MoveCost,
  MoveDefinition,
  MoveInstance,
  MoveType,
} from "./move-definition";

describe("Move Definition Types", () => {
  const player1 = createPlayerId("p1");
  const _player2 = createPlayerId("p2");
  const cardId1 = createCardId("card1");
  const _handZone = createZoneId("hand");

  describe("MoveType", () => {
    it("should support all move types", () => {
      const types: MoveType[] = [
        "play-card",
        "activate-ability",
        "attack",
        "block",
        "pass-priority",
        "draw-card",
        "discard",
        "mulligan",
        "custom",
      ];

      expect(types).toHaveLength(9);
    });
  });

  describe("MoveCost", () => {
    it("should define cost with generic resources", () => {
      const cost: MoveCost = {
        resources: { mana: 3, energy: 2 },
      };

      expect(cost.resources?.mana).toBe(3);
    });

    it("should define cost with multiple components", () => {
      const cost: MoveCost = {
        resources: { mana: 2 },
        tap: { type: "creature" },
        life: 1,
      };

      expect(cost.resources?.mana).toBe(2);
      expect(cost.tap).toBeDefined();
      expect(cost.life).toBe(1);
    });
  });

  describe("MoveDefinition", () => {
    it("should define basic move", () => {
      const move: MoveDefinition = {
        id: "play-creature",
        name: "Play Creature",
        type: "play-card",
      };

      expect(move.id).toBe("play-creature");
      expect(move.type).toBe("play-card");
    });

    it("should define move with targets", () => {
      const move: MoveDefinition = {
        id: "lightning-bolt",
        name: "Lightning Bolt",
        type: "play-card",
        targets: [{ filter: { type: "creature" }, count: 1 }],
      };

      expect(move.targets).toHaveLength(1);
    });
  });

  describe("MoveInstance", () => {
    it("should create move instance", () => {
      const instance: MoveInstance = {
        moveId: "play-creature",
        playerId: player1,
        sourceCardId: cardId1,
      };

      expect(instance.moveId).toBe("play-creature");
      expect(instance.playerId).toBe(player1);
    });
  });
});
