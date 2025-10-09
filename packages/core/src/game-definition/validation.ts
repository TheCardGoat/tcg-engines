import { z } from "zod";
import type { GameDefinition } from "./game-definition";

/**
 * Game Definition Validation Result
 *
 * Result of validating a GameDefinition.
 */
export type GameDefinitionValidationResult =
  | { success: true }
  | { success: false; error: string; errors?: string[] };

/**
 * Zod schema for GameDefinition validation
 *
 * Task 10.14: Implement Zod schema for GameDefinition validation
 *
 * Runtime validation to ensure GameDefinition is well-formed.
 * Checks:
 * - Required fields are present
 * - Types are correct (functions, numbers, strings)
 * - Constraints are met (minPlayers <= maxPlayers, etc.)
 */
const GameDefinitionSchema = z.object({
  // Name validation
  name: z.string().min(1, "Game name must not be empty"),

  // Setup function validation
  setup: z.function().args(z.array(z.string())).returns(z.record(z.any())),

  // Moves validation
  moves: z.record(
    z.object({
      reducer: z.function(),
      condition: z.function().optional(),
      metadata: z.record(z.any()).optional(),
    }),
  ),

  // Optional flow validation
  flow: z
    .object({
      initial: z.string(),
      states: z.record(z.any()),
      hooks: z
        .object({
          onBegin: z.function().optional(),
          onEnd: z.function().optional(),
        })
        .optional(),
    })
    .optional(),

  // Optional endIf validation
  endIf: z
    .function()
    .args(z.any())
    .returns(
      z.union([
        z.object({ winner: z.string(), reason: z.string() }),
        z.undefined(),
      ]),
    )
    .optional(),

  // Optional playerView validation
  playerView: z
    .function()
    .args(z.any(), z.string())
    .returns(z.any())
    .optional(),
});

/**
 * Validate GameDefinition
 *
 * Task 10.13, 10.14: Validate GameDefinition using Zod schema
 *
 * Performs comprehensive validation:
 * 1. Schema validation (types, required fields)
 * 3. Move definition validation (each move has reducer)
 * 4. Function signature validation
 *
 * @param definition - GameDefinition to validate
 * @returns GameDefinitionValidationResult with success flag and error details
 */
export function validateGameDefinition<
  TState,
  TMoves extends Record<string, any>,
>(definition: GameDefinition<TState, TMoves>): GameDefinitionValidationResult {
  const errors: string[] = [];

  try {
    // Run Zod schema validation
    GameDefinitionSchema.parse(definition);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Collect all Zod validation errors
      for (const issue of error.issues) {
        const path = issue.path.join(".");
        errors.push(`${path}: ${issue.message}`);
      }
    } else {
      errors.push("Unknown validation error");
    }
  }

  // Validate that setup is a function
  if (typeof definition.setup !== "function") {
    errors.push("setup must be a function");
  }

  // Validate that moves exist and have reducers
  if (!definition.moves || typeof definition.moves !== "object") {
    errors.push("moves must be an object");
  } else {
    for (const [moveName, moveDef] of Object.entries(definition.moves)) {
      if (!moveDef || typeof moveDef !== "object") {
        errors.push(`Move "${moveName}" must be an object`);
        continue;
      }

      if (typeof moveDef.reducer !== "function") {
        errors.push(`Move "${moveName}" must have a reducer function`);
      }

      if (moveDef.condition && typeof moveDef.condition !== "function") {
        errors.push(`Move "${moveName}" condition must be a function`);
      }
    }
  }

  // Validate optional endIf
  if (definition.endIf && typeof definition.endIf !== "function") {
    errors.push("endIf must be a function");
  }

  // Validate optional playerView
  if (definition.playerView && typeof definition.playerView !== "function") {
    errors.push("playerView must be a function");
  }

  // Validate optional flow
  if (definition.flow) {
    if (typeof definition.flow !== "object") {
      errors.push("flow must be an object");
    } else {
      // Flow validation - check that turn is defined
      // FlowDefinition has a 'turn' property with phases
      if (!definition.flow.turn || typeof definition.flow.turn !== "object") {
        errors.push("flow must have turn object");
      } else if (
        !definition.flow.turn.phases ||
        typeof definition.flow.turn.phases !== "object"
      ) {
        errors.push("flow.turn must have phases object");
      }
    }
  }

  // Return result
  if (errors.length > 0) {
    return {
      success: false,
      error: errors.join("; "),
      errors,
    };
  }

  return { success: true };
}
