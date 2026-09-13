import { GrandArchiveUnsupportedRuleError } from "../../procedures/effects/evaluation.ts";
import type { GrandArchiveCommandFailure } from "../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../handler-context.ts";

export function grandArchiveActivationFailure(
  context: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return context.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return context.failure("illegal-command", error.message);
  let detail: string;
  try {
    detail = typeof error === "string" ? error : JSON.stringify(error);
  } catch {
    detail = String(error);
  }
  return context.failure("illegal-command", detail || String(error));
}
