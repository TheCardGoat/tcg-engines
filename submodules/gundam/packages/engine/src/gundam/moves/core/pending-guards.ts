/**
 * Pending-effect error code (rule 5-2 / 10-1-6).
 *
 * The uniform guard is now applied by the runtime via
 * `MoveDefinition.gatedByPendingEffects` (see `types/move-types.ts` and
 * `runtime/match-runtime.validation.ts`); moves no longer call a
 * per-move helper. This module only exports the error-code constant so
 * existing rejection paths and the typed-error catalog keep referencing
 * a single canonical symbol.
 */

export const EFFECT_PENDING_ERROR_CODE = "EFFECT_PENDING";
