import { effectLogger } from "./effect-logger";

export class UnsupportedActionEffectError extends Error {
  readonly code = "UNSUPPORTED_ACTION_EFFECT";

  constructor(
    readonly effectType: string,
    readonly reason: string,
  ) {
    super(`[${effectType}] ${reason}`);
    this.name = "UnsupportedActionEffectError";
  }
}

function shouldFailFastForUnsupportedEffects(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function handleUnsupportedActionEffect(effectType: string, reason: string): void {
  const error = new UnsupportedActionEffectError(effectType, reason);
  if (shouldFailFastForUnsupportedEffects()) {
    throw error;
  }

  effectLogger.warn(error.message);
}
