import type { RuntimeValidationResult } from "#core";
import {
  EFFECT_PENDING_ERROR_CODE,
  hasPendingActionEffectResolution,
} from "../runtime-moves/resolution/action-effects/pending-action-effects";
import { hasPendingBagItems } from "../runtime-moves/effects/triggered-abilities";

type Failure = Extract<RuntimeValidationResult, { valid: false }>;

type Ctx = Parameters<typeof hasPendingActionEffectResolution>[0] &
  Parameters<typeof hasPendingBagItems>[0];

/**
 * Common guard used by many move `validate` functions. Returns a structured
 * failure when an action effect or bag effect is still pending; otherwise
 * returns null so the caller can keep validating.
 *
 * Pass `actionLabel` (e.g. "challenge", "quest", "ink cards") to interpolate
 * into the default error messages, or pass full custom messages.
 */
export function validateNoPendingEffects(
  ctx: Ctx,
  options: {
    actionLabel?: string;
    actionEffectError?: string;
    bagError?: string;
  } = {},
): Failure | null {
  if (hasPendingActionEffectResolution(ctx)) {
    return {
      valid: false,
      error:
        options.actionEffectError ??
        `Cannot ${options.actionLabel ?? "act"} while an action effect is pending`,
      errorCode: EFFECT_PENDING_ERROR_CODE,
    };
  }

  if (hasPendingBagItems(ctx)) {
    return {
      valid: false,
      error:
        options.bagError ?? `Cannot ${options.actionLabel ?? "act"} while bag effects are pending`,
      errorCode: "BAG_PENDING",
    };
  }

  return null;
}

export function hasAnyPendingEffects(ctx: Ctx): boolean {
  return hasPendingActionEffectResolution(ctx) || hasPendingBagItems(ctx);
}
