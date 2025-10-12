import type { GameMoveDefinition } from "../game-definition/move-definitions";

/**
 * Create a type-safe move definition with proper parameter narrowing
 *
 * This helper ensures that move parameters are correctly narrowed to the specific
 * move's parameter type, avoiding TypeScript's limitations with module boundary
 * type inference.
 *
 * @template TState - Game state type
 * @template TMoves - Record of move names to parameter types
 * @template K - Specific move name (keyof TMoves)
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @param definition - The move definition (reducer, condition, metadata)
 * @returns The same move definition with proper type narrowing
 *
 * @example
 * ```typescript
 * type GameMoves = {
 *   quest: { cardId: string };
 *   playCard: { cardId: string; cost: number };
 * };
 *
 * export const quest = createMove<GameState, GameMoves, "quest", CardMeta>({
 *   condition: (state, context) => {
 *     const { cardId } = context.params; // ✅ Typed as { cardId: string }
 *     return true;
 *   },
 *   reducer: (draft, context) => {
 *     const { cardId } = context.params; // ✅ Typed as { cardId: string }
 *     // Implementation...
 *   }
 * });
 * ```
 *
 * **Why this is needed**:
 * Without this helper, when you export a move with an explicit type annotation:
 * ```typescript
 * export const quest: MoveDefinition<GameState, GameMoves, CardMeta> = {...}
 * ```
 * TypeScript sees `context.params` as the full `GameMoves` type union, not just
 * the narrowed `GameMoves["quest"]` type.
 *
 * This helper uses TypeScript's generic inference to properly narrow the type
 * at the definition site, avoiding module boundary issues.
 */
export function createMove<
  TState,
  TMoves extends Record<string, any>,
  K extends keyof TMoves,
  TCardMeta = any,
  TCardDefinition = any,
>(
  definition: GameMoveDefinition<
    TState,
    TMoves[K], // ✅ Narrow to specific move's params
    TCardMeta,
    TCardDefinition
  >,
): GameMoveDefinition<TState, TMoves[K], TCardMeta, TCardDefinition> {
  return definition;
}
