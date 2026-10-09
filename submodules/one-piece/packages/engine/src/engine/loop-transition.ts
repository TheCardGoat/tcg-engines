import type { Action, Condition, EffectBlock } from "@tcg/op-types";
import { getCardForInstance } from "../shared.ts";
import { evaluateConditions } from "../effects/conditions.ts";
import { candidatePoolForTarget, candidatesForTarget } from "../effects/targeting.ts";
import type { MatchState, ResolutionItem } from "../types.ts";

export function isDeterministicStateAction(
  state: MatchState,
  item: ResolutionItem,
  action: Action,
  targetProfile: "singleton" | "forcedGroup" = "singleton",
): boolean {
  if (item.kind !== "effectAction" && item.kind !== "effectBlock") return false;
  if (action.action !== "rest" && action.action !== "setActive") return false;
  const target = action.target;
  if (
    !Object.keys(action).every((key) => key === "action" || key === "target") ||
    !Object.keys(target).every((key) => ["player", "self", "count", "zones"].includes(key)) ||
    !Object.keys(target.count).every((key) => key === "amount") ||
    (targetProfile === "singleton" && target.count.amount !== 1) ||
    target.zones.length !== 1 ||
    !["character", "leader"].includes(target.zones[0]!) ||
    (target.player !== "self" && target.player !== "opponent")
  )
    return false;
  const pool = candidatePoolForTarget(state, item.controller, item.sourceInstanceId, target);
  if (!pool.supported) return false;
  if (target.count.amount === 1 && pool.candidateIds.length === 1) return true;
  if (targetProfile !== "forcedGroup") return false;
  if (
    target.count.amount !== "all" &&
    (!Number.isSafeInteger(target.count.amount) || target.count.amount <= 0)
  )
    return false;
  // Use the owning target resolver: a numeric shortage, surplus candidates,
  // or any other choice must not be mistaken for a compulsory complete group.
  const forced = candidatesForTarget(state, item.controller, item.sourceInstanceId, target);
  if (
    !forced?.length ||
    forced.length !== pool.candidateIds.length ||
    forced.some((id, index) => id !== pool.candidateIds[index])
  )
    return false;
  // Rest replacements can perform nested unaudited actions. The new grouped
  // proof excludes these entirely; existing singleton certification is unchanged.
  return !Object.values(state.cards).some(
    (card) => getCardForInstance(state, card.instanceId).effects?.replacementEffects?.length,
  );
}

function stableConditionShape(condition: Condition, profile: "restReady" | "moving"): boolean {
  if (condition.condition === "turn") {
    return Object.keys(condition).every((key) => ["condition", "value"].includes(key));
  }
  // KO/replay can return attached DON to the cost area. Do not extend that
  // separate generation-normalizing proof with rest/ready invariants.
  if (profile === "moving") return false;
  let keys: string[];
  switch (condition.condition) {
    case "leaderName":
      keys = ["condition", "name", "match"];
      break;
    case "leaderTrait":
      keys = ["condition", "trait", "match"];
      break;
    case "handCount":
    case "lifeCount":
    case "activeDonCount":
      keys = ["condition", "player", "comparison", "value"];
      break;
    case "donFieldCount":
      keys = ["condition", "player", "comparison", "value", "state"];
      break;
    default:
      return false;
  }
  return Object.keys(condition).every((key) => keys.includes(key));
}

export function evaluateStableConditions(
  state: MatchState,
  controller: MatchState["activeSeat"],
  sourceInstanceId: string,
  conditions: EffectBlock["conditions"],
  profile: "restReady" | "moving",
): boolean | undefined {
  // Bare rest/ready actions cannot change these identities, areas or DON
  // counts. Exact fingerprints retain their values and all physical IDs.
  // Never certify a condition that reads omitted history or mutable card state.
  if (!(conditions ?? []).every((condition) => stableConditionShape(condition, profile)))
    return undefined;
  const result = evaluateConditions(state, controller, sourceInstanceId, conditions);
  return result.supported ? result.matches : undefined;
}

export function stableConditionsMatch(
  state: MatchState,
  controller: MatchState["activeSeat"],
  sourceInstanceId: string,
  conditions: EffectBlock["conditions"],
  profile: "restReady" | "moving",
): boolean {
  return (
    evaluateStableConditions(state, controller, sourceInstanceId, conditions, profile) === true
  );
}

// Bare self-movement is audited separately from rest/ready transitions.
// Block admission checks only the grammar: earlier sibling actions may move the
// source. Every dequeued action rechecks its actual zone and vacant destination.
// The optional moving proof retains the narrower trash-only profile.
export function isForcedSelfMovement(
  state: MatchState,
  item: ResolutionItem,
  action: Action,
  profile: "trash" | "handAndTrash" = "trash",
  checkCurrentZone = true,
): boolean {
  if (item.kind !== "effectAction" && item.kind !== "effectBlock") return false;
  const source = state.cards[item.sourceInstanceId];
  if (
    !source ||
    source.controller !== item.controller ||
    getCardForInstance(state, source.instanceId).cardType !== "character"
  )
    return false;
  if (action.action === "ko" || (profile === "handAndTrash" && action.action === "returnToHand")) {
    const target = action.target;
    return (
      (!checkCurrentZone || source.zone === "character") &&
      Object.keys(action).every((key) => ["action", "target"].includes(key)) &&
      Object.keys(target).every((key) => ["player", "self", "zones", "count"].includes(key)) &&
      target.player === "self" &&
      target.self === true &&
      target.zones.length === 1 &&
      target.zones[0] === "character" &&
      Object.keys(target.count).every((key) => key === "amount") &&
      target.count.amount === 1
    );
  }
  if (action.action !== "play") return false;
  return (
    (!checkCurrentZone || source.zone === action.source.zone) &&
    action.self === true &&
    Object.keys(action).every((key) => ["action", "source", "count", "self"].includes(key)) &&
    Object.keys(action.source).every((key) => ["player", "zone"].includes(key)) &&
    action.source.player === "self" &&
    (action.source.zone === "trash" ||
      (profile === "handAndTrash" && action.source.zone === "hand")) &&
    Object.keys(action.count).every((key) => key === "amount") &&
    action.count.amount === 1 &&
    (!checkCurrentZone ||
      state.players[item.controller].characterArea.some((slot) => slot === null))
  );
}

/** Narrow CR11 DON cycle grammar. No identity, choice, cost, condition or replacement semantics. */
export function isDeterministicDonAction(
  state: MatchState,
  item: ResolutionItem,
  action: Action,
  checkResources = true,
  allowOpponentReturn = false,
): boolean {
  if (item.kind !== "effectAction" && item.kind !== "effectBlock") return false;
  const player = state.players[item.controller];
  const positive = (value: unknown) =>
    typeof value === "number" && Number.isSafeInteger(value) && value > 0;
  if (action.action === "addDon") {
    return (
      Object.keys(action).every((key) => ["action", "player", "count", "state"].includes(key)) &&
      (action.player === undefined || action.player === "self") &&
      Object.keys(action.count).every((key) => key === "amount") &&
      positive(action.count.amount) &&
      (action.state === "active" || action.state === "rested")
    );
  }
  if (action.action === "giveDon") {
    const target = action.target;
    if (
      !Object.keys(action).every((key) =>
        ["action", "target", "count", "donState"].includes(key),
      ) ||
      !Object.keys(target).every((key) => ["player", "zones", "self", "count"].includes(key)) ||
      !Object.keys(target.count).every((key) => key === "amount") ||
      !Object.keys(action.count).every((key) => key === "amount") ||
      target.player !== "self" ||
      !target.self ||
      target.zones.length !== 1 ||
      target.zones[0] !== "leader" ||
      target.count.amount !== 1 ||
      !positive(action.count.amount) ||
      (action.donState !== "active" && action.donState !== "rested") ||
      item.sourceInstanceId !== player.leaderInstanceId
    )
      return false;
    const available = action.donState === "active" ? player.activeDon : player.restedDon;
    return (
      !checkResources ||
      available === 0 ||
      (typeof action.count.amount === "number" && available >= action.count.amount)
    );
  }
  if (
    action.action !== "returnDon" ||
    !Object.keys(action).every((key) => ["action", "player", "amount"].includes(key)) ||
    (action.player !== "self" && !(allowOpponentReturn && action.player === "opponent")) ||
    !positive(action.amount)
  )
    return false;
  const returning =
    action.player === "opponent"
      ? state.players[item.controller === "south" ? "north" : "south"]
      : player;
  const available =
    returning.activeDon +
    returning.restedDon +
    state.cards[returning.leaderInstanceId]!.attachedDon +
    returning.characterArea.reduce((sum, id) => sum + (id ? state.cards[id]!.attachedDon : 0), 0);
  // Only whole-pool/empty returns are certified, even when a scalar implementation
  // can auto-select equivalent DON!! from a strict subset.
  return !checkResources || available <= action.amount;
}
