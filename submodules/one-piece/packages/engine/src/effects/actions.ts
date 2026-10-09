import {
  scheduledActions,
  delayedTargetIsCurrent,
  delayedActionChain,
  delayedSourceIsCurrent,
} from "./delayed-identity.ts";
import {
  beginDonIdentityProcess,
  endDonIdentityProcess,
  donIdentitiesAt,
  donIdentityLabel,
  requiresDonIdentityChoice,
  locateDonIdentity,
  moveDonIdentities,
  donIdentitiesForVirtualIds,
  virtualIdsForDonIdentities,
  transferDonIdentities,
} from "../engine/don-state.ts";
import { observeOptionalLoop } from "../engine/optional-loop.ts";
import { currentEffectTriggerEvent } from "./trigger-context.ts";
import {
  currentReplacementProcess,
  withReplacementProcess,
  extendReplacementProcess,
  replacementProcessKey,
} from "./replacement-process.ts";
import type {
  Action,
  Cost,
  Duration,
  EffectBlock,
  GroupedPlayAction,
  PlayAction,
} from "@tcg/op-types";
import {
  basePower,
  cardName,
  cardsShareName,
  effectBlocksFor,
  effectBlocksForInstance,
  emitEvent,
  emitLog,
  enqueueInPlayEffectsForTrigger,
  enqueueKoEffectsForTrigger,
  enqueueMirroredInPlayEffectsForTrigger,
  enqueueResolution,
  getCardForInstance,
  getCardCost,
  getBaseCost,
  getCardPower,
  getSetBasePower,
  getInstance,
  getKeywords,
  getPlayer,
  donCardsOnField,
  hasFlagModifier,
  isDonActivationByCharacterEffectPrevented,
  recordCapabilityIssue,
  restCard,
  otherSeat,
  publishDonGiven,
  shuffle,
} from "../shared.ts";
import {
  completedLifeReplacementMoves,
  replacedLifeToHandIds,
  promptForLifeReplacementOrder,
  addDonFromDeck,
  addModifier,
  createChoicePrompt,
  drawCards,
  enqueueJudgePrompt,
  formatCardList,
  getOpenCharacterSlots,
  moveCard,
} from "../state.ts";
import type {
  EffectBlockContinuation,
  RestCostProcess,
  EffectPlayReplacementContinuation,
  MatchSeat,
  SimultaneousStateChangeProcess,
  DonTransferProcess,
  MatchState,
  PromptOption,
  PromptResolutionContext,
  PromptState,
  ReturnToDeckContinuation,
  ReturnToDeckOwnerGroup,
} from "../types.ts";
import { evaluateConditions } from "./conditions.ts";
import {
  isCardPlayRestricted,
  isCharacterRemovalPreventedByPermanentEffect,
  isKoPreventedByModifier,
  isPlayedRestedByPermanentEffect,
  isRestPreventedByPermanentEffect,
} from "./permanent.ts";
import {
  unavailableRemovalPayments,
  findKoReplacement,
  findKoReplacements,
  replacementOptionId,
  replacementChoiceLabel,
  findRemoveFromFieldReplacements,
  findRestReplacements,
  restActionCandidateIds,
} from "./replacements.ts";
import type { TargetFilter } from "@tcg/op-types";
import {
  candidatePoolForTarget,
  candidatesForTarget,
  matchesTargetFilter,
  resolveTargetCount,
  selectionSatisfiesTotalConstraint,
} from "./targeting.ts";

type RestCardsCost = Extract<Cost, { cost: "restCards" }>;
type TrashCharacterCost = Extract<Cost, { cost: "trashCharacter" }>;
type KoCharacterCost = Extract<Cost, { cost: "koCharacter" }>;
type RevealFromHandCost = Extract<Cost, { cost: "revealFromHand" }>;
type PlayCardCost = Extract<Cost, { cost: "playCard" }>;
type TrashCardCost = Extract<Cost, { cost: "trashCard" }>;
type CardCostOption = PlayCardCost | TrashCardCost["options"][number];
type TrashFromHandCost = Extract<Cost, { cost: "trashFromHand" }>;
type EffectRemovalAction = Extract<
  Action,
  { action: "returnToHand" | "returnToDeck" | "trashFromField" | "addToLife" }
>;

function delayedActionMovesSource(action: Action): boolean {
  switch (action.action) {
    case "trashThisCard":
    case "playThisCard":
    case "addThisCardToHand":
      return true;
    case "ko":
    case "returnToHand":
    case "returnToDeck":
    case "addToLife":
    case "trashFromField":
      return action.target.self === true;
    default:
      return false;
  }
}

function randomizedConcealedHandOrder(
  state: MatchState,
  sourceInstanceId: string,
  chooser: MatchSeat,
  candidateIds: string[],
  promptKind: string,
): string[] {
  const concealedIds = candidateIds.filter((instanceId) => {
    const instance = getInstance(state, instanceId);
    return instance.zone === "hand" && instance.controller !== chooser;
  });
  if (concealedIds.length < 2) {
    return candidateIds;
  }
  const randomizedIds = shuffle(
    concealedIds,
    [
      state.config.seed ?? "0",
      state.turnNumber,
      state.eventSequence,
      state.idCounter,
      sourceInstanceId,
      chooser,
      promptKind,
      ...concealedIds,
    ].join(":"),
  );
  let concealedIndex = 0;
  return candidateIds.map((instanceId) => {
    const instance = getInstance(state, instanceId);
    if (instance.zone !== "hand" || instance.controller === chooser) {
      return instanceId;
    }
    const randomizedId = randomizedIds[concealedIndex];
    concealedIndex += 1;
    return randomizedId ?? instanceId;
  });
}

function effectCanRestCard(
  state: MatchState,
  instanceId: string,
  sourceInstanceId: string,
): boolean {
  return (
    !getInstance(state, instanceId).rested &&
    !hasFlagModifier(state, instanceId, "cannotBeRested") &&
    !isRestPreventedByPermanentEffect(state, instanceId, sourceInstanceId)
  );
}

export function restCharacterByEffect(
  state: MatchState,
  instanceId: string,
  effectController: MatchSeat,
  sourceInstanceId: string,
): boolean {
  const instance = getInstance(state, instanceId);
  if (
    !effectCanRestCard(state, instanceId, sourceInstanceId) ||
    !restCard(state, instanceId, effectController, sourceInstanceId)
  ) {
    return false;
  }
  if (instance.zone === "character") {
    // Printed as "if a Character is rested by your effect", so only the
    // resting effect's controller has in-play cards that react.
    enqueueInPlayEffectsForTrigger(
      state,
      "whenCharacterRestedByEffect",
      {
        instanceId,
        effectController,
        sourceInstanceId,
        targetInstanceId: instanceId,
      },
      [effectController],
    );
  }
  return true;
}

/** Source choices stay physical while a simultaneous instruction holds DON references. */
export function continueDonTransfers(state: MatchState, process: DonTransferProcess): boolean {
  const used = new Set<string>();
  for (const [index, move] of process.moves.entries()) {
    const live = donIdentitiesAt(state, move.from);
    if (move.selected) {
      if (
        move.selected.length !== move.count ||
        new Set(move.selected).size !== move.selected.length ||
        move.selected.some(
          (id) => used.has(id) || !move.candidates.includes(id) || !live.includes(id),
        )
      )
        return false;
      move.selected.forEach((id) => used.add(id));
      continue;
    }
    const available = move.candidates.filter((id) => live.includes(id) && !used.has(id));
    if (available.length < move.count) return false;
    if (!requiresDonIdentityChoice(state, available, move.count)) {
      move.selected = available.slice(0, move.count);
      move.selected.forEach((id) => used.add(id));
      continue;
    }
    createChoicePrompt(state, {
      choiceKind: "costPayment",
      seat: process.controller,
      label: `Choose ${move.count} DON!! card(s) to move.`,
      details: "Choose the specific DON!! cards.",
      sourceCardId: getInstance(state, process.sourceInstanceId).cardId,
      sourceInstanceId: process.sourceInstanceId,
      eventId: null,
      options: available.map((id) => ({ id, value: id, label: donIdentityLabel(state, id) })),
      minSelections: move.count,
      maxSelections: move.count,
      context: { resource: "don" },
      resolutionContext: { intent: "effectDonTransferSelection", process, index },
    });
    return true;
  }
  for (const move of process.moves) {
    moveDonIdentities(state, move.selected!, move.to);
    if ("attachedTo" in move.from)
      getInstance(state, move.from.attachedTo).attachedDon -= move.count;
    else
      getPlayer(state, move.from.seat)[move.from.area === "active" ? "activeDon" : "restedDon"] -=
        move.count;
    if ("attachedTo" in move.to) getInstance(state, move.to.attachedTo).attachedDon += move.count;
    else
      getPlayer(state, move.to.seat)[move.to.area === "active" ? "activeDon" : "restedDon"] +=
        move.count;
  }
  for (const move of process.moves)
    if (move.count > 0 && "attachedTo" in move.to && !("attachedTo" in move.from))
      publishDonGiven(
        state,
        move.to.attachedTo,
        move.count,
        process.controller,
        process.sourceInstanceId,
      );
  for (const move of process.moves) {
    if (move.count === 0) continue;
    const destination =
      "attachedTo" in move.to
        ? `to ${cardName(getCardForInstance(state, move.to.attachedTo))}`
        : `to the ${move.to.area} cost area`;
    emitLog(
      state,
      process.controller,
      `${effectSourceName(state, process.sourceInstanceId)} moves ${move.count} DON!! ${destination}.`,
      {
        sourceCardId: getInstance(state, process.sourceInstanceId).cardId,
        sourceInstanceId: process.sourceInstanceId,
        visibility: "public",
      },
    );
  }
  for (const action of [...(process.afterActions ?? [])].reverse())
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        controller: process.controller,
        sourceInstanceId: process.sourceInstanceId,
        action,
        effectTriggerEvent: process.effectTriggerEvent,
      },
      { next: true },
    );
  return true;
}

function donTransferMove(
  state: MatchState,
  from: DonTransferProcess["moves"][number]["from"],
  to: DonTransferProcess["moves"][number]["to"],
  count: number,
): DonTransferProcess["moves"][number] {
  return { from, to, count, candidates: donIdentitiesAt(state, from) };
}

/** Resolve one explicit simultaneous instruction, not an ordinary action sequence. */
export function continueSimultaneousStateChange(
  state: MatchState,
  process: SimultaneousStateChangeProcess,
): boolean {
  const { controller, sourceInstanceId } = process;
  for (const [groupIndex, group] of process.groups.entries()) {
    if (group.selectedIds !== undefined) continue;
    if (
      group.maximum === 0 ||
      (group.minimum === group.candidateIds.length && group.maximum === group.minimum)
    ) {
      group.selectedIds = [...group.candidateIds];
      continue;
    }
    createChoicePrompt(state, {
      choiceKind: "selectTargets",
      seat: group.chooser,
      label: `Choose cards to ${process.action.groups[group.index]!.state === "rested" ? "rest" : "set active"}.`,
      details: "All choices are made before these simultaneous state changes occur.",
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      eventId: null,
      options: group.candidateIds.map((id) => ({
        id,
        value: id,
        ...(id.startsWith("don-token:") ? {} : { targetId: id }),
        label: id.startsWith("don-token:")
          ? donIdentityLabel(state, id)
          : cardName(getCardForInstance(state, id)),
      })),
      minSelections: group.minimum,
      maxSelections: group.maximum,
      context: {},
      resolutionContext: { intent: "effectSimultaneousStateSelection", process, groupIndex },
    });
    return false;
  }
  if (!process.winners) {
    const winners = new Map<string, boolean>();
    for (const group of process.groups) {
      const rested = process.action.groups[group.index]!.state === "rested";
      for (const id of group.selectedIds ?? []) winners.set(id, rested || winners.get(id) === true);
    }
    process.winners = [...winners].map(([id, rested]) => ({ id, rested }));
  }
  while (process.replacementIndex < process.winners.length) {
    const winner = process.winners[process.replacementIndex]!;
    const snapshot = process.snapshots[winner.id]!;
    const card = state.cards[winner.id];
    if (
      winner.rested &&
      snapshot.canRest &&
      card?.zone === snapshot.zone &&
      card.zoneChangeCounter === snapshot.zoneChangeCounter
    ) {
      const action: Extract<Action, { action: "rest" }> = {
        action: "rest",
        target: { player: "any", zones: ["leader", "character", "stage"], count: { amount: 1 } },
      };
      if (
        promptForEffectRestReplacement(
          state,
          winner.id,
          controller,
          sourceInstanceId,
          action,
          [],
          process,
        )
      )
        return false;
    }
    process.replacementIndex += 1;
  }
  // Commit all original results before publishing any new activation timing.
  const restedIds: string[] = [];
  const activeIds: string[] = [];
  for (const winner of process.winners) {
    const snapshot = process.snapshots[winner.id]!;
    const card = state.cards[winner.id];
    if (snapshot.donSeat) {
      const location = locateDonIdentity(state, winner.id);
      if (!location || "attachedTo" in location || location.seat !== snapshot.donSeat) continue;
      if (
        (winner.rested && !snapshot.canRest) ||
        (!winner.rested && !snapshot.canActivate) ||
        location.area === (winner.rested ? "rested" : "active")
      )
        continue;
      const player = getPlayer(state, location.seat);
      if (winner.rested) {
        player.activeDon--;
        player.restedDon++;
      } else {
        player.restedDon--;
        player.activeDon++;
      }
      moveDonIdentities(state, [winner.id], {
        seat: location.seat,
        area: winner.rested ? "rested" : "active",
      });
      continue;
    }
    if (
      winner.replaced ||
      !card ||
      card.zone !== snapshot.zone ||
      card.zoneChangeCounter !== snapshot.zoneChangeCounter
    )
      continue;
    if (winner.rested) {
      if (!snapshot.canRest || card.rested) continue;
      card.rested = true;
      restedIds.push(winner.id);
    } else if (card.rested) {
      card.rested = false;
      activeIds.push(winner.id);
    }
  }
  for (const instanceId of restedIds) {
    const event = {
      instanceId,
      effectController: controller,
      sourceInstanceId,
      targetInstanceId: instanceId,
    };
    enqueueInPlayEffectsForTrigger(state, "whenBecomesRested", event);
    if (state.cards[instanceId]?.zone === "character")
      enqueueInPlayEffectsForTrigger(state, "whenCharacterRestedByEffect", event, [controller]);
  }
  for (const [ids, verb] of [
    [restedIds, "rests"],
    [activeIds, "sets active"],
  ] as const) {
    if (ids.length)
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} ${verb} ${targetNames(state, [...ids])}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [...ids],
          visibility: "public",
        },
      );
  }
  if (process.donProcessId) endDonIdentityProcess(state, process.donProcessId);
  return true;
}

function beginSimultaneousStateChange(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "simultaneousStateChange" }>,
  allowDonFieldQualifiers = false,
): boolean {
  const process: SimultaneousStateChangeProcess = {
    sourceInstanceId,
    controller,
    action,
    groups: [],
    snapshots: {},
    replacementIndex: 0,
    effectTriggerEvent: currentEffectTriggerEvent(state),
  };
  if (action.groups.some((group) => group.target.zones.includes("costArea")))
    process.donProcessId = beginDonIdentityProcess(state);
  for (const [index, group] of action.groups.entries()) {
    const fieldZones = group.target.zones.filter((zone) => zone !== "costArea");
    const pool = fieldZones.length
      ? candidatePoolForTarget(state, controller, sourceInstanceId, {
          ...group.target,
          zones: fieldZones,
        })
      : { supported: true, candidateIds: [] as string[] };
    if (group.target.zones.includes("costArea")) {
      const seats =
        group.target.player === "both" || group.target.player === "any"
          ? [controller, otherSeat(controller)]
          : [group.target.player === "opponent" ? otherSeat(controller) : controller];
      for (const seat of seats)
        for (const area of ["active", "rested"] as const) {
          if (
            (group.target.filters ?? []).some(
              (filter) => filter.filter === "state" && filter.value !== area,
            )
          )
            continue;
          for (const token of donIdentitiesAt(state, { seat, area })) {
            pool.candidateIds.push(token);
            process.snapshots[token] ??= {
              zone: "costArea",
              zoneChangeCounter: 0,
              canRest: area === "active",
              canActivate: !isDonActivationByCharacterEffectPrevented(
                state,
                sourceInstanceId,
                seat,
              ),
              donSeat: seat,
              cost: 0,
              power: 0,
            };
          }
        }
    }
    if (
      !pool.supported ||
      (group.target.zones.includes("costArea") &&
        !allowDonFieldQualifiers &&
        (group.target.self ||
          group.target.totalConstraint ||
          (group.target.filters ?? []).some((filter) => filter.filter !== "state"))) ||
      group.target.zones.some(
        (zone) => !["leader", "character", "stage", "costArea"].includes(zone),
      )
    ) {
      if (process.donProcessId) endDonIdentityProcess(state, process.donProcessId);
      const details = "This simultaneous state-change target is not supported.";
      const issue = recordCapabilityIssue(state, {
        kind: "unsupportedTarget",
        code: "simultaneous-state-target",
        actor: controller,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        details,
      });
      enqueueJudgePrompt(
        state,
        sourceInstanceId,
        "Judge review: simultaneous state change",
        details,
        { issueId: issue.id },
      );
      return false;
    }
    const maximum =
      group.target.count.amount === "all"
        ? pool.candidateIds.length
        : Math.min(
            resolveTargetCount(state, controller, sourceInstanceId, group.target),
            pool.candidateIds.length,
          );
    process.groups.push({
      index,
      chooser: group.target.chosenBy === "opponent" ? otherSeat(controller) : controller,
      candidateIds: pool.candidateIds,
      maximum,
      minimum: group.target.count.upTo || group.target.totalConstraint ? 0 : maximum,
    });
    for (const id of pool.candidateIds) {
      if (id.startsWith("don-token:")) continue;
      const card = getInstance(state, id);
      process.snapshots[id] ??= {
        zone: card.zone,
        zoneChangeCounter: card.zoneChangeCounter,
        canRest: effectCanRestCard(state, id, sourceInstanceId),
        cost: getCardCost(state, id),
        power: getCardPower(state, id),
      };
    }
  }
  // 1-3-4: both players' choices belong to the same simultaneous instruction.
  process.groups.sort(
    (a, b) => Number(b.chooser === state.activeSeat) - Number(a.chooser === state.activeSeat),
  );
  return continueSimultaneousStateChange(state, process);
}

export function promptForEffectRestReplacement(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "rest" }>,
  remainingTargetIds: string[],
  simultaneousStateChange?: SimultaneousStateChangeProcess,
  restCostProcess?: RestCostProcess,
): boolean {
  const target = getInstance(state, targetId);
  if (
    target.zone !== "character" ||
    (!simultaneousStateChange && !effectCanRestCard(state, targetId, sourceInstanceId))
  ) {
    return false;
  }
  const replacements = findRestReplacements(state, targetId, controller, sourceInstanceId);
  const replacement = replacements[0];
  if (!replacement) return false;
  const restAction = {
    ...action,
    target: { ...action.target, count: { amount: remainingTargetIds.length } },
  };
  if (replacement.effect.mandatory && replacements.length === 1) {
    if (restCostProcess) {
      restCostProcess.incomplete = true;
      restCostProcess.index += 1;
      enqueueResolution(
        state,
        {
          kind: "effectRestCostContinue",
          process: restCostProcess,
          replacementProcess: currentReplacementProcess(state),
        },
        { next: true },
      );
    }
    if (simultaneousStateChange) {
      simultaneousStateChange.winners![simultaneousStateChange.replacementIndex]!.replaced = true;
      simultaneousStateChange.replacementIndex += 1;
      enqueueResolution(
        state,
        { kind: "effectStateChangeContinue", process: simultaneousStateChange },
        { next: true },
      );
    }
    if (remainingTargetIds.length)
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: restAction,
          selectedTargetIds: remainingTargetIds,
        },
        { next: true },
      );
    getInstance(state, replacement.sourceInstanceId).usedEffectKeys.push(replacement.effectKey);
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        sourceInstanceId: replacement.sourceInstanceId,
        controller: replacement.controller,
        action: replacement.effect.replacementAction,
        previousActionTargetIds: [targetId],
        replacementProcess: extendReplacementProcess(
          state,
          replacement.sourceInstanceId,
          replacement.effectKey,
        ),
      },
      { next: true },
    );
    return true;
  }
  const replacementChoices = replacements.map((candidate) => ({
    id: replacementOptionId(candidate),
    sourceInstanceId: candidate.sourceInstanceId,
    replacementEffectIndex: candidate.replacementEffectIndex,
    replacementEffectKey: candidate.effectKey,
    replacementAction: candidate.effect.replacementAction,
    replacementTargetIds: [targetId],
  }));
  const required = replacements.some((candidate) => candidate.effect.mandatory);
  createChoicePrompt(state, {
    choiceKind: replacements.length > 1 ? "chooseOption" : "confirm",
    replacementGroup: replacements.map((candidate) =>
      replacementProcessKey(state, candidate.sourceInstanceId, candidate.effectKey),
    ),
    seat: replacement.controller,
    label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace being rested.`,
    details: "Apply a replacement effect instead of resting this Character?",
    sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
    sourceInstanceId: replacement.sourceInstanceId,
    eventId: null,
    options:
      replacements.length > 1
        ? [
            ...(!required ? [{ id: "no", label: "Decline these replacements", value: "no" }] : []),
            ...replacementChoices.map((choice) => ({
              id: choice.id,
              value: choice.id,
              label: replacementChoiceLabel(state, choice.sourceInstanceId),
              targetId: choice.sourceInstanceId,
            })),
          ]
        : [
            { id: "no", label: "Decline replacement", value: "no" },
            { id: "yes", label: "Apply replacement", value: "yes" },
          ],
    minSelections: 1,
    maxSelections: 1,
    context: { action: "rest", replacement: true },
    resolutionContext: {
      intent: "effectRestReplacement",
      restCostProcess,
      simultaneousStateChange,
      replacementRequired: required,
      replacementChoices: replacements.length > 1 ? replacementChoices : undefined,
      targetId,
      controller: replacement.controller,
      replacementSourceInstanceId: replacement.sourceInstanceId,
      replacementEffectIndex: replacement.replacementEffectIndex,
      replacementEffectKey: replacement.effectKey,
      replacementAction: replacement.effect.replacementAction,
      restSourceInstanceId: sourceInstanceId,
      restController: controller,
      restAction,
      remainingTargetIds,
    },
  });
  return true;
}

export function koCharacterByEffect(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
) {
  if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) {
    emitLog(
      state,
      controller,
      `${cardName(getCardForInstance(state, targetId))} cannot be removed from the field by this effect.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        targetIds: [targetId],
        visibility: "public",
      },
    );
    return false;
  }
  const target = getInstance(state, targetId);
  const owner = target.owner;
  const effectController = target.controller;
  const attachedDon = target.attachedDon;
  const triggerEvent = {
    instanceId: targetId,
    instanceController: effectController,
    effectController: controller,
    koCause: "effect" as const,
    attachedDon,
  };
  // 10-2-17-1/10-2-17-2: [On K.O.] effects activate on the field before the
  // card is trashed, then resolve while the card is in the trash.
  enqueueKoEffectsForTrigger(state, targetId, effectController, triggerEvent);
  if (target.attachedDon > 0) {
    transferDonIdentities(
      state,
      { attachedTo: targetId },
      { seat: effectController, area: "rested" },
      target.attachedDon,
    );
    getPlayer(state, effectController).restedDon += target.attachedDon;
    target.attachedDon = 0;
  }
  moveCard(state, targetId, owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: controller,
    suppressLog: true,
  });
  emitLog(
    state,
    controller,
    `${effectSourceName(state, sourceInstanceId)} K.O.'s ${cardName(getCardForInstance(state, targetId))}.`,
    {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: [targetId],
      visibility: "public",
    },
  );
  return true;
}

function effectSourceName(state: MatchState, sourceInstanceId: string): string {
  return cardName(getCardForInstance(state, sourceInstanceId));
}

function targetNames(state: MatchState, targetIds: readonly string[]): string {
  return targetIds.map((targetId) => cardName(getCardForInstance(state, targetId))).join(", ");
}

function resolveAmountFromTarget(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  amountFromTarget: Extract<Action, { action: "draw" }>["amountFromTarget"],
): number | null {
  if (!amountFromTarget) {
    return null;
  }
  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, amountFromTarget);
  if (pool.supported) {
    return pool.candidateIds.length;
  }
  const issue = recordCapabilityIssue(state, {
    kind: "unsupportedAction",
    code: "action:dynamicAmount",
    actor: controller,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    details: `${effectSourceName(state, sourceInstanceId)} uses an unsupported target-derived amount.`,
  });
  enqueueJudgePrompt(
    state,
    sourceInstanceId,
    "Judge review: unsupported target-derived amount",
    `${effectSourceName(state, sourceInstanceId)} uses an unsupported target-derived amount.`,
    { issueId: issue.id },
  );
  return null;
}

export function returnAttachedDonToCostArea(state: MatchState, instanceId: string) {
  const instance = getInstance(state, instanceId);
  if (instance.zone !== "character" || instance.attachedDon === 0) {
    return;
  }
  transferDonIdentities(
    state,
    { attachedTo: instanceId },
    { seat: instance.controller, area: "rested" },
    instance.attachedDon,
  );
  getPlayer(state, instance.controller).restedDon += instance.attachedDon;
  instance.attachedDon = 0;
}

export function promptForEffectRemovalReplacement(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: EffectRemovalAction,
  remainingTargetIds: string[],
  returnToDeckContinuation?: ReturnToDeckContinuation,
  returnCharacterCostContinuation?: EffectBlockContinuation,
  skipRemovalReplacementIds?: string[],
  removalCostPaymentId?: string,
  movementCompletionId?: string,
): boolean {
  const replacements = findRemoveFromFieldReplacements(
    state,
    targetId,
    controller,
    sourceInstanceId,
  );
  const replacement = replacements[0];
  if (!replacement) {
    return false;
  }
  const replacementEvent = replacement.effect.replacedEvent;
  if (replacementEvent !== "removeFromField" && replacementEvent !== "leaveField") {
    return false;
  }
  if (replacement.effect.mandatory && replacements.length === 1) {
    if (remainingTargetIds.length > 0) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action,
          removalCostPaymentId,
          movementCompletionId,
          selectedTargetIds: remainingTargetIds,
          returnToDeckContinuation,
          skipRemovalReplacementIds,
        },
        { next: true },
      );
    } else if (returnToDeckContinuation) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action,
          removalCostPaymentId,
          movementCompletionId,
          selectedTargetIds: [],
          returnToDeckContinuation,
          skipRemovalReplacementIds,
        },
        { next: true },
      );
    }
    getInstance(state, replacement.sourceInstanceId).usedEffectKeys.push(replacement.effectKey);
    enqueueResolution(
      state,
      {
        kind: "effectAction",
        sourceInstanceId: replacement.sourceInstanceId,
        controller: replacement.controller,
        action: replacement.effect.replacementAction,
        replacementProcess: extendReplacementProcess(
          state,
          replacement.sourceInstanceId,
          replacement.effectKey,
        ),
        previousActionTargetIds: [targetId],
      },
      { next: true },
    );
    return true;
  }
  const replacementChoices = replacements.map((candidate) => ({
    id: replacementOptionId(candidate),
    sourceInstanceId: candidate.sourceInstanceId,
    replacementEffectIndex: candidate.replacementEffectIndex,
    replacementEffectKey: candidate.effectKey,
    replacementAction: candidate.effect.replacementAction,
    replacementTargetIds: [
      targetId,
      ...remainingTargetIds.filter(
        (id) =>
          !skipRemovalReplacementIds?.includes(id) &&
          findRemoveFromFieldReplacements(state, id, controller, sourceInstanceId).some(
            (eligible) => replacementOptionId(eligible) === replacementOptionId(candidate),
          ),
      ),
    ],
  }));
  createChoicePrompt(state, {
    choiceKind: replacements.length > 1 ? "chooseOption" : "confirm",
    replacementGroup: replacements.map((candidate) =>
      replacementProcessKey(state, candidate.sourceInstanceId, candidate.effectKey),
    ),
    seat: replacement.controller,
    label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace the removal.`,
    details: "Apply the replacement effect instead of removing the card from the field?",
    sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
    sourceInstanceId: replacement.sourceInstanceId,
    eventId: null,
    options:
      replacements.length > 1
        ? [
            ...(!replacements.some((candidate) => candidate.effect.mandatory)
              ? [{ id: "no", label: "Decline these replacements", value: "no" }]
              : []),
            ...replacementChoices.map((choice) => ({
              id: choice.id,
              value: choice.id,
              label: replacementChoiceLabel(state, choice.sourceInstanceId),
              targetId: choice.sourceInstanceId,
            })),
          ]
        : [
            { id: "no", label: "Allow removal", value: "no" },
            { id: "yes", label: "Apply replacement", value: "yes" },
          ],
    minSelections: 1,
    maxSelections: 1,
    context: { action: action.action, replacement: true },
    resolutionContext: {
      intent: "effectRemovalReplacement",
      removalCostPaymentId,
      movementCompletionId,
      replacementRequired: replacements.some((candidate) => candidate.effect.mandatory),
      replacementChoices: replacements.length > 1 ? replacementChoices : undefined,
      targetId,
      controller: replacement.controller,
      replacementSourceInstanceId: replacement.sourceInstanceId,
      replacementEffectIndex: replacement.replacementEffectIndex,
      replacementEvent,
      replacementEffectKey: replacement.effectKey,
      replacementAction: replacement.effect.replacementAction,
      removalSourceInstanceId: sourceInstanceId,
      removalController: controller,
      removalAction: action,
      remainingTargetIds,
      returnToDeckContinuation,
      returnCharacterCostContinuation,
      skipRemovalReplacementIds,
    },
  });
  return true;
}

function returnToDeckDestination(
  state: MatchState,
  controller: MatchSeat,
  targetId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
): MatchSeat {
  if (action.destinationPlayer === "opponent") {
    return otherSeat(controller);
  }
  if (action.destinationPlayer === "self") {
    return controller;
  }
  return getInstance(state, targetId).owner;
}

function promptForReturnToDeckOwnerOrder(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  targetIds: string[],
  continuation: ReturnToDeckContinuation,
) {
  createChoicePrompt(state, {
    choiceKind: "orderCards",
    seat: continuation.owner,
    label: `${effectSourceName(state, sourceInstanceId)} orders cards returned to the deck.`,
    details: `Order the cards from first to last at the ${action.position} of your deck.`,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: targetIds.map((instanceId) => ({
      id: instanceId,
      label: cardName(getCardForInstance(state, instanceId)),
      value: instanceId,
      targetId: instanceId,
    })),
    minSelections: targetIds.length,
    maxSelections: targetIds.length,
    context: { action: "returnToDeck", ordered: true },
    resolutionContext: {
      intent: "effectReturnToDeckOwnerOrder",
      sourceInstanceId,
      controller,
      action,
      targetIds,
      continuation,
    },
  });
}

function enqueueReturnToDeckOwnerGroup(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  group: ReturnToDeckOwnerGroup,
  remainingOwnerGroups: ReturnToDeckOwnerGroup[],
  allTargetIds: string[],
  removalCostPaymentId?: string,
) {
  enqueueResolution(
    state,
    {
      kind: "effectAction",
      sourceInstanceId,
      controller,
      action,
      selectedTargetIds: group.targetIds,
      returnToDeckContinuation: {
        removalCostPaymentId,
        owner: group.owner,
        allTargetIds,
        publicTargetIds: group.targetIds,
        orderedTargetIds: group.targetIds,
        remainingOwnerGroups,
        orderResolved: group.targetIds.length <= 1,
        finalizeOwnerGroup: true,
      },
    },
    { next: true },
  );
}

function finalizeReturnToDeckOwnerGroup(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "returnToDeck" }>,
  continuation: ReturnToDeckContinuation,
) {
  const movedIds = continuation.publicTargetIds.filter((instanceId) => {
    const instance = getInstance(state, instanceId);
    return (
      instance.zone === "deck" &&
      instance.controller === returnToDeckDestination(state, controller, instanceId, action)
    );
  });
  const movedSet = new Set(movedIds);
  const privateOrderedIds = continuation.orderedTargetIds.filter((instanceId) =>
    movedSet.has(instanceId),
  );
  if (movedIds.length > 0) {
    const ownerName = getPlayer(state, continuation.owner).playerName;
    const publicMessage = `${effectSourceName(state, sourceInstanceId)} places ${formatCardList(state, movedIds)} at the ${action.position} of ${ownerName}'s deck.`;
    const orderedMessage = `${publicMessage} Order: ${formatCardList(state, privateOrderedIds)}.`;
    emitLog(state, controller, publicMessage, {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: movedIds,
      visibility: "public",
      privateMessages: { [continuation.owner]: orderedMessage },
      judgeMessage: orderedMessage,
    });
  }
  const [nextGroup, ...remainingOwnerGroups] = continuation.remainingOwnerGroups;
  if (nextGroup) {
    enqueueReturnToDeckOwnerGroup(
      state,
      controller,
      sourceInstanceId,
      action,
      nextGroup,
      remainingOwnerGroups,
      continuation.allTargetIds,
      continuation.removalCostPaymentId,
    );
  }
}

export function removeCardByEffectAction(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  _sourceInstanceId: string,
  action: EffectRemovalAction,
  redactDeckOrder = false,
) {
  if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) {
    return false;
  }
  const target = getInstance(state, targetId);
  returnAttachedDonToCostArea(state, targetId);
  if (action.action === "addToLife") {
    if (action.position === "choice") return false;
    const destination =
      action.target.player === "self"
        ? controller
        : action.target.player === "opponent"
          ? otherSeat(controller)
          : target.controller;
    moveCard(state, targetId, destination, "life", {
      lifePosition: action.position,
      faceUp: action.faceUp ?? false,
      publicKnowledge: action.faceUp ?? false,
      actor: controller,
      visibility: action.faceUp ? "public" : "private",
    });
    return true;
  }
  if (action.action === "returnToHand") {
    moveCard(state, targetId, target.owner, "hand", {
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
    });
    return getInstance(state, targetId).zone === "hand";
  }
  if (action.action === "returnToDeck") {
    if (action.position === "any") {
      return false;
    }
    const destination = returnToDeckDestination(state, controller, targetId, action);
    const returnsFromHand = target.zone === "hand";
    if (returnsFromHand && !redactDeckOrder) {
      emitLog(
        state,
        controller,
        `${getPlayer(state, target.controller).playerName} places a card from their hand at the ${action.position} of ${getPlayer(state, destination).playerName}'s deck.`,
        {
          sourceCardId: null,
          sourceInstanceId: null,
          visibility: "public",
        },
      );
    }
    moveCard(state, targetId, destination, "deck", {
      deckPosition: action.position,
      faceUp: false,
      publicKnowledge: false,
      actor: controller,
      visibility: "public",
      suppressLog: returnsFromHand || redactDeckOrder,
      redactIdentity: redactDeckOrder,
    });
    return true;
  }
  moveCard(state, targetId, target.owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
    actor: controller,
  });
  return true;
}

export function addTopDeckCardsToLife(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "addToLife" }>,
  amount: number,
): boolean {
  if (action.position === "choice") {
    return false;
  }
  const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
  const player = getPlayer(state, targetSeat);
  const targetIds = player.deck.slice(0, amount);

  const movementOrder = action.position === "top" ? [...targetIds].reverse() : targetIds;
  for (const targetId of movementOrder) {
    moveCard(state, targetId, targetSeat, "life", {
      lifePosition: action.position,
      faceUp: action.faceUp ?? false,
      publicKnowledge: action.faceUp ?? false,
      actor: controller,
      visibility: action.faceUp ? "public" : "private",
      suppressLog: true,
    });
  }

  if (targetIds.length > 0) {
    emitLog(
      state,
      controller,
      `${getPlayer(state, controller).playerName} adds ${targetIds.length} card${targetIds.length === 1 ? "" : "s"} from the top of the deck to ${action.position} of Life.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      },
    );
  }

  return true;
}

export function trashTopDeckCards(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "trashFromDeck" }>,
  amount: number,
  requestedAmount = action.amount,
): boolean {
  const targetSeat = action.player === "self" ? controller : otherSeat(controller);
  const targetIds = getPlayer(state, targetSeat).deck.slice(0, amount);
  for (const targetId of targetIds) {
    moveCard(state, targetId, getInstance(state, targetId).owner, "trash", {
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
      sourceInstanceId,
      visibility: "public",
    });
  }
  const completedTrash = action.upTo ? targetIds.length > 0 : targetIds.length === requestedAmount;
  if (!action.thenRequiresFullAmount || completedTrash) {
    for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: nestedAction,
        },
        { next: true },
      );
    }
  }
  return true;
}

export function removeLifeCards(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "removeFromLife" }>,
  amount: number,
  selectedTargetIds?: string[],
): boolean {
  const targetSeat = action.player === "self" ? controller : otherSeat(controller);
  const player = getPlayer(state, targetSeat);
  const destination =
    action.destination === "hand" ? "hand" : action.destination === "deck" ? "deck" : "trash";
  if (
    destination === "hand" &&
    targetSeat === controller &&
    hasFlagModifier(state, player.leaderInstanceId, "cannotAddLifeToHandByOwnEffect")
  ) {
    emitLog(
      state,
      controller,
      `${effectSourceName(state, sourceInstanceId)} cannot add Life cards to hand because of an active effect.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      },
    );
    return true;
  }

  const targetIds =
    selectedTargetIds ??
    (amount === 0
      ? []
      : action.position === "bottom"
        ? player.life.slice(-amount)
        : player.life.slice(0, amount));
  if (
    targetIds.length !== amount ||
    new Set(targetIds).size !== targetIds.length ||
    targetIds.some((instanceId) => !player.life.includes(instanceId))
  ) {
    return false;
  }
  const replacedIds = destination === "hand" ? replacedLifeToHandIds(state, targetIds) : [];
  let completedMoves = 0;
  for (const targetId of targetIds) {
    const targetOwner = getInstance(state, targetId).owner;
    const destinationSeat = destination === "trash" ? targetOwner : targetSeat;
    const redactIdentity = !getInstance(state, targetId).faceUp && destination !== "trash";
    moveCard(state, targetId, destinationSeat, destination, {
      ...(destination === "deck" && {
        deckPosition: action.destinationPosition ?? ("bottom" as const),
      }),
      faceUp: destination === "trash",
      publicKnowledge: destination === "trash",
      actor: controller,
      sourceInstanceId,
      visibility: destination === "trash" ? "public" : "private",
      redactIdentity,
    });
    if (getInstance(state, targetId).zone === destination) completedMoves++;
  }
  promptForLifeReplacementOrder(state, completedLifeReplacementMoves(state, replacedIds));
  if (completedMoves > 0) {
    for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: nestedAction,
        },
        { next: true },
      );
    }
  }
  return true;
}

// Turn-end cleanup follows the relevant seat across extra turns. This is the
// earliest turn at whose end the duration may expire (OP01 FAQ: Mr.3/Galdino).
function modifierExpiryTurn(
  state: MatchState,
  controller: MatchSeat,
  duration: Duration,
): number | null {
  switch (duration) {
    case "thisTurn":
      return state.turnNumber;
    case "untilEndOfYourNextTurn":
      return state.turnNumber + 1;
    case "untilEndOfOpponentNextTurn":
    case "untilEndOfOpponentNextEndPhase":
      return state.turnNumber + (state.activeSeat === controller ? 1 : 0);
    default:
      return null;
  }
}

function durationLabel(duration: string): string {
  switch (duration) {
    case "thisTurn":
      return "this turn";
    case "thisBattle":
      return "this battle";
    case "untilStartOfNextTurn":
      return "until the start of the next turn";
    case "untilEndOfYourNextTurn":
      return "until the end of your next turn";
    case "untilEndOfOpponentNextTurn":
      return "until the end of the opponent's next turn";
    case "untilEndOfOpponentNextEndPhase":
      return "until the end of the opponent's next End Phase";
    case "permanent":
      return "permanently";
    default:
      return duration;
  }
}

export function candidatesForPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: PlayAction,
  previousActionTargetIds: string[] = [],
): string[] | null {
  const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
  const zones = Array.isArray(action.source.zone) ? action.source.zone : [action.source.zone];
  const topDeckOnly = action.topOnly && zones.length === 1 && zones[0] === "deck";
  if (action.self) {
    const source = getInstance(state, sourceInstanceId);
    const sourceZoneMatches =
      source.zone === "resolution" ? zones.includes("hand") : zones.includes(source.zone);
    const filtersMatch = (action.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, sourceInstanceId, filter);
      return result.supported && result.matches;
    });
    const card = getCardForInstance(state, sourceInstanceId);
    if (
      source.controller !== playingSeat ||
      !sourceZoneMatches ||
      !filtersMatch ||
      (card.cardType !== "stage" && card.cardType !== "character") ||
      isCardPlayRestricted(state, playingSeat, sourceInstanceId, source.zone, "effect")
    ) {
      return [];
    }
    return [sourceInstanceId];
  }
  if (
    !topDeckOnly &&
    zones.some((zone) => zone !== "hand" && zone !== "trash" && zone !== "deck")
  ) {
    return null;
  }

  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, {
    player: action.source.player,
    zones,
    count: action.count,
    filters: action.filters,
  });
  if (!pool.supported) {
    return null;
  }

  const previousColors = new Set(
    previousActionTargetIds.flatMap((instanceId) => getCardForInstance(state, instanceId).color),
  );

  const candidateIds = topDeckOnly
    ? pool.candidateIds.filter((instanceId) => instanceId === getPlayer(state, playingSeat).deck[0])
    : pool.candidateIds;

  return candidateIds.filter((instanceId) => {
    const card = getCardForInstance(state, instanceId);
    return (
      (card.cardType === "stage" || card.cardType === "character") &&
      !isCardPlayRestricted(
        state,
        playingSeat,
        instanceId,
        getInstance(state, instanceId).zone,
        "effect",
      ) &&
      (!action.differentColorFromPreviousCharacter ||
        (previousColors.size > 0 && card.color.every((color) => !previousColors.has(color)))) &&
      (!action.sameNameAsPreviousCard ||
        previousActionTargetIds.some((id) => cardsShareName(card, getCardForInstance(state, id))))
    );
  });
}

export function candidatesForGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  previousActionTargetIds?: string[],
): string[] | null {
  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );
  if (candidatesByGroup.some((candidateIds) => candidateIds === null)) {
    return null;
  }
  const candidates = [...new Set(candidatesByGroup.flatMap((candidateIds) => candidateIds ?? []))];
  return action.previousActionTargets
    ? candidates.filter((instanceId) => previousActionTargetIds?.includes(instanceId))
    : candidates;
}

export function selectionSatisfiesGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  selectedIds: string[],
): boolean {
  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );
  if (candidatesByGroup.some((candidateIds) => candidateIds === null)) {
    return false;
  }
  const maximum = action.groups.length;
  if (selectedIds.length > maximum || new Set(selectedIds).size !== selectedIds.length) {
    return false;
  }

  const assign = (selectedIndex: number, usedGroups: Set<number>): boolean => {
    if (selectedIndex === selectedIds.length) return true;
    const instanceId = selectedIds[selectedIndex]!;
    return candidatesByGroup.some((candidateIds, groupIndex) => {
      if (usedGroups.has(groupIndex) || !candidateIds?.includes(instanceId)) return false;
      const nextUsedGroups = new Set(usedGroups);
      nextUsedGroups.add(groupIndex);
      return assign(selectedIndex + 1, nextUsedGroups);
    });
  };
  return assign(0, new Set());
}

export function validActiveIdsForGroupedPlayAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: GroupedPlayAction,
  selectedIds: string[],
): string[] {
  if (
    selectedIds.length === 0 ||
    !selectionSatisfiesGroupedPlayAction(state, controller, sourceInstanceId, action, selectedIds)
  ) {
    return [];
  }
  if (
    selectedIds.length === 1 ||
    action.playStates.multiple.every((playState) => playState === "active") ||
    !action.playStates.byGroup
  )
    return [...selectedIds];

  const candidatesByGroup = action.groups.map((group) =>
    candidatesForPlayAction(state, controller, sourceInstanceId, {
      action: "play",
      source: action.source,
      count: group.count,
      filters: group.filters,
    }),
  );

  return selectedIds.filter((activeId) => {
    const assign = (selectedIndex: number, usedGroups: Set<number>): boolean => {
      if (selectedIndex === selectedIds.length) return true;
      const instanceId = selectedIds[selectedIndex]!;
      const requiredPlayState = instanceId === activeId ? "active" : "rested";
      return candidatesByGroup.some((candidateIds, groupIndex) => {
        if (
          usedGroups.has(groupIndex) ||
          action.playStates.multiple[groupIndex] !== requiredPlayState ||
          !candidateIds?.includes(instanceId)
        ) {
          return false;
        }
        const nextUsedGroups = new Set(usedGroups);
        nextUsedGroups.add(groupIndex);
        return assign(selectedIndex + 1, nextUsedGroups);
      });
    };
    return assign(0, new Set());
  });
}

export function candidatesForRestCardsCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: RestCardsCost,
): string[] {
  const player = getPlayer(state, controller);
  const candidates = [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
    ...(player.stageArea ? [player.stageArea] : []),
  ].filter(
    (instanceId) =>
      !getInstance(state, instanceId).rested &&
      !hasFlagModifier(state, instanceId, "cannotBeRested") &&
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
  );
  // Generic "your cards" costs include active DON!! in the cost area.
  // Catalog costs with category, name, or trait filters exclude DON!!.
  if (!cost.filters?.length) {
    candidates.push(
      ...Array.from(
        { length: player.activeDon },
        (_, index) => `active-don:${controller}:${index}`,
      ),
    );
  }
  return candidates;
}

function candidatesForCardCostOption(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  option: CardCostOption,
): string[] {
  const player = getPlayer(state, controller);
  const ids = option.zones.flatMap((zone) => {
    switch (zone) {
      case "hand":
        return player.hand;
      case "character":
        return player.characterArea.filter((entry): entry is string => Boolean(entry));
      case "stage":
        return player.stageArea ? [player.stageArea] : [];
      case "leader":
        return [player.leaderInstanceId];
      case "deck":
        return player.deck;
      case "trash":
        return player.trash;
      case "life":
        return player.life;
      case "field":
        return [
          player.leaderInstanceId,
          ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
          ...(player.stageArea ? [player.stageArea] : []),
        ];
      default:
        return [];
    }
  });
  return [...new Set(ids)].filter((instanceId) =>
    (option.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}

export function candidatesForPlayCardCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: PlayCardCost,
): string[] {
  return candidatesForCardCostOption(state, controller, sourceInstanceId, cost).filter(
    (instanceId) => {
      const card = getCardForInstance(state, instanceId);
      // 3-7-6-1 makes a Character play legal even into a full Character area.
      return (
        (card.cardType === "stage" || card.cardType === "character") &&
        !isCardPlayRestricted(
          state,
          controller,
          instanceId,
          getInstance(state, instanceId).zone,
          "effect",
        )
      );
    },
  );
}

export function candidatesForTrashCardCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashCardCost,
): string[] {
  return [
    ...new Set(
      cost.options.flatMap((option) =>
        candidatesForCardCostOption(state, controller, sourceInstanceId, option),
      ),
    ),
  ];
}

export function candidatesForKoCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: KoCharacterCost,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter(
      (instanceId) =>
        !isCharacterRemovalPreventedByPermanentEffect(state, instanceId, controller) &&
        !isKoPreventedByModifier(state, instanceId, sourceInstanceId, "effect"),
    )
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForTrashCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashCharacterCost,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter(
      (instanceId) => !isCharacterRemovalPreventedByPermanentEffect(state, instanceId, controller),
    )
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

function recordHandTrashedByEffect(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  seat: MatchSeat,
  selected: string[],
) {
  if (selected.length === 0) return;
  getPlayer(state, seat).handTrashedByEffectOnTurn = state.turnNumber;
  const triggerEvent = {
    instanceId: selected[0]!,
    effectController: controller,
    amount: selected.length,
    sourceInstanceId,
  };
  enqueueInPlayEffectsForTrigger(state, "whenCardTrashedFromHandByEffect", triggerEvent);
  enqueueInPlayEffectsForTrigger(state, "whenCardsTrashedFromHandByEffect", triggerEvent);
}

export function candidatesForLifeCardCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "addCharacterToLife" | "turnLifeFaceUp" }>,
): string[] {
  if (cost.cost === "turnLifeFaceUp") {
    // Orientation and position are independent printed restrictions.
    const ids = getPlayer(state, controller).life;
    const candidates =
      cost.position === "any"
        ? ids
        : cost.position === "choice"
          ? [...new Set([...ids.slice(0, 1), ...ids.slice(-1)])]
          : ids.slice(0, cost.count);
    return candidates.filter((id) => getInstance(state, id).faceUp !== (cost.faceUp ?? true));
  }
  return getPlayer(state, cost.player === "opponent" ? otherSeat(controller) : controller)
    .characterArea.filter((id): id is string => Boolean(id))
    .filter((id) => !isCharacterRemovalPreventedByPermanentEffect(state, id, controller))
    .filter((id) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, id, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForReturnCharacterCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnCharacter" }>,
): string[] {
  return getPlayer(state, controller)
    .characterArea.filter((entry): entry is string => Boolean(entry))
    .filter((instanceId) =>
      (cost.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
        return result.supported && result.matches;
      }),
    );
}

export function candidatesForTrashFromHandCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: TrashFromHandCost,
): string[] {
  const player = getPlayer(state, controller);
  const fieldIds = (cost.fieldZones ?? []).flatMap((zone) =>
    zone === "stage"
      ? player.stageArea
        ? [player.stageArea]
        : []
      : player.characterArea.filter((entry): entry is string => Boolean(entry)),
  );
  return [...player.hand, ...fieldIds].filter((instanceId) => {
    const filters =
      getInstance(state, instanceId).zone === "hand" ? cost.filters : cost.fieldFilters;
    return (filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    });
  });
}

export function candidatesForReturnCharacterToDeckCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnCharacterToDeck" }>,
): string[] {
  const zones = cost.zones ?? ["character"];
  const seats =
    cost.player === "both"
      ? ([controller, otherSeat(controller)] as const)
      : ([cost.player === "opponent" ? otherSeat(controller) : controller] as const);
  return seats.flatMap((seat) => {
    const player = getPlayer(state, seat);
    const candidates = zones.flatMap((zone) =>
      zone === "stage"
        ? player.stageArea
          ? [player.stageArea]
          : []
        : player.characterArea.filter((entry): entry is string => Boolean(entry)),
    );
    return candidates.filter(
      (instanceId) =>
        !isCharacterRemovalPreventedByPermanentEffect(state, instanceId, controller) &&
        (cost.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
    );
  });
}

export function candidatesForReturnTrashToDeckCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: Extract<Cost, { cost: "returnTrashToDeck" }>,
): string[] {
  return getPlayer(state, controller).trash.filter((instanceId) =>
    (cost.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}

export function returnDonCostOptions(
  state: MatchState,
  controller: MatchSeat,
  donState: "active" | "rested" | "any" | "attached" = "any",
): Array<{ id: string; label: string }> {
  const player = getPlayer(state, controller);
  const options = [
    ...Array.from(
      { length: donState === "rested" || donState === "attached" ? 0 : player.activeDon },
      (_, index) => ({
        id: `active-don:${index}`,
        label: `Active DON!! in cost area ${index + 1}`,
      }),
    ),
    ...Array.from(
      { length: donState === "active" || donState === "attached" ? 0 : player.restedDon },
      (_, index) => ({
        id: `rested-don:${index}`,
        label: `Rested DON!! in cost area ${index + 1}`,
      }),
    ),
  ];
  const attachedTargets =
    donState === "any" || donState === "attached"
      ? [
          player.leaderInstanceId,
          ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
        ]
      : [];
  for (const instanceId of attachedTargets) {
    const instance = getInstance(state, instanceId);
    for (let index = 0; index < instance.attachedDon; index += 1) {
      options.push({
        id: `attached-don:${instanceId}:${index}`,
        label: `DON!! attached to ${cardName(getCardForInstance(state, instanceId))} ${index + 1}`,
      });
    }
  }
  return state.donIdentities
    ? options.map((option) => {
        const token = donIdentitiesForVirtualIds(state, controller, [option.id])[0];
        return token ? { ...option, label: donIdentityLabel(state, token) } : option;
      })
    : options;
}

export function returnSelectedDonToDeck(
  state: MatchState,
  seat: MatchSeat,
  selectedIds: string[],
  sourceInstanceId?: string,
  effectController?: MatchSeat,
): void {
  const player = getPlayer(state, seat);
  moveDonIdentities(state, donIdentitiesForVirtualIds(state, seat, selectedIds));
  const orderedIds = [...selectedIds].sort((left, right) => {
    const leftIndex = left.startsWith("rested-don:")
      ? Number(left.slice("rested-don:".length))
      : -1;
    const rightIndex = right.startsWith("rested-don:")
      ? Number(right.slice("rested-don:".length))
      : -1;
    return rightIndex - leftIndex;
  });
  for (const id of orderedIds) {
    if (id.startsWith("active-don:")) {
      player.activeDon -= 1;
    } else if (id.startsWith("rested-don:")) {
      const returnedIndex = Number(id.slice("rested-don:".length));
      for (const modifier of Object.values(state.modifiers)) {
        const match = new RegExp(`^rested-don:${seat}:(\\d+)$`).exec(modifier.targetId);
        if (
          modifier.donIdentity ||
          modifier.type !== "flag" ||
          modifier.flag !== "freezeDon" ||
          !match
        )
          continue;
        const frozenIndex = Number(match[1]);
        if (frozenIndex === returnedIndex) {
          delete state.modifiers[modifier.id];
        } else if (frozenIndex > returnedIndex) {
          modifier.targetId = `rested-don:${seat}:${frozenIndex - 1}`;
        }
      }
      player.restedDon -= 1;
    } else if (id.startsWith("attached-don:")) {
      const instanceId = id.slice("attached-don:".length, id.lastIndexOf(":"));
      getInstance(state, instanceId).attachedDon -= 1;
    }
    player.donDeckCount += 1;
  }
  if (selectedIds.length > 0) {
    const triggerEvent =
      sourceInstanceId && effectController
        ? { instanceId: sourceInstanceId, effectController, amount: selectedIds.length }
        : undefined;
    // Printed as "when a DON!! card on your field is returned to your DON!!
    // deck", so only the returning player's in-play cards react.
    enqueueInPlayEffectsForTrigger(state, "whenDonReturned", triggerEvent, [seat]);
  }
}

export function playCardFromEffect(
  state: MatchState,
  controller: MatchSeat,
  instanceId: string,
  playState: PlayAction["playState"],
  effectSourceInstanceId: string,
  options: { deferOnPlay?: boolean; slotIndex?: number } = {},
): boolean {
  const instance = getInstance(state, instanceId);
  const card = getCardForInstance(state, instanceId);
  if (isCardPlayRestricted(state, controller, instanceId, instance.zone, "effect")) {
    return false;
  }
  const fromZone = instance.zone;
  if (instance.controller !== controller) {
    return false;
  }

  if (card.cardType === "character") {
    const slotIndex = options.slotIndex ?? getOpenCharacterSlots(state, controller)[0];
    if (slotIndex === undefined) {
      return false;
    }
    moveCard(state, instanceId, controller, "character", {
      slotIndex,
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
      // The public "plays X." line below supersedes the raw zone movement.
      suppressLog: true,
    });
    const played = getInstance(state, instanceId);
    played.playedOnTurn = state.turnNumber;
    played.rested =
      playState === "rested" || isPlayedRestedByPermanentEffect(state, controller, instanceId);
  } else if (card.cardType === "stage") {
    const existingStage = getPlayer(state, controller).stageArea;
    if (existingStage) {
      moveCard(state, existingStage, getInstance(state, existingStage).owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
    }
    moveCard(state, instanceId, controller, "stage", {
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
    });
    getInstance(state, instanceId).rested = playState === "rested";
  } else {
    return false;
  }

  emitEvent(state, "cardPlayed", controller, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    visibility: "public",
  });
  emitLog(
    state,
    controller,
    `${getPlayer(state, controller).playerName} plays ${cardName(card)}.`,
    {
      sourceCardId: card.id,
      sourceInstanceId: instanceId,
      visibility: "public",
    },
  );
  if (!options.deferOnPlay) {
    for (const [blockIndex] of effectBlocksForInstance(state, instanceId, "onPlay").entries()) {
      enqueueResolution(state, {
        kind: "effectBlock",
        sourceInstanceId: instanceId,
        controller,
        trigger: "onPlay",
        blockIndex,
      });
    }
  }
  if (card.cardType === "character") {
    const triggerEvent = {
      instanceId,
      effectController: controller,
      fromZone,
      sourceInstanceId: effectSourceInstanceId,
      sourceFromZone: getInstance(state, effectSourceInstanceId).zone,
    };
    enqueueMirroredInPlayEffectsForTrigger(
      state,
      controller,
      "whenYouPlayCharacter",
      "whenOpponentPlaysCharacter",
      triggerEvent,
    );
    if (card.trigger || effectBlocksFor(card, "trigger").length > 0) {
      // Printed as "when you play a Character with a [Trigger]", so only the
      // playing player's in-play cards react.
      enqueueInPlayEffectsForTrigger(state, "whenTriggerCharacterPlayed", triggerEvent, [
        controller,
      ]);
    }
  }
  return true;
}

// 3-7-6-1 for effect-driven plays: with 5 Characters in the Character area, a
// Character played by an effect is revealed and the playing player trashes 1
// of their Characters first (rule processing, 3-7-6-1-1 / 10-2-1-3). The
// prompt pauses the effect; the resolution completes the play into the freed
// slot and resumes the stored continuation.
export function promptForEffectCharacterReplacement(
  state: MatchState,
  options: {
    controller: MatchSeat;
    playingSeat: MatchSeat;
    sourceInstanceId: string;
    instanceId: string;
    playState?: "rested" | "active";
    continuation: EffectPlayReplacementContinuation;
  },
) {
  const { controller, playingSeat, sourceInstanceId, instanceId, playState, continuation } =
    options;
  const player = getPlayer(state, playingSeat);
  const card = getCardForInstance(state, instanceId);
  getInstance(state, instanceId).publicKnowledge = true;
  emitLog(state, playingSeat, `${player.playerName} reveals ${cardName(card)} to play it.`, {
    sourceCardId: card.id,
    sourceInstanceId: instanceId,
    targetIds: [instanceId],
    visibility: "public",
  });
  const candidateIds = player.characterArea.filter((entry): entry is string => Boolean(entry));
  createChoicePrompt(state, {
    choiceKind: "selectCards",
    seat: playingSeat,
    label: `${player.playerName} trashes 1 Character to play ${cardName(card)}.`,
    details: "Select 1 of your Characters to trash.",
    sourceCardId: card.id,
    sourceInstanceId,
    eventId: null,
    options: candidateIds.map((candidateId) => ({
      id: candidateId,
      label: cardName(getCardForInstance(state, candidateId)),
      value: candidateId,
      targetId: candidateId,
    })),
    minSelections: 1,
    maxSelections: 1,
    context: {},
    resolutionContext: {
      intent: "effectPlayCharacterReplacement",
      sourceInstanceId,
      controller,
      playingSeat,
      instanceId,
      candidateIds,
      playState,
      continuation,
    },
  });
}

// Plays each pending card with the effect's play semantics, pausing for the
// 3-7-6-1 replacement choice when a Character is played into a full Character
// area. Returns "suspended" while that choice is pending, "failed" when a
// play was illegal, and "completed" once every play finished (at which point
// the action's thenActions are queued with every played card).
export function playCardsFromEffectSequence(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: PlayAction,
  playingSeat: MatchSeat,
  pendingIds: string[],
  playedIds: string[],
  previousActionTargetIds?: string[],
): "completed" | "suspended" | "failed" {
  for (let index = 0; index < pendingIds.length; index += 1) {
    const instanceId = pendingIds[index]!;
    if (
      getCardForInstance(state, instanceId).cardType === "character" &&
      getOpenCharacterSlots(state, playingSeat).length === 0
    ) {
      promptForEffectCharacterReplacement(state, {
        controller,
        playingSeat,
        sourceInstanceId,
        instanceId,
        playState: action.playState,
        continuation: {
          kind: "playAction",
          action,
          remainingIds: pendingIds.slice(index + 1),
          playedIds: [...playedIds, ...pendingIds.slice(0, index)],
          previousActionTargetIds,
        },
      });
      return "suspended";
    }
    if (!playCardFromEffect(state, playingSeat, instanceId, action.playState, sourceInstanceId)) {
      return "failed";
    }
  }
  const allPlayedIds = [...playedIds, ...pendingIds];
  if (allPlayedIds.length > 0) {
    for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
      enqueueResolution(
        state,
        {
          kind: "effectAction",
          sourceInstanceId,
          controller,
          action: nestedAction,
          previousActionTargetIds: allPlayedIds,
        },
        { next: true },
      );
    }
  }
  return "completed";
}

// Completes a "playThisCard" action, optionally into a Character-area slot
// freed by the 3-7-6-1 replacement choice.
export function completePlayThisCard(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  slotIndex?: number,
): boolean {
  const source = getInstance(state, sourceInstanceId);
  const card = getCardForInstance(state, sourceInstanceId);
  if (
    source.controller !== controller ||
    (source.zone !== "hand" && source.zone !== "resolution")
  ) {
    return false;
  }
  const fromZone = source.zone;

  if (card.cardType === "character") {
    const resolvedSlotIndex = slotIndex ?? getOpenCharacterSlots(state, controller)[0];
    if (resolvedSlotIndex === undefined) {
      return false;
    }
    moveCard(state, sourceInstanceId, controller, "character", {
      slotIndex: resolvedSlotIndex,
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
      // The public "plays X." line below supersedes the raw zone movement.
      suppressLog: true,
    });
    const played = getInstance(state, sourceInstanceId);
    played.playedOnTurn = state.turnNumber;
    played.rested = isPlayedRestedByPermanentEffect(state, controller, sourceInstanceId);
  } else if (card.cardType === "stage") {
    const existingStage = getPlayer(state, controller).stageArea;
    if (existingStage) {
      moveCard(state, existingStage, getInstance(state, existingStage).owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
    }
    moveCard(state, sourceInstanceId, controller, "stage", {
      faceUp: true,
      publicKnowledge: true,
      actor: controller,
    });
  } else {
    return false;
  }

  emitEvent(state, "cardPlayed", controller, {
    sourceCardId: card.id,
    sourceInstanceId,
    visibility: "public",
  });
  emitLog(
    state,
    controller,
    `${getPlayer(state, controller).playerName} plays ${cardName(card)}.`,
    {
      sourceCardId: card.id,
      sourceInstanceId,
      visibility: "public",
    },
  );
  for (const [blockIndex] of effectBlocksForInstance(state, sourceInstanceId, "onPlay").entries()) {
    enqueueResolution(state, {
      kind: "effectBlock",
      sourceInstanceId,
      controller,
      trigger: "onPlay",
      blockIndex,
    });
  }
  if (card.cardType === "character") {
    const triggerEvent = {
      instanceId: sourceInstanceId,
      effectController: controller,
      fromZone,
      sourceInstanceId,
      sourceFromZone: fromZone,
    };
    enqueueMirroredInPlayEffectsForTrigger(
      state,
      controller,
      "whenYouPlayCharacter",
      "whenOpponentPlaysCharacter",
      triggerEvent,
    );
    if (card.trigger || effectBlocksFor(card, "trigger").length > 0) {
      // Printed as "when you play a Character with a [Trigger]", so only
      // the playing player's in-play cards react.
      enqueueInPlayEffectsForTrigger(state, "whenTriggerCharacterPlayed", triggerEvent, [
        controller,
      ]);
    }
  }
  return true;
}

function promptForSetPowerFromSource(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "setBasePowerFrom" }>,
  candidateIds: string[],
  previousActionTargetIds?: string[],
) {
  const sourceCard = getCardForInstance(state, sourceInstanceId);
  const chooser = action.source.chosenBy === "opponent" ? otherSeat(controller) : controller;
  createChoicePrompt(state, {
    choiceKind: "selectTargets",
    seat: chooser,
    label: `${cardName(sourceCard)} selects a card.`,
    details: "Choose 1 card to copy the base power from.",
    sourceCardId: sourceCard.id,
    sourceInstanceId,
    eventId: null,
    options: candidateIds.map((instanceId) => ({
      id: instanceId,
      label: cardName(getCardForInstance(state, instanceId)),
      value: instanceId,
      targetId: instanceId,
    })),
    minSelections: action.source.count.upTo ? 0 : 1,
    maxSelections: 1,
    context: { action: action.action },
    resolutionContext: {
      intent: "effectSetPowerFromSource",
      sourceInstanceId,
      controller,
      action,
      sourceCandidateIds: candidateIds,
      previousActionTargetIds,
    },
  });
}

const TARGET_SUMMARY_MAX_NAMES = 3;
const TARGET_SUMMARY_MAX_TOTAL_LENGTH = 190;
const HIDDEN_TARGET_LABEL = "a hidden card";

/**
 * Public label for a target-selection prompt: names up to three candidates so
 * the log line tells both players what the effect can hit, without leaking
 * hidden information. A candidate is only named when it is already public
 * knowledge (same rule as the spectator view and describeHiddenCard); every
 * other candidate renders as {@link HIDDEN_TARGET_LABEL}, and pooled
 * candidates like DON!! keep their prompt-option label. The total label stays
 * under the log audit's overlong-line threshold.
 */
function targetSelectionLabel(
  state: MatchState,
  sourceName: string,
  orderedCandidateIds: readonly string[],
  opaqueLabels: ReadonlyMap<string, string>,
): string {
  const prefix = `${sourceName} chooses its target: `;
  const isPubliclyNamed = (instanceId: string): boolean => {
    if (opaqueLabels.has(instanceId)) {
      return false;
    }
    const instance = getInstance(state, instanceId);
    return instance.publicKnowledge || instance.zone === "leader" || instance.zone === "character";
  };
  const displayFor = (instanceId: string): string =>
    opaqueLabels.get(instanceId) ??
    (isPubliclyNamed(instanceId)
      ? cardName(getCardForInstance(state, instanceId))
      : HIDDEN_TARGET_LABEL);
  const summaryFor = (count: number): string => {
    const parts: string[] = [];
    let namedRun: string[] = [];
    const flushNamedRun = () => {
      if (namedRun.length > 0) {
        parts.push(formatCardList(state, namedRun));
        namedRun = [];
      }
    };
    for (const instanceId of orderedCandidateIds.slice(0, count)) {
      if (isPubliclyNamed(instanceId)) {
        namedRun.push(instanceId);
      } else {
        flushNamedRun();
        parts.push(displayFor(instanceId));
      }
    }
    flushNamedRun();
    return parts.join(", ");
  };
  const labelFor = (count: number): string => {
    const remaining = orderedCandidateIds.length - count;
    const suffix = remaining > 0 ? `, + ${remaining} more` : "";
    return `${prefix}${summaryFor(count)}${suffix}.`;
  };
  let shown = Math.min(TARGET_SUMMARY_MAX_NAMES, orderedCandidateIds.length);
  let label = labelFor(shown);
  while (label.length > TARGET_SUMMARY_MAX_TOTAL_LENGTH && shown > 0) {
    shown -= 1;
    label = labelFor(shown);
  }
  return label;
}

export function promptForTargetSelection(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  candidateIds: string[],
  previousActionTargetIds?: string[],
  groupedRemovalSelection?: Extract<
    PromptState["resolutionContext"],
    { intent: "effectTargetSelection" }
  >["groupedRemovalSelection"],
) {
  const sourceCard = getCardForInstance(state, sourceInstanceId);
  const target = "target" in action ? action.target : null;
  const chooser = target?.chosenBy === "opponent" ? otherSeat(controller) : controller;
  const orderedCandidateIds = randomizedConcealedHandOrder(
    state,
    sourceInstanceId,
    chooser,
    candidateIds,
    "target-selection",
  );
  let hiddenHandIndex = 0;
  const opaqueCandidateIds: Record<string, string> = {};
  const options: PromptOption[] = orderedCandidateIds.map((instanceId) => {
    const instance = getInstance(state, instanceId);
    const concealedFromChooser = instance.zone === "hand" && instance.controller !== chooser;
    if (concealedFromChooser) {
      hiddenHandIndex += 1;
    }
    const optionId = concealedFromChooser ? `hidden-card:${hiddenHandIndex}` : instanceId;
    if (concealedFromChooser) {
      opaqueCandidateIds[optionId] = instanceId;
    }
    return {
      id: optionId,
      label: concealedFromChooser
        ? `Card ${hiddenHandIndex}`
        : cardName(getCardForInstance(state, instanceId)),
      value: optionId,
      ...(!concealedFromChooser && { targetId: instanceId }),
    };
  });
  const maximum = target?.count.amountFromMatchingCards
    ? Math.min(resolveTargetCount(state, chooser, sourceInstanceId, target), options.length)
    : target?.count.amount === "all" || target?.count.amount === undefined
      ? options.length
      : Math.min(target.count.amount, options.length);
  createChoicePrompt(state, {
    choiceKind: "selectTargets",
    seat: chooser,
    label: targetSelectionLabel(state, cardName(sourceCard), orderedCandidateIds, new Map()),
    details: "Choose valid targets to continue resolving the effect.",
    sourceCardId: sourceCard.id,
    sourceInstanceId,
    eventId: null,
    options,
    minSelections: target?.count.upTo || target?.totalConstraint ? 0 : maximum,
    maxSelections: maximum,
    context: {
      action: action.action,
    },
    resolutionContext: {
      intent: "effectTargetSelection",
      sourceInstanceId,
      controller,
      action,
      previousActionTargetIds,
      groupedRemovalSelection,
      ...(Object.keys(opaqueCandidateIds).length > 0 && { opaqueCandidateIds }),
    },
  });
}

function resolveActionTargets(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds: string[] | undefined,
  previousActionTargetIds?: string[],
): string[] | null | "prompt" {
  if (!("target" in action) || !action.target || selectedTargetIds) {
    return (selectedTargetIds ?? []).filter((id) => delayedTargetIsCurrent(state, action, id));
  }

  const targetIds = candidatesForTarget(state, controller, sourceInstanceId, action.target);
  if (targetIds === null) {
    const candidateSeat = action.target.player === "self" ? controller : otherSeat(controller);
    const candidatePlayer = getPlayer(state, candidateSeat);
    const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
    const candidateIds = pool.supported
      ? pool.candidateIds
      : [
          candidatePlayer.leaderInstanceId,
          ...candidatePlayer.characterArea.filter((entry): entry is string => Boolean(entry)),
          ...(candidatePlayer.stageArea ? [candidatePlayer.stageArea] : []),
          ...candidatePlayer.hand,
          ...candidatePlayer.trash,
          ...candidatePlayer.life,
          ...candidatePlayer.deck,
        ];
    const eligibleCandidateIds = candidateIds.filter((instanceId) =>
      actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
    );
    promptForTargetSelection(
      state,
      controller,
      sourceInstanceId,
      action,
      eligibleCandidateIds,
      previousActionTargetIds,
    );
    return "prompt";
  }

  return targetIds.filter((instanceId) =>
    actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
  );
}

export function freezeActionCandidateIds(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "freeze" }>,
): string[] {
  const fieldZones = action.target.zones.filter((zone) => zone !== "costArea");
  const fieldCandidates =
    fieldZones.length === 0
      ? []
      : candidatePoolForTarget(state, controller, sourceInstanceId, {
          ...action.target,
          zones: fieldZones,
        }).candidateIds.filter((instanceId) =>
          actionTargetIsEligible(state, action, instanceId, sourceInstanceId),
        );
  if (!action.target.zones.includes("costArea")) {
    return fieldCandidates;
  }
  const seats =
    action.target.player === "both" || action.target.player === "any"
      ? ([controller, otherSeat(controller)] as const)
      : ([action.target.player === "self" ? controller : otherSeat(controller)] as const);
  const donFiltersSupported = (action.target.filters ?? []).every(
    (filter) => filter.filter === "state" && filter.value === "rested",
  );
  const donCandidates = donFiltersSupported
    ? seats.flatMap((seat) =>
        Array.from(
          { length: getPlayer(state, seat).restedDon },
          (_, index) => `rested-don:${seat}:${index}`,
        ),
      )
    : [];
  return [...fieldCandidates, ...donCandidates];
}

export function actionTargetIsEligible(
  state: MatchState,
  action: Action,
  instanceId: string,
  _sourceInstanceId: string,
): boolean {
  if (!delayedTargetIsCurrent(state, action, instanceId)) return false;
  if (
    action.action === "modifyLifeValue" &&
    getCardForInstance(state, instanceId).cardType !== "leader"
  )
    return false;
  // Activating an Event resolves its Main effect, not its Counter or Life Trigger.
  // Keep this in shared action eligibility so prompts and retries use the same rule.
  if (action.action === "activateEvent") {
    return (
      getCardForInstance(state, instanceId).cardType === "event" &&
      effectBlocksForInstance(state, instanceId, action.effectTrigger).length > 0
    );
  }
  const paymentTrash = currentReplacementProcess(state)?.paymentTrash;
  if (
    action.action === "returnToDeck" &&
    paymentTrash &&
    getInstance(state, instanceId).zone === "trash"
  ) {
    const instance = getInstance(state, instanceId);
    if (
      !paymentTrash.some(
        (entry) =>
          entry.instanceId === instanceId && entry.zoneChangeCounter === instance.zoneChangeCounter,
      )
    )
      return false;
  }
  if (action.action === "giveDon" && action.donorPlayer === "targetOwner") {
    const available = giveDonPoolAmount(state, getInstance(state, instanceId).owner, action);
    return available >= (action.count.amount === "all" ? 1 : action.count.amount);
  }
  if (
    action.action === "cannotActivate" &&
    action.requiresKeyword &&
    !getKeywords(state, instanceId).has(action.keyword)
  ) {
    return false;
  }
  return true;
}

export function promptForRearrangeDeckOrder(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  action: Extract<Action, { action: "rearrangeDeck" }>,
  lookedIds: string[],
) {
  if (lookedIds.length === 0) {
    return;
  }
  createChoicePrompt(state, {
    choiceKind: "orderCards",
    seat: controller,
    label: `${effectSourceName(state, sourceInstanceId)} orders the ${lookedIds.length} looked-at card(s) in the deck.`,
    details: `Order the ${lookedIds.length} looked-at card(s) from first to last.`,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: lookedIds.map((instanceId) => ({
      id: instanceId,
      label: cardName(getCardForInstance(state, instanceId)),
      value: instanceId,
      targetId: instanceId,
    })),
    minSelections: lookedIds.length,
    maxSelections: lookedIds.length,
    context: { action: "rearrangeDeck", ordered: true },
    resolutionContext: {
      intent: "effectRearrangeDeckOrder",
      sourceInstanceId,
      controller,
      action,
      lookedIds,
    },
  });
}

function giveDonPoolAmount(
  state: MatchState,
  seat: MatchSeat,
  action: Extract<Action, { action: "giveDon" }>,
): number {
  const player = getPlayer(state, seat);
  return action.donState === "rested"
    ? player.restedDon
    : action.donState === "active"
      ? player.activeDon
      : player.restedDon + player.activeDon;
}

export function availableDonForGive(
  state: MatchState,
  controller: MatchSeat,
  action: Extract<Action, { action: "giveDon" }>,
): number {
  if (action.donorPlayer === "targetOwner") {
    // A single recipient cannot combine resources belonging to different owners.
    return Math.max(
      giveDonPoolAmount(state, controller, action),
      giveDonPoolAmount(state, otherSeat(controller), action),
    );
  }
  return giveDonPoolAmount(
    state,
    action.donorPlayer === "opponent" ? otherSeat(controller) : controller,
    action,
  );
}

export function completeGiveDon(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Extract<Action, { action: "giveDon" }>,
  targetId: string,
  activeCount: number,
): boolean {
  if (action.count.amount === "all") return false;
  const amount = action.count.amount;
  const donor =
    action.donorPlayer === "targetOwner"
      ? getInstance(state, targetId).owner
      : action.donorPlayer === "opponent"
        ? otherSeat(controller)
        : controller;
  const player = getPlayer(state, donor);
  const restedCount = amount - activeCount;
  if (
    !Number.isInteger(activeCount) ||
    activeCount < 0 ||
    restedCount < 0 ||
    activeCount > player.activeDon ||
    restedCount > player.restedDon ||
    (action.donState === "rested" && activeCount !== 0) ||
    (action.donState === "active" && restedCount !== 0)
  )
    return false;
  if (state.donIdentities)
    return continueDonTransfers(state, {
      controller,
      sourceInstanceId,
      effectTriggerEvent: currentEffectTriggerEvent(state),
      moves: [
        donTransferMove(
          state,
          { seat: donor, area: "active" },
          { attachedTo: targetId },
          activeCount,
        ),
        donTransferMove(
          state,
          { seat: donor, area: "rested" },
          { attachedTo: targetId },
          restedCount,
        ),
      ],
    });
  player.activeDon -= activeCount;
  player.restedDon -= restedCount;
  getInstance(state, targetId).attachedDon += amount;
  publishDonGiven(state, targetId, amount, controller, sourceInstanceId);
  emitLog(
    state,
    controller,
    `${effectSourceName(state, sourceInstanceId)} gives ${amount} DON!! to ${cardName(getCardForInstance(state, targetId))}.`,
    {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: [targetId],
      visibility: "public",
    },
  );
  return true;
}

type GiveDonEachContext = Extract<PromptResolutionContext, { intent: "effectGiveDonEachCount" }>;

/** Reserve all recipient choices before moving resources, so invalid retries cannot partially pay. */
export function continueGiveDonEach(
  state: MatchState,
  context: GiveDonEachContext,
  optionId?: string,
): boolean {
  const { action, controller, sourceInstanceId, recipients } = context;
  if (action.count.amount === "all" || !action.count.upTo) return false;
  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
  if (
    !pool.supported ||
    new Set(recipients.map((r) => r.instanceId)).size !== recipients.length ||
    recipients.some(
      (r) =>
        !pool.candidateIds.includes(r.instanceId) ||
        getInstance(state, r.instanceId).zoneChangeCounter !== r.zoneChangeCounter,
    )
  )
    return false;
  const remaining = {
    north: {
      active: getPlayer(state, "north").activeDon,
      rested: getPlayer(state, "north").restedDon,
    },
    south: {
      active: getPlayer(state, "south").activeDon,
      rested: getPlayer(state, "south").restedDon,
    },
  };
  const donorFor = (targetId: string) =>
    action.donorPlayer === "targetOwner"
      ? getInstance(state, targetId).owner
      : action.donorPlayer === "opponent"
        ? otherSeat(controller)
        : controller;
  for (const [index, allocation] of context.allocations.entries()) {
    const recipient = recipients[index];
    if (
      !recipient ||
      !Number.isInteger(allocation.amount) ||
      !Number.isInteger(allocation.active) ||
      allocation.amount < 0 ||
      allocation.amount > action.count.amount ||
      allocation.active < 0 ||
      allocation.active > allocation.amount
    )
      return false;
    const resource = remaining[donorFor(recipient.instanceId)];
    resource.active -= allocation.active;
    resource.rested -= allocation.amount - allocation.active;
    if (
      resource.active < 0 ||
      resource.rested < 0 ||
      (action.donState === "rested" && allocation.active !== 0) ||
      (action.donState === "active" && allocation.active !== allocation.amount)
    )
      return false;
  }
  const recipient = recipients[context.allocations.length];
  if (!recipient) {
    if (optionId !== undefined) return false;
    if (state.donIdentities)
      return continueDonTransfers(state, {
        controller,
        sourceInstanceId,
        effectTriggerEvent: currentEffectTriggerEvent(state),
        moves: context.allocations.flatMap((allocation, index) => {
          const targetId = recipients[index]!.instanceId,
            donor = donorFor(targetId);
          return [
            donTransferMove(
              state,
              { seat: donor, area: "active" },
              { attachedTo: targetId },
              allocation.active,
            ),
            donTransferMove(
              state,
              { seat: donor, area: "rested" },
              { attachedTo: targetId },
              allocation.amount - allocation.active,
            ),
          ];
        }),
      });
    for (const [index, allocation] of context.allocations.entries()) {
      if (allocation.amount === 0) continue;
      completeGiveDon(
        state,
        controller,
        sourceInstanceId,
        { ...action, count: { amount: allocation.amount } },
        recipients[index]!.instanceId,
        allocation.active,
      );
    }
    return true;
  }
  const resource = remaining[donorFor(recipient.instanceId)];
  const options: Array<PromptOption & { amount: number; active: number }> = [];
  for (let amount = 0; amount <= action.count.amount; amount++) {
    for (let active = 0; active <= amount; active++) {
      if (
        active > resource.active ||
        amount - active > resource.rested ||
        (action.donState === "rested" && active !== 0) ||
        (action.donState === "active" && active !== amount)
      )
        continue;
      const fixedState = action.donState === "rested" || action.donState === "active";
      const id = fixedState ? String(amount) : `${amount}:${active}`;
      options.push({
        id,
        value: id,
        label: fixedState
          ? String(amount)
          : `${amount} DON!! (${active} active, ${amount - active} rested)`,
        amount,
        active,
      });
    }
  }
  if (optionId !== undefined) {
    const selected = options.find((option) => option.id === optionId);
    if (!selected) return false;
    return continueGiveDonEach(state, {
      ...context,
      allocations: [...context.allocations, { amount: selected.amount, active: selected.active }],
    });
  }
  createChoicePrompt(state, {
    choiceKind: "chooseOption",
    seat: controller,
    label: `Give DON!! to ${cardName(getCardForInstance(state, recipient.instanceId))}`,
    details: `Choose up to ${action.count.amount} DON!! for Character ${getInstance(state, recipient.instanceId).zoneIndex + 1}.`,
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    eventId: null,
    options: options.map(({ amount: _amount, active: _active, ...option }) => option),
    minSelections: 1,
    maxSelections: 1,
    context: { action: "giveDon", resource: "don" },
    resolutionContext: context,
  });
  return true;
}

export function processEffectAction(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: Action,
  selectedTargetIds?: string[],
  previousActionTargetIds?: string[],
  skipRemovalReplacementIds?: string[],
  returnToDeckContinuation?: ReturnToDeckContinuation,
  setPowerFromSourceIds?: string[],
  removalCostPaymentId?: string,
  koCompletionId?: string,
  movementCompletionId?: string,
): boolean {
  if (delayedActionMovesSource(action) && !delayedSourceIsCurrent(state, action)) return true;
  const process = currentReplacementProcess(state);
  if (
    process?.unavailableRemovalPayments === undefined &&
    ["ko", "returnToHand", "returnToDeck", "trashFromField", "addToLife"].includes(action.action)
  ) {
    // One instruction is one removal batch. Persist the initial affordability
    // through its selection/replacement prompts; transformed replacement actions
    // get a fresh process in extendReplacementProcess.
    return withReplacementProcess(
      state,
      {
        ...process,
        applied: process?.applied ?? [],
        unavailableRemovalPayments: unavailableRemovalPayments(state),
        removalTrash: (["south", "north"] as const).flatMap((seat) =>
          getPlayer(state, seat).trash.map((instanceId) => ({
            instanceId,
            zoneChangeCounter: getInstance(state, instanceId).zoneChangeCounter,
          })),
        ),
      },
      () =>
        processEffectAction(
          state,
          controller,
          sourceInstanceId,
          action,
          selectedTargetIds,
          previousActionTargetIds,
          skipRemovalReplacementIds,
          returnToDeckContinuation,
          setPowerFromSourceIds,
          removalCostPaymentId,
          koCompletionId,
          movementCompletionId,
        ),
    );
  }
  switch (action.action) {
    case "sequence":
      for (const nestedAction of [...action.actions].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds,
          },
          { next: true },
        );
      }
      return true;
    case "optional": {
      const boundary = {
        kind: "effectAction" as const,
        id: "optional-action-boundary",
        sourceInstanceId,
        controller,
        action,
        previousActionTargetIds,
        effectTriggerEvent: currentEffectTriggerEvent(state),
      };
      const loop = observeOptionalLoop(state, boundary);
      if (loop === "pause") {
        enqueueResolution(state, boundary, { next: true });
        return false;
      }
      if (loop === "skip") return true;
      if (loop === "resolve") {
        for (const nestedAction of [...action.actions].reverse())
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
              previousActionTargetIds,
            },
            { next: true },
          );
        return true;
      }
      createChoicePrompt(state, {
        choiceKind: "confirm",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} has an optional action.`,
        details: "Resolve the optional action?",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          { id: "yes", label: "Resolve", value: "yes" },
          { id: "no", label: "Skip", value: "no" },
        ],
        minSelections: 0,
        maxSelections: 1,
        context: { action: "optional" },
        resolutionContext: {
          intent: "effectActionOptional",
          sourceInstanceId,
          controller,
          actions: action.actions,
          previousActionTargetIds,
        },
      });
      return false;
    }
    case "delayed":
      if (action.timing === "endOfThisBattle" && !state.battle) {
        return false;
      }
      for (const nestedAction of scheduledActions(
        state,
        action.actions,
        sourceInstanceId,
        previousActionTargetIds,
      )) {
        state.delayedEffectActions.push({
          sourceInstanceId,
          controller,
          action: nestedAction,
          scheduledTurn: state.turnNumber,
          ...(previousActionTargetIds && { previousActionTargetIds }),
          ...(delayedActionMovesSource(nestedAction) && {
            sourceZoneChangeCounter: getInstance(state, sourceInstanceId).zoneChangeCounter,
          }),
          ...(action.timing === "endOfThisBattle" && {
            scheduledBattleId: state.battle!.id,
          }),
          ...(action.timing === "startOfOpponentNextMainPhase" && {
            scheduledPhase: "main" as const,
            scheduledSeat: otherSeat(controller),
          }),
        });
      }
      return true;
    case "setCounter":
    case "modifyCounter":
      // Counter modifiers are continuous effects evaluated from their source card.
      return false;
    case "draw": {
      const resolvedAmount = action.amountFromPreviousActionTargets
        ? (previousActionTargetIds?.length ?? 0)
        : action.amountFromTarget
          ? resolveAmountFromTarget(state, controller, sourceInstanceId, action.amountFromTarget)
          : action.amount;
      if (resolvedAmount === null) {
        return false;
      }
      const resolvedAction = { ...action, amount: resolvedAmount };
      {
        const drawingSeat = resolvedAction.player === "self" ? controller : otherSeat(controller);
        if (
          drawingSeat === controller &&
          hasFlagModifier(
            state,
            getPlayer(state, drawingSeat).leaderInstanceId,
            "cannotDrawByOwnEffects",
          )
        ) {
          return true;
        }
      }
      if (resolvedAction.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may draw cards.`,
          details: `Choose how many cards to draw, up to ${resolvedAction.amount}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: resolvedAction.amount + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "draw", resource: "deck" },
          resolutionContext: {
            intent: "effectDrawCount",
            sourceInstanceId,
            controller,
            action: resolvedAction,
            maximum: resolvedAction.amount,
          },
        });
        return false;
      }
      drawCards(
        state,
        resolvedAction.player === "self" ? controller : otherSeat(controller),
        resolvedAction.untilHandSize === undefined
          ? resolvedAction.amount
          : Math.max(
              0,
              resolvedAction.untilHandSize -
                getPlayer(
                  state,
                  resolvedAction.player === "self" ? controller : otherSeat(controller),
                ).hand.length,
            ),
        `${cardName(getCardForInstance(state, sourceInstanceId))} resolves`,
      );
      return true;
    }
    case "trashFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const choiceSeat = action.chosenBy
        ? action.chosenBy === "self"
          ? controller
          : otherSeat(controller)
        : seat;
      const player = getPlayer(state, seat);
      const targetDerivedAmount = action.amountFromTarget
        ? resolveAmountFromTarget(state, controller, sourceInstanceId, action.amountFromTarget)
        : null;
      if (action.amountFromTarget && targetDerivedAmount === null) {
        return false;
      }
      const previousActionAmount = action.amountFromPreviousActionTargets
        ? (previousActionTargetIds?.length ?? 0)
        : null;
      const resolvedAction =
        previousActionAmount !== null
          ? {
              ...action,
              amount: previousActionAmount,
              amountFromPreviousActionTargets: undefined,
            }
          : targetDerivedAmount === null
            ? action
            : { ...action, amount: targetDerivedAmount, amountFromTarget: undefined };
      const pool = resolvedAction.filters
        ? player.hand.filter((instanceId) =>
            resolvedAction.filters!.every((filter) => {
              const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
              return result.supported && result.matches;
            }),
          )
        : player.hand;
      const requestedAmount =
        resolvedAction.untilHandSize === undefined
          ? resolvedAction.amount === "all"
            ? pool.length
            : resolvedAction.amount
          : Math.max(0, player.hand.length - resolvedAction.untilHandSize);
      const maximum = Math.min(requestedAmount, pool.length);
      const minimum = resolvedAction.upTo ? 0 : maximum;
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          selectedTargetIds = [];
        } else if (!resolvedAction.upTo && maximum === pool.length) {
          selectedTargetIds = [...pool];
        } else {
          const concealFromChooser = choiceSeat !== seat;
          const orderedPool = concealFromChooser
            ? randomizedConcealedHandOrder(
                state,
                sourceInstanceId,
                choiceSeat,
                pool,
                "trash-from-hand",
              )
            : pool;
          const opaqueCandidateIds = concealFromChooser
            ? Object.fromEntries(
                orderedPool.map((instanceId, index) => [`hidden-card:${index + 1}`, instanceId]),
              )
            : undefined;
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: choiceSeat,
            label: `${effectSourceName(state, sourceInstanceId)} requires trashing ${
              resolvedAction.upTo ? "up to " : ""
            }${maximum} card(s) from hand.`,
            details: resolvedAction.upTo
              ? resolvedAction.amount === "all"
                ? "Choose any number of eligible cards to trash from hand."
                : `Choose up to ${resolvedAction.amount} card(s) to trash from hand.`
              : `Choose ${maximum} card(s) to trash from hand.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: orderedPool.map((instanceId, index) => ({
              id: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
              label: !concealFromChooser
                ? cardName(getCardForInstance(state, instanceId))
                : `Card ${index + 1}`,
              value: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
              ...(!concealFromChooser && { targetId: instanceId }),
            })),
            minSelections: minimum,
            maxSelections: maximum,
            context: {
              action: "trashFromHand",
            },
            resolutionContext: {
              intent: "effectTrashFromHandSelection",
              sourceInstanceId,
              controller,
              seat,
              action: resolvedAction,
              candidateIds: pool,
              ...(opaqueCandidateIds && { opaqueCandidateIds }),
            },
          });
          return false;
        }
      }
      const selected = selectedTargetIds;
      for (const instanceId of selected) {
        // The aggregate "trashes N card(s) from hand." line below is the
        // single player-facing record; per-card zone movements would repeat
        // it once per card.
        moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
          visibility: "private",
          suppressLog: true,
        });
      }
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} trashes ${selected.length} card${selected.length === 1 ? "" : "s"} from hand.`,
        {
          visibility: "private",
          privateMessages: {
            [seat]: `You trashed ${formatCardList(state, selected)}.`,
          },
          judgeMessage: `${getPlayer(state, seat).playerName} trashes ${formatCardList(state, selected)} from hand.`,
        },
      );
      recordHandTrashedByEffect(state, controller, sourceInstanceId, seat, selected);
      if (!resolvedAction.thenRequiresFullAmount || selected.length === requestedAmount) {
        for (const nestedAction of [...(resolvedAction.thenActions ?? [])].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
              previousActionTargetIds: selected,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "trashFromHandUntil":
      return processEffectAction(
        state,
        controller,
        sourceInstanceId,
        {
          action: "trashFromHand",
          player: action.player,
          amount: "all",
          untilHandSize: action.handSize,
          condition: action.condition,
        },
        selectedTargetIds,
        previousActionTargetIds,
      );
    case "revealFromHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const choiceSeat = action.chosenBy
        ? action.chosenBy === "self"
          ? controller
          : otherSeat(controller)
        : seat;
      const player = getPlayer(state, seat);
      const candidateIds = player.hand.filter((instanceId) =>
        (action.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
      );
      if (action.amount !== "all" && !action.upTo && candidateIds.length < action.amount) {
        return true;
      }
      const maximum =
        action.amount === "all"
          ? candidateIds.length
          : Math.min(action.amount, candidateIds.length);
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          return true;
        }
        if (action.amount === "all") {
          selectedTargetIds = [...candidateIds];
        } else if (!action.upTo && candidateIds.length === 1 && maximum === 1) {
          selectedTargetIds = [candidateIds[0]!];
        } else {
          const concealFromChooser = choiceSeat !== seat;
          const orderedHand = concealFromChooser
            ? randomizedConcealedHandOrder(
                state,
                sourceInstanceId,
                choiceSeat,
                player.hand,
                "reveal-from-hand",
              )
            : player.hand;
          const opaqueCandidateIds = concealFromChooser
            ? Object.fromEntries(
                orderedHand.map((instanceId, index) => [`hidden-card:${index + 1}`, instanceId]),
              )
            : undefined;
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: choiceSeat,
            label: `${effectSourceName(state, sourceInstanceId)} reveals from hand.`,
            details: `Choose ${maximum} card(s) to reveal from hand.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: orderedHand
              .filter((instanceId) => candidateIds.includes(instanceId))
              .map((instanceId, index) => ({
                id: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
                label: !concealFromChooser
                  ? cardName(getCardForInstance(state, instanceId))
                  : `Card ${index + 1}`,
                value: concealFromChooser ? `hidden-card:${index + 1}` : instanceId,
                ...(!concealFromChooser && { targetId: instanceId }),
              })),
            minSelections: action.upTo ? 0 : maximum,
            maxSelections: maximum,
            context: { action: "revealFromHand" },
            resolutionContext: {
              intent: "effectRevealFromHandSelection",
              sourceInstanceId,
              controller,
              seat,
              action,
              candidateIds,
              ...(opaqueCandidateIds && { opaqueCandidateIds }),
            },
          });
          return false;
        }
      }
      const selected = selectedTargetIds;
      if (
        selected.length > maximum ||
        (!action.upTo && selected.length !== maximum) ||
        new Set(selected).size !== selected.length ||
        selected.some((instanceId) => !candidateIds.includes(instanceId))
      ) {
        return false;
      }
      for (const instanceId of selected) {
        getInstance(state, instanceId).publicKnowledge = true;
      }
      emitLog(
        state,
        controller,
        `${getPlayer(state, seat).playerName} reveals ${formatCardList(state, selected)} from hand.`,
        {
          targetIds: selected,
          visibility: "public",
        },
      );
      for (const instanceId of selected) {
        getInstance(state, instanceId).publicKnowledge = false;
      }
      const followUp = action.ifRevealedCardMatches;
      const matches =
        selected.some((instanceId) =>
          (followUp?.filters ?? []).every((filter) => {
            const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
            return result.supported && result.matches;
          }),
        ) && followUp !== undefined;
      if (followUp && matches) {
        for (const nestedAction of [...followUp!.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds: selected,
          },
          { next: true },
        );
      }
      return true;
    }
    case "modifyPower": {
      const targetIds =
        // "previousActionTargets" with a self target keeps the previous ids for
        // value scaling (e.g. power per revealed Life cost) while the modifier
        // still lands on the card itself.
        action.previousActionTargets && !action.target.self
          ? (previousActionTargetIds ?? []).filter((instanceId) => {
              const pool = candidatePoolForTarget(
                state,
                controller,
                sourceInstanceId,
                action.target,
              );
              return (
                pool.supported &&
                pool.candidateIds.includes(instanceId) &&
                delayedTargetIsCurrent(state, action, instanceId)
              );
            })
          : resolveActionTargets(
              state,
              controller,
              sourceInstanceId,
              action,
              selectedTargetIds,
              previousActionTargetIds,
            );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      const cardGroupPool = action.valuePerCardGroup
        ? candidatePoolForTarget(
            state,
            controller,
            sourceInstanceId,
            action.valuePerCardGroup.target,
          )
        : undefined;
      const attachedDonPool = action.valuePerAttachedDonOn
        ? candidatePoolForTarget(state, controller, sourceInstanceId, action.valuePerAttachedDonOn)
        : undefined;
      const modifierValue = action.restedDonGroupSize
        ? Math.floor(getPlayer(state, controller).restedDon / action.restedDonGroupSize) *
          action.value
        : action.valuePerCardGroup && cardGroupPool?.supported
          ? Math.floor(cardGroupPool.candidateIds.length / action.valuePerCardGroup.size) *
            action.value
          : action.valuePerAttachedDonOn && attachedDonPool?.supported
            ? attachedDonPool.candidateIds.reduce(
                (total, instanceId) => total + getInstance(state, instanceId).attachedDon,
                0,
              ) * action.value
            : action.valuePerPreviousActionTargetCost
              ? action.value *
                (previousActionTargetIds ?? []).reduce(
                  (total, instanceId) => total + getCardCost(state, instanceId),
                  0,
                )
              : action.value +
                (action.valuePerPreviousActionTarget ?? 0) *
                  Math.floor(
                    (previousActionTargetIds?.length ?? 0) /
                      (action.previousActionTargetGroupSize ?? 1),
                  );
      for (const [targetIndex, targetId] of targetIds.entries()) {
        const targetModifierValue = action.distributedValues?.[targetIndex] ?? modifierValue;
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: targetModifierValue,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        action.distributedValues
          ? `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} distributed power modifiers ${action.distributedValues.slice(0, targetIds.length).join(", ")} ${durationLabel(action.duration)}.`
          : `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} ${modifierValue >= 0 ? "+" : ""}${modifierValue} power ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "swapBasePower": {
      const resolvedTargetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (resolvedTargetIds === "prompt" || !resolvedTargetIds) {
        return false;
      }
      const pairedTargetIds = action.pairedTarget
        ? candidatesForTarget(state, controller, sourceInstanceId, action.pairedTarget)
        : [];
      const targetIds = action.pairedTarget
        ? [resolvedTargetIds[0], ...(pairedTargetIds ?? []).slice(0, 1)].filter(
            (instanceId): instanceId is string => Boolean(instanceId),
          )
        : resolvedTargetIds;
      if (targetIds.length !== 2) {
        return true;
      }
      const [firstId, secondId] = targetIds;
      const firstPower = basePower(getCardForInstance(state, firstId!));
      const secondPower = basePower(getCardForInstance(state, secondId!));
      for (const [targetId, value] of [
        [firstId!, secondPower],
        [secondId!, firstPower],
      ] as const) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "basePower",
          value,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} swaps the base power of ${targetNames(state, targetIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setBasePower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const duration = action.duration ?? "thisTurn";
        addModifier(state, sourceInstanceId, targetId, {
          type: "basePower",
          value: action.value,
          duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, duration),
          expiresAtBattleId: duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets the base power of ${targetNames(state, targetIds)} to ${action.value} ${durationLabel(action.duration ?? "thisTurn")}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setBasePowerFrom": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (setPowerFromSourceIds?.length === 0) {
        // The player declined to choose a source: skip the copy.
        return true;
      }
      const sourcePoolResult = candidatePoolForTarget(
        state,
        controller,
        sourceInstanceId,
        action.source,
      );
      const sourcePool = sourcePoolResult.supported ? sourcePoolResult.candidateIds : null;
      if (
        action.source.chosenBy &&
        sourcePool &&
        sourcePool.length >= 1 &&
        !setPowerFromSourceIds
      ) {
        promptForSetPowerFromSource(
          state,
          controller,
          sourceInstanceId,
          action,
          sourcePool,
          previousActionTargetIds,
        );
        return false;
      }
      const sourceIds =
        setPowerFromSourceIds ??
        candidatesForTarget(state, controller, sourceInstanceId, {
          ...action.source,
          count: { amount: 1 },
        });
      if (!sourceIds || sourceIds.length !== 1) {
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: base-power source",
          "Setting base power from another card requires exactly one source card.",
        );
        return false;
      }
      const copiedBasePower =
        getSetBasePower(state, sourceIds[0]!) ??
        basePower(getCardForInstance(state, sourceIds[0]!));
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "basePower",
          value: copiedBasePower,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets the base power of ${targetNames(state, targetIds)} from ${targetNames(state, sourceIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [...targetIds, ...sourceIds],
          visibility: "public",
        },
      );
      return true;
    }
    case "copyPower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const copiedFromId = targetIds[0];
      if (!copiedFromId) {
        return true;
      }
      const copiedPower = getCardPower(state, copiedFromId);
      addModifier(state, sourceInstanceId, sourceInstanceId, {
        type: "basePower",
        value: copiedPower,
        duration: action.duration,
        expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets its base power to ${copiedPower} from ${cardName(getCardForInstance(state, copiedFromId))} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [sourceInstanceId, copiedFromId],
          visibility: "public",
        },
      );
      return true;
    }
    case "grantAttribute": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return (
              pool.supported &&
              pool.candidateIds.includes(instanceId) &&
              delayedTargetIsCurrent(state, action, instanceId)
            );
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "attribute",
          attribute: action.value,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} the ${action.value} attribute ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "grantKeyword": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return (
              pool.supported &&
              pool.candidateIds.includes(instanceId) &&
              delayedTargetIsCurrent(state, action, instanceId)
            );
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "keyword",
          keyword: action.keyword,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} [${action.keyword}] ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "modifyCost": {
      const duration = action.duration ?? "permanent";
      if (action.consumeOnPlay) {
        addModifier(state, sourceInstanceId, getPlayer(state, controller).leaderInstanceId, {
          type: "cost",
          value: action.value,
          playerScope: true,
          nextPaidPlay: { controller, target: action.target },
          duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, duration),
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} reduces the cost of the next qualifying card played from hand by ${Math.abs(action.value)}.`,
        );
        return true;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "cost",
          value: action.value,
          duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, duration),
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} gives ${targetNames(state, targetIds)} ${action.value >= 0 ? "+" : ""}${action.value} cost ${durationLabel(duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "modifyLifeValue": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      for (const targetId of targetIds) {
        if (getCardForInstance(state, targetId).cardType !== "leader") continue;
        addModifier(state, sourceInstanceId, targetId, {
          type: "lifeValue",
          value: action.value,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "addActivationCosts":
    case "addActivationConditions": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "activationRequirements",
          activationRequirements: {
            effectTypes: action.effectTypes,
            targetZoneChangeCounter: getInstance(state, targetId).zoneChangeCounter,
            ...(action.action === "addActivationCosts"
              ? { costs: action.costs }
              : { conditions: action.conditions }),
          },
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "setBaseCost": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      const duration = action.duration ?? "thisTurn";
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "baseCost",
          value: action.value,
          baseCostTargetGeneration: getInstance(state, targetId).zoneChangeCounter,
          duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, duration),
          expiresAtBattleId: duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets the base cost of ${targetNames(state, targetIds)} to ${action.value} ${durationLabel(duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setCost": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const duration = action.duration ?? "permanent";
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "setCost",
          value: action.value,
          duration,
          expiresAtTurn: duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      return true;
    }
    case "ko": {
      const participants = state.battle?.comparedParticipants;
      const battleSource = participants?.find((entry) => entry.instanceId === sourceInstanceId);
      const battleOpponent = participants?.find((entry) => entry.instanceId !== sourceInstanceId);
      const boundTargetIds =
        battleSource &&
        battleOpponent &&
        getInstance(state, sourceInstanceId).zoneChangeCounter === battleSource.zoneChangeCounter &&
        getInstance(state, battleOpponent.instanceId).zoneChangeCounter ===
          battleOpponent.zoneChangeCounter &&
        getInstance(state, battleOpponent.instanceId).zone === "character" &&
        getInstance(state, battleOpponent.instanceId).controller !== controller
          ? [battleOpponent.instanceId]
          : [];
      let targetIds = action.battleOpponent
        ? boundTargetIds
        : action.previousActionTargets
          ? (previousActionTargetIds ?? []).filter((instanceId) => {
              const pool = candidatePoolForTarget(
                state,
                controller,
                sourceInstanceId,
                action.target,
              );
              return (
                pool.supported &&
                pool.candidateIds.includes(instanceId) &&
                delayedTargetIsCurrent(state, action, instanceId)
              );
            })
          : resolveActionTargets(
              state,
              controller,
              sourceInstanceId,
              action,
              selectedTargetIds,
              previousActionTargetIds,
            );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      targetIds = targetIds.filter((targetId) =>
        (action.selectedTargetFilters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, targetId, filter);
          return result.supported && result.matches;
        }),
      );
      if (action.thenActions?.length && !koCompletionId) {
        koCompletionId = enqueueResolution(
          state,
          {
            kind: "effectKoComplete",
            effectTriggerEvent: currentEffectTriggerEvent(state),
            sourceInstanceId,
            sourceZoneChangeCounter: getInstance(state, sourceInstanceId).zoneChangeCounter,
            controller,
            successfulTargetIds: [],
            actions: action.thenActions,
          },
          { next: true },
        ).id;
      }
      // Freeze the entire original group before any member's aura disappears.
      // The process survives declined replacements and saved continuations; a
      // transformed replacement action starts its own process and observations.
      if (process && !process.koBasePowers) {
        process.koBasePowers = targetIds.map((instanceId) => ({
          instanceId,
          zoneChangeCounter: getInstance(state, instanceId).zoneChangeCounter,
          value:
            getSetBasePower(state, instanceId) ?? basePower(getCardForInstance(state, instanceId)),
        }));
      }
      // One K.O. instruction affects its selected group simultaneously. Protection
      // present now still applies if its source is removed earlier in this loop
      // (OP04-119). Protected cards must not enter a replacement continuation.
      const initiallyProtectedIds = new Set(
        targetIds.filter(
          (id) =>
            isKoPreventedByModifier(state, id, sourceInstanceId, "effect") ||
            isCharacterRemovalPreventedByPermanentEffect(state, id, controller),
        ),
      );
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          initiallyProtectedIds.has(targetId) ||
          isKoPreventedByModifier(state, targetId, sourceInstanceId, "effect")
        ) {
          emitLog(
            state,
            controller,
            `${cardName(getCardForInstance(state, targetId))} cannot be K.O.'d.`,
            {
              sourceCardId: getInstance(state, sourceInstanceId).cardId,
              sourceInstanceId,
              targetIds: [targetId],
              visibility: "public",
            },
          );
          continue;
        }
        const replacements = findKoReplacements(
          state,
          targetId,
          controller,
          "effect",
          sourceInstanceId,
        );
        const replacement = replacements[0];
        if (replacement) {
          const remainingTargetIds = targetIds
            .slice(targetIndex + 1)
            .filter((id) => !initiallyProtectedIds.has(id));
          const replacementTargetIds = [
            targetId,
            ...remainingTargetIds.filter((remainingTargetId) => {
              const remainingReplacement = findKoReplacement(
                state,
                remainingTargetId,
                controller,
                "effect",
                sourceInstanceId,
              );
              return (
                remainingReplacement?.sourceInstanceId === replacement.sourceInstanceId &&
                remainingReplacement.replacementEffectIndex === replacement.replacementEffectIndex
              );
            }),
          ];
          if (replacement.effect.mandatory && replacements.length === 1) {
            getInstance(state, replacement.sourceInstanceId).usedEffectKeys.push(
              replacement.effectKey,
            );
            if (remainingTargetIds.length > 0) {
              enqueueResolution(
                state,
                {
                  kind: "effectAction",
                  removalCostPaymentId,
                  koCompletionId,
                  sourceInstanceId,
                  controller,
                  action: {
                    action: "ko",
                    target: {
                      player: "both",
                      zones: ["character"],
                      count: { amount: "all" },
                    },
                    previousActionTargets: true,
                  },
                  previousActionTargetIds: remainingTargetIds.filter(
                    (remainingTargetId) => !replacementTargetIds.includes(remainingTargetId),
                  ),
                },
                { next: true },
              );
            }
            enqueueResolution(
              state,
              {
                kind: "effectAction",
                sourceInstanceId: replacement.sourceInstanceId,
                controller: replacement.controller,
                action: replacement.effect.replacementAction,
                replacementProcess: extendReplacementProcess(
                  state,
                  replacement.sourceInstanceId,
                  replacement.effectKey,
                ),
                previousActionTargetIds: replacementTargetIds,
              },
              { next: true },
            );
            return false;
          }
          const replacementChoices = replacements.map((candidate) => ({
            id: replacementOptionId(candidate),
            sourceInstanceId: candidate.sourceInstanceId,
            replacementEffectIndex: candidate.replacementEffectIndex,
            replacementEffectKey: candidate.effectKey,
            replacementAction: candidate.effect.replacementAction,
            replacementTargetIds: [
              targetId,
              ...remainingTargetIds.filter((id) =>
                findKoReplacements(state, id, controller, "effect", sourceInstanceId).some(
                  (eligible) => replacementOptionId(eligible) === replacementOptionId(candidate),
                ),
              ),
            ],
          }));
          createChoicePrompt(state, {
            choiceKind: replacements.length > 1 ? "chooseOption" : "confirm",
            replacementGroup: replacements.map((candidate) =>
              replacementProcessKey(state, candidate.sourceInstanceId, candidate.effectKey),
            ),
            seat: replacement.controller,
            label: `${effectSourceName(state, replacement.sourceInstanceId)} may replace the K.O.`,
            details: "Apply the replacement effect instead of allowing the K.O.?",
            sourceCardId: getInstance(state, replacement.sourceInstanceId).cardId,
            sourceInstanceId: replacement.sourceInstanceId,
            eventId: null,
            options:
              replacements.length > 1
                ? [
                    ...(!replacements.some((candidate) => candidate.effect.mandatory)
                      ? [{ id: "no", label: "Decline these replacements", value: "no" }]
                      : []),
                    ...replacementChoices.map((choice) => ({
                      id: choice.id,
                      value: choice.id,
                      label: replacementChoiceLabel(state, choice.sourceInstanceId),
                      targetId: choice.sourceInstanceId,
                    })),
                  ]
                : [
                    { id: "no", label: "Allow K.O.", value: "no" },
                    { id: "yes", label: "Apply replacement", value: "yes" },
                  ],
            minSelections: 1,
            maxSelections: 1,
            context: { action: "ko", replacement: true },
            resolutionContext: {
              intent: "effectKoReplacement",
              removalCostPaymentId,
              koCompletionId,
              replacementRequired: replacements.some((candidate) => candidate.effect.mandatory),
              replacementChoices: replacements.length > 1 ? replacementChoices : undefined,
              targetId,
              controller: replacement.controller,
              replacementSourceInstanceId: replacement.sourceInstanceId,
              replacementEffectIndex: replacement.replacementEffectIndex,
              replacementEvent: replacement.effect.replacedEvent as "ko" | "removeFromField",
              replacementEffectKey: replacement.effectKey,
              replacementAction: replacement.effect.replacementAction,
              koSourceInstanceId: sourceInstanceId,
              koController: controller,
              replacementTargetIds,
              remainingTargetIds,
            },
          });
          return false;
        }
        if (koCharacterByEffect(state, targetId, controller, sourceInstanceId)) {
          const completion = state.resolutionQueue.find((item) => item.id === koCompletionId);
          if (completion?.kind === "effectKoComplete")
            completion.successfulTargetIds.push(targetId);
          const payment = state.resolutionQueue.find((item) => item.id === removalCostPaymentId);
          if (payment?.kind === "effectRemovalCostComplete") payment.paidTargetIds.push(targetId);
        }
      }
      return true;
    }
    case "simultaneousStateChange":
      return beginSimultaneousStateChange(state, controller, sourceInstanceId, action);
    case "rest": {
      if (state.donIdentities && action.target.zones.includes("costArea")) {
        const zones = action.target.zones.filter(
          (zone): zone is "leader" | "character" | "stage" | "costArea" =>
            ["leader", "character", "stage", "costArea"].includes(zone),
        );
        return beginSimultaneousStateChange(
          state,
          controller,
          sourceInstanceId,
          {
            action: "simultaneousStateChange",
            groups: [{ state: "rested", target: { ...action.target, zones } }],
          },
          true,
        );
      }
      const selectionMode = currentReplacementProcess(state)?.applied.length
        ? "performable"
        : "selection";
      if (action.target.zones.includes("costArea") && selectedTargetIds === undefined) {
        const candidateIds = restActionCandidateIds(
          state,
          controller,
          sourceInstanceId,
          action.target,
          selectionMode,
        );
        const requested =
          action.target.count.amount === "all"
            ? candidateIds.length
            : Math.min(action.target.count.amount, candidateIds.length);
        if (requested === 0) {
          return true;
        }
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: action.target.chosenBy === "opponent" ? otherSeat(controller) : controller,
          label: `${effectSourceName(state, sourceInstanceId)} rests cards.`,
          details: `Choose ${requested} card${requested === 1 ? "" : "s"} or DON!! to rest.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: candidateIds.map((id) => ({
            id,
            label: id.startsWith("active-don:")
              ? "Active DON!! in cost area"
              : id.startsWith("rested-don:")
                ? "Rested DON!! in cost area"
                : cardName(getCardForInstance(state, id)),
            value: id,
            ...(!id.startsWith("active-don:") && !id.startsWith("rested-don:")
              ? { targetId: id }
              : {}),
          })),
          minSelections: action.target.count.upTo ? 0 : requested,
          maxSelections: requested,
          context: { action: "rest", resource: "fieldOrDon" },
          resolutionContext: {
            intent: "effectMixedRestSelection",
            sourceInstanceId,
            controller,
            action,
            candidateIds,
            requested,
          },
        });
        return false;
      }
      if (action.target.zones.includes("costArea") && selectedTargetIds) {
        const liveCandidateIds = restActionCandidateIds(
          state,
          controller,
          sourceInstanceId,
          action.target,
          selectionMode,
        );
        const requested =
          action.target.count.amount === "all"
            ? liveCandidateIds.length
            : Math.min(action.target.count.amount, liveCandidateIds.length);
        if (
          selectedTargetIds.length < (action.target.count.upTo ? 0 : requested) ||
          selectedTargetIds.length > requested ||
          new Set(selectedTargetIds).size !== selectedTargetIds.length ||
          selectedTargetIds.some((id) => !liveCandidateIds.includes(id))
        ) {
          return false;
        }
        const consumedDonIds: string[] = [];
        for (const [targetIndex, id] of selectedTargetIds.entries()) {
          if (id.startsWith("rested-don:")) continue;
          if (id.startsWith("active-don:")) {
            const seat = id.split(":")[1] as MatchSeat;
            getPlayer(state, seat).activeDon -= 1;
            getPlayer(state, seat).restedDon += 1;
            consumedDonIds.push(id);
          } else {
            if (
              promptForEffectRestReplacement(
                state,
                id,
                controller,
                sourceInstanceId,
                action,
                selectedTargetIds.slice(targetIndex + 1).map((remainingId) => {
                  if (!remainingId.startsWith("active-don:")) return remainingId;
                  const [, seat, indexText] = remainingId.split(":");
                  const index = Number(indexText);
                  const removedBefore = consumedDonIds.filter((used) => {
                    const [, usedSeat, usedIndex] = used.split(":");
                    return usedSeat === seat && Number(usedIndex) < index;
                  }).length;
                  return `active-don:${seat}:${index - removedBefore}`;
                }),
              )
            ) {
              return false;
            }
            restCharacterByEffect(state, id, controller, sourceInstanceId);
          }
        }
        return true;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const restedIds: string[] = [];
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          promptForEffectRestReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
          )
        ) {
          return false;
        }
        if (restCharacterByEffect(state, targetId, controller, sourceInstanceId))
          restedIds.push(targetId);
      }
      if (restedIds.length > 0)
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} rests ${targetNames(state, restedIds)}.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: restedIds,
            visibility: "public",
          },
        );
      return true;
    }
    case "restDonForPower": {
      const maximum = getPlayer(state, controller).activeDon;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may rest DON!! cards.`,
        details: `Choose how many active DON!! cards to rest for +${action.valuePerDon} power each.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: Array.from({ length: maximum + 1 }, (_, count) => ({
          id: String(count),
          label: String(count),
          value: String(count),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { action: "restDonForPower", resource: "don" },
        resolutionContext: {
          intent: "effectRestDonForPowerCount",
          sourceInstanceId,
          controller,
          action,
          maximum,
        },
      });
      return false;
    }
    case "setActive": {
      if (action.target.zones.includes("costArea")) {
        const seat = action.target.player === "self" ? controller : otherSeat(controller);
        const player = getPlayer(state, seat);
        if (isDonActivationByCharacterEffectPrevented(state, sourceInstanceId, seat)) {
          return true;
        }
        const requestedAmount =
          action.target.count.amount === "all" ? player.restedDon : action.target.count.amount;
        const maximum = Math.min(requestedAmount, player.restedDon);
        if (maximum === 0) {
          return true;
        }
        if (action.target.count.upTo) {
          createChoicePrompt(state, {
            choiceKind: "chooseOption",
            seat: controller,
            label: `${effectSourceName(state, sourceInstanceId)} may set up to ${maximum} DON!! card(s) as active.`,
            details: `Choose how many rested DON!! cards to set as active, up to ${maximum}.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: Array.from({ length: maximum + 1 }, (_, count) => ({
              id: String(count),
              label: String(count),
              value: String(count),
            })),
            minSelections: 1,
            maxSelections: 1,
            context: {
              action: "setActive",
              resource: "don",
            },
            resolutionContext: {
              intent: "effectSetActiveDon",
              sourceInstanceId,
              controller,
              maximum,
            },
          });
          return false;
        }
        if (state.donIdentities)
          return continueDonTransfers(state, {
            controller,
            sourceInstanceId,
            effectTriggerEvent: currentEffectTriggerEvent(state),
            moves: [
              donTransferMove(state, { seat, area: "rested" }, { seat, area: "active" }, maximum),
            ],
          });
        player.restedDon -= maximum;
        player.activeDon += maximum;
        return true;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        getInstance(state, targetId).rested = false;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets ${targetNames(state, targetIds)} active.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "returnToHand": {
      const chosenTargetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (chosenTargetIds === "prompt" || !chosenTargetIds) {
        return false;
      }
      movementCompletionId ??= enqueueResolution(
        state,
        {
          kind: "effectMovementComplete",
          sourceInstanceId,
          controller,
          movedIds: [],
          delayedActionChainId: delayedActionChain(action),
        },
        { next: true },
      ).id;
      const targetIds = chosenTargetIds.filter(
        (id) => !isCharacterRemovalPreventedByPermanentEffect(state, id, controller),
      );
      const lifeReplacementIds = replacedLifeToHandIds(state, targetIds);
      if (lifeReplacementIds.length > 0 && lifeReplacementIds.length < targetIds.length) {
        // CR3-1-7/8: settle the simultaneous Life destination and its private
        // order before another replacement can read or change that deck.
        // The remaining field processing belongs to this same movement result.
        const lifeReplacementSet = new Set(lifeReplacementIds);
        for (const id of lifeReplacementIds)
          removeCardByEffectAction(state, id, controller, sourceInstanceId, action);
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            // This is a continuation of the same action, not a new condition check.
            action: { ...action, condition: undefined },
            selectedTargetIds: targetIds.filter((id) => !lifeReplacementSet.has(id)),
            movementCompletionId,
            skipRemovalReplacementIds,
          },
          { next: true },
        );
        promptForLifeReplacementOrder(
          state,
          completedLifeReplacementMoves(state, lifeReplacementIds),
        );
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
            undefined,
            undefined,
            skipRemovalReplacementIds,
            undefined,
            movementCompletionId,
          )
        ) {
          return false;
        }
        const replacedLife = replacedLifeToHandIds(state, [targetId]);
        if (removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action)) {
          const result = state.resolutionQueue.find((item) => item.id === movementCompletionId);
          if (result?.kind === "effectMovementComplete") result.movedIds.push(targetId);
        }
        if (replacedLife.length && getInstance(state, targetId).zone === "deck") {
          const result = state.resolutionQueue.find((item) => item.id === movementCompletionId);
          if (result?.kind === "effectMovementComplete")
            (result.replacedLifeCards ??= []).push(
              ...completedLifeReplacementMoves(state, [targetId]),
            );
        }
      }
      if (targetIds.length > 0) {
        for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
              previousActionTargetIds: targetIds,
            },
            { next: true },
          );
        }
      }
      // The movement boundary must precede nested continuations as well as
      // sibling actions, so private replacement order and actual counts settle first.
      const completionIndex = state.resolutionQueue.findIndex(
        (item) => item.id === movementCompletionId,
      );
      if (completionIndex > 0) {
        const [completion] = state.resolutionQueue.splice(completionIndex, 1);
        if (completion) state.resolutionQueue.unshift(completion);
      }
      return true;
    }
    case "returnToDeck": {
      removalCostPaymentId ??= returnToDeckContinuation?.removalCostPaymentId;
      const chosenTargetIds =
        action.previousActionTargets || action.costPaymentTargets
          ? (action.costPaymentTargets
              ? (selectedTargetIds ?? [])
              : (previousActionTargetIds ?? [])
            ).filter((instanceId) => {
              const pool = candidatePoolForTarget(
                state,
                controller,
                sourceInstanceId,
                action.target,
              );
              return (
                pool.supported &&
                pool.candidateIds.includes(instanceId) &&
                delayedTargetIsCurrent(state, action, instanceId)
              );
            })
          : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (chosenTargetIds === "prompt" || !chosenTargetIds) {
        return false;
      }
      const targetIds = chosenTargetIds.filter(
        (id) => !isCharacterRemovalPreventedByPermanentEffect(state, id, controller),
      );
      if (targetIds.length === 0) return true;
      const orderedHandOwners =
        action.order === "any" &&
        action.position === "any" &&
        targetIds.length > 1 &&
        action.target.zones.every((zone) => zone === "hand")
          ? [
              ...new Set(
                targetIds.map((targetId) =>
                  returnToDeckDestination(state, controller, targetId, action),
                ),
              ),
            ]
          : [];
      const orderedHandOwner = orderedHandOwners[0];
      if (
        orderedHandOwners.length === 1 &&
        orderedHandOwner &&
        targetIds.every((targetId) => getInstance(state, targetId).controller === orderedHandOwner)
      ) {
        createChoicePrompt(state, {
          choiceKind: "orderCards",
          seat: orderedHandOwner,
          label: `${effectSourceName(state, sourceInstanceId)} orders cards for the deck.`,
          details: `Order the ${targetIds.length} cards from first to last.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: targetIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          })),
          minSelections: targetIds.length,
          maxSelections: targetIds.length,
          context: { action: "returnToDeck", ordered: true },
          resolutionContext: {
            intent: "effectReturnToDeckOrder",
            sourceInstanceId,
            controller,
            owner: orderedHandOwner,
            action,
            targetIds,
            previousActionTargetIds,
          },
        });
        return false;
      }
      if (action.position === "any") {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} chooses the deck position for the selected card(s).`,
          details: `Place the selected card${targetIds.length === 1 ? "" : "s"} at the top or bottom of your deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "top", label: "Top of deck", value: "top" },
            { id: "bottom", label: "Bottom of deck", value: "bottom" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "returnToDeck", position: "topOrBottom" },
          resolutionContext: {
            intent: "effectDeckPosition",
            sourceInstanceId,
            controller,
            action,
            selectedTargetIds: targetIds,
          },
        });
        return false;
      }
      if (!returnToDeckContinuation) {
        const ownerOrder = [state.activeSeat, otherSeat(state.activeSeat)];
        const ownerGroups = ownerOrder
          .map(
            (owner): ReturnToDeckOwnerGroup => ({
              owner,
              targetIds: targetIds.filter(
                (targetId) =>
                  returnToDeckDestination(state, controller, targetId, action) === owner,
              ),
            }),
          )
          .filter((group) => group.targetIds.length > 0);
        const [firstGroup, ...remainingOwnerGroups] = ownerGroups;
        const targetChooser =
          action.target.chosenBy === "opponent" ? otherSeat(controller) : controller;
        const selectionAlreadyProvidesOwnerOrder =
          selectedTargetIds !== undefined &&
          ownerGroups.length === 1 &&
          firstGroup?.owner === targetChooser &&
          action.target.zones.every((zone) => zone === "hand");
        if (
          firstGroup &&
          ownerGroups.some((group) => group.targetIds.length > 1) &&
          !selectionAlreadyProvidesOwnerOrder
        ) {
          enqueueReturnToDeckOwnerGroup(
            state,
            controller,
            sourceInstanceId,
            action,
            firstGroup,
            remainingOwnerGroups,
            targetIds,
            removalCostPaymentId,
          );
          return true;
        }
        for (const [targetIndex, targetId] of targetIds.entries()) {
          if (
            !skipRemovalReplacementIds?.includes(targetId) &&
            promptForEffectRemovalReplacement(
              state,
              targetId,
              controller,
              sourceInstanceId,
              action,
              targetIds.slice(targetIndex + 1),
              undefined,
              undefined,
              skipRemovalReplacementIds,
              removalCostPaymentId,
            )
          ) {
            return false;
          }
          if (
            removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action) &&
            removalCostPaymentId
          ) {
            const payment = state.resolutionQueue.find((item) => item.id === removalCostPaymentId);
            if (payment?.kind === "effectRemovalCostComplete") payment.paidTargetIds.push(targetId);
          }
        }
        return true;
      }
      if (targetIds.length > 1 && !returnToDeckContinuation.orderResolved) {
        promptForReturnToDeckOwnerOrder(
          state,
          controller,
          sourceInstanceId,
          action,
          targetIds,
          returnToDeckContinuation,
        );
        return false;
      }
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
            returnToDeckContinuation,
            undefined,
            skipRemovalReplacementIds,
            removalCostPaymentId,
          )
        ) {
          return false;
        }
        const moved = removeCardByEffectAction(
          state,
          targetId,
          controller,
          sourceInstanceId,
          action,
          returnToDeckContinuation.publicTargetIds.length > 1,
        );
        if (moved && removalCostPaymentId) {
          const payment = state.resolutionQueue.find((item) => item.id === removalCostPaymentId);
          if (payment?.kind === "effectRemovalCostComplete") payment.paidTargetIds.push(targetId);
        }
      }
      if (
        returnToDeckContinuation.finalizeOwnerGroup &&
        returnToDeckContinuation.publicTargetIds.length > 1
      ) {
        finalizeReturnToDeckOwnerGroup(
          state,
          controller,
          sourceInstanceId,
          action,
          returnToDeckContinuation,
        );
      } else if (returnToDeckContinuation.finalizeOwnerGroup) {
        const [nextGroup, ...remainingOwnerGroups] = returnToDeckContinuation.remainingOwnerGroups;
        if (nextGroup) {
          enqueueReturnToDeckOwnerGroup(
            state,
            controller,
            sourceInstanceId,
            action,
            nextGroup,
            remainingOwnerGroups,
            returnToDeckContinuation.allTargetIds,
            removalCostPaymentId,
          );
        }
      }
      return true;
    }
    case "addDon": {
      const recipient = action.player === "opponent" ? otherSeat(controller) : controller;
      const player = getPlayer(state, recipient);
      if (
        action.state !== "rested" &&
        isDonActivationByCharacterEffectPrevented(state, sourceInstanceId, recipient)
      ) {
        return true;
      }
      const requested = action.count.amount === "all" ? player.donDeckCount : action.count.amount;
      const maximum = Math.min(requested, player.donDeckCount);
      if (maximum === 0) {
        return true;
      }
      if (action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: recipient,
          label: `${effectSourceName(state, sourceInstanceId)} may add DON!!`,
          details: `Choose how many DON!! cards to add from your DON!! deck, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "addDon", resource: "don" },
          resolutionContext: {
            intent: "effectAddDon",
            sourceInstanceId,
            controller: recipient,
            maximum,
            rested: action.state === "rested",
          },
        });
        return false;
      }
      addDonFromDeck(state, recipient, maximum, action.state === "rested");
      return true;
    }
    case "addToLife": {
      const isSupportedTrashTarget =
        action.target.player !== "both" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "trash" &&
        action.position !== "choice";
      if (isSupportedTrashTarget) {
        const poolResult = candidatePoolForTarget(
          state,
          controller,
          sourceInstanceId,
          action.target,
        );
        const availableIds = poolResult.supported ? poolResult.candidateIds : [];
        const targetIds = selectedTargetIds ?? availableIds;
        const requestedCount =
          typeof action.target.count.amount === "number"
            ? action.target.count.amount
            : targetIds.length;
        if (!selectedTargetIds && targetIds.length > requestedCount) {
          promptForTargetSelection(
            state,
            controller,
            sourceInstanceId,
            action,
            targetIds,
            previousActionTargetIds,
          );
          return false;
        }
        for (const targetId of targetIds) {
          const owner = getInstance(state, targetId).owner;
          moveCard(state, targetId, owner, "life", {
            faceUp: action.faceUp ?? false,
            publicKnowledge: action.faceUp ?? false,
            actor: controller,
            lifePosition: action.position === "bottom" ? "bottom" : "top",
          });
        }
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} adds ${targetNames(state, targetIds)} to the top of ${getPlayer(state, controller).playerName}'s Life.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      const requestedAmount = action.target.count.amount;
      const isSupportedDeckTarget =
        action.target.player !== "both" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "deck" &&
        !action.target.filters?.length &&
        typeof requestedAmount === "number";
      if (isSupportedDeckTarget && typeof requestedAmount === "number") {
        if (action.position === "choice") {
          recordCapabilityIssue(state, {
            kind: "unsupportedAction",
            code: "action:addToLife",
            actor: controller,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            details: `${cardName(getCardForInstance(state, sourceInstanceId))} cannot choose a Life position for cards added directly from the deck.`,
          });
          return false;
        }
        const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
        const maximum = Math.min(requestedAmount, getPlayer(state, targetSeat).deck.length);
        if (maximum === 0) {
          return true;
        }
        if (action.target.count.upTo) {
          createChoicePrompt(state, {
            choiceKind: "chooseOption",
            seat: controller,
            label: `${effectSourceName(state, sourceInstanceId)} may add up to ${maximum} card(s) to Life.`,
            details: `Choose how many cards to add from the top of the deck to Life, up to ${maximum}.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: Array.from({ length: maximum + 1 }, (_, count) => ({
              id: String(count),
              label: String(count),
              value: String(count),
            })),
            minSelections: 1,
            maxSelections: 1,
            context: { action: "addToLife", resource: "life" },
            resolutionContext: {
              intent: "effectAddToLifeFromDeck",
              sourceInstanceId,
              controller,
              action,
              maximum,
            },
          });
          return false;
        }
        return addTopDeckCardsToLife(state, controller, sourceInstanceId, action, maximum);
      }

      const chosenTargetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return (
              pool.supported &&
              pool.candidateIds.includes(instanceId) &&
              delayedTargetIsCurrent(state, action, instanceId)
            );
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (chosenTargetIds === "prompt" || chosenTargetIds === null) return false;
      const targetIds = chosenTargetIds.filter(
        (id) => !isCharacterRemovalPreventedByPermanentEffect(state, id, controller),
      );
      if (targetIds.length === 0) return true;
      if (action.position === "choice") {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} Life position.`,
          details: "Choose whether to add the selected card to the top or bottom of Life.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "top", label: "Top of Life", value: "top" },
            { id: "bottom", label: "Bottom of Life", value: "bottom" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "addToLife", resource: "life" },
          resolutionContext: {
            intent: "effectLifePosition",
            removalCostPaymentId,
            sourceInstanceId,
            controller,
            action,
            selectedTargetIds: targetIds,
          },
        });
        return false;
      }
      for (const [index, targetId] of targetIds.entries()) {
        if (isCharacterRemovalPreventedByPermanentEffect(state, targetId, controller)) continue;
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(index + 1),
            undefined,
            undefined,
            skipRemovalReplacementIds,
            removalCostPaymentId,
          )
        )
          return false;
        const moved = removeCardByEffectAction(
          state,
          targetId,
          controller,
          sourceInstanceId,
          action,
        );
        if (moved && removalCostPaymentId) {
          const payment = state.resolutionQueue.find((item) => item.id === removalCostPaymentId);
          if (payment?.kind === "effectRemovalCostComplete") payment.paidTargetIds.push(targetId);
        }
      }
      return true;
    }
    case "trashFromDeck": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const requestedAmount = action.amountFromPreviousActionTargets
        ? (previousActionTargetIds?.length ?? 0)
        : action.amount;
      const maximum = Math.min(requestedAmount, getPlayer(state, targetSeat).deck.length);
      // Resolve as much as possible (1-3-2), including the independent
      // "Then" continuation when no cards remain (4-10-2).
      if (maximum === 0) {
        return trashTopDeckCards(state, controller, sourceInstanceId, action, 0, requestedAmount);
      }
      if (action.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may trash cards from the deck.`,
          details: `Choose how many cards to trash from the top of the deck, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "trashFromDeck", resource: "deck" },
          resolutionContext: {
            intent: "effectTrashFromDeckCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      trashTopDeckCards(state, controller, sourceInstanceId, action, maximum, requestedAmount);
      return true;
    }
    case "removeFromLife": {
      const supported =
        action.destination === "trash" ||
        action.destination === "hand" ||
        action.destination === "deck";
      if (!supported) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:removeFromLife",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses a removeFromLife variant that is not automated yet.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported action",
          `${cardName(getCardForInstance(state, sourceInstanceId))} uses a removeFromLife variant that is not automated yet.`,
        );
        return false;
      }

      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, targetSeat);
      const requested =
        "untilRemaining" in action.count
          ? Math.max(0, player.life.length - action.count.untilRemaining)
          : action.count.amount === "all"
            ? player.life.length
            : action.count.amount;
      const maximum = Math.min(requested, player.life.length);
      const upTo = !("untilRemaining" in action.count) && action.count.upTo === true;
      if (action.position === "choice" && maximum > 0) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} Life position.`,
          details: "Choose whether to remove from the top or bottom of Life.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "top", label: "Top of Life", value: "top" },
            { id: "bottom", label: "Bottom of Life", value: "bottom" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectLifePosition",
            removalCostPaymentId,
            sourceInstanceId,
            controller,
            action,
          },
        });
        return false;
      }
      if (action.destination === "deck" && action.position === undefined && maximum > 0) {
        const concealFromChooser = targetSeat !== controller;
        const opaqueCandidateIds = concealFromChooser
          ? Object.fromEntries(
              player.life.map((instanceId, index) => [`hidden-life:${index + 1}`, instanceId]),
            )
          : undefined;
        createChoicePrompt(state, {
          choiceKind: "selectCards",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} removes Life cards.`,
          details: upTo
            ? `Choose up to ${maximum} card(s) to remove from Life.`
            : `Choose ${maximum} card(s) to remove from Life.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: player.life.map((instanceId, index) => ({
            id: concealFromChooser ? `hidden-life:${index + 1}` : instanceId,
            label: `Life card ${index + 1}`,
            value: concealFromChooser ? `hidden-life:${index + 1}` : instanceId,
          })),
          minSelections: upTo ? 0 : maximum,
          maxSelections: maximum,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectRemoveFromLifeSelection",
            sourceInstanceId,
            controller,
            action,
            candidateIds: [...player.life],
            ...(opaqueCandidateIds && { opaqueCandidateIds }),
            minimum: upTo ? 0 : maximum,
            maximum,
          },
        });
        return false;
      }
      if (!("untilRemaining" in action.count) && action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may remove Life cards.`,
          details: `Choose how many cards to remove from Life, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "removeFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectRemoveFromLifeCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      return removeLifeCards(state, controller, sourceInstanceId, action, maximum);
    }
    case "freeze": {
      const mixedDonTarget = action.target.zones.includes("costArea");
      if (mixedDonTarget && selectedTargetIds === undefined && !action.previousActionTargets) {
        const candidateIds = freezeActionCandidateIds(state, controller, sourceInstanceId, action);
        const requested =
          action.target.count.amount === "all"
            ? candidateIds.length
            : Math.min(action.target.count.amount, candidateIds.length);
        if (requested === 0) {
          return true;
        }
        createChoicePrompt(state, {
          choiceKind: "selectTargets",
          seat: controller,
          label: targetSelectionLabel(
            state,
            effectSourceName(state, sourceInstanceId),
            candidateIds,
            new Map(
              candidateIds
                .filter((id) => id.startsWith("rested-don:"))
                .map((id): [string, string] => [id, "Rested DON!! in cost area"]),
            ),
          ),
          details: "Choose valid targets to continue resolving the effect.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: candidateIds.map((id) => ({
            id,
            label: id.startsWith("rested-don:")
              ? "Rested DON!! in cost area"
              : cardName(getCardForInstance(state, id)),
            value: id,
            ...(!id.startsWith("rested-don:") && { targetId: id }),
          })),
          minSelections: action.target.count.upTo ? 0 : requested,
          maxSelections: requested,
          context: { action: "freeze" },
          resolutionContext: {
            intent: "effectTargetSelection",
            sourceInstanceId,
            controller,
            action,
          },
        });
        return false;
      }
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((instanceId) => {
            const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
            return (
              pool.supported &&
              pool.candidateIds.includes(instanceId) &&
              delayedTargetIsCurrent(state, action, instanceId)
            );
          })
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const refreshSeat =
        action.refreshPlayer === "self"
          ? controller
          : action.refreshPlayer === "opponent"
            ? otherSeat(controller)
            : undefined;
      // A player's Refresh only readies that player's cards. A chosen card on
      // the other field remains a legal choice, but this restriction has no effect.
      const applicableIds = targetIds.filter(
        (id) =>
          refreshSeat === undefined ||
          (id.startsWith("rested-don:") ? id.split(":")[1] : getInstance(state, id).controller) ===
            refreshSeat,
      );
      const cardTargetIds = applicableIds.filter((targetId) => !targetId.startsWith("rested-don:"));
      const donTargetIds = applicableIds.filter((targetId) => targetId.startsWith("rested-don:"));
      for (const targetId of cardTargetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "freeze",
          duration: "untilStartOfNextTurn",
          expiresAtTurn: null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: getInstance(state, targetId).controller,
        });
      }
      for (const targetId of donTargetIds) {
        const seat = targetId.split(":")[1] as MatchSeat;
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "freezeDon",
          duration: "untilStartOfNextTurn",
          expiresAtTurn: null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: seat,
        });
      }
      if (applicableIds.length > 0) {
        const targetDescription = [
          ...(cardTargetIds.length > 0 ? [targetNames(state, cardTargetIds)] : []),
          ...(donTargetIds.length > 0
            ? [`${donTargetIds.length} DON!! card${donTargetIds.length === 1 ? "" : "s"}`]
            : []),
        ].join(" and ");
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} prevents ${targetDescription} from becoming active in the next Refresh Phase.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: cardTargetIds,
            visibility: "public",
          },
        );
      }
      return true;
    }
    case "battleKoReplacement": {
      const targetPool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
      if (!targetPool.supported) {
        return false;
      }
      for (const targetId of targetPool.candidateIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "battleKoReplacement",
          duration: action.duration,
          expiresAtTurn: state.turnNumber,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} lets its controller replace battle K.O.s of ${targetPool.candidateIds.length} current Character${targetPool.candidateIds.length === 1 ? "" : "s"} by trashing a card from hand during this turn.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: targetPool.candidateIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "giveDon": {
      let player = getPlayer(
        state,
        action.donorPlayer === "opponent" ? otherSeat(controller) : controller,
      );
      const availableDon = availableDonForGive(state, controller, action);
      if (action.distribution === "each") {
        if (action.count.amount === "all") {
          return false;
        }
        if (action.count.upTo) {
          const targetIds = resolveActionTargets(
            state,
            controller,
            sourceInstanceId,
            action,
            selectedTargetIds,
          );
          if (targetIds === "prompt" || !targetIds) return false;
          return continueGiveDonEach(state, {
            intent: "effectGiveDonEachCount",
            sourceInstanceId,
            controller,
            action,
            recipients: targetIds.map((instanceId) => ({
              instanceId,
              zoneChangeCounter: getInstance(state, instanceId).zoneChangeCounter,
            })),
            allocations: [],
          });
        }
        const amountPerTarget = action.count.amount;
        const targetPool = candidatePoolForTarget(
          state,
          controller,
          sourceInstanceId,
          action.target,
        );
        if (!targetPool.supported) {
          return false;
        }
        const requestedTargets =
          action.target.count.amount === "all"
            ? targetPool.candidateIds.length
            : action.target.count.amount;
        const maximumTargets = Math.min(
          requestedTargets,
          targetPool.candidateIds.length,
          Math.floor(availableDon / amountPerTarget),
        );
        if (maximumTargets === 0) {
          return true;
        }
        const distributedAction: Extract<Action, { action: "giveDon" }> = {
          ...action,
          target: {
            ...action.target,
            count: {
              amount: maximumTargets,
              upTo: action.target.count.upTo,
            },
          },
        };
        const targetIds = resolveActionTargets(
          state,
          controller,
          sourceInstanceId,
          distributedAction,
          selectedTargetIds,
        );
        if (targetIds === "prompt" || !targetIds) {
          return false;
        }
        const totalDon = targetIds.length * amountPerTarget;
        if (totalDon > availableDon) {
          return false;
        }
        if (state.donIdentities)
          return continueDonTransfers(state, {
            controller,
            sourceInstanceId,
            effectTriggerEvent: currentEffectTriggerEvent(state),
            moves: targetIds.map((targetId) =>
              donTransferMove(
                state,
                {
                  seat: action.donorPlayer === "opponent" ? otherSeat(controller) : controller,
                  area: action.donState === "rested" ? "rested" : "active",
                },
                { attachedTo: targetId },
                amountPerTarget,
              ),
            ),
          });
        if (action.donState === "rested") {
          player.restedDon -= totalDon;
        } else {
          player.activeDon -= totalDon;
        }
        for (const targetId of targetIds) {
          getInstance(state, targetId).attachedDon += amountPerTarget;
          publishDonGiven(state, targetId, amountPerTarget, controller, sourceInstanceId);
        }
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${amountPerTarget} DON!! to each of ${targetNames(state, targetIds)}.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      const requested = action.count.amount === "all" ? availableDon : action.count.amount;
      const maximum = Math.min(requested, availableDon);
      if (maximum === 0) {
        return true;
      }
      if (action.count.upTo) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may give DON!!`,
          details: `Choose how many ${action.donState === "rested" ? "rested" : "active"} DON!! cards to give, up to ${maximum}.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "giveDon", resource: "don" },
          resolutionContext: {
            intent: "effectGiveDonCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (
        targetIds === "prompt" ||
        !targetIds ||
        targetIds.length !== 1 ||
        action.count.amount === "all"
      ) {
        return false;
      }
      const amount = action.count.amount;
      if (action.donorPlayer === "targetOwner") {
        player = getPlayer(state, getInstance(state, targetIds[0]!).owner);
      }
      const minimumActive =
        action.donState === "active" ? amount : Math.max(0, amount - player.restedDon);
      const maximumActive = action.donState === "rested" ? 0 : Math.min(amount, player.activeDon);
      if (minimumActive < maximumActive) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} chooses DON!! from the cost area`,
          details: "Choose how many active and rested DON!! cards to give.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximumActive - minimumActive + 1 }, (_, index) => {
            const active = minimumActive + index;
            return {
              id: String(active),
              value: String(active),
              label: `${active} active, ${amount - active} rested`,
            };
          }),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "giveDon", resource: "don" },
          resolutionContext: {
            intent: "effectGiveDonSource",
            controller,
            sourceInstanceId,
            action,
            targetId: targetIds[0]!,
          },
        });
        return false;
      }
      return completeGiveDon(
        state,
        controller,
        sourceInstanceId,
        action,
        targetIds[0]!,
        minimumActive,
      );
    }

    case "giveDonFromDonPhase":
      return true;
    case "trashFromField": {
      const chosenTargetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (chosenTargetIds === "prompt" || !chosenTargetIds) {
        return false;
      }
      const targetIds = chosenTargetIds.filter(
        (id) => !isCharacterRemovalPreventedByPermanentEffect(state, id, controller),
      );
      for (const [targetIndex, targetId] of targetIds.entries()) {
        if (
          !skipRemovalReplacementIds?.includes(targetId) &&
          promptForEffectRemovalReplacement(
            state,
            targetId,
            controller,
            sourceInstanceId,
            action,
            targetIds.slice(targetIndex + 1),
            undefined,
            undefined,
            skipRemovalReplacementIds,
          )
        ) {
          return false;
        }
        removeCardByEffectAction(state, targetId, controller, sourceInstanceId, action);
      }
      return true;
    }
    case "trashThisCard": {
      const source = getInstance(state, sourceInstanceId);
      returnAttachedDonToCostArea(state, sourceInstanceId);
      moveCard(state, sourceInstanceId, source.owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
      return true;
    }
    case "turnLifeFaceDown": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      for (const instanceId of getPlayer(state, seat).life) {
        getInstance(state, instanceId).faceUp = false;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} turns ${getPlayer(state, seat).playerName}'s Life face-down.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    }
    case "turnLifeFaceUp": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const life = getPlayer(state, seat).life;
      const selected =
        action.position === "top"
          ? life.slice(0, action.count)
          : life.slice(Math.max(0, life.length - action.count));
      if (
        selected.length !== action.count ||
        selected.some((instanceId) => getInstance(state, instanceId).faceUp)
      ) {
        return false;
      }
      for (const instanceId of selected) {
        const instance = getInstance(state, instanceId);
        instance.faceUp = true;
        instance.publicKnowledge = true;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} turns ${formatCardList(state, selected)} face-up in Life.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: selected,
          visibility: "public",
        },
      );
      return true;
    }
    case "redistributeDon": {
      const player = getPlayer(state, controller);
      const donorIds = [
        player.leaderInstanceId,
        ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
      ].filter((instanceId) => getInstance(state, instanceId).attachedDon > 0);
      const recipientPool = candidatePoolForTarget(
        state,
        controller,
        sourceInstanceId,
        action.target,
      );
      if (
        !recipientPool.supported ||
        donorIds.length === 0 ||
        recipientPool.candidateIds.length === 0
      ) {
        return true;
      }

      const requested =
        action.count.amount === "all"
          ? donorIds.reduce(
              (total, instanceId) => total + getInstance(state, instanceId).attachedDon,
              0,
            )
          : action.count.amount;
      const tokenized = requested > 1;
      const sourceOptions = tokenized
        ? donorIds.flatMap((instanceId) =>
            Array.from({ length: getInstance(state, instanceId).attachedDon }, (_, index) => ({
              id: `attached-don:${instanceId}:${index}`,
              label: `${cardName(getCardForInstance(state, instanceId))} DON!! ${index + 1}`,
              value: `attached-don:${instanceId}:${index}`,
            })),
          )
        : donorIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          }));
      const maximum = Math.min(requested, sourceOptions.length);

      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may move a given DON!! card.`,
        details: "Choose a Leader or Character currently given a DON!! card, or skip.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: sourceOptions,
        minSelections: action.count.upTo ? 0 : maximum,
        maxSelections: maximum,
        context: {
          action: "redistributeDon",
          role: "donSource",
        },
        resolutionContext: {
          intent: "effectRedistributeDonSource",
          sourceInstanceId,
          controller,
          action,
          candidateIds: sourceOptions.map((option) => option.id),
          tokenized,
        },
      });
      return false;
    }
    case "activateEffect": {
      const targetIds = action.target
        ? resolveActionTargets(
            state,
            controller,
            sourceInstanceId,
            action,
            selectedTargetIds,
            previousActionTargetIds,
          )
        : [sourceInstanceId];
      if (targetIds === "prompt" || !targetIds) return false;
      for (const targetId of targetIds) {
        for (const [blockIndex] of effectBlocksForInstance(
          state,
          targetId,
          action.effectTrigger,
        ).entries()) {
          enqueueResolution(state, {
            kind: "effectBlock",
            sourceInstanceId: targetId,
            controller,
            trigger: action.effectTrigger,
            blockIndex,
          });
        }
      }
      return true;
    }
    case "activateEvent": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      for (const eventInstanceId of targetIds) {
        const eventCard = getCardForInstance(state, eventInstanceId);
        const eventInstance = getInstance(state, eventInstanceId);
        if (
          !actionTargetIsEligible(state, action, eventInstanceId, sourceInstanceId) ||
          eventInstance.controller !== controller ||
          eventInstance.zone !== "hand"
        ) {
          return false;
        }
        const baseCostAtActivation = getBaseCost(state, eventInstanceId);
        moveCard(state, eventInstanceId, eventInstance.controller, "resolution", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
          sourceInstanceId,
          visibility: "public",
        });
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} activates ${cardName(eventCard)}.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [eventInstanceId],
            visibility: "public",
          },
        );
        for (const [blockIndex] of effectBlocksForInstance(
          state,
          eventInstanceId,
          action.effectTrigger,
        ).entries()) {
          enqueueResolution(state, {
            kind: "effectBlock",
            sourceInstanceId: eventInstanceId,
            controller,
            trigger: action.effectTrigger,
            blockIndex,
          });
        }
        const triggerEvent = {
          instanceId: eventInstanceId,
          effectController: controller,
          baseCostAtActivation,
        };
        enqueueMirroredInPlayEffectsForTrigger(
          state,
          controller,
          "whenYouActivateEvent",
          "whenOpponentActivatesEvent",
          triggerEvent,
        );
      }
      return true;
    }
    case "playThisCard": {
      const source = getInstance(state, sourceInstanceId);
      if (
        source.controller === controller &&
        (source.zone === "hand" || source.zone === "resolution") &&
        getCardForInstance(state, sourceInstanceId).cardType === "character" &&
        getOpenCharacterSlots(state, controller).length === 0
      ) {
        // 3-7-6-1: the Character area is full, so the play pauses for the
        // replacement choice instead of fizzling.
        promptForEffectCharacterReplacement(state, {
          controller,
          playingSeat: controller,
          sourceInstanceId,
          instanceId: sourceInstanceId,
          continuation: { kind: "playThisCard" },
        });
        return false;
      }
      return completePlayThisCard(state, controller, sourceInstanceId);
    }
    case "search": {
      if (
        action.source.player !== "self" ||
        action.source.zone !== "deck" ||
        (action.revealDestination !== "hand" &&
          action.revealDestination !== "character" &&
          action.revealDestination !== "life") ||
        (action.remainderPosition !== "bottom" &&
          action.remainderPosition !== "top" &&
          action.remainderPosition !== "trash" &&
          action.remainderPosition !== "any")
      ) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:search:configuration",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} uses an unsupported search configuration.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: search configuration",
          `${effectSourceName(state, sourceInstanceId)} uses an unsupported search configuration.`,
        );
        return false;
      }
      const deck = getPlayer(state, controller).deck;
      if (action.lookCountUpTo) {
        const maximum = Math.min(action.lookCount, deck.length);
        if (maximum === 0) return true;
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may look at up to ${maximum} cards.`,
          details: "Choose how many cards to look at before seeing their contents.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: Array.from({ length: maximum + 1 }, (_, count) => ({
            id: String(count),
            label: String(count),
            value: String(count),
          })),
          minSelections: 1,
          maxSelections: 1,
          context: { action: "search", role: "lookCount" },
          resolutionContext: {
            intent: "effectSearchLookCount",
            sourceInstanceId,
            controller,
            action,
            maximum,
          },
        });
        return false;
      }
      const lookedIds = action.lookCount === 0 ? [...deck] : deck.slice(0, action.lookCount);
      if (lookedIds.length === 0) {
        return true;
      }
      const eligibleIds = lookedIds.filter((instanceId) =>
        action.revealFilters?.length
          ? action.revealFilterMode === "any"
            ? action.revealFilters.some((filter) => {
                const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
                return result.supported && result.matches;
              })
            : action.revealFilters.every((filter) => {
                const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
                return result.supported && result.matches;
              })
          : true,
      );
      const requested =
        action.revealCount.amount === "all" ? eligibleIds.length : action.revealCount.amount;
      const playableEligibleIds =
        action.revealDestination === "character"
          ? eligibleIds.filter((instanceId) => {
              // 3-7-6-1 keeps Character plays legal even into a full
              // Character area.
              const card = getCardForInstance(state, instanceId);
              return card.cardType === "stage" || card.cardType === "character";
            })
          : eligibleIds;
      const maximum = Math.min(requested, playableEligibleIds.length);
      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} looks at the top ${lookedIds.length} card(s) of the deck.`,
        details:
          action.revealDestination === "character"
            ? `Choose up to ${maximum} eligible card(s) to play.`
            : `Choose up to ${maximum} eligible card(s) to ${action.reveal === false ? "add to your hand" : "reveal and add to your hand"}.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: lookedIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
          enabled: playableEligibleIds.includes(instanceId),
        })),
        minSelections: action.revealCount.upTo ? 0 : maximum,
        maxSelections: maximum,
        context: { action: "search", role: "revealedChoice" },
        resolutionContext: {
          intent: "effectSearchSelection",
          sourceInstanceId,
          controller,
          action,
          lookedIds,
          eligibleIds,
        },
      });
      return false;
    }
    case "winGame":
      state.status = "finished";
      state.phase = "finished";
      state.winner = controller;
      state.finishReason = "effectWin";
      emitEvent(state, "winnerDeclared", controller, {
        data: {
          winner: controller,
        },
      });
      emitLog(state, controller, `${getPlayer(state, controller).playerName} wins the match.`, {
        visibility: "public",
      });
      return true;
    case "play": {
      const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
      const candidateIds = candidatesForPlayAction(
        state,
        controller,
        sourceInstanceId,
        action,
        previousActionTargetIds,
      );
      if (!candidateIds) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:play:source",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} plays from an unsupported source.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported play source",
          `${effectSourceName(state, sourceInstanceId)} plays from an unsupported source.`,
        );
        return false;
      }

      const requested = action.count.amount === "all" ? candidateIds.length : action.count.amount;
      const maximum = Math.min(requested, candidateIds.length);
      const minimum = action.count.upTo ? 0 : maximum;
      if (selectedTargetIds === undefined) {
        if (maximum === 0) {
          return true;
        }
        if (!action.count.upTo && maximum === 1 && candidateIds.length === 1) {
          selectedTargetIds = [candidateIds[0]!];
        } else {
          createChoicePrompt(state, {
            choiceKind: "selectCards",
            seat: playingSeat,
            label: `${effectSourceName(state, sourceInstanceId)} may play cards.`,
            details: action.count.upTo
              ? `Choose up to ${maximum} eligible card(s) to play.`
              : `Choose ${maximum} eligible card(s) to play.`,
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            eventId: null,
            options: candidateIds.map((instanceId) => ({
              id: instanceId,
              label: cardName(getCardForInstance(state, instanceId)),
              value: instanceId,
              targetId: instanceId,
            })),
            minSelections: minimum,
            maxSelections: maximum,
            context: { action: "play" },
            resolutionContext: {
              intent: "effectPlaySelection",
              sourceInstanceId,
              controller,
              action,
              candidateIds,
              previousActionTargetIds,
            },
          });
          return false;
        }
      }

      if (
        selectedTargetIds.length < minimum ||
        selectedTargetIds.length > maximum ||
        new Set(selectedTargetIds).size !== selectedTargetIds.length ||
        selectedTargetIds.some((instanceId) => !candidateIds.includes(instanceId))
      ) {
        return false;
      }
      const selectedCards = selectedTargetIds.map((instanceId) =>
        getCardForInstance(state, instanceId),
      );
      if (
        action.differentNames &&
        new Set(selectedCards.map((card) => card.name)).size !== selectedCards.length
      ) {
        return false;
      }
      if (!selectionSatisfiesTotalConstraint(state, selectedTargetIds, action.totalConstraint)) {
        return false;
      }
      if (selectedCards.filter((card) => card.cardType === "stage").length > 1) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:play:placement",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} cannot place all selected cards.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: effect play placement",
          `${effectSourceName(state, sourceInstanceId)} cannot place all selected cards.`,
        );
        return false;
      }
      // 3-7-6-1 keeps Character plays legal even into a full Character area;
      // the sequence pauses for the replacement choice when one is needed.
      const playResult = playCardsFromEffectSequence(
        state,
        controller,
        sourceInstanceId,
        action,
        playingSeat,
        selectedTargetIds,
        [],
        previousActionTargetIds,
      );
      return playResult === "completed";
    }
    case "playGrouped": {
      const playingSeat = action.source.player === "self" ? controller : otherSeat(controller);
      const candidateIds = candidatesForGroupedPlayAction(
        state,
        controller,
        sourceInstanceId,
        action,
        previousActionTargetIds,
      );
      if (!candidateIds) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:playGrouped:source",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} plays grouped cards from an unsupported source.`,
        });
        return false;
      }
      const maximum = Math.min(action.groups.length, candidateIds.length);
      if (maximum === 0) return true;
      createChoicePrompt(state, {
        choiceKind: "selectCards",
        seat: playingSeat,
        label: `${effectSourceName(state, sourceInstanceId)} may play cards.`,
        details: `Choose up to ${maximum} eligible card(s) to play together.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: candidateIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: 0,
        maxSelections: maximum,
        context: { action: "playGrouped" },
        resolutionContext: {
          intent: "effectGroupedPlaySelection",
          sourceInstanceId,
          controller,
          action,
          candidateIds,
          ...(previousActionTargetIds && { previousActionTargetIds }),
        },
      });
      return false;
    }
    case "revealTopDeckCard": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${getPlayer(state, controller).playerName} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of ${getPlayer(state, owner).playerName}'s deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );
      const matchesConditional = (action.conditional?.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
        return result.supported && result.matches;
      });
      enqueueResolution(
        state,
        {
          kind: "finalizeRevealedDeckCard",
          sourceInstanceId,
          controller,
          revealedInstanceId,
          owner,
          position: matchesConditional
            ? (action.conditional?.finalPosition ?? action.finalPosition)
            : action.finalPosition,
        },
        { next: true },
      );
      if (action.conditional && matchesConditional) {
        for (const nestedAction of [...action.conditional.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "revealFromDeck": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of the deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );
      enqueueResolution(
        state,
        {
          kind: "finalizeRevealedDeckCard",
          sourceInstanceId,
          controller,
          revealedInstanceId,
          owner,
          position: "top",
        },
        { next: true },
      );
      const followUp = action.ifRevealedCardMatches;
      const matches =
        followUp?.filters.every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
          return result.supported && result.matches;
        }) ?? false;
      if (matches) {
        for (const nestedAction of [...followUp!.actions].reverse()) {
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId,
              controller,
              action: nestedAction,
            },
            { next: true },
          );
        }
      }
      return true;
    }
    case "lookAtTopDeckCard": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const instanceId = getPlayer(state, owner).deck[0];
      if (!instanceId) return true;
      emitLog(
        state,
        controller,
        `${getPlayer(state, controller).playerName} looks at the top card of ${getPlayer(state, owner).playerName}'s deck.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "private",
          privateMessages: {
            [controller]: `You looked at ${cardName(getCardForInstance(state, instanceId))}.`,
          },
          judgeMessage: `${getPlayer(state, controller).playerName} looks at ${cardName(getCardForInstance(state, instanceId))}.`,
        },
      );
      return true;
    }
    case "changeBattleTarget": {
      const battle = state.battle;
      if (!battle || battle.defendingSeat !== controller) {
        return false;
      }
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      const targetId = targetIds[0];
      if (!targetId || targetIds.length !== 1) {
        return false;
      }
      battle.targetId = targetId;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} changes the attack target to ${cardName(getCardForInstance(state, targetId))}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetId],
          eventId: battle.id,
          visibility: "public",
        },
      );
      return true;
    }
    case "choice":
      const choiceSeat = action.player === "opponent" ? otherSeat(controller) : controller;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: choiceSeat,
        label: `${effectSourceName(state, sourceInstanceId)} requires a choice.`,
        details: "Choose one effect to resolve.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: action.options.map((option, index) => ({
          id: String(index),
          label: option.map((nestedAction) => nestedAction.action).join(" then "),
          value: String(index),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: {
          action: "choice",
        },
        resolutionContext: {
          intent: "effectActionChoice",
          sourceInstanceId,
          controller,
          options: action.options,
          previousActionTargetIds,
        },
      });
      return false;
    case "conditional": {
      const result = evaluateConditions(
        state,
        controller,
        sourceInstanceId,
        [action.predicate],
        previousActionTargetIds,
        currentEffectTriggerEvent(state),
      );
      if (!result.supported) {
        const source = getInstance(state, sourceInstanceId);
        const issue = recordCapabilityIssue(state, {
          kind: "unsupportedCondition",
          code: "conditional-action",
          actor: controller,
          sourceCardId: source.cardId,
          sourceInstanceId,
          eventId: null,
          details: `${effectSourceName(state, sourceInstanceId)} uses a conditional branch that is not automated yet.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported conditional branch",
          `${effectSourceName(state, sourceInstanceId)} uses a conditional branch that is not automated yet.`,
          { issueId: issue.id },
        );
        return false;
      }
      const branch = result.matches ? action.whenTrue : (action.whenFalse ?? []);
      for (const nestedAction of [...branch].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
            previousActionTargetIds,
          },
          { next: true },
        );
      }
      return true;
    }
    case "scheduleAtEndOfTurn":
      for (const nestedAction of scheduledActions(
        state,
        action.actions,
        sourceInstanceId,
        previousActionTargetIds,
      )) {
        state.delayedEffectActions.push({
          sourceInstanceId,
          controller,
          action: nestedAction,
          scheduledTurn: state.turnNumber,
          ...(previousActionTargetIds && { previousActionTargetIds }),
          ...(delayedActionMovesSource(nestedAction) && {
            sourceZoneChangeCounter: getInstance(state, sourceInstanceId).zoneChangeCounter,
          }),
        });
      }
      return true;
    case "guessTopDeckCost": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).deck[0];
      if (!revealedInstanceId) {
        return true;
      }
      const maximumCost = 10;
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} chooses a cost.`,
        details: "Choose a cost, then reveal the top card of your opponent's deck.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: Array.from({ length: maximumCost + 1 }, (_, cost) => ({
          id: String(cost),
          label: `Cost ${cost}`,
          value: String(cost),
        })),
        minSelections: 1,
        maxSelections: 1,
        context: { action: "guessTopDeckCost" },
        resolutionContext: {
          intent: "effectGuessTopDeckCost",
          sourceInstanceId,
          controller,
          action,
          revealedInstanceId,
          owner,
        },
      });
      return false;
    }
    case "cannotAttack": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((id) => delayedTargetIsCurrent(state, action, id))
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: action.unlessTrashFromHand ? "attackHandTrashCost" : "cannotAttack",
          ...(action.unlessTrashFromHand && { value: action.unlessTrashFromHand }),
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from attacking ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotBeKod": {
      const targetIds = action.previousActionTargets
        ? (previousActionTargetIds ?? []).filter((id) => delayedTargetIsCurrent(state, action, id))
        : resolveActionTargets(state, controller, sourceInstanceId, action, selectedTargetIds);
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "cannotBeKO",
          koRestriction: action.restriction,
          koByPlayer: action.byPlayer,
          koByFilters: action.byFilter,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from being K.O.'d ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "negateEffects": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "effectsNegated",
          negatedEffectTypes: action.effectTypes,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} negates the effects of ${targetNames(state, targetIds)} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "negatePlayerEffects": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      const targetLeaderId = getPlayer(state, targetSeat).leaderInstanceId;
      addModifier(state, sourceInstanceId, targetLeaderId, {
        type: "flag",
        flag: "effectsNegated",
        negatedEffectTypes: action.effectTypes,
        playerScope: true,
        duration: action.duration,
        expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} negates ${getPlayer(state, targetSeat).playerName}'s ${action.effectTypes?.join(", ") ?? "card"} effects ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetLeaderId],
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotBeRested": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "cannotBeRested",
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from being rested ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "canAttackActive": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "flag",
          flag: "canAttackActive",
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} allows ${targetNames(state, targetIds)} to attack active Characters ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotActivate": {
      let targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      if (
        action.keyword === "blocker" &&
        action.target.count.amount === "all" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "character" &&
        !action.target.filters?.length
      ) {
        const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
        const leaderId = getPlayer(state, targetSeat).leaderInstanceId;
        addModifier(state, sourceInstanceId, leaderId, {
          type: "flag",
          flag: "cannotActivate",
          keyword: action.keyword,
          playerScope: true,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
        targetIds = [...new Set([...targetIds, leaderId])];
      } else {
        for (const targetId of targetIds) {
          addModifier(state, sourceInstanceId, targetId, {
            type: "flag",
            flag: "cannotActivate",
            keyword: action.keyword,
            duration: action.duration,
            expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
            expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
            expiresOnTurnStartOfSeat:
              action.duration === "untilStartOfNextTurn" ? controller : null,
          });
        }
      }
      // The leader-scope branch above may legitimately add the Leader even
      // when no resolved candidate had the keyword, so only the log line is
      // guarded here — the modifier application must still run.
      if (targetIds.length === 0) {
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} resolves without a target.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds,
            visibility: "public",
          },
        );
        return true;
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${targetNames(state, targetIds)} from activating ${action.keyword} ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "setPower": {
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        action,
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) {
        return false;
      }
      for (const targetId of targetIds) {
        const currentPower = getCardPower(state, targetId);
        addModifier(state, sourceInstanceId, targetId, {
          type: "power",
          value: action.value === 0 && currentPower < 0 ? 0 : action.value - currentPower,
          duration: action.duration,
          expiresAtTurn: modifierExpiryTurn(state, controller, action.duration),
          expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
          expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
        });
      }
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} sets ${targetNames(state, targetIds)} to ${action.value} power ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds,
          visibility: "public",
        },
      );
      return true;
    }
    case "attackRestriction":
    case "playRested":
      recordCapabilityIssue(state, {
        kind: "unsupportedAction",
        code: `action:${action.action}`,
        actor: controller,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      });
      enqueueJudgePrompt(
        state,
        sourceInstanceId,
        "Judge review: unsupported action",
        `${cardName(getCardForInstance(state, sourceInstanceId))} uses ${action.action}, which is not automated yet.`,
      );
      return false;
    case "extraTurn":
      state.extraTurnSeat = controller;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} grants ${getPlayer(state, controller).playerName} an extra turn after this one.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );
      return true;
    case "playRestriction": {
      const targetLeaderId = getPlayer(state, controller).leaderInstanceId;
      addModifier(state, sourceInstanceId, targetLeaderId, {
        type: "flag",
        flag: "cannotPlay",
        playerScope: true,
        playRestrictionFilters: action.filters,
        playRestrictionSourceZones: action.sourceZones,
        playRestrictionOrigin: action.origin,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} prevents ${getPlayer(state, controller).playerName} from playing matching cards ${durationLabel(action.duration)}.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [targetLeaderId],
          visibility: "public",
        },
      );
      return true;
    }
    case "cannotDraw": {
      const affectedSeat = action.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, affectedSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotDrawByOwnEffects",
        playerScope: true,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      return true;
    }
    case "cannotSetDonActive": {
      const affectedSeat = action.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, affectedSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotSetDonActiveByCharacterEffects",
        playerScope: true,
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: null,
        expiresOnTurnStartOfSeat: null,
      });
      return true;
    }
    case "cannotBePlayedByEffects":
      return true;
    case "addThisCardToHand": {
      const source = getInstance(state, sourceInstanceId);
      if (source.zone !== "hand") {
        moveCard(state, sourceInstanceId, source.owner, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
          sourceInstanceId,
          visibility: "private",
        });
      }
      return true;
    }
    case "cannotAttackTargets": {
      const isPlayerWide =
        action.attacker.player === "self" &&
        action.attacker.count.amount === "all" &&
        action.attacker.zones.includes("leader") &&
        action.attacker.zones.includes("character") &&
        !action.attacker.filters?.length;
      const targetIds = resolveActionTargets(
        state,
        controller,
        sourceInstanceId,
        {
          action: "cannotAttack",
          target: action.attacker,
          duration: action.duration,
        },
        selectedTargetIds,
        previousActionTargetIds,
      );
      if (targetIds === "prompt" || !targetIds) return false;
      const modifierTargetIds = isPlayerWide
        ? [getPlayer(state, controller).leaderInstanceId]
        : targetIds;
      for (const targetId of modifierTargetIds) {
        addModifier(state, sourceInstanceId, targetId, {
          type: "attackRestriction",
          attackRestriction: "cannotAttack",
          attackTargetFilters: action.filters,
          playerScope: isPlayerWide,
          duration: action.duration,
          expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
      }
      return true;
    }
    case "revealFromLife": {
      const owner = action.player === "self" ? controller : otherSeat(controller);
      const revealedInstanceId = getPlayer(state, owner).life[0];
      if (!revealedInstanceId) {
        return true;
      }
      if (action.upTo && !selectedTargetIds) {
        createChoicePrompt(state, {
          choiceKind: "chooseOption",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} may reveal a Life card.`,
          details: "Choose whether to reveal the top card of your Life.",
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: [
            { id: "0", label: "Do not reveal", value: "0" },
            { id: "1", label: "Reveal 1", value: "1" },
          ],
          minSelections: 1,
          maxSelections: 1,
          context: { action: "revealFromLife", resource: "life" },
          resolutionContext: {
            intent: "effectRevealFromLifeSelection",
            sourceInstanceId,
            controller,
            action,
          },
        });
        return false;
      }
      if (action.upTo && selectedTargetIds?.length === 0) {
        return true;
      }
      const revealed = getInstance(state, revealedInstanceId);
      revealed.faceUp = true;
      revealed.publicKnowledge = true;
      emitLog(
        state,
        controller,
        `${effectSourceName(state, sourceInstanceId)} reveals ${cardName(getCardForInstance(state, revealedInstanceId))} from the top of ${getPlayer(state, owner).playerName}'s Life.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          targetIds: [revealedInstanceId],
          visibility: "public",
        },
      );

      const conditionalPlay = action.conditionalPlay;
      const matches = conditionalPlay?.filters.every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, revealedInstanceId, filter);
        return result.supported && result.matches;
      });
      const card = getCardForInstance(state, revealedInstanceId);
      // 3-7-6-1 keeps the play legal even into a full Character area, so the
      // choice is offered regardless of open slots.
      if (!conditionalPlay || !matches || owner !== controller || card.cardType !== "character") {
        revealed.faceUp = false;
        revealed.publicKnowledge = false;
        return true;
      }

      createChoicePrompt(state, {
        choiceKind: "confirm",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} may play the revealed card.`,
        details: `Play ${cardName(card)} from Life?`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          { id: "play", label: "Play card", value: "play" },
          { id: "keep", label: "Leave in Life", value: "keep" },
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "revealFromLife", resource: "life" },
        resolutionContext: {
          intent: "effectRevealFromLifePlay",
          sourceInstanceId,
          controller,
          owner,
          action,
          revealedInstanceId,
        },
      });
      return false;
    }
    case "lookAtLife": {
      const availableSeats = (
        action.player === "either"
          ? [controller, otherSeat(controller)]
          : [action.player === "self" ? controller : otherSeat(controller)]
      ).filter((seat) => getPlayer(state, seat).life.length > 0);
      if (availableSeats.length === 0) {
        return true;
      }
      const lifeOwners = availableSeats
        .map((seat) => `${getPlayer(state, seat).playerName}'s Life`)
        .join(" or ");
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: controller,
        label: `${effectSourceName(state, sourceInstanceId)} looks at the top card of ${lifeOwners}.`,
        details: "Choose whose top Life card to look at.",
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: [
          ...(action.upTo ? [{ id: "skip", label: "Do not look", value: "skip" }] : []),
          ...availableSeats.map((seat) => ({
            id: seat === controller ? "self" : "opponent",
            label: seat === controller ? "Your Life" : "Opponent's Life",
            value: seat === controller ? "self" : "opponent",
          })),
        ],
        minSelections: 1,
        maxSelections: 1,
        context: { action: "lookAtLife", resource: "life" },
        resolutionContext: {
          intent: "effectLookAtLifeOwner",
          sourceInstanceId,
          controller,
          action,
          availableSeats,
        },
      });
      return false;
    }
    case "dealDamage": {
      const targetSeat = action.player === "self" ? controller : otherSeat(controller);
      enqueueResolution(
        state,
        {
          kind: "effectDamageContinue",
          sourceInstanceId,
          controller,
          targetSeat,
          remaining: action.amount,
        },
        { next: true },
      );
      return true;
    }
    case "opponentReturnDon": {
      const returningSeat = otherSeat(controller);
      const options = returnDonCostOptions(state, returningSeat, action.donState);
      const amount = Math.min(action.amount, options.length);
      if (amount === 0) {
        return true;
      }
      const sourceKeys = new Set(
        options.map((option) =>
          option.id.startsWith("attached-don:")
            ? option.id.slice(0, option.id.lastIndexOf(":"))
            : option.id.slice(0, option.id.indexOf(":")),
        ),
      );
      if (
        options.length > amount &&
        (sourceKeys.size > 1 ||
          requiresDonIdentityChoice(
            state,
            donIdentitiesForVirtualIds(
              state,
              returningSeat,
              options.map((option) => option.id),
            ),
            amount,
          ))
      ) {
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: returningSeat,
          label: `${effectSourceName(state, sourceInstanceId)} requires returning ${amount} DON!! to the DON!! deck.`,
          details: `Choose ${amount} DON!! card(s) from your field to return to your DON!! deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: options.map((option) => ({
            id: option.id,
            label: option.label,
            value: option.id,
          })),
          minSelections: amount,
          maxSelections: amount,
          context: { action: "opponentReturnDon", resource: "don" },
          resolutionContext: {
            intent: "effectOpponentReturnDon",
            sourceInstanceId,
            controller,
            returningSeat,
            amount,
            candidateIds: options.map((option) => option.id),
            action,
          },
        });
        return false;
      }
      returnSelectedDonToDeck(
        state,
        returningSeat,
        options.slice(0, amount).map((option) => option.id),
        sourceInstanceId,
        controller,
      );
      return true;
    }
    case "returnDon": {
      if (action.player === "opponent" && !action.thenActions?.length) {
        return processEffectAction(
          state,
          controller,
          sourceInstanceId,
          {
            action: "opponentReturnDon",
            amount: action.amount,
            donState: action.donState,
            condition: action.condition,
          },
          selectedTargetIds,
          previousActionTargetIds,
        );
      }
      const returningSeat = action.player === "self" ? controller : otherSeat(controller);
      const options = returnDonCostOptions(state, returningSeat, action.donState);
      const requestedAmount = action.untilSameCountAsOpponent
        ? Math.max(
            0,
            options.length -
              returnDonCostOptions(state, otherSeat(returningSeat), action.donState).length,
          )
        : action.amount;
      const amount = Math.min(requestedAmount, options.length);
      if (amount === 0) {
        return true;
      }
      if (options.length > amount) {
        createChoicePrompt(state, {
          choiceKind: "costPayment",
          seat: returningSeat,
          label: `${effectSourceName(state, sourceInstanceId)} requires returning ${amount} DON!! to the DON!! deck.`,
          details: `Choose ${amount} DON!! card(s) from your field to return to your DON!! deck.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: options.map((option) => ({
            id: option.id,
            label: option.label,
            value: option.id,
          })),
          minSelections: amount,
          maxSelections: amount,
          context: { action: "returnDon", resource: "don" },
          resolutionContext: {
            intent: "effectReturnDon",
            sourceInstanceId,
            controller,
            returningSeat,
            amount,
            candidateIds: options.map((option) => option.id),
            action,
          },
        });
        return false;
      }
      const selectedIds = options.slice(0, amount).map((option) => option.id);
      returnSelectedDonToDeck(state, returningSeat, selectedIds, sourceInstanceId, controller);
      for (const nestedAction of [...(action.thenActions ?? [])].reverse()) {
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId,
            controller,
            action: nestedAction,
          },
          { next: true },
        );
      }
      return true;
    }
    case "rearrangeDeck": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const lookedIds = getPlayer(state, seat).deck.slice(0, action.count);
      if (lookedIds.length === 0) {
        return true;
      }
      if (action.trashUpTo !== undefined) {
        const maximum = Math.min(action.trashUpTo, lookedIds.length);
        createChoicePrompt(state, {
          choiceKind: "selectCards",
          seat: controller,
          label: `${effectSourceName(state, sourceInstanceId)} looks at the top ${lookedIds.length} card(s) of the deck.`,
          details: `Choose up to ${maximum} card(s) to trash.`,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          options: lookedIds.map((instanceId) => ({
            id: instanceId,
            label: cardName(getCardForInstance(state, instanceId)),
            value: instanceId,
            targetId: instanceId,
          })),
          minSelections: 0,
          maxSelections: maximum,
          context: { action: "rearrangeDeck", role: "trashChoice" },
          resolutionContext: {
            intent: "effectRearrangeDeckTrashSelection",
            sourceInstanceId,
            controller,
            action,
            lookedIds,
          },
        });
        return false;
      }
      promptForRearrangeDeckOrder(state, sourceInstanceId, controller, action, lookedIds);
      return false;
    }
    case "shuffleDeck": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      player.deck = shuffle(
        player.deck,
        `${state.config.seed ?? "0"}:${state.turnNumber}:${state.eventSequence}:${sourceInstanceId}:effect-shuffle`,
      );
      for (const [index, instanceId] of player.deck.entries()) {
        const instance = getInstance(state, instanceId);
        instance.zoneIndex = index;
        instance.faceUp = false;
        instance.publicKnowledge = false;
      }
      emitLog(state, controller, `${getPlayer(state, seat).playerName} shuffles their deck.`, {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      });
      return true;
    }
    case "redrawHand": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      const returnedIds = [...player.hand];

      emitLog(
        state,
        controller,
        returnedIds.length > 0
          ? `${player.playerName} returns ${returnedIds.length} card${returnedIds.length === 1 ? "" : "s"} from hand to their deck.`
          : `${player.playerName} has no cards to return from hand.`,
        {
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          visibility: "public",
        },
      );

      for (const instanceId of returnedIds) {
        moveCard(state, instanceId, seat, "deck", {
          deckPosition: "bottom",
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
          sourceInstanceId,
          visibility: "public",
          suppressLog: true,
        });
      }

      player.deck = shuffle(
        player.deck,
        [
          state.config.seed ?? "0",
          state.turnNumber,
          state.eventSequence,
          sourceInstanceId,
          seat,
          "redraw-hand",
        ].join(":"),
      );
      for (const [index, instanceId] of player.deck.entries()) {
        const instance = getInstance(state, instanceId);
        instance.zoneIndex = index;
        instance.faceUp = false;
        instance.publicKnowledge = false;
      }

      const drawAmount = action.drawCount === "returned" ? returnedIds.length : action.drawCount;
      emitLog(state, controller, `${player.playerName} shuffles their deck.`, {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        visibility: "public",
      });
      const drawBlockedByOwnEffect =
        seat === controller &&
        hasFlagModifier(state, getPlayer(state, seat).leaderInstanceId, "cannotDrawByOwnEffects");
      if (!drawBlockedByOwnEffect) {
        drawCards(state, seat, drawAmount, `${effectSourceName(state, sourceInstanceId)} redraws`);
      }
      return true;
    }
    case "rearrangeLife": {
      const seat = action.player === "self" ? controller : otherSeat(controller);
      const lookedIds = [...getPlayer(state, seat).life];
      if (lookedIds.length <= 1) {
        if (action.moveOneToDeckTop && lookedIds[0]) {
          moveCard(state, lookedIds[0], seat, "deck", {
            deckPosition: "top",
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
        }
        return true;
      }
      createChoicePrompt(state, {
        choiceKind: "orderCards",
        seat: controller,
        label: action.moveOneToDeckTop
          ? `${effectSourceName(state, sourceInstanceId)} chooses a Life card for the deck`
          : `${effectSourceName(state, sourceInstanceId)} orders Life cards`,
        details: action.moveOneToDeckTop
          ? "Place the first card on top of the deck, then order the remaining Life cards from top to bottom."
          : `Order the ${lookedIds.length} Life card(s) from top to bottom.`,
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        eventId: null,
        options: lookedIds.map((instanceId) => ({
          id: instanceId,
          label: cardName(getCardForInstance(state, instanceId)),
          value: instanceId,
          targetId: instanceId,
        })),
        minSelections: lookedIds.length,
        maxSelections: lookedIds.length,
        context: { action: "rearrangeLife", ordered: true },
        resolutionContext: {
          intent: "effectRearrangeLifeOrder",
          sourceInstanceId,
          controller,
          action,
          lookedIds,
        },
      });
      return false;
    }
    case "lifeToHandReplacement":
      // Continuous replacement evaluated at each Life-to-hand movement.
      return true;
    case "cannotBeRemoved": {
      const supportedLifeRestriction =
        action.bySource === "ownEffect" &&
        action.target.player !== "both" &&
        action.target.zones.length === 1 &&
        action.target.zones[0] === "life" &&
        action.target.count.amount === "all";
      if (!supportedLifeRestriction) {
        recordCapabilityIssue(state, {
          kind: "unsupportedAction",
          code: "action:cannotBeRemoved",
          actor: controller,
          sourceCardId: getInstance(state, sourceInstanceId).cardId,
          sourceInstanceId,
          eventId: null,
          details: `${cardName(getCardForInstance(state, sourceInstanceId))} uses cannotBeRemoved, which is not automated for this target.`,
        });
        enqueueJudgePrompt(
          state,
          sourceInstanceId,
          "Judge review: unsupported action",
          `${cardName(getCardForInstance(state, sourceInstanceId))} uses cannotBeRemoved, which is not automated for this target.`,
        );
        return false;
      }
      const targetSeat = action.target.player === "self" ? controller : otherSeat(controller);
      addModifier(state, sourceInstanceId, getPlayer(state, targetSeat).leaderInstanceId, {
        type: "flag",
        flag: "cannotAddLifeToHandByOwnEffect",
        duration: action.duration,
        expiresAtTurn: action.duration === "thisTurn" ? state.turnNumber : null,
        expiresAtBattleId: action.duration === "thisBattle" ? (state.battle?.id ?? null) : null,
        expiresOnTurnStartOfSeat: action.duration === "untilStartOfNextTurn" ? controller : null,
      });
      return true;
    }
  }
  // Unhandled action kinds previously fell through to an implicit undefined;
  // keep the falsy behavior explicit for the compiler.
  return false;
}

/** Resolve a giveDon cost's donor/recipient seats and available pool. */
export function giveDonCostParts(
  state: MatchState,
  controller: MatchSeat,
  cost: Extract<Cost, { cost: "giveDon" }>,
): { donorSeat: MatchSeat; recipientSeat: MatchSeat; poolAmount: number } {
  const donorSeat = cost.donorPlayer === "opponent" ? otherSeat(controller) : controller;
  const recipientSeat = cost.recipientPlayer === "opponent" ? otherSeat(controller) : controller;
  const donor = getPlayer(state, donorSeat);
  const poolAmount = cost.donState === "rested" ? donor.restedDon : donor.activeDon;
  return { donorSeat, recipientSeat, poolAmount };
}

/** Resolve the legal recipients for a give-DON!! cost. */
export function giveDonCostCandidateIds(
  state: MatchState,
  controller: MatchSeat,
  cost: Extract<Cost, { cost: "giveDon" }>,
  sourceInstanceId: string,
): string[] {
  const { recipientSeat } = giveDonCostParts(state, controller, cost);
  const recipient = getPlayer(state, recipientSeat);
  const zones = cost.recipientZones ?? ["leader", "character"];
  return [
    ...(zones.includes("leader") ? [recipient.leaderInstanceId] : []),
    ...(zones.includes("character")
      ? recipient.characterArea.filter((instanceId): instanceId is string => instanceId !== null)
      : []),
  ].filter((candidateId) =>
    (cost.recipientFilters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, candidateId, filter);
      return result.supported && result.matches;
    }),
  );
}

export function effectBlockWithSelectedCost(
  block: EffectBlock | undefined,
  selectedAlternativeCostIndex?: number,
  costIndex?: number,
): EffectBlock | undefined {
  if (!block) return undefined;
  const alternative =
    selectedAlternativeCostIndex === undefined
      ? undefined
      : block.alternativeCosts?.[selectedAlternativeCostIndex];
  if (selectedAlternativeCostIndex !== undefined && !alternative) return undefined;
  const selected = alternative
    ? { ...block, costs: [...(block.costs ?? []), ...alternative] }
    : block;
  return costIndex === undefined
    ? selected
    : { ...selected, costs: selected.costs?.slice(costIndex, costIndex + 1) };
}

// Explore original payments in order without resolving triggered/replacement effects.
// This is an affordability preview only; real payment still uses the public cost cursor.
function* costSelections(
  state: MatchState,
  controller: MatchSeat,
  source: string,
  cost: Cost,
): Generator<string[] | undefined> {
  let candidates: string[] | undefined;
  let amount = 0;
  switch (cost.cost) {
    case "trashFromHand":
      candidates = candidatesForTrashFromHandCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "playCard":
      candidates = candidatesForPlayCardCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "trashCard":
      candidates = candidatesForTrashCardCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "returnCharacterToDeck":
      candidates = candidatesForReturnCharacterToDeckCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "returnCharacter":
      candidates = candidatesForReturnCharacterCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "koCharacter":
      candidates = candidatesForKoCharacterCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "trashCharacter":
      candidates = candidatesForTrashCharacterCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "restCards":
      candidates = candidatesForRestCardsCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "revealFromHand":
      candidates = candidatesForRevealFromHandCost(state, controller, source, cost);
      amount = cost.amount;
      break;
    case "returnHandToDeck":
      candidates = [...getPlayer(state, controller).hand];
      amount = cost.amount;
      break;
    case "returnThisAndHandToDeck":
      for (const hand of combinations(getPlayer(state, controller).hand, cost.handAmount))
        yield [source, ...hand];
      return;
    case "returnTrashToDeck":
      for (const trash of combinations(
        candidatesForReturnTrashToDeckCost(state, controller, source, cost),
        cost.amount,
      ))
        yield [...(cost.includeSelf ? [source] : []), ...trash];
      return;
    case "addCharacterToLife":
    case "turnLifeFaceUp":
      candidates = candidatesForLifeCardCost(state, controller, source, cost);
      amount = cost.cost === "turnLifeFaceUp" ? cost.count : cost.amount;
      break;
    case "giveDon":
      candidates = giveDonCostCandidateIds(state, controller, cost, source);
      amount = 1;
      break;
    case "returnDon": {
      candidates = returnDonCostOptions(state, controller, cost.donState).map(
        (option) => option.id,
      );
      for (
        let count = cost.minimumAmount ?? cost.amount;
        count <= Math.min(cost.amount ?? candidates.length, candidates.length);
        count++
      )
        yield* combinations(candidates, count);
      return;
    }
    case "addLifeToHand":
    case "trashLife":
      if (cost.position === "choice") {
        yield ["top"];
        yield ["bottom"];
        return;
      }
      yield undefined;
      return;
    default:
      yield undefined;
      return;
  }
  yield* combinations(candidates, amount);
}

function* combinations(
  ids: readonly string[],
  count: number,
  start = 0,
  selected: string[] = [],
): Generator<string[]> {
  if (selected.length === count) {
    yield selected;
    return;
  }
  for (let index = start; index <= ids.length - (count - selected.length); index++) {
    yield* combinations(ids, count, index + 1, [...selected, ids[index]!]);
  }
}

export function costSourceIsCurrent(
  state: MatchState,
  source: string,
  cost: Cost,
  generation?: number,
): boolean {
  const refersToSource =
    [
      "restThisCard",
      "trashThisCard",
      "returnThisToHand",
      "returnThisToDeck",
      "returnThisAndHandToDeck",
    ].includes(cost.cost) ||
    (cost.cost === "returnTrashToDeck" && cost.includeSelf === true);
  return (
    !refersToSource ||
    generation === undefined ||
    getInstance(state, source).zoneChangeCounter === generation
  );
}

function* previewCostPlays(
  state: MatchState,
  controller: MatchSeat,
  source: string,
  ids: string[],
): Generator<MatchState> {
  const [id, ...remaining] = ids;
  if (!id) {
    yield state;
    return;
  }
  const full =
    getCardForInstance(state, id).cardType === "character" &&
    getOpenCharacterSlots(state, controller).length === 0;
  const replacements = full
    ? getPlayer(state, controller).characterArea.filter(
        (candidate): candidate is string => candidate !== null,
      )
    : [undefined];
  for (const replacement of replacements) {
    const preview: MatchState = JSON.parse(JSON.stringify(state));
    if (replacement) {
      returnAttachedDonToCostArea(preview, replacement);
      moveCard(preview, replacement, getInstance(preview, replacement).owner, "trash", {
        faceUp: true,
        publicKnowledge: true,
        actor: controller,
      });
    }
    if (playCardFromEffect(preview, controller, id, "active", source, { deferOnPlay: true }))
      yield* previewCostPlays(preview, controller, source, remaining);
  }
}

function canPayOrderedCosts(
  state: MatchState,
  controller: MatchSeat,
  source: string,
  costs: Cost[],
  index = 0,
  suppliedTrashHandIds?: string[],
  sourceGeneration = getInstance(state, source).zoneChangeCounter,
): boolean {
  const cost = costs[index];
  if (!cost) return true;
  if (!costSourceIsCurrent(state, source, cost, sourceGeneration)) return false;
  // A hand-only consumption prefix cannot spend more physical cards than exist.
  // Stop at any possible hand supplier; reveal/rest/DON costs do not supply cards.
  let handNeeded = 0;
  for (const later of costs.slice(index)) {
    if (["addLifeToHand", "returnCharacter", "returnThisToHand"].includes(later.cost)) break;
    if (
      (later.cost === "trashFromHand" && !later.fieldZones?.length) ||
      later.cost === "returnHandToDeck"
    )
      handNeeded += later.amount;
    if (later.cost === "returnThisAndHandToDeck") handNeeded += later.handAmount;
    if (handNeeded > getPlayer(state, controller).hand.length) return false;
  }
  const choices =
    cost.cost === "trashFromHand" && suppliedTrashHandIds !== undefined
      ? [suppliedTrashHandIds]
      : costSelections(state, controller, source, cost);
  for (const selected of choices) {
    const trashIds = cost.cost === "trashFromHand" ? selected : undefined;
    const byType = cost.cost === "giveDon" ? { giveDon: selected } : undefined;
    if (!canPayCosts(state, controller, source, [cost], trashIds, selected, byType)) continue;
    if (index === costs.length - 1) return true;
    // Logs, old queued work and pending prompts cannot affect original-payment
    // eligibility. Event history stays intact for characteristic predicates.
    const preview: MatchState = JSON.parse(
      JSON.stringify({
        ...state,
        logHistory: [],
        promptQueue: [],
        resolutionQueue: [],
        pendingAutoEffects: undefined,
        readyEffectGroup: undefined,
      }),
    );
    if (cost.cost === "playCard") {
      for (const placed of previewCostPlays(preview, controller, source, selected ?? []))
        if (
          canPayOrderedCosts(
            placed,
            controller,
            source,
            costs,
            index + 1,
            suppliedTrashHandIds,
            sourceGeneration,
          )
        )
          return true;
      continue;
    }
    if (cost.cost === "restThisCard" || cost.cost === "restCards") {
      const ids = cost.cost === "restThisCard" ? [source] : (selected ?? []);
      const donIds = ids.filter((id) => id.startsWith(`active-don:${controller}:`));
      // Preview original payment without Character rest replacements or triggers.
      // DON tokens are resources, not CardInstances; preserve their identities.
      moveDonIdentities(preview, donIdentitiesForVirtualIds(preview, controller, donIds), {
        seat: controller,
        area: "rested",
      });
      getPlayer(preview, controller).activeDon -= donIds.length;
      getPlayer(preview, controller).restedDon += donIds.length;
      for (const id of ids)
        if (!id.startsWith(`active-don:${controller}:`)) getInstance(preview, id).rested = true;
    } else if (cost.cost === "addLifeToHand") {
      // Eligibility concerns the original payment, even when a replacement will
      // prevent its completion later (8-3-1-7). Do not apply that replacement here.
      const player = getPlayer(preview, controller);
      const bottom = cost.position === "bottom" || selected?.[0] === "bottom";
      const ids = bottom ? player.life.splice(-cost.amount) : player.life.splice(0, cost.amount);
      for (const id of ids) {
        player.hand.push(id);
        const card = getInstance(preview, id);
        card.zone = "hand";
        card.zoneChangeCounter += 1;
      }
    } else if (!payCosts(preview, controller, source, [cost], trashIds, selected, byType)) continue;
    if (
      canPayOrderedCosts(
        preview,
        controller,
        source,
        costs,
        index + 1,
        cost.cost === "trashFromHand" ? undefined : suppliedTrashHandIds,
        sourceGeneration,
      )
    )
      return true;
  }
  return false;
}

/** Maximum original payment still possible after an earlier cost was paid. */
export function partiallyPayableCost(
  state: MatchState,
  controller: MatchSeat,
  source: string,
  cost: Cost,
  sourceGeneration?: number,
): Cost | null {
  if (!costSourceIsCurrent(state, source, cost, sourceGeneration)) {
    if (cost.cost === "returnThisAndHandToDeck") {
      cost = { cost: "returnHandToDeck", amount: cost.handAmount, position: cost.position };
    } else if (cost.cost === "returnTrashToDeck") {
      cost = { ...cost, includeSelf: undefined };
    } else return null;
  }
  let required: number;
  let resize: (amount: number) => Cost;
  if (cost.cost === "returnDon") {
    if (cost.minimumAmount !== undefined) {
      required = cost.minimumAmount;
      resize = (amount) => ({ ...cost, minimumAmount: amount });
    } else {
      required = cost.amount;
      resize = (amount) => ({ ...cost, amount });
    }
  } else if (cost.cost === "turnLifeFaceUp") {
    // Reducing top-N to top-M would change the original eligible cards.
    // The cursor binds every remaining original candidate before execution.
    const count = Math.min(
      cost.count,
      candidatesForLifeCardCost(state, controller, source, cost).length,
    );
    return count > 0 ? { ...cost, count, position: "any" } : null;
  } else if (cost.cost === "returnThisAndHandToDeck") {
    required = cost.handAmount;
    resize = (handAmount) => ({ ...cost, handAmount });
  } else if ("amount" in cost) {
    required = cost.amount;
    resize = (amount) => ({ ...cost, amount });
  } else {
    return null;
  }
  // All quantitative native costs spend/reveal physical cards or DON. Cap the
  // search by actual resources, then use monotone single-entry affordability.
  const resources =
    Object.keys(state.cards).length +
    donCardsOnField(state, "south") +
    donCardsOnField(state, "north");
  let low = 0;
  let high = Math.min(required, resources);
  if (!canPayCosts(state, controller, source, [resize(0)], undefined)) return null;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (canPayCosts(state, controller, source, [resize(middle)], undefined)) low = middle;
    else high = middle - 1;
  }
  // These compound entries can still move the source when no hand/trash card
  // remains. Other zero-sized entries perform no payment operation.
  if (
    low === 0 &&
    cost.cost !== "returnThisAndHandToDeck" &&
    !(cost.cost === "returnTrashToDeck" && cost.includeSelf)
  )
    return null;
  return resize(low);
}

export function canPayEffectBlockCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  block: EffectBlock,
  trashHandIds?: string[],
): boolean {
  const groups = block.alternativeCosts?.map((costs) => [...(block.costs ?? []), ...costs]) ?? [
    block.costs,
  ];
  return groups.some((costs) =>
    (costs?.length ?? 0) > 1
      ? canPayOrderedCosts(state, controller, sourceInstanceId, costs!, 0, trashHandIds)
      : canPayCosts(state, controller, sourceInstanceId, costs, trashHandIds),
  );
}

export function bindDonCostSelections(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[],
  paymentIds: string[] | undefined,
  byType: EffectBlockContinuation["costPaymentIdsByType"],
): Array<string[] | undefined> | null {
  if (!state.donIdentities) return costs.map(() => undefined);
  const preview: MatchState = JSON.parse(JSON.stringify(state));
  preview.donIdentities!.processes.push("payment-preview");
  const bound: Array<string[] | undefined> = [];
  for (const cost of costs) {
    let tokens: string[] | undefined,
      valid: (token: string) => boolean = () => true;
    let destination: import("../engine/don-state.ts").DonLocation | undefined;
    if (cost.cost === "restDon") {
      tokens =
        byType?.restDon ??
        donIdentitiesAt(state, { seat: controller, area: "active" }).slice(0, cost.amount);
      valid = (token) =>
        donIdentitiesAt(preview, { seat: controller, area: "active" }).includes(token);
      destination = { seat: controller, area: "rested" };
    } else if (cost.cost === "giveDon") {
      const { donorSeat } = giveDonCostParts(state, controller, cost);
      const from = {
        seat: donorSeat,
        area: cost.donState === "rested" ? ("rested" as const) : ("active" as const),
      };
      tokens = byType?.giveDonSources ?? donIdentitiesAt(state, from).slice(0, cost.amount);
      valid = (token) => donIdentitiesAt(preview, from).includes(token);
      const targetId = (byType?.giveDon ??
        giveDonCostCandidateIds(state, controller, cost, sourceInstanceId))[0];
      if (!targetId) return null;
      destination = { attachedTo: targetId };
    } else if (cost.cost === "returnDon") {
      const ids =
        paymentIds ??
        returnDonCostOptions(state, controller, cost.donState)
          .slice(0, cost.minimumAmount ?? cost.amount)
          .map((option) => option.id);
      tokens = byType?.returnDonSources ?? donIdentitiesForVirtualIds(state, controller, ids);
      if (tokens.length !== ids.length) return null;
      valid = (token) => {
        const location = locateDonIdentity(preview, token);
        if (!location) return false;
        if ("attachedTo" in location)
          return (
            getInstance(preview, location.attachedTo).controller === controller &&
            (cost.donState === undefined || cost.donState === "attached" || cost.donState === "any")
          );
        return (
          location.seat === controller &&
          (cost.donState === undefined ||
            cost.donState === "any" ||
            cost.donState === location.area)
        );
      };
      if (cost.destination === "costAreaRested") destination = { seat: controller, area: "rested" };
    } else if (cost.cost === "restCards") {
      const ids =
        byType?.restCards ??
        (costs.some((candidate) => candidate.cost === "returnDon") ? undefined : paymentIds) ??
        candidatesForRestCardsCost(state, controller, sourceInstanceId, cost).slice(0, cost.amount);
      tokens = byType?.restCardsSources ?? donIdentitiesForVirtualIds(state, controller, ids);
      if (tokens.length !== ids.filter((id) => id.startsWith("active-don:")).length) return null;
      valid = (token) =>
        donIdentitiesAt(preview, { seat: controller, area: "active" }).includes(token);
      destination = { seat: controller, area: "rested" };
    }
    if (tokens) {
      if (new Set(tokens).size !== tokens.length || tokens.some((token) => !valid(token)))
        return null;
      moveDonIdentities(preview, tokens, destination);
    }
    bound.push(tokens);
  }
  return bound;
}

export function canPayCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
  costPaymentIds?: string[],
  costPaymentIdsByType?: {
    giveDon?: string[];
    giveDonSources?: string[];
    restDon?: string[];
    returnDonSources?: string[];
    restCardsSources?: string[];
    restCards?: string[];
    returnCharacter?: string[];
  },
): boolean {
  if (!costs?.length) {
    return true;
  }

  for (const cost of costs) {
    switch (cost.cost) {
      case "trashThisCard": {
        const trashThisCost = cost as Extract<
          Cost,
          { cost: "trashThisCard"; filters?: TargetFilter[] }
        >;
        const gateMatches = (trashThisCost.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, sourceInstanceId, filter);
          return result.supported && result.matches;
        });
        if (!gateMatches) {
          return false;
        }
        break;
      }
      case "restDon":
        if (
          costPaymentIdsByType?.restDon &&
          (costPaymentIdsByType.restDon.length !== cost.amount ||
            new Set(costPaymentIdsByType.restDon).size !== cost.amount ||
            costPaymentIdsByType.restDon.some(
              (id) => !donIdentitiesAt(state, { seat: controller, area: "active" }).includes(id),
            ))
        )
          return false;
        if (getPlayer(state, controller).activeDon < cost.amount) {
          return false;
        }
        break;
      case "giveDon": {
        const { poolAmount, donorSeat } = giveDonCostParts(state, controller, cost);
        if (
          costPaymentIdsByType?.giveDonSources &&
          (costPaymentIdsByType.giveDonSources.length !== cost.amount ||
            new Set(costPaymentIdsByType.giveDonSources).size !== cost.amount ||
            costPaymentIdsByType.giveDonSources.some(
              (id) =>
                !donIdentitiesAt(state, {
                  seat: donorSeat,
                  area: cost.donState === "rested" ? "rested" : "active",
                }).includes(id),
            ))
        )
          return false;
        const candidates = giveDonCostCandidateIds(state, controller, cost, sourceInstanceId);
        const selected = costPaymentIdsByType?.giveDon ?? candidates.slice(0, 1);
        if (
          poolAmount < cost.amount ||
          selected.length !== 1 ||
          !candidates.includes(selected[0]!)
        ) {
          return false;
        }
        break;
      }
      case "returnDon":
        if (
          returnDonCostOptions(state, controller, cost.donState).length <
          (cost.minimumAmount ?? cost.amount)
        ) {
          return false;
        }
        if (costPaymentIds) {
          const candidateIds = returnDonCostOptions(state, controller, cost.donState).map(
            (option) => option.id,
          );
          const minimumAmount = cost.minimumAmount ?? cost.amount;
          const maximumAmount =
            cost.minimumAmount === undefined ? minimumAmount : candidateIds.length;
          if (
            costPaymentIds.length < minimumAmount ||
            costPaymentIds.length > maximumAmount ||
            new Set(costPaymentIds).size !== costPaymentIds.length ||
            costPaymentIds.some((id) => !candidateIds.includes(id))
          ) {
            return false;
          }
        }
        break;
      case "restThisCard":
        if (
          getInstance(state, sourceInstanceId).rested ||
          hasFlagModifier(state, sourceInstanceId, "cannotBeRested")
        ) {
          return false;
        }
        break;
      case "modifyLeaderPower":
        if (
          cost.requiresActive &&
          getInstance(state, getPlayer(state, controller).leaderInstanceId).rested
        ) {
          return false;
        }
        break;
      case "returnThisToHand": {
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller || source.zone !== "character") {
          return false;
        }
        break;
      }
      case "trashFromHand":
        const trashCandidates = candidatesForTrashFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selectedTrashIds = trashHandIds ?? trashCandidates.slice(0, cost.amount);
        if (
          selectedTrashIds.length !== cost.amount ||
          new Set(selectedTrashIds).size !== selectedTrashIds.length ||
          selectedTrashIds.some((instanceId) => !trashCandidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      case "playCard": {
        const candidates = candidatesForPlayCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashCard": {
        const candidates = candidatesForTrashCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashLife":
        if (
          getPlayer(state, controller).life.length < cost.amount ||
          (cost.position === "choice" &&
            getPlayer(state, controller).life.length > 1 &&
            costPaymentIds !== undefined &&
            (costPaymentIds.length !== 1 ||
              (costPaymentIds[0] !== "top" && costPaymentIds[0] !== "bottom")))
        ) {
          return false;
        }
        break;
      case "returnCharacterToDeck": {
        const candidates = candidatesForReturnCharacterToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? player.hand.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !player.hand.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnTrashToDeck": {
        const candidates = candidatesForReturnTrashToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const source = getInstance(state, sourceInstanceId);
        if (cost.includeSelf && (source.controller !== controller || source.zone !== "character")) {
          return false;
        }
        const selected = costPaymentIds ?? [
          ...(cost.includeSelf ? [sourceInstanceId] : []),
          ...candidates.slice(0, cost.amount),
        ];
        const selectedTrash = cost.includeSelf
          ? selected.filter((instanceId) => instanceId !== sourceInstanceId)
          : selected;
        if (
          selected.length !== cost.amount + (cost.includeSelf ? 1 : 0) ||
          new Set(selected).size !== selected.length ||
          (cost.includeSelf && !selected.includes(sourceInstanceId)) ||
          selectedTrash.length !== cost.amount ||
          selectedTrash.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnThisToDeck": {
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller) {
          return false;
        }
        break;
      }
      case "returnThisAndHandToDeck": {
        const player = getPlayer(state, controller);
        const source = getInstance(state, sourceInstanceId);
        if (source.controller !== controller || player.hand.length < cost.handAmount) {
          return false;
        }
        if (costPaymentIds) {
          const selectedHandIds = costPaymentIds.filter(
            (instanceId) => instanceId !== sourceInstanceId,
          );
          if (
            costPaymentIds.length !== cost.handAmount + 1 ||
            new Set(costPaymentIds).size !== costPaymentIds.length ||
            !costPaymentIds.includes(sourceInstanceId) ||
            selectedHandIds.length !== cost.handAmount ||
            selectedHandIds.some((instanceId) => !player.hand.includes(instanceId))
          ) {
            return false;
          }
        }
        break;
      }
      case "addCharacterToLife":
      case "turnLifeFaceUp": {
        const candidates = candidatesForLifeCardCost(state, controller, sourceInstanceId, cost);
        const count = cost.cost === "turnLifeFaceUp" ? cost.count : cost.amount;
        const selected = costPaymentIds ?? candidates.slice(0, count);
        if (
          selected.length !== count ||
          new Set(selected).size !== count ||
          selected.some((id) => !candidates.includes(id))
        )
          return false;
        break;
      }
      case "addLifeToHand": {
        const player = getPlayer(state, controller);
        if (
          player.life.length < cost.amount ||
          hasFlagModifier(state, player.leaderInstanceId, "cannotAddLifeToHandByOwnEffect")
        ) {
          return false;
        }
        if (
          cost.position === "choice" &&
          player.life.length > 1 &&
          costPaymentIds !== undefined &&
          (costPaymentIds.length !== 1 ||
            (costPaymentIds[0] !== "top" && costPaymentIds[0] !== "bottom"))
        ) {
          return false;
        }
        break;
      }
      case "restCards": {
        const candidates = candidatesForRestCardsCost(state, controller, sourceInstanceId, cost);
        const selected =
          costPaymentIdsByType?.restCards ??
          (costs.some((candidate) => candidate.cost === "returnDon")
            ? undefined
            : costPaymentIds) ??
          candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "koCharacter": {
        const candidates = candidatesForKoCharacterCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "trashCharacter": {
        const candidates = candidatesForTrashCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "returnCharacter": {
        const candidates = candidatesForReturnCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected =
          costPaymentIdsByType?.returnCharacter ??
          costPaymentIds ??
          candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
      case "revealFromHand": {
        const candidates = candidatesForRevealFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        if (
          selected.length !== cost.amount ||
          new Set(selected).size !== selected.length ||
          selected.some((instanceId) => !candidates.includes(instanceId))
        ) {
          return false;
        }
        break;
      }
    }
  }

  if (
    state.donIdentities &&
    costPaymentIds &&
    (costPaymentIdsByType?.restDon ||
      costPaymentIdsByType?.giveDonSources ||
      costPaymentIdsByType?.restCards) &&
    !bindDonCostSelections(
      state,
      controller,
      sourceInstanceId,
      costs,
      costPaymentIds,
      costPaymentIdsByType,
    )
  )
    return false;
  return true;
}

export function payCosts(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  costs: Cost[] | undefined,
  trashHandIds: string[] | undefined,
  costPaymentIds?: string[],
  costPaymentIdsByType?: {
    giveDon?: string[];
    giveDonSources?: string[];
    restDon?: string[];
    returnDonSources?: string[];
    restCardsSources?: string[];
    restCards?: string[];
    returnCharacter?: string[];
  },
): boolean {
  if (!costs?.length) {
    return true;
  }

  if (
    !canPayCosts(
      state,
      controller,
      sourceInstanceId,
      costs,
      trashHandIds,
      costPaymentIds,
      costPaymentIdsByType,
    )
  ) {
    return false;
  }

  const donPayments = bindDonCostSelections(
    state,
    controller,
    sourceInstanceId,
    costs,
    costPaymentIds,
    costPaymentIdsByType,
  );
  if (!donPayments) return false;
  let fullyPaid = true;
  for (const [costIndex, cost] of costs.entries()) {
    switch (cost.cost) {
      case "restDon":
        transferDonIdentities(
          state,
          { seat: controller, area: "active" },
          { seat: controller, area: "rested" },
          cost.amount,
          donPayments[costIndex],
        );
        getPlayer(state, controller).activeDon -= cost.amount;
        getPlayer(state, controller).restedDon += cost.amount;
        break;
      case "giveDon": {
        const { donorSeat, poolAmount } = giveDonCostParts(state, controller, cost);
        const donor = getPlayer(state, donorSeat);
        const targetId = (costPaymentIdsByType?.giveDon ??
          giveDonCostCandidateIds(state, controller, cost, sourceInstanceId))[0]!;
        if (poolAmount < cost.amount) {
          return false;
        }
        transferDonIdentities(
          state,
          { seat: donorSeat, area: cost.donState === "rested" ? "rested" : "active" },
          { attachedTo: targetId },
          cost.amount,
          donPayments[costIndex],
        );
        if (cost.donState === "rested") {
          donor.restedDon -= cost.amount;
        } else {
          donor.activeDon -= cost.amount;
        }
        getInstance(state, targetId).attachedDon += cost.amount;
        publishDonGiven(state, targetId, cost.amount, controller, sourceInstanceId);
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${cost.amount} ${cost.donState ?? "active"} DON!! to ${cardName(getCardForInstance(state, targetId))} as an activation cost.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [targetId],
            visibility: "public",
          },
        );
        break;
      }
      case "returnDon": {
        const minimumAmount = cost.minimumAmount ?? cost.amount;
        const selectedIds = donPayments[costIndex]
          ? virtualIdsForDonIdentities(state, donPayments[costIndex]!)
          : (costPaymentIds ??
            returnDonCostOptions(state, controller, cost.donState)
              .slice(0, minimumAmount)
              .map((option) => option.id));
        if (cost.destination === "costAreaRested") {
          moveDonIdentities(state, donIdentitiesForVirtualIds(state, controller, selectedIds), {
            seat: controller,
            area: "rested",
          });
          for (const id of selectedIds) {
            const instanceId = id.slice("attached-don:".length, id.lastIndexOf(":"));
            getInstance(state, instanceId).attachedDon -= 1;
          }
          getPlayer(state, controller).restedDon += selectedIds.length;
          emitLog(
            state,
            controller,
            `${effectSourceName(state, sourceInstanceId)} returns ${selectedIds.length} given DON!! to the cost area rested as an activation cost.`,
            {
              sourceCardId: getInstance(state, sourceInstanceId).cardId,
              sourceInstanceId,
              visibility: "public",
            },
          );
        } else {
          returnSelectedDonToDeck(state, controller, selectedIds, sourceInstanceId, controller);
        }
        break;
      }
      case "restThisCard":
        restCharacterByEffect(state, sourceInstanceId, controller, sourceInstanceId);
        break;
      case "modifyLeaderPower": {
        const leaderId = getPlayer(state, controller).leaderInstanceId;
        addModifier(state, sourceInstanceId, leaderId, {
          type: "power",
          value: cost.value,
          duration: cost.duration,
          expiresAtTurn: state.turnNumber,
          expiresAtBattleId: null,
          expiresOnTurnStartOfSeat: null,
        });
        emitLog(
          state,
          controller,
          `${effectSourceName(state, sourceInstanceId)} gives ${cardName(getCardForInstance(state, leaderId))} ${cost.value} power during this turn as an activation cost.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: [leaderId],
            visibility: "public",
          },
        );
        break;
      }
      case "trashThisCard": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: controller,
        });
        break;
      }
      case "returnThisToHand": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
        break;
      }
      case "trashFromHand": {
        const seat = controller;
        const selected =
          trashHandIds ??
          candidatesForTrashFromHandCost(state, seat, sourceInstanceId, cost).slice(0, cost.amount);
        const discardedHandIds = selected.filter((id) => getInstance(state, id).zone === "hand");
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          // The aggregate "trashes N card(s) from hand." line below is the
          // single player-facing record; per-card zone movements would repeat
          // it once per card.
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
            visibility: "private",
            suppressLog: true,
          });
        }
        if (selected.length > 0) {
          emitLog(
            state,
            controller,
            `${getPlayer(state, seat).playerName} trashes ${selected.length} card${
              selected.length === 1 ? "" : "s"
            } from hand.`,
            {
              visibility: "private",
              privateMessages: {
                [seat]: `You trashed ${formatCardList(state, selected)}.`,
              },
              judgeMessage: `${getPlayer(state, seat).playerName} trashes ${formatCardList(state, selected)} from hand.`,
            },
          );
        }
        recordHandTrashedByEffect(state, controller, sourceInstanceId, seat, discardedHandIds);
        break;
      }
      case "playCard": {
        const candidates = candidatesForPlayCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          if (!playCardFromEffect(state, controller, instanceId, "active", sourceInstanceId)) {
            return false;
          }
        }
        break;
      }
      case "trashCard": {
        const candidates = candidatesForTrashCardCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        const discardedHandIds = selected.filter((id) => getInstance(state, id).zone === "hand");
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
          });
        }
        recordHandTrashedByEffect(
          state,
          controller,
          sourceInstanceId,
          controller,
          discardedHandIds,
        );
        break;
      }
      case "trashLife": {
        const player = getPlayer(state, controller);
        const position =
          cost.position === "choice"
            ? costPaymentIds?.[0] === "bottom"
              ? "bottom"
              : "top"
            : cost.position;
        const selected =
          position === "bottom"
            ? player.life.slice(-cost.amount)
            : player.life.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
            sourceInstanceId,
            visibility: "public",
          });
        }
        break;
      }
      case "returnCharacterToDeck": {
        const candidates = candidatesForReturnCharacterToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          const owner = getInstance(state, instanceId).owner;
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, owner, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
          });
        }
        break;
      }
      case "returnHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? player.hand.slice(0, cost.amount);
        for (const instanceId of selected) {
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "returnTrashToDeck": {
        const candidates = candidatesForReturnTrashToDeckCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? [
          ...(cost.includeSelf ? [sourceInstanceId] : []),
          ...candidates.slice(0, cost.amount),
        ];
        const publiclyRevealedIds = [...selected].sort((left, right) => left.localeCompare(right));
        emitLog(
          state,
          controller,
          `${getPlayer(state, controller).playerName} returns ${formatCardList(state, publiclyRevealedIds)} ${cost.includeSelf ? "from the field and trash" : "from trash"} to the ${cost.position} of their deck in a private order.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: publiclyRevealedIds,
            visibility: "public",
          },
        );
        const movementOrder = cost.position === "top" ? [...selected].reverse() : selected;
        for (const instanceId of movementOrder) {
          if (cost.includeSelf && instanceId === sourceInstanceId) {
            returnAttachedDonToCostArea(state, instanceId);
          }
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "public",
            suppressLog: true,
            redactIdentity: true,
          });
        }
        break;
      }
      case "returnThisToDeck": {
        const source = getInstance(state, sourceInstanceId);
        returnAttachedDonToCostArea(state, sourceInstanceId);
        moveCard(state, sourceInstanceId, source.owner, "deck", {
          deckPosition: cost.position,
          faceUp: false,
          publicKnowledge: false,
          actor: controller,
        });
        break;
      }
      case "returnThisAndHandToDeck": {
        const player = getPlayer(state, controller);
        const selected = costPaymentIds ?? [
          sourceInstanceId,
          ...player.hand.slice(0, cost.handAmount),
        ];
        for (const instanceId of selected) {
          if (instanceId === sourceInstanceId) {
            returnAttachedDonToCostArea(state, instanceId);
          }
          moveCard(state, instanceId, controller, "deck", {
            deckPosition: cost.position,
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            visibility: "private",
          });
        }
        break;
      }
      case "restCards": {
        const selected =
          costPaymentIdsByType?.restCards ??
          (costs?.some((candidate) => candidate.cost === "returnDon")
            ? undefined
            : costPaymentIds) ??
          candidatesForRestCardsCost(state, controller, sourceInstanceId, cost).slice(
            0,
            cost.amount,
          );
        moveDonIdentities(state, donPayments[costIndex] ?? [], {
          seat: controller,
          area: "rested",
        });
        for (const instanceId of selected) {
          if (instanceId.startsWith(`active-don:${controller}:`)) {
            getPlayer(state, controller).activeDon -= 1;
            getPlayer(state, controller).restedDon += 1;
          } else {
            restCharacterByEffect(state, instanceId, controller, sourceInstanceId);
          }
        }
        break;
      }
      case "koCharacter": {
        const candidates = candidatesForKoCharacterCost(state, controller, sourceInstanceId, cost);
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          koCharacterByEffect(state, instanceId, controller, sourceInstanceId);
        }
        break;
      }
      case "trashCharacter": {
        const candidates = candidatesForTrashCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: controller,
          });
        }
        break;
      }
      case "turnLifeFaceUp": {
        const lifeIds =
          costPaymentIds ??
          candidatesForLifeCardCost(state, controller, sourceInstanceId, cost).slice(0, cost.count);
        const faceUp = cost.faceUp ?? true;
        for (const instanceId of lifeIds) {
          const instance = getInstance(state, instanceId);
          instance.faceUp = faceUp;
          instance.publicKnowledge = faceUp;
        }
        emitLog(
          state,
          controller,
          faceUp
            ? `${getPlayer(state, controller).playerName} turns ${formatCardList(state, lifeIds)} face-up in Life.`
            : `${getPlayer(state, controller).playerName} turns ${lifeIds.length} Life card(s) face-down.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            ...(faceUp && { targetIds: lifeIds }),
            visibility: "public",
          },
        );
        break;
      }
      case "addLifeToHand": {
        const player = getPlayer(state, controller);
        const position =
          cost.position === "choice" ? (costPaymentIds?.[0] ?? "top") : (cost.position ?? "top");
        const selected =
          position === "bottom"
            ? player.life.slice(-cost.amount)
            : player.life.slice(0, cost.amount);
        const replacedIds = replacedLifeToHandIds(state, selected);
        for (const instanceId of selected) {
          moveCard(state, instanceId, controller, "hand", {
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
          if (getInstance(state, instanceId).zone !== "hand") fullyPaid = false;
        }
        promptForLifeReplacementOrder(state, completedLifeReplacementMoves(state, replacedIds));
        break;
      }
      case "returnCharacter": {
        const candidates = candidatesForReturnCharacterCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected =
          costPaymentIdsByType?.returnCharacter ??
          costPaymentIds ??
          candidates.slice(0, cost.amount);
        for (const instanceId of selected) {
          returnAttachedDonToCostArea(state, instanceId);
          moveCard(state, instanceId, controller, "hand", {
            faceUp: false,
            publicKnowledge: false,
            actor: controller,
            sourceInstanceId,
            visibility: "private",
          });
        }
        break;
      }
      case "revealFromHand": {
        const candidates = candidatesForRevealFromHandCost(
          state,
          controller,
          sourceInstanceId,
          cost,
        );
        const selected = costPaymentIds ?? candidates.slice(0, cost.amount);
        emitLog(
          state,
          controller,
          `${getPlayer(state, controller).playerName} reveals ${formatCardList(state, selected)} from hand.`,
          {
            sourceCardId: getInstance(state, sourceInstanceId).cardId,
            sourceInstanceId,
            targetIds: selected,
            visibility: "public",
          },
        );
        break;
      }
    }
  }

  return fullyPaid;
}

export function candidatesForRevealFromHandCost(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  cost: RevealFromHandCost,
): string[] {
  return getPlayer(state, controller).hand.filter((instanceId) =>
    (cost.filters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
      return result.supported && result.matches;
    }),
  );
}
