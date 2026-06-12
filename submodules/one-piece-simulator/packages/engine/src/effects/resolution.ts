import { getCard } from "../../../cards/src/index.ts";
import type { EffectBlock } from "@tcg/op-types";
import {
  cardName,
  effectBlocksFor,
  emitEvent,
  emitLog,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getPlayer,
  recordCapabilityIssue,
} from "../shared.ts";
import { createChoicePrompt, enqueueJudgePrompt } from "../state.ts";
import type { GameCommand, MatchSeat, MatchState, PromptState, ResolutionItem } from "../types.ts";
import { processEffectAction, payCosts } from "./actions.ts";
import { evaluateConditions } from "./conditions.ts";

export function enqueueEffectsForTrigger(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  trigger: EffectBlock["trigger"],
  trashHandIds: string[] | undefined,
) {
  const source = getInstance(state, sourceInstanceId);
  const card = getCard(source.cardId);
  const blocks = effectBlocksFor(card, trigger);

  if (!blocks.length) {
    return;
  }

  for (const [index, block] of blocks.entries()) {
    const effectKey = `${trigger}:${index}`;
    if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey)) {
      continue;
    }

    enqueueResolution(state, {
      kind: "effectBlock",
      sourceInstanceId,
      controller,
      trigger,
      blockIndex: index,
      trashHandIds,
    });
  }
}

export function processEffectBlock(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectBlock" }>,
) {
  const source = getInstance(state, item.sourceInstanceId);
  const card = getCard(source.cardId);
  const block = effectBlocksFor(card, item.trigger)[item.blockIndex];

  if (!block) {
    return;
  }

  const effectKey = `${item.trigger}:${item.blockIndex}`;
  if (block.oncePerTurn && source.usedEffectKeys.includes(effectKey)) {
    return;
  }

  const conditions = evaluateConditions(
    state,
    item.controller,
    item.sourceInstanceId,
    block.conditions,
  );
  if (!conditions.supported) {
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedCondition",
      code: `condition:${item.trigger}:${item.blockIndex}`,
      actor: item.controller,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      details: `${cardName(card)} uses an effect condition that is not automated yet.`,
    });
    enqueueJudgePrompt(
      state,
      item.sourceInstanceId,
      "Judge review: unsupported effect condition",
      `${cardName(card)} uses a condition that is not automated yet.`,
      { issueId: issue.id },
    );
    return;
  }
  if (!conditions.matches) {
    return;
  }

  if (block.optional && !item.confirmed) {
    createChoicePrompt(state, {
      choiceKind: "confirm",
      seat: item.controller,
      label: `${cardName(card)} has an optional effect`,
      details: `Activate ${item.trigger} effect?`,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: [
        { id: "yes", label: "Activate", value: "yes" },
        { id: "no", label: "Skip", value: "no" },
      ],
      minSelections: 0,
      maxSelections: 1,
      context: {
        trigger: item.trigger,
      },
      resolutionContext: {
        intent: "effectOptional",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        trashHandIds: item.trashHandIds,
      },
    });
    return;
  }

  const trashFromHandCost = block.costs?.find((cost) => cost.cost === "trashFromHand");
  if (
    trashFromHandCost &&
    !item.trashHandIds &&
    getPlayer(state, item.controller).hand.length > trashFromHandCost.amount
  ) {
    const player = getPlayer(state, item.controller);
    createChoicePrompt(state, {
      choiceKind: "costPayment",
      seat: item.controller,
      label: `${cardName(card)} cost payment`,
      details: `Choose ${trashFromHandCost.amount} card(s) to trash from hand.`,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      options: player.hand.map((instanceId) => ({
        id: instanceId,
        label: cardName(getCardForInstance(state, instanceId)),
        value: instanceId,
        targetId: instanceId,
      })),
      minSelections: trashFromHandCost.amount,
      maxSelections: trashFromHandCost.amount,
      context: {
        cost: "trashFromHand",
      },
      resolutionContext: {
        intent: "effectCostTrashFromHand",
        sourceInstanceId: item.sourceInstanceId,
        controller: item.controller,
        trigger: item.trigger,
        blockIndex: item.blockIndex,
        amount: trashFromHandCost.amount,
        candidateIds: [...player.hand],
      },
    });
    return;
  }

  if (!payCosts(state, item.controller, item.sourceInstanceId, block.costs, item.trashHandIds)) {
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedCost",
      code: `cost:${item.trigger}:${item.blockIndex}`,
      actor: item.controller,
      sourceCardId: source.cardId,
      sourceInstanceId: item.sourceInstanceId,
      eventId: null,
      details: `${cardName(card)} has costs that could not be paid automatically.`,
    });
    enqueueJudgePrompt(
      state,
      item.sourceInstanceId,
      "Judge review: effect costs",
      `${cardName(card)} has costs that could not be paid automatically.`,
      { issueId: issue.id },
    );
    return;
  }

  if (block.oncePerTurn) {
    source.usedEffectKeys.push(effectKey);
  }

  emitEvent(state, "effectResolved", item.controller, {
    sourceCardId: source.cardId,
    sourceInstanceId: item.sourceInstanceId,
    visibility: "public",
    data: {
      trigger: item.trigger,
    },
  });
  emitLog(state, item.controller, `${cardName(card)} resolves its ${item.trigger} effect.`, {
    sourceCardId: source.cardId,
    sourceInstanceId: item.sourceInstanceId,
    visibility: "public",
  });

  for (const action of [...block.actions].reverse()) {
    enqueueResolution(state, {
      kind: "effectAction",
      sourceInstanceId: item.sourceInstanceId,
      controller: item.controller,
      action,
    });
  }
}

export function processQueuedEffectAction(
  state: MatchState,
  item: Extract<ResolutionItem, { kind: "effectAction" }>,
) {
  processEffectAction(
    state,
    item.controller,
    item.sourceInstanceId,
    item.action,
    item.selectedTargetIds,
  );
}

export function resolveEffectChoicePrompt(
  state: MatchState,
  prompt: PromptState,
  command: Extract<GameCommand, { type: "resolvePrompt" }>,
): boolean {
  switch (prompt.resolutionContext?.intent) {
    case "effectOptional":
      if (command.optionId === "yes") {
        enqueueResolution(state, {
          kind: "effectBlock",
          sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
          controller: prompt.resolutionContext.controller,
          trigger: prompt.resolutionContext.trigger,
          blockIndex: prompt.resolutionContext.blockIndex,
          trashHandIds: prompt.resolutionContext.trashHandIds,
          confirmed: true,
        });
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the optional effect.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      return true;
    case "effectCostTrashFromHand":
      enqueueResolution(state, {
        kind: "effectBlock",
        sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
        controller: prompt.resolutionContext.controller,
        trigger: prompt.resolutionContext.trigger,
        blockIndex: prompt.resolutionContext.blockIndex,
        trashHandIds: command.selectedIds ?? [],
        confirmed: true,
      });
      return true;
    case "effectTargetSelection":
      enqueueResolution(state, {
        kind: "effectAction",
        sourceInstanceId: prompt.resolutionContext.sourceInstanceId,
        controller: prompt.resolutionContext.controller,
        action: prompt.resolutionContext.action,
        selectedTargetIds: command.selectedIds ?? (command.optionId ? [command.optionId] : []),
      });
      return true;
    default:
      return false;
  }
}
