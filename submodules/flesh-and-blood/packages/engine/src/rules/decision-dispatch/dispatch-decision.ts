import type { FabMatchState } from "../../state.ts";
import type { FabRulesStackLayer } from "../layers.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { assertNever } from "../evaluation/assert-never.ts";
import type { FabUnansweredLayerDecision } from "./decision-types.ts";
import type { FabLayerResolutionResult } from "./result.ts";
import type { LayerDecisionHelpers } from "./decisions/context.ts";
import { handleOptional } from "./decisions/optional.ts";
import { handleOpt } from "./decisions/opt.ts";
import { handleReorderDeck } from "./decisions/reorder-deck.ts";
import { handleChoice } from "./decisions/choice.ts";
import { handleSearch } from "./decisions/search.ts";
import { handleTarget } from "./decisions/target.ts";
import { handleNameCard } from "./decisions/name-card.ts";
import { handleChooseColor } from "./decisions/choose-color.ts";
import { handleGuessMatch } from "./decisions/guess-match.ts";
import { handleChooseOption } from "./decisions/choose-option.ts";
import { handleChooseNumber } from "./decisions/choose-number.ts";
import { handleChooseAndCreateToken } from "./decisions/choose-and-create-token.ts";
import { handleGroupChoice } from "./decisions/group-choice.ts";
import { handleMoveCounterSelection } from "./decisions/move-counter-selection.ts";
import { handlePayment, handlePaymentAmount, handlePaymentCommit } from "./decisions/payment.ts";

export type LayerDecisionDispatchCtx = {
  state: FabMatchState;
  layer: FabRulesStackLayer;
  process: NonNullable<FabMatchState["rulesProcess"]>;
  options: FabEventTransactionOptions;
  decision: FabUnansweredLayerDecision;
} & LayerDecisionHelpers;

export function dispatchLayerDecision(ctx: LayerDecisionDispatchCtx): FabLayerResolutionResult {
  switch (ctx.decision.kind) {
    case "payment-amount":
      return handlePaymentAmount({ ...ctx, decision: ctx.decision });
    case "payment-commit":
      return handlePaymentCommit({ ...ctx, decision: ctx.decision });
    case "payment":
      return handlePayment({ ...ctx, decision: ctx.decision });
    case "optional":
      return handleOptional({ ...ctx, decision: ctx.decision });
    case "opt":
      return handleOpt({ ...ctx, decision: ctx.decision });
    case "reorder-deck":
      return handleReorderDeck({ ...ctx, decision: ctx.decision });
    case "group-choice":
      return handleGroupChoice({ ...ctx, decision: ctx.decision });
    case "choice":
      return handleChoice({ ...ctx, decision: ctx.decision });
    case "name-card":
      return handleNameCard({ ...ctx, decision: ctx.decision });
    case "choose-color":
      return handleChooseColor({ ...ctx, decision: ctx.decision });
    case "guess-match":
      return handleGuessMatch({ ...ctx, decision: ctx.decision });
    case "move-counter-selection":
      return handleMoveCounterSelection({ ...ctx, decision: ctx.decision });
    case "choose-option":
      return handleChooseOption({ ...ctx, decision: ctx.decision });
    case "choose-number":
      return handleChooseNumber({ ...ctx, decision: ctx.decision });
    case "choose-and-create-token":
      return handleChooseAndCreateToken({ ...ctx, decision: ctx.decision });
    case "search":
      return handleSearch({ ...ctx, decision: ctx.decision });
    case "target":
      return handleTarget({ ...ctx, decision: ctx.decision });
    default:
      return assertNever(ctx.decision, "FabUnansweredLayerDecision.kind");
  }
}
