import { isFabAmount, isQuantifier, isUpToCount } from "@tcg/flesh-and-blood-types";

import type { CommittedEvent } from "./rules/events.ts";
import { evaluateCanonicalCondition } from "./rules/condition-evaluator.ts";
import { buildFabRulesView, resolveFabEventBindings } from "./rules/state-rules-view.ts";
import { triggerIsPrevented } from "./rules/trigger-prevention.ts";
import type { FabPlayerLogFact } from "./player-log.ts";
import { commitFabKernelBatch, commitFabKernelBatchDraft } from "./kernel/commit.ts";
import { publishFabKernelReceipt, type FabKernelEventSink } from "./kernel/transaction-kernel.ts";
import type { FabEventTransactionOptions } from "./kernel/process-runner/index.ts";
import {
  resumeAbilityStepAfterJournal,
  resumeEffectPaymentAfterJournal,
} from "./procedures/layer-resolution/index.ts";
import { advanceFabTurnProcedure } from "./procedures/turn/index.ts";
import { legalFabDecisionTargets } from "./runtime-targets.ts";
import { isFabStateDraft } from "./copy-on-write.ts";
import { nextRandom } from "./random.ts";
import type { FabMatchState } from "./state.ts";

/**
 * The engine-owned wiring of `FabEventTransactionOptions`.
 *
 * This is the single place the kernel's service ports (trigger evaluation,
 * amount evaluation, deterministic randomness, procedure resume, legal
 * targets, turn-procedure advance) are bound to their implementations. The
 * runtime passes event/log sinks; everything else is fixed engine policy.
 */
export function fabRulesTransactionOptions(
  onCommittedEvents: (events: readonly CommittedEvent[]) => void,
  onPlayerLogFacts: (facts: readonly FabPlayerLogFact[]) => void = () => {},
  onCommittedReceipt?: FabKernelEventSink["onCommittedReceipt"],
): FabEventTransactionOptions {
  const options: FabEventTransactionOptions = {
    triggerContext: {
      evaluateStateCondition: evaluateCanonicalCondition,
      isTriggerPrevented: triggerIsPrevented,
    },
    resumeAbilityStep: (state, continuation, committedEvents) =>
      resumeAbilityStepAfterJournal(state, continuation, options, committedEvents),
    resumeEffectPayment: (state, continuation, events) =>
      resumeEffectPaymentAfterJournal(state, continuation, options, events),
    onCommittedEvents,
    onPlayerLogFacts,
    ...(onCommittedReceipt ? { onCommittedReceipt } : {}),
    legalTargets: legalFabDecisionTargets,
    evaluateAmount: (state, amount, pending) => {
      if (typeof amount === "number") return amount;
      if (isQuantifier(amount)) return Number.POSITIVE_INFINITY;
      if (isUpToCount(amount)) {
        return typeof amount.amount === "number"
          ? amount.amount
          : options.evaluateAmount(state, amount.amount, pending);
      }
      if (!isFabAmount(amount)) return null;
      try {
        const resolved = buildFabRulesView(state).evaluateAmount(amount, {
          controllerId: pending.controllerId,
          source: pending.source.ref,
          bindings: resolveFabEventBindings(pending.bindings),
        }).value;
        return typeof resolved === "number" && Number.isFinite(resolved) ? resolved : null;
      } catch {
        return null;
      }
    },
    randomIndex: (state, maxExclusive) => {
      if (maxExclusive <= 0) return 0;
      const roll = nextRandom(state.rngState);
      const result = Math.floor(roll.value * maxExclusive);
      const process = state.rulesProcess;
      if (!process) throw new Error("FAB random selection requires a persisted rules process.");
      const event = {
        name: "consume-random-index" as const,
        processId: process.processId,
        cause: {
          kind: "rule" as const,
          rule: "deterministic random selection",
          controllerId: state.activePlayerId,
        },
        controllerId: state.activePlayerId,
        source: null,
        affected: [],
        bindings: {},
        data: { maxExclusive, result },
      };
      const committed = isFabStateDraft(state)
        ? commitFabKernelBatchDraft(state, [event])
        : commitFabKernelBatch(state, [event], {
            onCommittedEvents: options.onCommittedEvents,
            onPlayerLogFacts: options.onPlayerLogFacts,
            onCommittedReceipt: options.onCommittedReceipt,
          });
      if (!committed.batch) throw new Error("FAB random selection could not be committed.");
      if ("state" in committed) {
        Object.assign(state, committed.state);
        state.rulesProcess = process;
      } else {
        publishFabKernelReceipt(options, committed.events, committed.playerLogFacts);
      }
      return result;
    },
    advanceProcedure: (state) => advanceFabTurnProcedure(state, options),
  };
  return options;
}
