import type { FabMoveName } from "../../moves.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";

export interface FabLegalCommandSource {
  enumerateMoves(actorId: string): readonly FabMoveName[];
  getState(): FabRulesSnapshot;
}

/**
 * A fully-instantiated legal command: move name + payload ready for
 * {@link FabMatchRuntime.dispatch}. Strategies choose among these.
 */
export interface FabLegalCommand {
  readonly move: FabMoveName;
  readonly payload: Record<string, unknown>;
  /** Short human-readable label for UI / logging. */
  readonly label: string;
  /** Player-owned configuration is legal UI, but never a bot action candidate. */
  readonly automation?: "player-only";
  /** Card that owns a context-only command whose payload is canonical, not instance-scoped. */
  readonly sourceInstanceId?: string;
  /** Legal Instant use that a per-canonical-card yield may ignore during automation proof. */
  readonly priorityYield?: {
    readonly kind: "instant-use";
    readonly canonicalId: string;
  };
}

export function botEligibleFabCommands(commands: readonly FabLegalCommand[]): FabLegalCommand[] {
  return commands.filter((command) => command.automation !== "player-only");
}

export interface ListLegalCommandsOptions {
  /** Include concede in the candidate list (default false). Last-resort bots opt in. */
  readonly includeConcede?: boolean;
  /** Optional caller cap on multi-card defend sets; defaults to all legal sizes. */
  readonly maxDefendSetSize?: number;
}

interface LegalCommandEvaluationContext {
  readonly stateID: number;
  readonly view: FabRulesView;
}

export const LEGAL_COMMAND_EVALUATION_CONTEXT = new WeakMap<
  readonly FabLegalCommand[],
  LegalCommandEvaluationContext
>();

/** Reuse authoritative activation prices without putting rules objects in command payloads. */
export const LEGAL_ACTIVATION_QUOTES = new WeakMap<
  FabLegalCommand,
  {
    readonly quote: import("../../procedures/activate-ability/types.ts").FabActivationQuote;
    readonly isAttack: boolean;
  }
>();

export function activationQuoteForCommand(command: FabLegalCommand) {
  return LEGAL_ACTIVATION_QUOTES.get(command);
}

/**
 * Reuse the exact evaluated view that produced a command list while its state
 * version remains current. This is deliberately scoped to the returned array:
 * it is not a state cache and cannot survive a dispatch under the same object.
 */
export function rulesViewForLegalCommands(
  legalCommands: readonly FabLegalCommand[],
  stateID: number,
): FabRulesView | null {
  const context = LEGAL_COMMAND_EVALUATION_CONTEXT.get(legalCommands);
  return context?.stateID === stateID ? context.view : null;
}
