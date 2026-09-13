import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabCommandFor } from "./command-router.ts";
import { eligibleOptionalTriggerSources } from "../rules/optional-trigger-automation.ts";

export interface FabOptionalTriggerAutomationDecisionContext {
  readonly decision: NonNullable<FabRulesSnapshot["decision"]> & { readonly kind: "boolean" };
  readonly sourceInstanceId: string;
}

/**
 * Resolve the one owner-controlled triggered layer whose active yes/no prompt
 * may be answered while saving an automation preference.
 */
export function optionalTriggerAutomationDecisionContext(
  state: FabRulesSnapshot,
  actorId: string,
): FabOptionalTriggerAutomationDecisionContext | null {
  const decision = state.decision;
  if (
    decision?.kind !== "boolean" ||
    decision.actorId !== actorId ||
    decision.continuation.kind !== "optional-effect" ||
    !decision.source ||
    decision.source.ownerId !== actorId
  )
    return null;

  const resolvingLayerId = state.rulesProcess?.resolvingLayerId;
  const layer = resolvingLayerId
    ? state.rulesStack.find((candidate) => candidate.layerId === resolvingLayerId)
    : undefined;
  if (
    layer?.kind !== "triggered" ||
    layer.controllerId !== actorId ||
    layer.source.ownerId !== actorId ||
    layer.source.instanceId !== decision.source.instanceId ||
    !eligibleOptionalTriggerSources(state, actorId).some(
      (source) => source.source.instanceId === layer.source.instanceId,
    )
  )
    return null;

  return { decision, sourceInstanceId: layer.source.instanceId };
}

export function isActiveOptionalTriggerAutomationCommand(
  state: FabRulesSnapshot,
  actorId: string,
  command: FabCommandFor<"set-optional-trigger-automation">,
): boolean {
  const context = optionalTriggerAutomationDecisionContext(state, actorId);
  return (
    context !== null &&
    command.decision?.decisionId === context.decision.decisionId &&
    command.decision.stateVersion === context.decision.stateVersion &&
    command.instanceId === context.sourceInstanceId &&
    (command.mode === "auto-accept" || command.mode === "auto-decline")
  );
}
