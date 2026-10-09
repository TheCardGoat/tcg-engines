import { optionalDonSources, donSourceIds } from "./don-loop.ts";
import { movingSourceIds, optionalMovingSources } from "./optional-moving-loop.ts";
import { isDeterministicStateAction, stableConditionsMatch } from "./loop-transition.ts";
import { effectBlocksForInstance, emitLog, getPlayer, otherSeat } from "../shared.ts";
import { createChoicePrompt } from "../state.ts";
import type { MatchSeat, MatchState, OptionalLoopBoundary, ResolutionItem } from "../types.ts";

function audited(state: MatchState, item: ResolutionItem): boolean {
  if (item.kind === "effectComplete") return true;
  if (item.kind === "effectAction")
    return isDeterministicStateAction(state, item, item.action, "forcedGroup");
  if (item.kind !== "effectBlock") return false;
  const block = effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[
    item.blockIndex
  ];
  return Boolean(
    block &&
    !block.oncePerTurn &&
    !block.costs?.length &&
    !block.alternativeCosts?.length &&
    !block.postCostConditions?.length &&
    stableConditionsMatch(
      state,
      item.controller,
      item.sourceInstanceId,
      block.conditions,
      "restReady",
    ) &&
    block.actions.every((action) => isDeterministicStateAction(state, item, action, "forcedGroup")),
  );
}

// No hidden snapshot is projected. These exact comparisons are internal proof
// evidence. Only telemetry, resolved prompts, and command history are omitted;
// no audited transition reads them. Physical IDs always remain. The separately
// certified self-movement profile preserves relative source-generation identity.
function semanticState(
  state: MatchState,
  includeQueue: boolean,
  boundaryItem?: ResolutionItem,
  movingSourceInstanceIds: string[] = [],
): string {
  const queueIds = new Map<string, string>();
  const queueId = (id: string) => {
    if (!queueIds.has(id)) queueIds.set(id, `queue-${queueIds.size}`);
    return queueIds.get(id)!;
  };
  const queued = (item: ResolutionItem) => ({
    ...item,
    id: queueId(item.id),
    ...(movingSourceInstanceIds.includes(
      item.kind === "effectBlock" ? item.sourceInstanceId : "",
    ) &&
    item.kind === "effectBlock" &&
    item.sourceZoneChangeCounter !== undefined
      ? {
          sourceZoneChangeCounter:
            item.sourceZoneChangeCounter - state.cards[item.sourceInstanceId]!.zoneChangeCounter,
        }
      : {}),
  });
  const semantic = {
    ...state,
    ...(movingSourceInstanceIds.length
      ? {
          cards: Object.fromEntries(
            Object.entries(state.cards).map(([id, card]) => [
              id,
              movingSourceInstanceIds.includes(id) ? { ...card, zoneChangeCounter: 0 } : card,
            ]),
          ),
        }
      : {}),
    // Derived cache keys contain raw movement generations and K.O. history.
    // Preserve the actual settled choices and any pending settlement, not the
    // redundant serialization used only to invalidate that cache.
    continuousCosts: state.continuousCosts
      ? { ...state.continuousCosts, fingerprint: undefined }
      : undefined,
    optionalLoopEvidence: undefined,
    optionalLoopPlan: undefined,
    stoppedOptionalLoops: undefined,
    pendingAutoEffects: state.pendingAutoEffects?.map(queued),
    readyEffectGroup: state.readyEffectGroup
      ? {
          ...state.readyEffectGroup,
          effects: state.readyEffectGroup.effects.map(queued),
        }
      : undefined,
    idCounter: 0,
    eventSequence: 0,
    logSequence: 0,
    capabilitySequence: 0,
    eventHistory: ["south", "north"].map((seat) =>
      state.eventHistory.some(
        (event) =>
          event.type === "characterKod" &&
          event.turn === state.turnNumber &&
          event.payload.targetController === seat,
      ),
    ),
    logHistory: [],
    capabilityHistory: [],
    commandHistory: [],
    promptQueue: [],
    resolutionStatus: "running",
    resolutionQueue: includeQueue
      ? (boundaryItem ? [boundaryItem, ...state.resolutionQueue] : state.resolutionQueue).map(
          queued,
        )
      : [],
  };
  // MatchState field insertion order can change after restore/queue cleanup.
  // Nested dictionary order remains exact: modifier order controls appended costs.
  return JSON.stringify(
    Object.fromEntries(Object.entries(semantic).sort(([a], [b]) => a.localeCompare(b))),
  );
}

function requestCount(state: MatchState, seat: MatchSeat): void {
  createChoicePrompt(state, {
    choiceKind: "chooseNumber",
    seat,
    label: "Declare loop repetitions",
    details:
      "Declare a finite number of complete loop repetitions, then stop. Enter a nonnegative whole number.",
    sourceCardId: null,
    sourceInstanceId: null,
    eventId: null,
    options: [],
    minSelections: 1,
    maxSelections: 1,
    context: { minimum: 0, maximum: Number.MAX_SAFE_INTEGER, integer: true },
    resolutionContext: { intent: "loopIterations" },
  });
}

/** Called before a queue transition. Never certify an unaudited transition. */
export function observeOptionalLoop(
  state: MatchState,
  boundaryItem?: Extract<ResolutionItem, { kind: "effectBlock" | "effectAction" }>,
): "continue" | "pause" | "skip" | "resolve" {
  const item = boundaryItem ?? state.resolutionQueue[0];
  const movingIds = item ? optionalMovingSources(state, item) : undefined;
  const donSources = item ? optionalDonSources(state, item) : undefined;
  const existingBoundary = state.optionalLoopPlan?.boundaries[0] ?? state.optionalLoopEvidence?.[0];
  const existingDon = donSourceIds(existingBoundary);
  const existingMoving = movingSourceIds(
    state.optionalLoopPlan?.boundaries[0] ?? state.optionalLoopEvidence?.[0],
  );
  if (
    !item ||
    (existingBoundary && !existingDon.length && donSources) ||
    (existingDon.length
      ? JSON.stringify(donSources) !== JSON.stringify(existingDon)
      : existingMoving.length
        ? !movingIds
        : !movingIds && !donSources && !audited(state, item))
  ) {
    state.optionalLoopEvidence = undefined;
    state.optionalLoopPlan = undefined;
    return "continue";
  }
  if (!boundaryItem || (item.kind !== "effectBlock" && item.kind !== "effectAction"))
    return "continue";
  if (item.kind === "effectBlock") {
    if (
      item.confirmed ||
      !effectBlocksForInstance(state, item.sourceInstanceId, item.trigger)[item.blockIndex]
        ?.optional
    )
      return "continue";
  } else if (item.action.action !== "optional") return "continue";
  const boundary: OptionalLoopBoundary = {
    ...(donSources?.length === 1
      ? { donSourceInstanceId: donSources[0] }
      : donSources
        ? { donSourceInstanceIds: donSources }
        : {}),
    ...(movingIds?.length === 1
      ? { movingSourceInstanceId: movingIds[0] }
      : movingIds
        ? { movingSourceInstanceIds: movingIds }
        : {}),
    fingerprint: semanticState(state, true, item, movingIds),
    cardState: semanticState(state, false, undefined, movingIds),
    effectKey:
      item.kind === "effectBlock"
        ? `${item.sourceInstanceId}:${item.trigger}:${item.blockIndex}`
        : `${item.sourceInstanceId}:optionalAction:${JSON.stringify(item.action)}`,
    controller: item.controller,
  };
  const plan = state.optionalLoopPlan;
  if (plan?.phase === "stop") {
    if (plan.representativeCycle === "start") {
      // Normal movement creates a fresh object. All remaining complete cycles
      // are equivalent under the strict reference-free self-movement proof.
      plan.representativeCycle = "return";
      if (item.kind === "effectAction") return "resolve";
      item.confirmed = true;
      return "continue";
    }
    if (plan.representativeCycle === "return") {
      if (boundary.fingerprint !== plan.boundaries[0]?.fingerprint) {
        if (item.kind === "effectAction") return "resolve";
        item.confirmed = true;
        return "continue";
      }
      plan.representativeCycle = undefined;
    }
    if (item.controller === plan.stopSeat) {
      // Complete cycles were shortcut below. Traverse only the remaining prefix to
      // the selected player's stopping boundary, then decline that activation.
      state.stoppedOptionalLoops = [
        ...(state.stoppedOptionalLoops ?? []),
        ...plan.boundaries,
        boundary,
      ];
      state.optionalLoopPlan = undefined;
      state.optionalLoopEvidence = undefined;
      emitLog(
        state,
        item.controller,
        `${getPlayer(state, item.controller).playerName} stops the loop.`,
        { visibility: "public" },
      );
      return "skip";
    }
    if (item.kind === "effectAction") return "resolve";
    item.confirmed = true;
    return "continue";
  }
  if (
    state.stoppedOptionalLoops?.some(
      (stopped) =>
        stopped.effectKey === boundary.effectKey && stopped.cardState === boundary.cardState,
    )
  ) {
    emitLog(
      state,
      item.controller,
      "This optional loop cannot be restarted in the same game state.",
      { visibility: "public" },
    );
    state.optionalLoopEvidence = undefined;
    return "skip";
  }
  const evidence = state.optionalLoopEvidence ?? [];
  const repeatedAt = evidence.findIndex(
    (previous) => previous.fingerprint === boundary.fingerprint,
  );
  if (repeatedAt < 0) {
    state.optionalLoopEvidence = [...evidence, boundary];
    return "continue";
  }
  const boundaries = evidence.slice(repeatedAt);
  const participants = [state.activeSeat, otherSeat(state.activeSeat)].filter((seat) =>
    boundaries.some((entry) => entry.controller === seat),
  );
  state.optionalLoopPlan = { boundaries, participants, declarations: {}, phase: "declare" };
  state.optionalLoopEvidence = undefined;
  requestCount(state, participants[0]!);
  return "pause";
}

export function validLoopDeclaration(
  state: MatchState,
  seat: MatchSeat,
  iterations: number | undefined,
): boolean {
  const plan = state.optionalLoopPlan;
  return Boolean(
    plan?.phase === "declare" &&
    plan.participants.find((participant) => plan.declarations[participant] === undefined) ===
      seat &&
    iterations !== undefined &&
    Number.isSafeInteger(iterations) &&
    iterations >= 0,
  );
}

export function declareLoopIterations(
  state: MatchState,
  seat: MatchSeat,
  iterations: number,
): boolean {
  if (!validLoopDeclaration(state, seat, iterations)) return false;
  const plan = state.optionalLoopPlan!;
  plan.declarations[seat] = iterations;
  emitLog(
    state,
    seat,
    `${getPlayer(state, seat).playerName} declares ${iterations} loop repetitions.`,
    { visibility: "public" },
  );
  const nextSeat = plan.participants.find(
    (participant) => plan.declarations[participant] === undefined,
  );
  if (nextSeat) {
    requestCount(state, nextSeat);
    return true;
  }
  const count = Math.min(
    ...plan.participants.map((participant) => plan.declarations[participant]!),
  );
  // Equal declarations stop at the turn player's next boundary. Both players
  // chose that count, so either stopping choice would satisfy 11-1-1-3.
  plan.stopSeat = plan.participants.find(
    (participant) => plan.declarations[participant] === count,
  )!;
  plan.phase = "stop";
  if (count > 0 && movingSourceIds(plan.boundaries[0]).length) plan.representativeCycle = "start";
  // Rest/ready restores exact state. Self-movement executes one representative
  // cycle through normal movement to create the new object (3-1-6); its strict
  // proof excludes external references and observers of skipped generations.
  // Neither shortcut allocates work proportional to the declared integer.
  emitLog(state, "system", `The loop repeats ${count} ${count === 1 ? "time" : "times"}.`, {
    visibility: "public",
  });
  return true;
}
