import { describe, expect, it } from "bun:test";
import type { PlayerId } from "@tcg/core";
import type {
  AvailableMoveInfo,
  MoveParamSchema,
  MoveParameterOptions,
  MoveValidationError,
  ParamFieldSchema,
  ParameterInfo,
} from "../move-enumeration";

describe("Move Enumeration Types", () => {
  describe("Type Compilation", () => {
    it("should compile AvailableMoveInfo type", () => {
      const moveInfo: AvailableMoveInfo = {
        description: "Select which player goes first",
        displayName: "Choose First Player",
        icon: "dice",
        moveId: "chooseWhoGoesFirstMove",
        paramSchema: {
          required: [
            {
              description: "Player to go first",
              name: "playerId",
              type: "playerId",
            },
          ],
        },
      };

      expect(moveInfo.moveId).toBe("chooseWhoGoesFirstMove");
      expect(moveInfo.displayName).toBe("Choose First Player");
    });

    it("should compile AvailableMoveInfo without optional fields", () => {
      const moveInfo: AvailableMoveInfo = {
        description: "End your turn",
        displayName: "Pass Turn",
        moveId: "passTurn",
      };

      expect(moveInfo.moveId).toBe("passTurn");
      expect(moveInfo.icon).toBeUndefined();
      expect(moveInfo.paramSchema).toBeUndefined();
    });

    it("should compile ParamFieldSchema type", () => {
      const fieldSchema: ParamFieldSchema = {
        description: "Card to play",
        name: "cardId",
        type: "cardId",
        validValues: ["card1", "card2"],
      };

      expect(fieldSchema.name).toBe("cardId");
      expect(fieldSchema.type).toBe("cardId");
    });

    it("should compile ParamFieldSchema with enum values", () => {
      const fieldSchema: ParamFieldSchema = {
        description: "Choice to make",
        enumValues: ["option1", "option2"],
        name: "choice",
        type: "string",
      };

      expect(fieldSchema.enumValues).toEqual(["option1", "option2"]);
    });

    it("should compile MoveParamSchema type", () => {
      const schema: MoveParamSchema = {
        optional: [
          {
            description: "Optional target",
            name: "targetId",
            type: "cardId",
          },
        ],
        required: [
          {
            description: "Target player",
            name: "playerId",
            type: "playerId",
          },
        ],
      };

      expect(schema.required).toHaveLength(1);
      expect(schema.optional).toHaveLength(1);
    });

    it("should compile MoveParameterOptions type", () => {
      const options: MoveParameterOptions = {
        parameterInfo: {
          playerId: {
            description: "Player to choose",
            type: "playerId",
            validValues: ["player_one", "player_two"],
          },
        },
        validCombinations: [
          { playerId: "player_one" as PlayerId },
          { playerId: "player_two" as PlayerId },
        ],
      };

      expect(options.validCombinations).toHaveLength(2);
      expect(options.parameterInfo.playerId.type).toBe("playerId");
    });

    it("should compile ParameterInfo type", () => {
      const info: ParameterInfo = {
        description: "Number of cards to draw",
        max: 7,
        min: 1,
        type: "number",
        validValues: [1, 2, 3],
      };

      expect(info.type).toBe("number");
      expect(info.min).toBe(1);
      expect(info.max).toBe(7);
    });

    it("should compile MoveValidationError type", () => {
      const error: MoveValidationError = {
        context: {
          available: 3,
          required: 5,
        },
        errorCode: "INSUFFICIENT_INK",
        moveId: "playCard",
        reason: "Not enough ink to play this card",
        suggestions: ["Add more cards to your inkwell"],
      };

      expect(error.errorCode).toBe("INSUFFICIENT_INK");
      expect(error.suggestions).toHaveLength(1);
    });

    it("should compile MoveValidationError without optional fields", () => {
      const error: MoveValidationError = {
        errorCode: "INVALID_TARGET",
        moveId: "quest",
        reason: "Character is exhausted",
      };

      expect(error.context).toBeUndefined();
      expect(error.suggestions).toBeUndefined();
    });
  });

  describe("Type Safety", () => {
    it("should enforce valid parameter types", () => {
      const paramInfo: ParameterInfo = {
        description: "Card ID",
        type: "cardId",
      };

      // Type should be one of the allowed values
      expect(["cardId", "playerId", "number", "boolean", "object"]).toContain(paramInfo.type);
    });

    it("should allow all valid ParamFieldSchema types", () => {
      const types: ParamFieldSchema["type"][] = [
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
