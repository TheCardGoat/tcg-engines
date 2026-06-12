import { z } from "zod";

/**
 * Per-move Zod schemas for the LLM's `execute_move` tool. Covers the moves
 * a competent Lorcana agent realistically picks during a turn; debug /
 * manual moves are deliberately excluded so the model can't reach them.
 *
 * Each schema validates the payload that gets passed through to
 * `engine.dispatch(moveId, actorId, payload, context)`. The engine performs
 * the *real* legality check; the schema just keeps shape errors away from
 * the engine call.
 */

const cardInstanceId = z.string().min(1);
const playerId = z.string().min(1);

const playCardCost = z.union([
  z.object({ cost: z.literal("ink") }),
  z.object({
    cost: z.literal("shift"),
    /** Card the new card is being shifted onto. */
    shiftTargetId: cardInstanceId,
  }),
  z.object({
    cost: z.literal("free"),
  }),
  z.object({
    cost: z.literal("put-on-deck-bottom"),
    deckBottomTarget: cardInstanceId,
  }),
]);

const playCardArgs = z
  .object({
    cardId: cardInstanceId,
  })
  .and(playCardCost)
  .and(z.record(z.string(), z.unknown()));

const activateAbilityArgs = z.object({
  cardId: cardInstanceId,
  abilityIndex: z.number().int().min(0).optional(),
  abilityText: z.string().optional(),
  targets: z.unknown().optional(),
  effectSelections: z.unknown().optional(),
  choiceIndex: z.number().int().min(0).optional(),
  preventAutoResolveTriggeredEffects: z.boolean().optional(),
  costs: z
    .object({
      banishCharacters: z.array(cardInstanceId).optional(),
      banishItems: z.array(cardInstanceId).optional(),
      exertCharacters: z.array(cardInstanceId).optional(),
      exertItems: z.array(cardInstanceId).optional(),
      discardCards: z.array(cardInstanceId).optional(),
    })
    .optional(),
});

export const lorcanaMoveSchemas = {
  chooseWhoGoesFirst: z.object({ playerId }),
  alterHand: z.object({
    playerId,
    cardsToMulligan: z.array(cardInstanceId),
  }),
  putCardIntoInkwell: z.object({ cardId: cardInstanceId }),
  playCard: playCardArgs,
  quest: z.object({ cardId: cardInstanceId }),
  questWithAll: z.object({}).strict(),
  challenge: z.object({
    attackerId: cardInstanceId,
    defenderId: cardInstanceId,
  }),
  sing: z.object({
    singerId: cardInstanceId,
    songId: cardInstanceId,
  }),
  singTogether: z.object({
    singerIds: z.array(cardInstanceId).min(1),
    songId: cardInstanceId,
  }),
  moveCharacterToLocation: z.object({
    characterId: cardInstanceId,
    locationId: cardInstanceId,
  }),
  activateAbility: activateAbilityArgs,
  resolveBag: z.object({
    bagId: z.string().min(1),
    params: z.record(z.string(), z.unknown()).optional(),
  }),
  resolveEffect: z.object({
    effectId: z.string().min(1),
    params: z.unknown(),
  }),
  passTurn: z.object({}).strict(),
  concede: z.object({ playerId }),
} as const satisfies Record<string, z.ZodTypeAny>;

export type LorcanaMoveId = keyof typeof lorcanaMoveSchemas;

export function isLorcanaMoveId(moveId: string): moveId is LorcanaMoveId {
  return moveId in lorcanaMoveSchemas;
}

export function getLorcanaMoveIds(): LorcanaMoveId[] {
  return Object.keys(lorcanaMoveSchemas) as LorcanaMoveId[];
}

/**
 * Validate a move payload against its move-id schema. Returns a discriminated
 * result so the tool implementation can surface a clean error to the runner
 * without throwing.
 */
export function validateLorcanaMovePayload(
  moveId: string,
  payload: unknown,
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (!isLorcanaMoveId(moveId)) {
    return { ok: false, error: `Unknown Lorcana move id: ${moveId}` };
  }
  const schema = lorcanaMoveSchemas[moveId];
  const parsed = schema.safeParse(payload ?? {});
  if (!parsed.success) {
    return {
      ok: false,
      error: `Invalid payload for ${moveId}: ${parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    };
  }
  return { ok: true, value: parsed.data as Record<string, unknown> };
}
