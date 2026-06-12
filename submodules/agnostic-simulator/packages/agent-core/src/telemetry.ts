import type { TurnTelemetry } from "./types";

/**
 * Resolve span attributes for the runner's outer span. Kept here (rather than
 * inlined into the runner) so callers can re-stamp the same attributes onto
 * their own enclosing spans without duplicating the key list.
 */
export function turnSpanAttributes(telemetry: TurnTelemetry): Record<string, string | number> {
  return {
    "agent.provider": telemetry.provider,
    "agent.model": telemetry.model,
    "agent.game": telemetry.gameSlug,
    "agent.outcome": telemetry.outcome,
    "agent.tools_used": telemetry.toolsUsed.join(","),
    "agent.duration_ms": telemetry.durationMs,
    "agent.tokens_in": telemetry.tokensIn,
    "agent.tokens_out": telemetry.tokensOut,
  };
}
