import { logBrowserError, logBrowserInfo, logBrowserWarn } from "../../observability/browser";

interface FabPracticeCommandContext {
  readonly actorId: string;
  readonly commandLabel: string;
  readonly commandMove: string;
  readonly stateID: number;
  readonly turnNumber: number;
}

function commandAttributes(context: FabPracticeCommandContext) {
  return {
    "fab.actor_id": context.actorId,
    "fab.command.label": context.commandLabel,
    "fab.command.move": context.commandMove,
    "fab.state_id": context.stateID,
    "fab.turn_number": context.turnNumber,
  };
}

export function reportFabPracticeCommandSubmitted(
  context: FabPracticeCommandContext & { readonly commandId: string },
): void {
  const details = {
    ...commandAttributes(context),
    "fab.command.id": context.commandId,
  };
  console.info("[fab-practice] engine command submitted", details);
  logBrowserInfo("fab.practice.command_submitted", details);
}

export function runFabPracticePostCommandWork(input: {
  readonly commandId: string;
  readonly stage: "animation" | "analytics" | "persistence" | "presentation" | "telemetry";
  readonly work: () => void;
}): void {
  try {
    input.work();
  } catch (error) {
    const exception =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { name: "UnknownError", message: String(error), stack: undefined };
    const details = {
      "fab.command.id": input.commandId,
      "fab.post_command.stage": input.stage,
      "exception.type": exception.name,
      "exception.message": exception.message,
      ...(exception.stack ? { "exception.stacktrace": exception.stack } : {}),
    };
    console.error("[fab-practice] non-blocking post-command task failed", details);
    logBrowserError("fab.practice.post_command_failure", details);
  }
}

export function reportFabPracticeRulesReversal(
  context: FabPracticeCommandContext & {
    readonly action: "play-card" | "activate";
    readonly reasonCode: string;
    readonly reasonMessage: string;
  },
): void {
  const details = {
    ...commandAttributes(context),
    "fab.reversal.action": context.action,
    "fab.reversal.reason_code": context.reasonCode,
    "fab.reversal.reason_message": context.reasonMessage,
    "log.message": context.reasonMessage,
  };
  console.warn("[fab-practice] rules action reversed", details);
  logBrowserWarn("fab.practice.rules_action_reversed", details);
}

export function reportFabPracticeCommandFailure(
  context: FabPracticeCommandContext & {
    readonly error: string;
    readonly errorCode?: string;
  },
): void {
  const details = {
    ...commandAttributes(context),
    "error.message": context.error,
    "log.message": context.error,
    ...(context.errorCode ? { "error.code": context.errorCode } : {}),
  };
  console.error("[fab-practice] command rejected", details);
  logBrowserError("fab.practice.command_rejected", details);
}

export function reportFabPracticeDispatchException(
  context: FabPracticeCommandContext,
  error: unknown,
): void {
  const exception =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { name: "UnknownError", message: String(error), stack: undefined };
  const details = {
    ...commandAttributes(context),
    "exception.type": exception.name,
    "exception.message": exception.message,
    ...(exception.stack ? { "exception.stacktrace": exception.stack } : {}),
  };
  console.error("[fab-practice] dispatch failed", details);
  logBrowserError("fab.practice.dispatch_exception", details);
}
