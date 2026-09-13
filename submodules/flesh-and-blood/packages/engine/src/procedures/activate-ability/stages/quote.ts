import type { FabActivatedAbility, FabEffect } from "@tcg/flesh-and-blood-types";
import {
  continuousEffectInstanceIsActive,
  futureApplicabilityIncludesEvent,
} from "../../../rules/continuous/runtime.ts";
import { snapshotObject } from "../../../rules/snapshots.ts";
import {
  collectAutomaticTargets,
  collectDeclaredTargets,
} from "../../../kernel/trigger-declaration.ts";
import { declaredObjectTargetBounds } from "../../../kernel/declared-target-bounds.ts";
import { evaluateCanonicalCondition } from "../../../rules/condition-evaluator.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "../../../rules/state-rules-view.ts";
import type { FabRulesSnapshot } from "../../../kernel/transaction-kernel.ts";
import {
  expandCatalogZonesForScan,
  catalogZoneToEngine,
  engineZoneToCatalog,
  isArenaZone,
} from "../../../rules/zones.ts";
import { activationCosts, declaredActivationCost } from "../costs/parse.ts";
import {
  activationBanishRequirements,
  activationDiscardRequirements,
  activationDestroyRequirements,
  activationTapRequirements,
  activationUntapRequirements,
  activationChargeRequirements,
  activationRemoveCounterRequirements,
} from "../costs/requirements.ts";
import {
  sourceZone,
  activationPaymentCandidates,
  activationSelfMoveZones,
  actorMayActivateAbility,
  effectiveActivationLimit,
  activationLimitUsageKey,
  activationLimitUsageCount,
  asInstantActivationWaiver,
  FAB_EQUIP_DESTINATION_TARGET_KEY,
  isEquipmentSeatName,
  legalEquipDestinationSeats,
} from "../helpers.ts";
import type { FabActivationRequest, FabActivationQuote } from "../types.ts";
import {
  activationMatchesRestrictionFilter,
  restrictCapReached,
} from "../../../rules/legality/restrict-cap.ts";

function isAttackActivation(ability: FabActivatedAbility): boolean {
  return ability.abilityType === "attack" || ability.effect.type === "attack-with";
}

/** Type-box tokens are matched by {@link activationMatchesRestrictionFilter}.
 * Remaining filter fields (hasStatus owned-by-controller, …) use the object
 * matcher with the rule controller, same as quoteFabPlay. */
function activationRestrictionNonTypeFilterMatches(
  view: import("../../../rules/rules-view.ts").FabRulesView,
  object: NonNullable<ReturnType<import("../../../rules/rules-view.ts").FabRulesView["object"]>>,
  filter: import("@tcg/flesh-and-blood-types").FabCardFilter,
  controllerId: string,
  source: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
): boolean {
  const { typeBox: _typeBox, ...rest } = filter;
  if (Object.keys(rest).length === 0) return true;
  return view.matchesFilter(object, rest, {
    controllerId,
    source,
    subject: object.ref,
    bindings: { objects: {}, numbers: {}, strings: {} },
  });
}

/** Unique activated ability when the command omits `abilityId`. */
export function selectActivatedAbility(
  abilities: readonly FabActivatedAbility[],
  abilityId: string | null | undefined,
): FabActivatedAbility | null {
  if (abilityId) return abilities.find((candidate) => candidate.id === abilityId) ?? null;
  if (abilities.length === 1) return abilities[0] ?? null;
  const nonAttack = abilities.filter((ability) => !isAttackActivation(ability));
  if (nonAttack.length === 1) return nonAttack[0] ?? null;
  const attacks = abilities.filter(isAttackActivation);
  if (attacks.length === 1 && nonAttack.length === 0) return attacks[0] ?? null;
  // Unique Action among mixed Action + reaction/instant (Induction Chamber).
  const actions = abilities.filter((ability) => ability.abilityType === "action");
  const othersAreReactions = abilities.every(
    (ability) =>
      ability.abilityType === "action" ||
      ability.abilityType === "attack-reaction" ||
      ability.abilityType === "defense-reaction" ||
      ability.abilityType === "instant",
  );
  if (actions.length === 1 && othersAreReactions) return actions[0] ?? null;
  return null;
}

export function activationAlternativeArmPayable(
  current: FabRulesSnapshot,
  request: Pick<FabActivationRequest, "actorId" | "instanceId">,
  view: import("../../../rules/rules-view.ts").FabRulesView,
  object: { readonly ref: import("../../../rules/continuous/ir.ts").FabObjectRef } | null,
  arm: import("@tcg/flesh-and-blood-types").FabCost,
): boolean {
  const parsed = activationCosts(arm);
  const player = current.players[request.actorId];
  if (!parsed || !player || !object) return false;
  const maximumResources =
    player.resourcePoints +
    activationPaymentCandidates(current, request.actorId, [], "resources").reduce(
      (total, candidate) => total + candidate.value,
      0,
    );
  if (maximumResources < parsed.resources) return false;
  if (parsed.destroyTargets) {
    for (const requirement of activationDestroyRequirements(arm)) {
      if (
        view.targetCandidates(requirement.target, {
          controllerId: request.actorId,
          source: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        }).length < requirement.count
      ) {
        return false;
      }
    }
  }
  return true;
}

export function evaluateActivationCostReduction(
  view: import("../../../rules/rules-view.ts").FabRulesView,
  actorId: string,
  source: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
  ability: FabActivatedAbility,
): number {
  if (!ability.costReduction) return 0;
  return evaluateActivationAmountModifier(view, actorId, source, ability.costReduction.amount);
}

/** Surcharge for `costIncrease` (Grasp of the Arknight Runechant tax). */
export function evaluateActivationCostIncrease(
  view: import("../../../rules/rules-view.ts").FabRulesView,
  actorId: string,
  source: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
  ability: FabActivatedAbility,
): number {
  if (!ability.costIncrease) return 0;
  return evaluateActivationAmountModifier(view, actorId, source, ability.costIncrease.amount);
}

function evaluateActivationAmountModifier(
  view: import("../../../rules/rules-view.ts").FabRulesView,
  actorId: string,
  source: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
  amount: NonNullable<FabActivatedAbility["costReduction"]>["amount"],
): number {
  try {
    return Math.max(
      0,
      view.evaluateAmount(amount, {
        controllerId: actorId,
        source,
        bindings: { objects: {}, numbers: {}, strings: {} },
      }).value,
    );
  } catch {
    return 0;
  }
}

export function continuousPlayCostDelta(
  view: import("../../../rules/rules-view.ts").FabRulesView,
  objectRef: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
  state: FabRulesSnapshot | null = null,
  actorId: string | null = null,
): number {
  if (!objectRef) return 0;
  const obj = view.object(objectRef);
  if (!obj) return 0;
  const base = obj.baseNumeric.cost ?? 0;
  const current = obj.current.numeric.cost ?? 0;
  const latched = current - base;
  // appliesTo.next cost modifiers latch after announce/attack, but cost is
  // quoted before that. Prospectively apply the Nth matching attack's cost
  // delta (Kassai Cintari second sword, "next attack costs {r} less", …).
  if (!state || !actorId) return latched;
  return latched + prospectivePlayCostDelta(state, view, objectRef, actorId);
}

/**
 * Resource-cost delta contributed by first-class activation-cost atoms.
 * Card Cost is never consulted: play-cost modifiers and activation-cost
 * modifiers are separate executable concepts.
 */
export function activationCostDelta(
  state: FabRulesSnapshot,
  view: import("../../../rules/rules-view.ts").FabRulesView,
  objectRef: import("../../../rules/continuous/ir.ts").FabObjectRef,
  actorId: string,
): number {
  const object = view.object(objectRef);
  if (!object) return 0;
  let delta = 0;
  for (const instance of state.continuousEffectInstances) {
    if (!continuousEffectInstanceIsActive(state, instance)) continue;
    const bindings =
      instance.origin === "layer"
        ? instance.lockedBindings
        : { objects: {}, numbers: {}, strings: {} };
    for (const atom of instance.atoms) {
      if (atom.kind !== "activation-cost") continue;
      if (
        atom.condition &&
        !evaluateCanonicalCondition(
          state,
          atom.condition,
          {
            controllerId: instance.controllerId,
            source: instance.source,
            bindings,
          },
          null,
        )
      ) {
        continue;
      }

      const future = instance.futureApplicability;
      let applies = false;
      if (future) {
        applies = future.latchedSubjects.some(
          (ref) =>
            ref.instanceId === objectRef.instanceId && ref.incarnation === objectRef.incarnation,
        );
        if (
          !applies &&
          future.remaining > 0 &&
          futureApplicabilityIncludesEvent(future.events, "activate")
        ) {
          const controllerCanObserve = instance.controllerId === actorId || future.observesOpponent;
          const matches =
            controllerCanObserve &&
            view.matchesFilter(object, future.filter, {
              controllerId: instance.controllerId,
              source: instance.source.ref,
              bindings,
            });
          applies = matches && future.observedSubjects.length + 1 >= future.ordinal;
        }
      } else {
        applies =
          instance.initialSubjects.some(
            (ref) =>
              ref.instanceId === objectRef.instanceId && ref.incarnation === objectRef.incarnation,
          ) ||
          view
            .targetCandidates(atom.target, {
              controllerId: instance.controllerId,
              source: instance.source.ref,
              bindings,
            })
            .some(
              (candidate) =>
                candidate.ref.instanceId === objectRef.instanceId &&
                candidate.ref.incarnation === objectRef.incarnation,
            );
      }
      if (!applies) continue;
      let amount: number;
      try {
        amount = view.evaluateAmount(atom.amount, {
          controllerId: instance.controllerId,
          source: instance.source.ref,
          subject: objectRef,
          bindings,
        }).value;
      } catch {
        continue;
      }
      if (!Number.isFinite(amount)) continue;
      delta += atom.operation === "subtract" ? -amount : amount;
    }
  }
  return delta;
}

/**
 * Quote-time cost delta for unlatched future-applicability cost atoms that
 * would latch if this object were the next qualifying subject.
 */
export function prospectivePlayCostDelta(
  state: FabRulesSnapshot,
  view: import("../../../rules/rules-view.ts").FabRulesView,
  objectRef: import("../../../rules/continuous/ir.ts").FabObjectRef,
  actorId: string,
): number {
  const object = view.object(objectRef);
  if (!object) return 0;
  let delta = 0;
  for (const instance of state.continuousEffectInstances) {
    if (!continuousEffectInstanceIsActive(state, instance)) continue;
    const future = instance.futureApplicability;
    if (!future || future.remaining <= 0) continue;
    if (!futureApplicabilityIncludesEvent(future.events, "play")) continue;
    // Self cost mods: controller quotes their own objects.
    // Opponent tax (Heart of Ice hasStatus "another"): controller ≠ actor, but
    // the filter still matches the actor's objects — do not early-skip.
    if (instance.controllerId !== actorId) {
      const filter = future.filter as {
        readonly hasStatus?: string;
        readonly and?: readonly { readonly hasStatus?: string }[];
        readonly or?: readonly { readonly hasStatus?: string }[];
      } | null;
      const taxesOpponent =
        filter?.hasStatus === "another" ||
        filter?.hasStatus === "opponent-controlled" ||
        filter?.and?.some(
          (c) => c.hasStatus === "another" || c.hasStatus === "opponent-controlled",
        ) ||
        filter?.or?.some((c) => c.hasStatus === "another" || c.hasStatus === "opponent-controlled");
      if (!future.observesOpponent && !taxesOpponent) continue;
    }
    // Already latched onto this subject — continuous view already includes it.
    if (
      future.latchedSubjects.some(
        (ref) =>
          ref.instanceId === objectRef.instanceId && ref.incarnation === objectRef.incarnation,
      )
    ) {
      continue;
    }
    const matches = view.matchesFilter(object, future.filter, {
      controllerId: instance.controllerId,
      source: instance.source.ref,
      bindings:
        instance.origin === "layer"
          ? instance.lockedBindings
          : { objects: {}, numbers: {}, strings: {} },
    });
    if (!matches) continue;
    const prospectiveOrdinal = future.observedSubjects.length + 1;
    if (prospectiveOrdinal < future.ordinal) continue;
    for (const atom of instance.atoms) {
      if (atom.kind !== "numeric") continue;
      if (atom.property !== "cost") continue;
      // Static continuous cost atoms often carry ability-level conditions
      // (Empyrean Rapture Herald-soul gate). Without this check, prospective
      // quote would discount even when the printed condition is unmet.
      if (
        atom.condition &&
        !evaluateCanonicalCondition(
          state,
          atom.condition,
          {
            controllerId: instance.controllerId,
            source: instance.source,
            bindings:
              instance.origin === "layer"
                ? instance.lockedBindings
                : { objects: {}, numbers: {}, strings: {} },
          },
          null,
        )
      ) {
        continue;
      }
      const amount =
        typeof atom.amount === "number"
          ? atom.amount
          : (() => {
              try {
                return view.evaluateAmount(atom.amount, {
                  controllerId: actorId,
                  source: instance.source.ref,
                  subject: objectRef,
                  bindings:
                    instance.origin === "layer"
                      ? instance.lockedBindings
                      : { objects: {}, numbers: {}, strings: {} },
                }).value;
              } catch {
                return null;
              }
            })();
      if (typeof amount !== "number" || !Number.isFinite(amount)) continue;
      if (atom.operation === "subtract") delta -= amount;
      else if (atom.operation === "add") delta += amount;
    }
  }
  return delta;
}

export function quoteFabActivation(
  current: FabRulesSnapshot,
  request: FabActivationRequest,
  view: import("../../../rules/rules-view.ts").FabRulesView = buildFabRulesView(current),
): FabActivationQuote {
  const player = current.players[request.actorId];
  const actorHeroId = player?.heroCardId ?? null;
  const zone = sourceZone(current, request.actorId, request.instanceId);
  const record = current.objects[request.instanceId];
  const object = record
    ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
    : null;
  const abilities = object
    ? view
        .functionalAbilities(object.ref)
        .filter((candidate): candidate is FabActivatedAbility => candidate.kind === "activated")
    : [];
  const ability = applyActivationTargetScope(
    current,
    view,
    object?.ref ?? null,
    request.actorId,
    selectActivatedAbility(abilities, request.abilityId),
  );
  const activationRules = object
    ? view.rules("activate").filter((rule) => {
        const filterMatches =
          rule.filter === null ||
          (ability !== null &&
            activationMatchesRestrictionFilter(
              {
                abilityType: ability.abilityType,
                types: object.current.typeBox.types,
                subtypes: object.current.typeBox.subtypes,
                supertypes: object.current.typeBox.supertypes,
              },
              rule.filter,
            ) &&
            activationRestrictionNonTypeFilterMatches(
              view,
              object,
              rule.filter,
              rule.controllerId,
              current.continuousEffectInstances.find((entry) => entry.effectId === rule.effectId)
                ?.source.ref ?? null,
            ));
        if (!filterMatches) return false;
        // Game-scope restrict/allow (Bait "cards you own") applies to every
        // matching activation, same as quoteFabPlay.
        if (rule.scope.kind === "game") return true;
        if (
          rule.scope.kind === "objects" &&
          rule.scope.subjects.some(
            (subject) =>
              subject.instanceId === object.ref.instanceId &&
              subject.incarnation === object.ref.incarnation,
          )
        ) {
          return true;
        }
        // A rule written as "target hero can't activate" latches the hero
        // object, while activation legality quotes the ability's source.
        // Bridge the actor to their hero just as play legality does for
        // "target hero can't play" rules; otherwise the restriction can
        // never match equipment, weapons, allies, or hero abilities.
        return (
          actorHeroId !== null &&
          rule.scope.kind === "objects" &&
          rule.scope.subjects.some((subject) => subject.instanceId === actorHeroId)
        );
      })
    : [];
  const selectedCost = ability
    ? declaredActivationCost(ability.cost, request.alternativeCostIndex, (arm) =>
        activationAlternativeArmPayable(current, request, view, object, arm),
      )
    : null;
  const costs = selectedCost ? activationCosts(selectedCost) : null;
  // Apply dynamic cost reduction (e.g. Fai's chain-link discount).
  if (costs && ability?.costReduction) {
    costs.resources = Math.max(
      0,
      costs.resources -
        evaluateActivationCostReduction(view, request.actorId, object?.ref ?? null, ability),
    );
  }
  // Apply dynamic cost increase (e.g. Grasp of the Arknight Runechant tax).
  if (costs && ability?.costIncrease) {
    costs.resources = Math.max(
      0,
      costs.resources +
        evaluateActivationCostIncrease(view, request.actorId, object?.ref ?? null, ability),
    );
  }
  // Apply explicitly authored activation-cost modifiers. Ordinary numeric
  // Cost modifications affect play quotes only.
  if (costs && object) {
    costs.resources = Math.max(
      0,
      costs.resources + activationCostDelta(current, view, object.ref, request.actorId),
    );
  }
  const isAttack = ability
    ? ability.abilityType === "attack" || ability.effect.type === "attack-with"
    : false;
  // CR 8.1.1d: an ability activated as though it were an instant "is still
  // considered an action, but it can be played/activated any time the player
  // has priority and does not cost an action point" — Snap Shot (ELE041-043,
  // fused) grants exactly that for bows its controller holds this turn.
  const instantWaiver = ability ? asInstantActivationWaiver(view, request.actorId, object) : false;
  const actionPointCost = ability
    ? ((ability.abilityType === "action" || isAttack) && !instantWaiver ? 1 : 0) +
      (costs?.actionPoints ?? 0)
    : null;
  const attackTargets =
    isAttack && object
      ? view.quoteAttackTargets({
          actorId: request.actorId,
          attackInstanceId: request.instanceId,
        }).candidates
      : [];
  const namedAttackTargetId = isEquipmentSeatName(request.attackTargetId)
    ? null
    : request.attackTargetId;
  const attackTargetCandidate = isAttack
    ? namedAttackTargetId
      ? attackTargets.find((candidate) => candidate.targetId === namedAttackTargetId)
      : attackTargets.find((candidate) => candidate.kind === "hero")
    : undefined;
  const equipDestinationRequired = Boolean(
    ability && activationNeedsEquipDestination(ability, object?.current.keywords ?? []),
  );
  const base = {
    stateID: current.stateID,
    request,
    ability,
    source: object?.ref ?? null,
    sourceZone: zone,
    resourceCost: costs?.resources ?? null,
    chiCost: costs?.chi ?? null,
    lifeCost: costs?.life ?? null,
    actionPointCost,
    requiredDeclarations: ability
      ? [
          ...(collectDeclaredTargets(ability.effect, "activation").length > 0 ? ["target"] : []),
          ...(equipDestinationRequired ? [FAB_EQUIP_DESTINATION_TARGET_KEY] : []),
          ...(costs?.turnFaceUpTargets ||
          costs?.turnFaceDownTargets ||
          costs?.discardTargets ||
          costs?.banishTargets ||
          costs?.destroyTargets ||
          costs?.tapTargets ||
          costs?.untapTargets ||
          costs?.chargeTargets ||
          costs?.moveToDeckTargets ||
          costs?.removeCounterTargets
            ? ["cost-target"]
            : []),
        ]
      : [],
    effectIds: [
      ...(object?.appliedEffectIds ?? []),
      ...activationRules.map((rule) => rule.effectId),
    ],
    attackTarget: attackTargetCandidate?.target ?? null,
  } satisfies Omit<FabActivationQuote, "handled" | "allowed" | "reasonCode" | "reason">;
  const denied = (handled: boolean, reasonCode: string, reason: string): FabActivationQuote => ({
    ...base,
    handled,
    allowed: false,
    reasonCode,
    reason,
  });
  if (current.rulesProcess || current.decision)
    return denied(true, "rules_process_pending", "Finish the current rules process first.");
  if (!player || current.priority?.holderPlayerId !== request.actorId)
    return denied(true, "not_priority_player", "Only the player with priority may activate.");
  if (!zone || !object)
    return denied(
      true,
      "invalid_activation_source",
      "The activation source is not in a legal zone.",
    );
  if (!ability)
    return denied(true, "no_activated_ability", "This object has no activated ability.");
  if (ability.functionalZones && ability.functionalZones.length > 0) {
    const catalogZone = engineZoneToCatalog(zone);
    if (!ability.functionalZones.includes(catalogZone)) {
      return denied(
        true,
        "invalid_activation_source",
        "This ability can only be activated from its functional zone.",
      );
    }
  } else if (!isArenaZone(zone) && !(zone === "hand" && costs?.discardSelf)) {
    // CR 1.7.4 / 1.7.4b: ordinary abilities function in the arena.
    // Off-arena activation requires an authored zone permission or a cost
    // that can only be paid there (discarding the source from hand).
    return denied(
      true,
      "invalid_activation_source",
      "This ability is not functional in the source's current zone.",
    );
  }
  if (!selectedCost)
    return denied(
      true,
      "alternative_cost_choice_required",
      "Choose one of this activation's alternative costs.",
    );
  const activationRestriction = activationRules.find(
    (rule) => rule.mode === "restrict" && restrictCapReached(current, request.actorId, rule),
  );
  if (activationRestriction)
    return denied(
      true,
      "restricted_by_rule",
      activationRestriction.parameters.kind === "freeze"
        ? "That object is frozen and cannot be activated."
        : "A rules effect restricts this object from being activated.",
    );
  // Continuous attack restrictions (HNT Kabuto: "opponents can't attack with
  // weapons"). action:"attack" binds opponents of the continuous effect's
  // controller; filter matches the attack source (Weapon type-line).
  if (ability?.abilityType === "attack" && object) {
    const attackRestriction = view.rules("attack").find((rule) => {
      if (rule.mode !== "restrict") return false;
      // "Opponents can't…" — the effect controller is not restricted.
      if (rule.controllerId === request.actorId) return false;
      if (!rule.filter) return true;
      return view.matchesFilter(object, rule.filter, {
        controllerId: rule.controllerId,
        source: object.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
    });
    if (attackRestriction)
      return denied(
        true,
        "restricted_by_rule",
        "A rules effect restricts attacking with this object.",
      );
  }
  if (!costs)
    return denied(false, "unsupported_activation_cost", "The activation cost is not supported.");
  if (!actorMayActivateAbility(ability, request.actorId, object.controllerId))
    return denied(true, "not_controller", "Only the controller may activate this ability.");
  const selfMoveZones = activationSelfMoveZones(ability);
  if (costs.destroySelf && !selfMoveZones.includes(zone))
    return denied(
      false,
      "unsupported_activation",
      "The source cannot pay destroy-self from this zone.",
    );
  if (costs.banishSelf && !selfMoveZones.includes(zone))
    return denied(
      false,
      "unsupported_activation",
      "The source cannot pay banish-self from this zone.",
    );
  if (costs.tapSelf && record?.markers.some((marker) => marker.kind === "tapped"))
    return denied(true, "already_tapped", "The activation source is already tapped.");
  const heroId = player.heroCardId;
  if (
    costs.tapHero &&
    (!heroId || current.objects[heroId]?.markers.some((marker) => marker.kind === "tapped"))
  )
    return denied(
      true,
      heroId ? "already_tapped" : "missing_hero",
      heroId ? "The hero is already tapped." : "The activation requires a hero.",
    );
  if (costs.discardSelf && zone !== "hand")
    return denied(false, "unsupported_activation", "Discard-self is not available from this zone.");
  if (costs.selfMoveToDeck && (!record || zone === "deck" || !current.players[record.ownerId]))
    return denied(
      true,
      "unpayable_self_move_to_deck",
      "The activation source cannot be moved into its owner's deck from this zone.",
    );
  if (costs.turnFaceUpSelf && !record?.markers.some((marker) => marker.kind === "face-down"))
    return denied(true, "already_face_up", "The activation source is already face up.");
  for (const counterCost of costs.counterCosts) {
    if (
      counterCost.operation === "remove" &&
      (record?.counters.find(
        (counter) => counter.kind === "named" && counter.name === counterCost.counter,
      )?.count ?? 0) < counterCost.amount
    )
      return denied(
        true,
        "insufficient_counters",
        "The activation source lacks the required counters.",
      );
  }
  if (costs.xCounterCost?.operation === "remove") {
    const available =
      record?.counters.find(
        (counter) => counter.kind === "named" && counter.name === costs.xCounterCost!.counter,
      )?.count ?? 0;
    if (available < 1)
      return denied(
        true,
        "insufficient_counters",
        "The activation source lacks counters for a variable X cost.",
      );
  }
  if (
    (ability.abilityType === "action" || isAttack) &&
    // CR 8.1.1d as-though-instant waiver (Snap Shot ELE041-043, fused): while
    // an allow/activate rule carrying the activate-additional-as-instant
    // marker is live for this object, its action/attack abilities may be
    // activated any time the player has priority — stack open, combat steps,
    // off-turn.
    !instantWaiver &&
    (current.phase !== "action" ||
      current.activePlayerId !== request.actorId ||
      current.rulesStack.length > 0 ||
      // CR 7.0.1a / 7.6.3a: Resolution reopens priority for attacks and
      // attack-layers only. A non-attack action ability (for example Savage
      // Sash) remains illegal until the combat chain closes.
      (current.combat?.open && (current.combat.step !== "resolution" || !isAttack)))
  )
    return denied(true, "illegal_activation_timing", "The action ability is not legal now.");
  if (
    ability.abilityType === "attack-reaction" &&
    (current.phase !== "action" ||
      current.combat?.step !== "reaction" ||
      current.combat.activeLink?.attackingPlayerId !== request.actorId)
  )
    return denied(
      true,
      "illegal_activation_timing",
      "The attack-reaction ability is not legal now.",
    );
  if (
    ability.abilityType === "defense-reaction" &&
    (current.phase !== "action" ||
      current.combat?.step !== "reaction" ||
      current.combat.activeLink?.defendingPlayerId !== request.actorId)
  )
    return denied(
      true,
      "illegal_activation_timing",
      "The defense-reaction ability is not legal now.",
    );
  if (player.actionPoints < (actionPointCost ?? 0))
    return denied(
      true,
      "insufficient_action_points",
      "The activation action-point cost cannot be paid.",
    );
  if (player.life <= costs.life)
    return denied(
      true,
      "insufficient_activation_assets",
      "The activation asset cost cannot be paid.",
    );
  const maximumResources =
    player.resourcePoints +
    activationPaymentCandidates(
      current,
      request.actorId,
      costs.selfMoveToDeck || costs.discardSelf ? [request.instanceId] : [],
      "resources",
    ).reduce((total, candidate) => total + candidate.value, 0);
  const maximumChi =
    player.chiPoints +
    activationPaymentCandidates(
      current,
      request.actorId,
      costs.selfMoveToDeck || costs.discardSelf ? [request.instanceId] : [],
      "chi",
    ).reduce((total, candidate) => total + candidate.value, 0);
  if (maximumResources < costs.resources || maximumChi < costs.chi)
    return denied(true, "insufficient_activation_assets", "The activation payment cannot be paid.");
  const source = snapshotObject(current, request.instanceId, request.actorId, zone);
  if (
    ability.condition &&
    !evaluateCanonicalCondition(
      current,
      ability.condition,
      { controllerId: request.actorId, source },
      null,
    )
  )
    return denied(
      true,
      "activation_condition_failed",
      "The activation condition is not satisfied.",
    );
  const effectiveLimit = effectiveActivationLimit({
    state: current,
    actorId: request.actorId,
    instanceId: request.instanceId,
    incarnation: record.incarnation,
    ability,
  });
  if (effectiveLimit !== null) {
    const key = activationLimitUsageKey({
      state: current,
      actorId: request.actorId,
      instanceId: request.instanceId,
      incarnation: record.incarnation,
      ability,
    });
    if (key === null) throw new Error("FAB effective activation limit requires a usage key.");
    if (
      activationLimitUsageCount({
        state: current,
        actorId: request.actorId,
        instanceId: request.instanceId,
        incarnation: record.incarnation,
        ability,
      }) >= effectiveLimit
    )
      return denied(true, "activation_limit", "The activated ability limit has been reached.");
  }
  if (isAttack && !attackTargetCandidate)
    return denied(true, "illegal_target", "The attack ability requires a legal attack target.");
  // Quote-time availability for required on-stack effect targets (New Moon
  // face-down equipment, destroy-target, …). Mirrors declaration-stage
  // `required_targets_unavailable` so illegal activations do not appear legal.
  if (ability && !costs?.xResourceCost) {
    const view = buildFabRulesView(current);
    for (const target of collectAutomaticTargets(ability.effect)) {
      if (
        view.targetCandidates(target, {
          controllerId: request.actorId,
          source: source.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        }).length === 0
      ) {
        return denied(
          true,
          "required_targets_unavailable",
          "Required activation targets are unavailable.",
        );
      }
    }
    for (const requirement of collectDeclaredTargets(ability.effect, "effect-0")) {
      if (requirement.target.selector === "any-hero") continue;
      if (requirement.target.selector !== "object") continue;
      const candidates = view.targetCandidates(requirement.target, {
        controllerId: request.actorId,
        source: source.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
      const bounds = declaredObjectTargetBounds(
        requirement.target,
        (amount) => (typeof amount === "number" ? amount : null),
        requirement.optionalEffectPath !== undefined,
        candidates.length,
      );
      if (bounds === null) continue;
      const { min } = bounds;
      if (min <= 0) continue;
      if (candidates.length < min) {
        return denied(
          true,
          "required_targets_unavailable",
          "Required activation targets are unavailable.",
        );
      }
    }
  }
  // Quote-time destroy-cost targets (Puffin: destroy a Gold you control, …).
  if (costs.destroyTargets && ability) {
    for (const requirement of activationDestroyRequirements(selectedCost)) {
      const candidates = buildFabRulesView(current).targetCandidates(requirement.target, {
        controllerId: request.actorId,
        source: source.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
      if (candidates.length < requirement.count) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation destroy cost is unavailable.",
        );
      }
    }
  }
  // Quote-time tap-cost targets (Rust Belt: {t} a cog you control).
  if (costs.tapTargets && ability) {
    for (const requirement of activationTapRequirements(selectedCost)) {
      const candidates = buildFabRulesView(current)
        .targetCandidates(requirement.target, {
          controllerId: request.actorId,
          source: source.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })
        .filter((object) => {
          const live = current.objects[object.ref.instanceId];
          return live && !live.markers.some((m) => m.kind === "tapped");
        });
      if (candidates.length < 1) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation tap cost is unavailable.",
        );
      }
    }
  }
  if (costs.untapTargets && ability) {
    for (const requirement of activationUntapRequirements(selectedCost)) {
      const candidates = buildFabRulesView(current)
        .targetCandidates(requirement.target, {
          controllerId: request.actorId,
          source: source.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })
        .filter((object) => {
          const live = current.objects[object.ref.instanceId];
          return live && live.markers.some((m) => m.kind === "tapped");
        });
      if (candidates.length < 1) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation untap cost is unavailable.",
        );
      }
    }
  }
  // Quote-time remove-counter costs from filtered permanents (Pleiades: remove a
  // suspense counter from an aura you control).
  if (costs.removeCounterTargets && ability) {
    for (const requirement of activationRemoveCounterRequirements(selectedCost)) {
      const candidates = buildFabRulesView(current).targetCandidates(requirement.target, {
        controllerId: request.actorId,
        source: source.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
      if (candidates.length < 1) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation counter cost is unavailable.",
        );
      }
    }
  }
  // Quote-time availability for required banish costs (hand/GY/arena/soul). Without
  // at least one candidate the activation must not appear legal — mirrors the
  // declaration-stage `required_banish_unavailable` gate.
  if (costs.banishTargets && ability) {
    // Quote-time: enough filtered candidates per banish component (Kassai 2 red +
    // 2 yellow). Overlapping pools can still fail at declaration if the same
    // card is needed twice — declaration excludes already-chosen ids.
    for (const requirement of activationBanishRequirements(selectedCost)) {
      let candidates = 0;
      for (const catalogZone of expandCatalogZonesForScan(requirement.target.zones)) {
        // CR 3.0.14: hosted sub-cards seat in subcardsByHostId keyed to the
        // activated source — the same candidate source as declaration.
        if (catalogZone === "under") {
          const hosted = current.containers.subcardsByHostId[request.instanceId] ?? [];
          for (const instanceId of hosted) {
            const snapshot = snapshotObject(current, instanceId, request.actorId, "under");
            if (
              requirement.target.filter &&
              !matchesFabSnapshotFilter(
                current,
                snapshot,
                requirement.target.filter,
                undefined,
                request.actorId,
              )
            ) {
              continue;
            }
            candidates += 1;
          }
          continue;
        }
        // weapon expands to both seats; permanent expands via expandCatalogZonesForScan.
        const engineZones =
          catalogZone === "weapon"
            ? (["weapon1", "weapon2"] as const)
            : (() => {
                const single = catalogZoneToEngine(catalogZone);
                return single ? ([single] as const) : null;
              })();
        if (!engineZones) continue;
        for (const engineZone of engineZones) {
          for (const instanceId of current.containers.zonesByPlayerId[request.actorId]![
            engineZone
          ]) {
            const snapshot = snapshotObject(current, instanceId, request.actorId, engineZone);
            if (
              requirement.target.filter &&
              !matchesFabSnapshotFilter(
                current,
                snapshot,
                requirement.target.filter,
                undefined,
                request.actorId,
              )
            ) {
              continue;
            }
            candidates += 1;
          }
        }
      }
      if (candidates < requirement.count)
        return denied(
          true,
          "required_banish_unavailable",
          "Required activation banish is unavailable.",
        );
    }
  }
  if (costs.chargeTargets && ability) {
    for (const requirement of activationChargeRequirements(selectedCost)) {
      const candidates = view
        .targetCandidates(requirement.target, {
          controllerId: request.actorId,
          source: object?.ref ?? null,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })
        .filter((candidate) => candidate.ref.instanceId !== request.instanceId);
      if (candidates.length < requirement.count) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation charge is unavailable.",
        );
      }
    }
  }
  if (costs.discardTargets && ability) {
    for (const requirement of activationDiscardRequirements(selectedCost)) {
      const candidates = view.targetCandidates(requirement.target, {
        controllerId: request.actorId,
        source: object?.ref ?? null,
        bindings: { objects: {}, numbers: {}, strings: {} },
      });
      if (candidates.length < requirement.min) {
        return denied(
          true,
          "required_cost_targets_unavailable",
          "Required activation discard is unavailable.",
        );
      }
    }
  }
  if (equipDestinationRequired) {
    const seats = legalEquipDestinationSeats(current, request.actorId, request.instanceId);
    if (seats.length === 0) {
      return denied(
        true,
        "required_targets_unavailable",
        "No empty equipment zone is available to equip to.",
      );
    }
    const declaredSeat =
      request.equipToZone ??
      (isEquipmentSeatName(request.attackTargetId) ? request.attackTargetId : null);
    if (declaredSeat && !seats.includes(declaredSeat)) {
      return denied(
        true,
        "illegal_target",
        "That equipment zone is not a legal Equip destination.",
      );
    }
  }
  return { ...base, handled: true, allowed: true, reasonCode: null, reason: null };
}

/** CR 8.5.41 / 8.3.30: modular Equip without a named zone must declare a seat. */
export function activationNeedsEquipDestination(
  ability: FabActivatedAbility,
  keywords: readonly { readonly name: string }[],
): boolean {
  const equip = findEquipEffect(ability.effect);
  if (!equip || equip.zone) return false;
  return keywords.some((keyword) => keyword.name === "modular");
}

function findEquipEffect(effect: FabEffect): Extract<FabEffect, { type: "equip" }> | null {
  if (effect.type === "equip") return effect;
  if (effect.type === "sequence") {
    for (const step of effect.steps) {
      const nested = findEquipEffect(step);
      if (nested) return nested;
    }
  }
  return null;
}

/** Freeze a next-activation targeting permission before costs destroy its source. */
export function applyActivationTargetScope(
  state: FabRulesSnapshot,
  view: import("../../../rules/rules-view.ts").FabRulesView,
  ref: import("../../../rules/continuous/ir.ts").FabObjectRef | null,
  actorId: string,
  ability: FabActivatedAbility | null,
): FabActivatedAbility | null {
  if (
    !ability ||
    !ref ||
    ability.effect.type !== "play-card" ||
    ability.effect.source?.selector !== "object"
  )
    return ability;
  const object = view.object(ref);
  if (!object) return ability;
  for (const instance of state.continuousEffectInstances) {
    if (!continuousEffectInstanceIsActive(state, instance) || instance.controllerId !== actorId)
      continue;
    const future = instance.futureApplicability;
    if (
      !future ||
      future.remaining <= 0 ||
      !futureApplicabilityIncludesEvent(future.events, "activate")
    )
      continue;
    const bindings =
      instance.origin === "layer"
        ? instance.lockedBindings
        : { objects: {}, numbers: {}, strings: {} };
    if (
      !view.matchesFilter(object, future.filter, {
        controllerId: actorId,
        source: instance.source.ref,
        bindings,
      }) ||
      future.observedSubjects.length + 1 < future.ordinal
    )
      continue;
    for (const atom of instance.atoms) {
      if (
        atom.kind !== "rule" ||
        atom.action !== "play-card-target" ||
        atom.mode !== "allow" ||
        atom.parameters.kind !== "rule-modification" ||
        !atom.parameters.targetPlayer
      )
        continue;
      if (
        atom.condition &&
        !evaluateCanonicalCondition(
          state,
          atom.condition,
          { controllerId: actorId, source: instance.source, bindings },
          null,
        )
      )
        continue;
      return {
        ...ability,
        effect: {
          ...ability.effect,
          source: { ...ability.effect.source, player: atom.parameters.targetPlayer },
        },
      };
    }
  }
  return ability;
}
