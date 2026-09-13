import type { FabDecisionContinuation } from "../../rules/process.ts";
import type { FabDecisionResumeContext, FabDecisionSubmitResult } from "./types.ts";
import {
  resumeLayerMode,
  resumeLayerTarget,
  resumeTriggerAdditionalCost,
} from "./continuations/layer.ts";
import {
  resumeReplacementKinds,
  resumeContinuousOrder,
  resumeReplacementCostTarget,
  resumeReplacementConsequenceTarget,
} from "./continuations/replacement.ts";
import {
  resumeActivationTarget,
  resumeActivationEquipDestination,
  resumeActivationX,
  resumeEffectResolution,
  resumeEffectPaymentAmount,
  resumeOptionalEffect,
  resumePayment,
  resumePlayCostTarget,
  resumePlayModeOrTarget,
  resumePlayX,
  resumeTurnArsenal,
  resumeTurnHeave,
  resumeTurnPitchOrder,
} from "./continuations/procedures.ts";
import { resumeTriggerFirstPlayer, resumeTriggerOrder } from "./continuations/triggers.ts";

type ContinuationResult = FabDecisionSubmitResult | "continue";
type ContinuationKind = FabDecisionContinuation["kind"];
type ContinuationHandler = (ctx: FabDecisionResumeContext) => ContinuationResult;

/**
 * The only continuation routing table. `satisfies Record` makes adding a
 * serialized continuation a compile-time error until its resume behavior is
 * registered here.
 */
const continuationRegistry = {
  "trigger-first-player": resumeTriggerFirstPlayer,
  "trigger-order": resumeTriggerOrder,
  "layer-mode": resumeLayerMode,
  "layer-target": resumeLayerTarget,
  "trigger-additional-cost": resumeTriggerAdditionalCost,
  "play-mode": resumePlayModeOrTarget,
  "play-target": resumePlayModeOrTarget,
  "play-x": resumePlayX,
  "play-cost-target": resumePlayCostTarget,
  "activation-target": resumeActivationTarget,
  "activation-equip-destination": resumeActivationEquipDestination,
  "activation-x": resumeActivationX,
  "replacement-player": resumeReplacementKinds,
  "replacement-first-player": resumeReplacementKinds,
  "replacement-cost-target": resumeReplacementCostTarget,
  "replacement-consequence-target": resumeReplacementConsequenceTarget,
  "replacement-order": resumeReplacementKinds,
  "journal-replacement-order": resumeReplacementKinds,
  "continuous-replacement-order": resumeReplacementKinds,
  "continuous-order": resumeContinuousOrder,
  "optional-effect": resumeOptionalEffect,
  "effect-payment-amount": resumeEffectPaymentAmount,
  payment: resumePayment,
  "effect-resolution": resumeEffectResolution,
  "turn-pitch-order": resumeTurnPitchOrder,
  "turn-heave": resumeTurnHeave,
  "turn-arsenal": resumeTurnArsenal,
} satisfies Record<ContinuationKind, ContinuationHandler>;

export function resumeFabDecisionContinuation(ctx: FabDecisionResumeContext): ContinuationResult {
  return continuationRegistry[ctx.decision.continuation.kind](ctx);
}
