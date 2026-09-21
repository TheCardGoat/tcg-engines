import { proposeGrandArchiveCardActivation } from "../../activation/activation.ts";
import type { GrandArchiveCommandFailure } from "../../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../../commands/handler-context.ts";
import type { GrandArchiveProposedEvent } from "../../../kernel/events.ts";
import { GrandArchiveUnsupportedRuleError } from "../../effects/evaluation.ts";
import type { GrandArchiveObjectId } from "../../../game/identity.ts";
import { grandArchiveGrantedKeywordsForAction } from "../../../rules/state/rule-modifications.ts";
import { resumeGrandArchiveEffectResolution } from "../../effects/stack-resolution.ts";
import { GrandArchiveDecisionAnswerCodec } from "../answer-codec.ts";
import type { GrandArchiveDecisionResolver } from "../types.ts";

function glimpseFailure(
  match: GrandArchiveCommandHandlerContext,
  error: unknown,
): GrandArchiveCommandFailure {
  if (error instanceof GrandArchiveUnsupportedRuleError) {
    return match.failure("not-implemented", error.message);
  }
  if (error instanceof Error) return match.failure("illegal-command", error.message);
  throw error;
}

export const resolveGrandArchiveGlimpseDecision: GrandArchiveDecisionResolver<
  "resolve-glimpse"
> = ({ match, decision, command, playerId }) => {
  const state = match.getState();
  const resolution = state.resolution;
  if (!resolution || resolution.stackItemId !== decision.stackItemId) {
    return match.failure("illegal-command", "Effect resolution is no longer suspended");
  }
  const pending = resolution.pendingGlimpse;
  if (!pending || pending.cardIds.length !== decision.cardIds.length) {
    return match.failure("illegal-command", "Glimpse is no longer pending");
  }
  const answer = command.answer;
  if (typeof answer !== "object" || answer === null || Array.isArray(answer)) {
    return match.failure("illegal-command", "Glimpse answer must be an object");
  }
  const answerKind = "kind" in answer ? answer.kind : undefined;
  const currentDeck = state.zones[playerId]["main-deck"];
  if (decision.cardIds.some((id) => !currentDeck.includes(id))) {
    return match.failure("illegal-command", "A glimpsed card left the deck");
  }
  const original = state;
  const answers = new GrandArchiveDecisionAnswerCodec(match);
  try {
    const { pendingGlimpse: _pendingGlimpse, ...baseResolution } = resolution;
    const baseBindings = {
      ...resolution.bindings,
      ...(pending.bindResultAs ? { [pending.bindResultAs]: decision.cardIds } : {}),
    };
    let reordered: readonly GrandArchiveObjectId[];
    let resumed = { ...baseResolution, bindings: baseBindings };
    let loadEvents: readonly GrandArchiveProposedEvent[] = [];
    let activationEvents: readonly GrandArchiveProposedEvent[] = [];
    let deferredEvent: GrandArchiveProposedEvent | undefined;
    if (answerKind === "reorder") {
      const entries = Object.entries(answer);
      if (
        entries.some(
          ([key]) => key !== "kind" && key !== "loads" && key !== "top" && key !== "bottom",
        ) ||
        !("top" in answer) ||
        !("bottom" in answer) ||
        !Array.isArray(answer.top) ||
        !Array.isArray(answer.bottom) ||
        [...answer.top, ...answer.bottom].some((value) => typeof value !== "string")
      ) {
        throw new Error("Glimpse reorder must contain object-id top and bottom piles");
      }
      const loads = answers.parseAethercallingLoads("loads" in answer ? answer.loads : undefined);
      if (!loads) throw new Error("Glimpse loads must name cards and Aetherwing weapons");
      loadEvents = answers.proposeAethercallingLoadEvents(loads, decision.cardIds, playerId);
      const loadedCardIds = new Set(loads.map((load) => load.cardId));
      const remainingLookedCards = decision.cardIds.filter(
        (objectId) => !loadedCardIds.has(objectId),
      );
      const submitted = [...answer.top, ...answer.bottom];
      if (
        submitted.length !== remainingLookedCards.length ||
        new Set(submitted).size !== submitted.length ||
        submitted.some((id) => !remainingLookedCards.includes(id))
      ) {
        throw new Error("Glimpse piles must exactly partition the cards still being looked at");
      }
      const topIds = answers.parseKnownObjectIds(answer.top);
      const bottomIds = answers.parseKnownObjectIds(answer.bottom);
      if (!topIds || !bottomIds) throw new Error("Glimpse contains an unknown object");
      const looked = new Set(decision.cardIds);
      reordered = [...topIds, ...currentDeck.filter((id) => !looked.has(id)), ...bottomIds];
    } else if (answerKind === "starcall") {
      const parsed = answers.parseStarcallingAnswer(answer);
      if (!parsed || !decision.cardIds.includes(parsed.cardId)) {
        throw new Error("Starcalling must select an eligible looked-at card");
      }
      loadEvents = answers.proposeAethercallingLoadEvents(
        parsed.loads ?? [],
        decision.cardIds,
        playerId,
      );
      const loadedCardIds = new Set((parsed.loads ?? []).map((load) => load.cardId));
      if (loadedCardIds.has(parsed.cardId)) {
        throw new Error("A card cannot be both loaded and Starcalled");
      }
      const otherCards = decision.cardIds.filter(
        (id) => id !== parsed.cardId && !loadedCardIds.has(id),
      );
      if (
        parsed.bottom.length !== otherCards.length ||
        new Set(parsed.bottom).size !== parsed.bottom.length ||
        parsed.bottom.some((id) => !otherCards.includes(id))
      ) {
        throw new Error("Starcalling must put every other glimpsed card on the bottom");
      }
      const previewState =
        loadEvents.length > 0 ? match.getKernel().transact(state, loadEvents).state : state;
      const grantedStarcalling = grandArchiveGrantedKeywordsForAction(
        match.getProgram(),
        previewState,
        playerId,
        "glimpse",
        parsed.cardId,
      ).find((keyword) => keyword.name === "starcalling");
      const proposal = proposeGrandArchiveCardActivation(
        match.getProgram(),
        previewState,
        playerId,
        {
          move: "activate-card",
          cardId: parsed.cardId,
          activationMethod: "starcalling",
          ...(parsed.modeIds ? { modeIds: parsed.modeIds } : {}),
          ...(parsed.targets ? { targets: parsed.targets } : {}),
          ...(parsed.reservePayment ? { reservePayment: parsed.reservePayment } : {}),
          ...(parsed.revealForImbue !== undefined ? { revealForImbue: parsed.revealForImbue } : {}),
          ...(parsed.kindleCardIds ? { kindleCardIds: parsed.kindleCardIds } : {}),
          ...(parsed.paymentContributions
            ? { paymentContributions: parsed.paymentContributions }
            : {}),
          ...(parsed.costSelections ? { costSelections: parsed.costSelections } : {}),
          ...(parsed.costPaymentOrders ? { costPaymentOrders: parsed.costPaymentOrders } : {}),
          ...(parsed.costOptionIndex !== undefined
            ? { costOptionIndex: parsed.costOptionIndex }
            : {}),
          ...(parsed.payOptionalCost !== undefined
            ? { payOptionalCost: parsed.payOptionalCost }
            : {}),
          ...(parsed.prepareAbilityIndexes
            ? { prepareAbilityIndexes: parsed.prepareAbilityIndexes }
            : {}),
          ...(parsed.variables ? { variables: parsed.variables } : {}),
        },
        {
          starcalling: {
            cardIds: pending.cardIds,
            ...(grantedStarcalling ? { grantedKeyword: grantedStarcalling } : {}),
          },
        },
      );
      activationEvents = proposal.events.filter(
        (event) => event.type !== "stack-item-added" && event.type !== "opportunity-opened",
      );
      deferredEvent = {
        type: "stack-item-deferred",
        item: proposal.stackItem,
        actorId: playerId,
        cause: { kind: "rule", rule: "starcalling-deferred-resolution" },
      };
      resumed = {
        ...resumed,
        deferredStackItems: [...resolution.deferredStackItems, proposal.stackItem],
      };
      const looked = new Set(decision.cardIds);
      reordered = [...currentDeck.filter((id) => !looked.has(id)), ...parsed.bottom];
    } else {
      throw new Error("Glimpse answer kind must be reorder or starcall");
    }
    const committed = match.getKernel().transact(state, [
      {
        type: "decision-cleared",
        decisionId: decision.id,
        actorId: playerId,
        cause: { kind: "command", move: "answer-decision" },
      },
      ...loadEvents,
      ...activationEvents,
      {
        type: "zone-reordered",
        playerId,
        zone: "main-deck",
        objectIds: reordered,
        actorId: playerId,
        cause: { kind: "rule", rule: "glimpse-order-chosen" },
      },
      {
        type: "keyword-action-performed",
        action: "glimpse",
        glimpseStage: "complete",
        playerId,
        objectIds: decision.cardIds,
        actorId: playerId,
        cause: { kind: "rule", rule: "glimpse-performed" },
      },
      ...(deferredEvent ? [deferredEvent] : []),
    ]);
    match.replaceState(committed.state);
    const continuation = resumeGrandArchiveEffectResolution(
      match.getProgram(),
      match.getState(),
      match.getKernel(),
      resumed,
    );
    match.replaceState(continuation.state);
    const events = [...committed.result.events, ...continuation.events];
    if (continuation.paused) return { ok: true, state: match.getState(), events };
    return match.stabilize(events, continuation.triggerEvents);
  } catch (error) {
    match.replaceState(original);
    return glimpseFailure(match, error);
  }
};

export const grandArchiveGlimpseDecisionResolvers = {
  "resolve-glimpse": resolveGrandArchiveGlimpseDecision,
} satisfies {
  readonly "resolve-glimpse": GrandArchiveDecisionResolver<"resolve-glimpse">;
};
