import type { Action, EffectBlock } from "@tcg/op-types";
import { isForcedSelfMovement, stableConditionsMatch } from "./loop-transition.ts";
import { getCardForInstance } from "../shared.ts";
import type { MatchState, OptionalLoopBoundary, ResolutionItem } from "../types.ts";

/** Older saved plans carry the scalar field; keep that snapshot contract. */
export function movingSourceIds(boundary: OptionalLoopBoundary | undefined): string[] {
  return (
    boundary?.movingSourceInstanceIds ??
    (boundary?.movingSourceInstanceId ? [boundary.movingSourceInstanceId] : [])
  );
}

function unwrap(actions: Action[]): { body: Action[]; wrappers: string[] } | undefined {
  const wrappers: string[] = [];
  while (actions.length === 1 && actions[0]?.action === "optional") {
    const action = actions[0];
    if (!Object.keys(action).every((key) => key === "action" || key === "actions")) return;
    const key = JSON.stringify(action);
    if (wrappers.includes(key)) return;
    wrappers.push(key);
    actions = action.actions;
  }
  return { body: actions, wrappers };
}

function definition(state: MatchState, id: string) {
  const effects = getCardForInstance(state, id).effects;
  const blocks = effects?.effects;
  if (
    !effects ||
    Object.keys(effects).some((key) => key !== "effects") ||
    !blocks?.length ||
    blocks.some((b) =>
      Object.keys(b).some((key) => !["trigger", "optional", "conditions", "actions"].includes(key)),
    )
  )
    return;
  const play = blocks.find((b) => b.trigger === "onPlay"),
    ko = blocks.find((b) => b.trigger === "onKo");
  if (
    blocks.length === 2 &&
    play &&
    !play.optional &&
    ko?.optional &&
    play.actions.length === 1 &&
    ko.actions.length === 1 &&
    play.actions[0]?.action === "ko" &&
    ko.actions[0]?.action === "play"
  )
    return { blocks, profile: "trash" as const, multi: false, wrappers: [] as string[] };
  const reaction = play ?? blocks.find((b) => b.trigger === "whenOpponentPlaysCharacter");
  if (!reaction || blocks.length > 2) return;
  const nested = unwrap(reaction.actions);
  if (!nested || (!reaction.optional && !nested.wrappers.length)) return;
  // A strict chain has no duplicate lexical sites. Sibling/branching wrappers
  // remain excluded until continuations carry stable action-origin paths.
  if (reaction.optional && nested.wrappers.length) return;
  if (
    !blocks.every((b) => {
      if (b !== reaction && (b.trigger !== "activateMain" || b.optional)) return false;
      const actions = b === reaction ? nested.body : b.actions;
      return (
        actions.length === 2 &&
        actions[0]?.action === "returnToHand" &&
        actions[1]?.action === "play" &&
        actions[1].source.zone === "hand"
      );
    })
  )
    return;
  return {
    blocks,
    profile: "handAndTrash" as const,
    multi: reaction.trigger === "whenOpponentPlaysCharacter",
    wrappers: nested.wrappers,
  };
}

/** Certified movement graph; all queued physical references must stay inside it. */
export function optionalMovingSources(
  state: MatchState,
  item: ResolutionItem,
): string[] | undefined {
  const remembered = movingSourceIds(
    state.optionalLoopPlan?.boundaries[0] ?? state.optionalLoopEvidence?.[0],
  );
  const sourceId = "sourceInstanceId" in item ? item.sourceInstanceId : remembered[0];
  if (!sourceId || !state.cards[sourceId]) return;
  const sourceDefinition = definition(state, sourceId);
  if (!sourceDefinition) return;
  const ids = remembered.length
    ? remembered
    : sourceDefinition.multi
      ? Object.values(state.cards)
          .filter((c) => c.zone === "character" && definition(state, c.instanceId)?.multi)
          .map((c) => c.instanceId)
          .sort()
      : [sourceId];
  if (
    !ids.includes(sourceId) ||
    (sourceDefinition.multi &&
      (ids.length !== 2 || state.cards[ids[0]!]!.controller === state.cards[ids[1]!]!.controller))
  )
    return;
  const definitions = new Map(ids.map((id) => [id, definition(state, id)]));
  if (
    ids.some((id) => {
      const source = state.cards[id],
        d = definitions.get(id);
      return (
        !source ||
        !d ||
        d.multi !== sourceDefinition.multi ||
        !Number.isSafeInteger(source.zoneChangeCounter) ||
        source.zoneChangeCounter > Number.MAX_SAFE_INTEGER - 2 ||
        !d.blocks.every((b) =>
          stableConditionsMatch(state, source.controller, id, b.conditions, "moving"),
        )
      );
    })
  )
    return;
  if (
    state.battle ||
    Object.keys(state.modifiers).length ||
    state.delayedEffectActions.length ||
    Object.values(state.cards).some(
      (c) => getCardForInstance(state, c.instanceId).effects?.replacementEffects?.length,
    ) ||
    state.promptQueue.some((p) => p.status === "pending")
  )
    return;
  const valid = (queued: ResolutionItem): boolean => {
    if (queued.kind === "effectComplete") return true;
    if (
      queued.kind !== "effectAction" &&
      queued.kind !== "effectBlock" &&
      queued.kind !== "effectMovementComplete"
    )
      return false;
    const d = definitions.get(queued.sourceInstanceId),
      source = state.cards[queued.sourceInstanceId];
    if (!d || !source || queued.controller !== source.controller) return false;
    const common = ["id", "kind", "sourceInstanceId", "controller"];
    if (queued.kind === "effectMovementComplete")
      return (
        d.profile === "handAndTrash" &&
        queued.movedIds.every((id) => id === queued.sourceInstanceId) &&
        Object.entries(queued).every(
          ([key, value]) => value === undefined || [...common, "movedIds"].includes(key),
        )
      );
    if (queued.kind === "effectAction")
      return (
        (queued.previousActionTargetIds ?? []).every(
          (id) => d.profile === "handAndTrash" && id === queued.sourceInstanceId,
        ) &&
        Object.entries(queued).every(
          ([key, value]) =>
            value === undefined ||
            [...common, "action", "previousActionTargetIds", "effectTriggerEvent"].includes(key),
        )
      );
    return (
      Object.entries(queued).every(
        ([key, value]) =>
          value === undefined ||
          [
            ...common,
            "trigger",
            "blockIndex",
            "sourceZoneChangeCounter",
            "readyEffectSelected",
            "triggerEvent",
            "confirmed",
          ].includes(key),
      ) &&
      (queued.sourceZoneChangeCounter === undefined ||
        queued.sourceZoneChangeCounter === source.zoneChangeCounter)
    );
  };
  if (
    ![
      item,
      ...state.resolutionQueue,
      ...(state.pendingAutoEffects ?? []),
      ...(state.readyEffectGroup?.effects ?? []),
    ].every(valid)
  )
    return;
  if (item.kind === "effectComplete" || item.kind === "effectMovementComplete")
    return remembered.length ? ids : undefined;
  const d = definitions.get(sourceId)!;
  if (item.kind === "effectAction") {
    if (item.action.action === "optional")
      return d.wrappers.includes(JSON.stringify(item.action)) &&
        unwrap([item.action])?.body.every((action) =>
          isForcedSelfMovement(state, item, action, d.profile, false),
        )
        ? ids
        : undefined;
    return isForcedSelfMovement(state, item, item.action, d.profile) ? ids : undefined;
  }
  if (item.kind !== "effectBlock") return;
  const block = d.blocks.filter((b: EffectBlock) => b.trigger === item.trigger)[item.blockIndex];
  return block &&
    unwrap(block.actions)?.body.every((action) =>
      isForcedSelfMovement(state, item, action, d.profile, false),
    )
    ? ids
    : undefined;
}

/** Compatibility for existing one-source proof consumers. */
export function optionalMovingSource(state: MatchState, item: ResolutionItem): string | undefined {
  const ids = optionalMovingSources(state, item);
  return ids?.length === 1 ? ids[0] : undefined;
}
