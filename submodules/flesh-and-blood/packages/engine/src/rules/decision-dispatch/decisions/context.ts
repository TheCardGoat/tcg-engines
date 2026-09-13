import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabMatchState } from "../../../state.ts";
import type { FabRulesStackLayer } from "../../layers.ts";
import type { FabEventTransactionOptions } from "../../../kernel/process-runner/index.ts";
import type { FabUnansweredLayerDecision } from "../decision-types.ts";
import type { FabLayerResolutionResult } from "../result.ts";

export type LayerDecisionHelpers = {
  firstRequiredAtResolutionTarget: (effect: FabEffect) => unknown;
  failure: (state: FabMatchState, error: string, errorCode: string) => FabLayerResolutionResult;
  advance: (
    state: FabMatchState,
    layer: FabRulesStackLayer,
    options: FabEventTransactionOptions,
  ) => FabLayerResolutionResult;
};

export type LayerDecisionCtx<K extends FabUnansweredLayerDecision["kind"]> = {
  state: FabMatchState;
  layer: FabRulesStackLayer;
  process: NonNullable<FabMatchState["rulesProcess"]>;
  options: FabEventTransactionOptions;
  decision: Extract<FabUnansweredLayerDecision, { kind: K }>;
} & LayerDecisionHelpers;
