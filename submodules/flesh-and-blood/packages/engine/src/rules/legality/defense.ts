import type { FabZoneKind } from "../../state.ts";
import type { FabRulesView } from "../rules-view.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { fabPrimaryDefenders } from "../../game/combat.ts";
import { isHeroAttackTarget } from "../combat-target.ts";
import type {
  FabDefenseDenialReason,
  FabDefenseOrigin,
  FabDefenseQuote,
  FabDefenseQuoteBase,
  FabDefenseRequest,
} from "./types.ts";

const EQUIPMENT_DEFENSE_ZONES = ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const;

/** Deterministic defense legality quote over current evaluated properties. */
export function quoteFabDefense(
  state: FabRulesSnapshot,
  request: FabDefenseRequest,
  view: FabRulesView = buildFabRulesView(state),
): FabDefenseQuote {
  return quoteDefenseSelection(state, request, view, "complete");
}

/** Candidate eligibility excludes requirements that only a complete set can satisfy. */
export function isFabDefenseCandidate(
  state: FabRulesSnapshot,
  actorId: string,
  instanceId: string,
  view: FabRulesView,
): boolean {
  return quoteDefenseSelection(state, { actorId, instanceIds: [instanceId] }, view, "candidate")
    .allowed;
}

function quoteDefenseSelection(
  state: FabRulesSnapshot,
  request: FabDefenseRequest,
  view: FabRulesView,
  selection: "complete" | "candidate",
): FabDefenseQuote {
  const link = state.combat?.activeLink;
  const player = state.players[request.actorId];
  const attackRecord = link ? state.objects[link.activeAttack.sourceObjectId] : undefined;
  const attack = attackRecord
    ? view.object({ instanceId: attackRecord.instanceId, incarnation: attackRecord.incarnation })
    : null;
  const resolved = request.instanceIds.flatMap((instanceId) => {
    const record = state.objects[instanceId];
    if (!record || !player) return [];
    const object = view.object({ instanceId: record.instanceId, incarnation: record.incarnation });
    if (!object) return [];
    const origin = defenseOrigin(
      state.containers.zonesByPlayerId[request.actorId]!,
      object.current.keywords,
      instanceId,
    );
    return origin ? [{ object, origin }] : [];
  });
  const base: FabDefenseQuoteBase = {
    stateID: state.stateID,
    request,
    defenders: resolved.map(({ object, origin }) => ({ ref: object.ref, origin })),
    attack: attack?.ref ?? null,
    effectIds: attack?.appliedEffectIds ?? [],
  };
  const denied = (reasonCode: FabDefenseDenialReason, reason: string): FabDefenseQuote => ({
    ...base,
    allowed: false,
    reasonCode,
    reason,
  });
  if (
    !link ||
    state.combat?.step !== "defend" ||
    !state.combat.defenseDeclarationPending ||
    !player ||
    link.defendingPlayerId !== request.actorId
  )
    return denied("not_defend_step", "Defenders cannot be declared now.");
  if (new Set(request.instanceIds).size !== request.instanceIds.length)
    return denied("invalid_defenders", "Choose each defending card at most once.");
  if (!isHeroAttackTarget(state, link.attackTargetRef)) {
    const allProtect = request.instanceIds.every((instanceId) => {
      const record = state.objects[instanceId];
      if (!record) return false;
      return (
        view
          .object({ instanceId: record.instanceId, incarnation: record.incarnation })
          ?.current.keywords.some((keyword) => keyword.name === "protect") ?? false
      );
    });
    if (!allProtect)
      return denied(
        "ally_target_no_defend",
        "Defending cards need protect when an ally or permanent is attacked.",
      );
  }
  if (resolved.length !== request.instanceIds.length) {
    // CR 8.3.28 ambush: arsenal cards may defend only when they have ambush.
    for (const instanceId of request.instanceIds) {
      const inArsenal =
        state.containers.zonesByPlayerId[request.actorId]!.arsenal.includes(instanceId);
      const record = state.objects[instanceId];
      const object = record
        ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
        : null;
      const hasAmbush =
        object?.current.keywords.some((keyword) => keyword.name === "ambush") ?? false;
      if (inArsenal && !hasAmbush)
        return denied(
          "card_not_in_hand",
          "An arsenal card needs ambush to be declared as a defender.",
        );
    }
    return denied(
      "illegal_defense_origin",
      "A selected card is not in a zone from which it can defend.",
    );
  }
  for (const { object } of resolved) {
    if (object.current.typeBox.types.includes("Defense Reaction"))
      return denied(
        "defense_reaction_not_defend",
        "Defense reactions must be played during the reaction step, not declared as defenders.",
      );
    if (object.current.numeric.defense === undefined)
      return denied("no_defense", "A selected card has no defense property.");
  }
  // Defender-count caps — Dominate / Overpower keywords AND Confidence
  // maxDefenders continuous rules — are enforced uniformly in one counting
  // pass below, after the per-defender restrict/require pass.
  // Continuous defend restrictions (Benji: ≤2{p} AAC can't be defended from hand).
  // Continuous defend requirements (Face Adversity: may only defend if attack
  // controller drew this turn — mode "require" + subjectFilter on the attack).
  if (attack) {
    const attackCtx = {
      controllerId: link.attackingPlayerId,
      source: attack.ref,
      bindings: { objects: {}, numbers: {}, strings: {} },
    };
    for (const rule of view.rules("defend")) {
      if (rule.parameters.kind !== "rule-modification") continue;
      // Count-cap rules (maxDefenders) are not per-defender blocks — they are
      // enforced by the defender-count pass below. Skip them here so a null
      // per-defender filter does not over-broadly block all defense.
      if (rule.parameters.maxDefenders) continue;
      const subjectFilter = rule.parameters.subjectFilter;
      // Require + filter + no subjectFilter: "must defend with a matching
      // card if able" (T-Bone). Distinct from require + subjectFilter
      // ("this card may only defend when …" — Embrace Adversity).
      if (rule.mode === "require" && !subjectFilter && rule.filter) {
        const appliesToThisAttack =
          rule.scope.kind === "objects" && rule.scope.selection === "latched"
            ? rule.scope.subjects.some(
                (subject) =>
                  subject.instanceId === attack.ref.instanceId &&
                  subject.incarnation === attack.ref.incarnation,
              )
            : true;
        if (appliesToThisAttack && selection === "complete") {
          const requiredCount = rule.limit?.count ?? 1;
          const able = countLegalMatchingEquipmentDefenders(
            state,
            view,
            request.actorId,
            rule.filter,
            rule.controllerId,
          );
          if (able >= requiredCount) {
            const included = resolved.filter(({ object, origin }) =>
              defenderMatchesDefendFilter(
                object,
                origin,
                rule.filter,
                view,
                request.actorId,
                rule.controllerId,
              ),
            ).length;
            if (included < requiredCount) {
              return denied(
                "restricted_by_rule",
                "The defending hero must defend with a matching card they control if able.",
              );
            }
          }
        }
      }
      if (rule.mode === "restrict") {
        if (subjectFilter && !view.matchesFilter(attack, subjectFilter, attackCtx)) continue;
        // A rule latched onto a specific attack ("it can't be defended by…"
        // printed on that attack — Crane Dance combo, EVO061-063) governs
        // only that attack: once the latched attack resolves its subject refs
        // go stale/empty, and the rule must not fall through to game-level
        // (same guard the maxDefenders pass applies below).
        //
        // A rule latched onto a defender ("it can't defend this turn" —
        // Stasis Cell) governs that object as a defender on any attack.
        const appliesToThisAttack =
          rule.scope.kind === "objects" && rule.scope.selection === "latched"
            ? rule.scope.subjects.some(
                (subject) =>
                  subject.instanceId === attack.ref.instanceId &&
                  subject.incarnation === attack.ref.incarnation,
              )
            : true;
        for (const { object, origin } of resolved) {
          const defenderIsSubject =
            rule.scope.kind === "objects" &&
            rule.scope.selection === "latched" &&
            rule.scope.subjects.some((subject) => subject.instanceId === object.ref.instanceId);
          if (!appliesToThisAttack && !defenderIsSubject) continue;
          if (
            defenderIsSubject
              ? !rule.filter ||
                defenderMatchesDefendFilter(
                  object,
                  origin,
                  rule.filter,
                  view,
                  request.actorId,
                  rule.controllerId,
                )
              : defenderMatchesDefendFilter(
                  object,
                  origin,
                  rule.filter,
                  view,
                  request.actorId,
                  rule.controllerId,
                )
          ) {
            return denied(
              "restricted_by_rule",
              "A continuous effect prevents this card from defending that attack.",
            );
          }
        }
      } else if (rule.mode === "require") {
        // Defender matching filter may only defend when the attack matches subject.
        for (const { object, origin } of resolved) {
          if (
            !defenderMatchesDefendFilter(
              object,
              origin,
              rule.filter,
              view,
              request.actorId,
              rule.controllerId,
            )
          ) {
            continue;
          }
          if (subjectFilter && !view.matchesFilter(attack, subjectFilter, attackCtx)) {
            return denied(
              "restricted_by_rule",
              "This card may only defend when its printed condition is met.",
            );
          }
        }
      }
    }
    // Unified defender-count caps. Confidence (CR 8.6.35: "can't be defended
    // by more than N non-block cards") emits a continuous maxDefenders rule;
    // Dominate / Overpower are baked onto the attack as keywords. Synthesize
    // both into one cap list (Dominate → hand-origin, Overpower → Action, each
    // count 1; continuous rules carry their own count + filter) and enforce
    // them with a single existing+new counting pass. `defenderMatchesDefendFilter`
    // accepts a null filter (counts every defender), so a cap with no filter
    // bounds the total defender count.
    const attackKeywords = attack.current.keywords.map((keyword) => keyword.name);
    type DefenderCountCap = {
      readonly count: number;
      readonly filter: import("@tcg/flesh-and-blood-types").FabCardFilter | null;
      readonly reasonCode: FabDefenseDenialReason;
      readonly message: string;
      /** Seat in which dynamic counts inside `filter` resolve (the cap's
       * author: the attacking card's controller). */
      readonly controllerId: string;
    };
    const caps: DefenderCountCap[] = [];
    if (attackKeywords.includes("dominate")) {
      caps.push({
        count: 1,
        filter: { playedFromZones: ["hand"] },
        reasonCode: "dominate",
        message: "Dominate allows at most one defending card from hand.",
        controllerId: link.attackingPlayerId,
      });
    }
    if (attackKeywords.includes("overpower")) {
      caps.push({
        count: 1,
        filter: { typeBox: { types: ["Action"] } },
        reasonCode: "overpower",
        message: "Overpower allows at most one defending action card.",
        controllerId: link.attackingPlayerId,
      });
    }
    for (const rule of view.rules("defend")) {
      if (rule.parameters.kind !== "rule-modification") continue;
      const cap = rule.parameters.maxDefenders;
      if (!cap) continue;
      // A maxDefenders cap is either latched to a specific attack — an
      // appliesTo.next rule like Confidence (CR 8.6.35: "the next attack action
      // card you play this turn"), whose object scope holds that one attack's
      // identity — or explicit game scope.
      // For a latched cap, require the current attack to BE the latched subject:
      // once the latched attack resolves (its incarnation bumps on the way to
      // the graveyard) the evaluator omits the now-subjectless object rule, so
      // it cannot fall through onto a later attack. Only game scope applies to
      // every attack.
      const appliesToThisAttack =
        rule.scope.kind === "objects" && rule.scope.selection === "latched"
          ? rule.scope.subjects.some(
              (subject) =>
                subject.instanceId === attack.ref.instanceId &&
                subject.incarnation === attack.ref.incarnation,
            )
          : true;
      if (!appliesToThisAttack) continue;
      if (
        rule.parameters.subjectFilter &&
        !view.matchesFilter(attack, rule.parameters.subjectFilter, attackCtx)
      )
        continue;
      caps.push({
        count: cap.count,
        filter: cap.filter,
        reasonCode: "restricted_by_rule",
        message: `A continuous effect prevents defending with more than ${cap.count} matching card(s).`,
        controllerId: rule.controllerId,
      });
    }
    for (const cap of caps) {
      const countsTowardCap = (
        obj: import("../rules-view.ts").FabEvaluatedObject,
        origin: FabDefenseOrigin,
      ): boolean =>
        defenderMatchesDefendFilter(
          obj,
          origin,
          cap.filter,
          view,
          request.actorId,
          cap.controllerId,
        );
      const existing = fabPrimaryDefenders(link).filter((instanceId) => {
        const rec = state.objects[instanceId];
        if (!rec) return false;
        const obj = view.object({ instanceId: rec.instanceId, incarnation: rec.incarnation });
        if (!obj) return false;
        const origin = (link.defendingOrigins[instanceId]?.kind ?? "hand") as FabDefenseOrigin;
        return countsTowardCap(obj, origin);
      }).length;
      const adding = resolved.filter(({ object, origin }) =>
        countsTowardCap(object, origin),
      ).length;
      if (existing + adding > cap.count) return denied(cap.reasonCode, cap.message);
    }
  }
  return { ...base, allowed: true, reasonCode: null, reason: null };
}

/**
 * Whether a declared defender is blocked by a defend-restriction filter.
 * `playedFromZones` on defend filters means "defending from this zone" (hand /
 * arsenal / equipment), not "was played onto the stack from".
 */
function countLegalMatchingEquipmentDefenders(
  state: FabRulesSnapshot,
  view: FabRulesView,
  actorId: string,
  filter: import("@tcg/flesh-and-blood-types").FabCardFilter,
  /** Seat for dynamic counts inside `filter` — the rule's controller, i.e. the
   * attacking card's owner of the printed text (EVO059 "X is the number of
   * Evos you have equipped", CR 8.4.11), NOT the defending player. */
  seatControllerId: string = actorId,
): number {
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return 0;
  let count = 0;
  for (const origin of EQUIPMENT_DEFENSE_ZONES) {
    for (const instanceId of zones[origin]) {
      const record = state.objects[instanceId];
      if (!record) continue;
      const object = view.object({
        instanceId: record.instanceId,
        incarnation: record.incarnation,
      });
      if (!object || object.current.numeric.defense === undefined) continue;
      if (defenderMatchesDefendFilter(object, origin, filter, view, actorId, seatControllerId))
        count += 1;
    }
  }
  return count;
}

function defenderMatchesDefendFilter(
  defender: import("../rules-view.ts").FabEvaluatedObject,
  origin: FabDefenseOrigin,
  filter: import("@tcg/flesh-and-blood-types").FabCardFilter | null,
  view: FabRulesView,
  actorId: string,
  /** Seat resolving dynamic counts inside `filter`. Printed "you" on the
   * attacking card is its controller — e.g. Heavy Artillery (EVO061-063)
   * "cost less than X, where X is the number of Evos YOU have equipped"
   * counts the ATTACKER's Evos (CR 8.4.11), not the defender's reading the
   * restriction during the defend step (CR 7.6). */
  seatControllerId: string = actorId,
): boolean {
  if (!filter) return true;
  if (filter.playedFromZones && filter.playedFromZones.length > 0) {
    // Defend origin → catalog zone tokens used in printed filters.
    const originTokens: string[] =
      origin === "hand" ? ["hand"] : origin === "arsenal" ? ["arsenal"] : ["permanent", origin];
    const matchesOrigin = filter.playedFromZones.some((zone) => originTokens.includes(zone));
    if (!matchesOrigin) return false;
  }
  // Strip playedFromZones for the rest of the match — already validated via origin.
  const { playedFromZones: _zones, ...rest } = filter;
  if (Object.keys(rest).length === 0) return true;
  return view.matchesFilter(defender, rest, {
    controllerId: seatControllerId,
    source: defender.ref,
    bindings: { objects: {}, numbers: {}, strings: {} },
  });
}

function defenseOrigin(
  zones: Readonly<Record<FabZoneKind, readonly string[]>>,
  keywords: readonly { readonly name: string }[],
  instanceId: string,
): FabDefenseOrigin | null {
  if (zones.hand.includes(instanceId)) return "hand";
  if (zones.arsenal.includes(instanceId) && keywords.some((keyword) => keyword.name === "ambush"))
    return "arsenal";
  return EQUIPMENT_DEFENSE_ZONES.find((zone) => zones[zone].includes(instanceId)) ?? null;
}

/** Deterministic, read-only play legality and cost quote for one exact object incarnation. */
