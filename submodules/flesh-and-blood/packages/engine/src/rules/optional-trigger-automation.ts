import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { snapshotFunctionalTriggerSources } from "./snapshots.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";
import { isEligibleOptionalTriggerSource } from "./optional-trigger-eligibility.ts";

export {
  isEligibleOptionalTriggerSource,
  resolutionContainsControllerOptional,
} from "./optional-trigger-eligibility.ts";

export function eligibleOptionalTriggerSources(
  state: FabRulesSnapshot,
  ownerId: string,
): readonly FabTriggerSource[] {
  return snapshotFunctionalTriggerSources(state).filter(
    (source) =>
      source.source.ownerId === ownerId &&
      source.controllerId === ownerId &&
      isEligibleOptionalTriggerSource(source),
  );
}

export function sourceHasOptionalTriggerAutomation(
  state: FabRulesSnapshot,
  ownerId: string,
  instanceId: string,
): boolean {
  return state.optionalTriggerAutomation[ownerId]?.[instanceId] !== undefined;
}

export interface FabAutomaticTriggerPass {
  readonly actorId: string;
  readonly cardName: string;
}

/**
 * Consume only the owner's priority while the exact latched trigger remains
 * on top. These are internal authoritative transitions, never client moves.
 */
export function drainOptionalTriggerAutomation(
  getState: () => FabRulesSnapshot,
  passPriority: (
    actorId: string,
  ) => { readonly accepted: true } | { readonly accepted: false; readonly error: string },
): readonly FabAutomaticTriggerPass[] {
  const automaticPasses: FabAutomaticTriggerPass[] = [];
  const guard = createFabLoopGuard({ label: "runtime: optional trigger automation drain" });
  while (true) {
    const state = getState();
    if (state.gameEnded || state.decision) break;
    const topLayer = state.rulesStack?.at(-1);
    if (topLayer?.kind !== "triggered") break;
    const automation = topLayer.optionalTriggerAutomation;
    if (!automation?.autoPassWhileTop) break;
    if (state.priority?.holderPlayerId !== automation.ownerId) break;

    guard.tick();
    const passResult = passPriority(automation.ownerId);
    if (!passResult.accepted) {
      throw new Error(`Optional trigger automation could not pass priority: ${passResult.error}`);
    }
    automaticPasses.push({
      actorId: automation.ownerId,
      cardName:
        topLayer.source.current.names.join(" // ") ||
        topLayer.source.canonicalId ||
        "triggered ability",
    });
  }
  return automaticPasses;
}
