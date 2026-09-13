import type { FabAttackTarget } from "../../state.ts";
import type { FabEvaluatedObject, FabRulesView } from "../rules-view.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import { fabPlayerId } from "../../game/identity.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type {
  FabAttackTargetCandidate,
  FabAttackTargetQuote,
  FabAttackTargetRequest,
} from "./types.ts";

function collectBeAttackedPermissions(view: FabRulesView): Map<string, string[]> {
  const allowedByRule = new Map<string, string[]>();
  for (const rule of view.rules("be-attacked")) {
    if (rule.mode !== "allow" || rule.parameters.kind !== "can-be-attacked") continue;
    if (rule.scope.kind !== "objects") continue;
    for (const subject of rule.scope.subjects) {
      const key = `${subject.instanceId}#${subject.incarnation}`;
      const ids = allowedByRule.get(key) ?? [];
      ids.push(rule.effectId);
      allowedByRule.set(key, ids);
    }
  }
  return allowedByRule;
}

/**
 * "Opponents must choose this as the target of attacks if able."
 * Required subjects are only binding for an attacking opponent, and only
 * when that subject is already a legal candidate.
 */
function collectRequiredBeAttackedKeys(view: FabRulesView, actorId: string): Set<string> {
  const required = new Set<string>();
  for (const rule of view.rules("be-attacked")) {
    if (rule.mode !== "require") continue;
    if (rule.controllerId === actorId) continue;
    if (rule.scope.kind !== "objects") continue;
    for (const subject of rule.scope.subjects) {
      required.add(`${subject.instanceId}#${subject.incarnation}`);
    }
  }
  return required;
}

/**
 * Classify an arena object as a legal non-hero attack-target kind, or null when
 * it is not independently attackable. Used by {@link quoteFabAttackTargets}
 * (candidate enumeration). The caller still filters perched objects and opposing
 * control — this only encodes the spectra/ally/be-attacked classification.
 */
function classifyArenaAttackTarget(
  object: FabEvaluatedObject,
  ruleEffectIds: readonly string[],
): Exclude<FabAttackTarget["kind"], "hero"> | null {
  const spectra = object.current.keywords.some((keyword) => keyword.name === "spectra");
  const ally = object.current.typeBox.subtypes.includes("Ally");
  // CR 1.4.5a / 2.5.1a: a permanent with the life property is living and attackable.
  // Heroes are quoted separately; this path is arena permanents only.
  const living =
    object.current.numeric.life !== undefined && !object.current.typeBox.types.includes("Hero");
  if (!living && !spectra && ruleEffectIds.length === 0) return null;
  return ally ? "ally" : spectra ? "spectra" : "permanent";
}

/** Hero and object attack-target candidates from one evaluated rules view. */
export function quoteFabAttackTargets(
  state: FabRulesSnapshot,
  request: FabAttackTargetRequest,
  view: FabRulesView = buildFabRulesView(state),
): FabAttackTargetQuote {
  const attackRecord = state.objects[request.attackInstanceId];
  const attack = attackRecord
    ? view.object({ instanceId: attackRecord.instanceId, incarnation: attackRecord.incarnation })
    : null;
  if (!attack) {
    return {
      stateID: state.stateID,
      request,
      allowed: false,
      reasonCode: "attack_source_missing",
      reason: "The attack source is missing or not evaluable.",
      candidates: [],
    };
  }
  const opponents = state.playerIds.filter((playerId) => playerId !== request.actorId);
  const candidates: FabAttackTargetCandidate[] = opponents.map((playerId) => {
    const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
    const heroRecord = heroId ? state.objects[heroId] : undefined;
    const hero = heroRecord
      ? view.object({ instanceId: heroRecord.instanceId, incarnation: heroRecord.incarnation })
      : null;
    return {
      targetId: playerId,
      kind: "hero",
      target: { kind: "hero", playerId },
      defendingPlayerId: playerId,
      object: null,
      label: hero?.current.names.join(" // ") || playerId,
      effectIds: [],
    };
  });
  const allowedByRule = collectBeAttackedPermissions(view);
  for (const object of view.objects({ zones: ["arena"] })) {
    const defendingPlayerId = object.controllerId ?? object.ownerId;
    if (!opponents.some((playerId) => playerId === defendingPlayerId)) continue;
    if (object.current.keywords.some((keyword) => keyword.name === "perched")) continue;
    const key = `${object.ref.instanceId}#${object.ref.incarnation}`;
    const ruleEffectIds = allowedByRule.get(key) ?? [];
    const kind = classifyArenaAttackTarget(object, ruleEffectIds);
    if (kind === null) continue;
    candidates.push({
      targetId: object.ref.instanceId,
      kind,
      target: {
        kind,
        ref: object.ref,
        controllerId: fabPlayerId(defendingPlayerId),
      },
      defendingPlayerId,
      object: object.ref,
      label: object.current.names.join(" // ") || object.canonicalId,
      effectIds: [...object.appliedEffectIds, ...ruleEffectIds],
    });
  }
  const requiredKeys = collectRequiredBeAttackedKeys(view, request.actorId);
  const requiredCandidates =
    requiredKeys.size === 0
      ? candidates
      : candidates.filter((candidate) => {
          if (!candidate.object) return false;
          return requiredKeys.has(`${candidate.object.instanceId}#${candidate.object.incarnation}`);
        });
  // "if able": only constrain when at least one required subject is legal.
  const finalCandidates = requiredCandidates.length > 0 ? requiredCandidates : candidates;
  return finalCandidates.length > 0
    ? {
        stateID: state.stateID,
        request,
        allowed: true,
        reasonCode: null,
        reason: null,
        candidates: finalCandidates,
      }
    : {
        stateID: state.stateID,
        request,
        allowed: false,
        reasonCode: "no_attack_targets",
        reason: "No legal attack target is available.",
        candidates: [],
      };
}
