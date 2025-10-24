import { describe, expect, it } from "bun:test";
import type { PlayerId } from "@tcg/core";
import type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "../move-enumeration";

describe("Move Enumeration Types", () => {
  describe("Type Compilation", () => {
    it("should compile AvailableMoveInfo type", () => {
      const moveInfo: AvailableMoveInfo = {
        moveId: "chooseWhoGoesFirstMove",
        displayName: "Choose First Player",
        description: "Select which player goes first",
        icon: "dice",
        paramSchema: {
          required: [
            {
              name: "playerId",
              type: "playerId",
              description: "Player to go first",
            },
          ],
        },
      };

      expect(moveInfo.moveId).toBe("chooseWhoGoesFirstMove");
      expect(moveInfo.displayName).toBe("Choose First Player");
    });

    it("should compile AvailableMoveInfo without optional fields", () => {
      const moveInfo: AvailableMoveInfo = {
        moveId: "passTurn",
        displayName: "Pass Turn",
        description: "End your turn",
      };

      expect(moveInfo.moveId).toBe("passTurn");
      expect(moveInfo.icon).toBeUndefined();
      expect(moveInfo.paramSchema).toBeUndefined();
    });

    it("should compile ParamFieldSchema type", () => {
      const fieldSchema: ParamFieldSchema = {
        name: "cardId",
        type: "cardId",
        description: "Card to play",
        validValues: ["card1", "card2"],
      };

      expect(fieldSchema.name).toBe("cardId");
      expect(fieldSchema.type).toBe("cardId");
    });

    it("should compile ParamFieldSchema with enum values", () => {
      const fieldSchema: ParamFieldSchema = {
        name: "choice",
        type: "string",
        description: "Choice to make",
        enumValues: ["option1", "option2"],
      };

      expect(fieldSchema.enumValues).toEqual(["option1", "option2"]);
    });

    it("should compile MoveParamSchema type", () => {
      const schema: MoveParamSchema = {
        required: [
          {
            name: "playerId",
            type: "playerId",
            description: "Target player",
          },
        ],
        optional: [
          {
            name: "targetId",
            type: "cardId",
            description: "Optional target",
          },
        ],
      };

      expect(schema.required).toHaveLength(1);
      expect(schema.optional).toHaveLength(1);
    });

    it("should compile MoveParameterOptions type", () => {
      const options: MoveParameterOptions = {
        validCombinations: [
          { playerId: "player_one" as PlayerId },
          { playerId: "player_two" as PlayerId },
        ],
        parameterInfo: {
          playerId: {
            type: "playerId",
            description: "Player to choose",
            validValues: ["player_one", "player_two"],
          },
        },
      };

      expect(options.validCombinations).toHaveLength(2);
      expect(options.parameterInfo.playerId.type).toBe("playerId");
    });

    it("should compile ParameterInfo type", () => {
      const info: ParameterInfo = {
        type: "number",
        description: "Number of cards to draw",
        validValues: [1, 2, 3],
        min: 1,
        max: 7,
      };

      expect(info.type).toBe("number");
      expect(info.min).toBe(1);
      expect(info.max).toBe(7);
    });

    it("should compile MoveValidationError type", () => {
      const error: MoveValidationError = {
        moveId: "playCard",
        errorCode: "INSUFFICIENT_INK",
        reason: "Not enough ink to play this card",
        context: {
          required: 5,
          available: 3,
        },
        suggestions: ["Add more cards to your inkwell"],
      };

      expect(error.errorCode).toBe("INSUFFICIENT_INK");
      expect(error.suggestions).toHaveLength(1);
    });

    it("should compile MoveValidationError without optional fields", () => {
      const error: MoveValidationError = {
        moveId: "quest",
        errorCode: "INVALID_TARGET",
        reason: "Character is exhausted",
      };

      expect(error.context).toBeUndefined();
      expect(error.suggestions).toBeUndefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce valid parameter types", () => {
      const paramInfo: ParameterInfo = {
        type: "cardId",
        description: "Card ID",
      };

      // Type should be one of the allowed values
      expect(["cardId", "playerId", "number", "boolean", "object"]).toContain(
        paramInfo.type,
      );
    });

    it("should allow all valid ParamFieldSchema types", () => {
      const types: Array<ParamFieldSchema["type"]> = [
        "cardId",
        "playerId",
        "number",
        "boolean",
        "object",
        "string",
      ];

      expect(types).toHaveLength(6);
    });
  });
});
