/**
 * Zod validation schema for GameDefinition
 */

import { z } from "zod";
import type { GameDefinition } from "./game-definition";

/**
 * Zod schema for validating GameDefinition structure
 */
const gameDefinitionSchema = z.object({
  name: z.string().min(1, "Game name must not be empty"),
  minPlayers: z
    .number()
    .int()
    .positive("minPlayers must be a positive integer"),
  maxPlayers: z
    .number()
    .int()
    .positive("maxPlayers must be a positive integer"),
  setup: z.function(),
  moves: z.record(z.string(), z.any()).refine((moves) => {
    return Object.keys(moves).length > 0;
  }, "At least one move must be defined"),
  flow: z.object({
    id: z.string(),
    initial: z.string(),
    states: z.record(z.string(), z.any()),
  }),
  endIf: z.function().optional(),
  playerView: z.function().optional(),
});

/**
 * Additional validation beyond schema
 */
const validateAdditionalRules = <
  TState,
  TMoves extends Record<string, unknown>,
>(
  definition: GameDefinition<TState, TMoves>,
): string | null => {
  // Validate maxPlayers >= minPlayers
  if (definition.maxPlayers < definition.minPlayers) {
    return "maxPlayers must be greater than or equal to minPlayers";
  }

  // Validate state ID uniqueness
  const stateIds = Object.keys(definition.flow.states);
  const uniqueStateIds = new Set(stateIds);
  if (stateIds.length !== uniqueStateIds.size) {
    return "State IDs must be unique within flow";
  }

  // Validate initial state exists
  if (!definition.flow.states[definition.flow.initial]) {
    return `Initial state '${definition.flow.initial}' does not exist in states`;
  }

  return null;
};

/**
 * Validate a GameDefinition using Zod schema and additional rules
 * @param definition - GameDefinition to validate
 * @returns Validation result
 */
export const validateGameDefinition = <
  TState,
  TMoves extends Record<string, unknown>,
>(
  definition: unknown,
):
  | { success: true; data: GameDefinition<TState, TMoves> }
  | { success: false; error: string } => {
  // First, validate with Zod schema
  const schemaResult = gameDefinitionSchema.safeParse(definition);

  if (!schemaResult.success) {
    const errors = schemaResult.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    return {
      success: false,
      error: errors,
    };
  }

  // Then validate additional rules
  const additionalError = validateAdditionalRules(
    definition as GameDefinition<TState, TMoves>,
  );

  if (additionalError) {
    return {
      success: false,
      error: additionalError,
    };
  }

  return {
    success: true,
    data: definition as GameDefinition<TState, TMoves>,
  };
};
