import {
  isUpToCount,
  type FabCardFilter,
  type FabCondition,
  type FabEffect,
  type FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import { declaredSplitBaseProperties } from "../../cards.ts";
import type { FabRulesView } from "../rules-view.ts";
import type { FabObjectRef } from "../continuous/ir.ts";
import { buildFabRulesView } from "../state-rules-view.ts";
import { collectDeclaredTargets } from "../../kernel/trigger-declaration.ts";
import { controlsABow } from "../weapons/weapon-area.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { countControlledTokens } from "../selectors.ts";
import {
  continuousEffectInstanceIsActive,
  futureApplicabilityIncludesEvent,
} from "../continuous/runtime.ts";
import { continuousPlayCostDelta } from "../../procedures/activate-ability/stages/quote.ts";
import { evaluateCanonicalCondition } from "../condition-evaluator.ts";
import { snapshotObject } from "../snapshots.ts";
import {
  isPayablePlayCost,
  isSoulBanishPlayCost,
  isSoulBanishXPlayCost,
  optionalPlayCostIsPayable,
  playCostFilter,
  playCostSpecs,
  soulBanishPlayCostMax,
  zonePlayCostCandidates,
} from "../../procedures/play-card/effect-costs.ts";
import { isHeroAttackTarget } from "../combat-target.ts";
import { resolveAdditionalHeroAttackTarget } from "../additional-attack-targets.ts";
import { fabPrimaryDefenders } from "../../game/combat.ts";
import type { FabSplitPlayMethod } from "../../cards.ts";
import { quoteFabAttackTargets } from "./attack-targets.ts";
import { restrictCapReached } from "./restrict-cap.ts";
import type {
  FabPlayDenialReason,
  FabPlayOrigin,
  FabPlayQuote,
  FabPlayQuoteBase,
  FabPlayRequest,
  FabPlayTiming,
} from "./types.ts";

export function quoteFabPlay(
  state: FabRulesSnapshot,
  request: FabPlayRequest,
  view: FabRulesView = buildFabRulesView(state),
): FabPlayQuote {
  const record = state.objects[request.instanceId];
  const liveObject = record
    ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
    : null;
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  const layout = definition?.layout;
  let splitPlayMethod: FabSplitPlayMethod | null = null;
  let declarationError: string | null = null;
  if (layout?.kind === "split") {
    if (request.playMethod?.kind === "meld") {
      if (!layout.faces.some((face) => face.keywords.some((keyword) => keyword.name === "meld"))) {
        declarationError = "This split-card does not have meld.";
      } else {
        splitPlayMethod = request.playMethod;
      }
    } else if (request.playMethod?.kind === "face") {
      splitPlayMethod = request.playMethod;
    } else {
      declarationError = "Declare the left or right side of this split-card.";
    }
  } else if (request.playMethod?.kind === "meld") {
    if (!definition?.base.keywords.some((keyword) => keyword.name === "meld")) {
      declarationError = "This card does not have meld.";
    } else {
      splitPlayMethod = request.playMethod;
    }
  } else if (request.playMethod !== undefined) {
    declarationError = "Only a split-card may declare a printed face.";
  }
  const declaredBase =
    definition && splitPlayMethod ? declaredSplitBaseProperties(definition, splitPlayMethod) : null;
  const object =
    liveObject && declaredBase
      ? {
          ...liveObject,
          base: declaredBase,
          baseNumeric: declaredBase.numeric,
          current: declaredBase,
        }
      : liveObject;
  const player = state.players[request.actorId];
  // Locate the card in the declared origin across all seats. Own hand/arsenal
  // are base play origins; banished/deck/graveyard may also be other players'
  // zones when a play-permission continuous effect grants access (Nuu free
  // blue from opposing banished, etc.). Permission gates still apply below.
  const originOwnerId = (["hand", "arsenal", "banished", "deck", "graveyard"] as const)
    .filter((origin) => origin === request.from)
    .flatMap((origin) =>
      state.playerIds.filter((playerId) =>
        (state.containers.zonesByPlayerId[playerId]?.[origin] ?? []).includes(request.instanceId),
      ),
    )[0];
  const allowedOrigins: FabPlayOrigin[] = originOwnerId !== undefined ? [request.from] : [];
  // Hand and arsenal remain controller-owned unless a play-card permission
  // names this exact object (Annexation: play face-up cards from their arsenal).
  // A stray game-scope allow/play rule is not that permission.
  const crossOwnerBaseZone =
    request.from === "hand" || request.from === "arsenal"
      ? originOwnerId !== undefined && originOwnerId !== request.actorId
      : false;
  const actorHeroId = player?.heroCardId ?? null;
  const playRules = object
    ? view.rules("play").filter((rule) => {
        const filterMatches =
          rule.filter === null ||
          playRestrictionFilterMatches(
            view,
            object,
            request.from,
            rule.filter,
            rule.controllerId,
            continuousRuleSource(state, rule.effectId),
          );
        if (!filterMatches) return false;
        if (rule.scope.kind === "game") return true;
        if (
          rule.scope.subjects.some(
            (subject) =>
              subject.instanceId === object.ref.instanceId &&
              subject.incarnation === object.ref.incarnation,
          )
        ) {
          return true;
        }
        // "Target hero can't play …" latches the hero object as the subject.
        // Apply the filter to cards that hero's controller is quoting.
        return (
          actorHeroId !== null &&
          rule.scope.subjects.some((subject) => subject.instanceId === actorHeroId)
        );
      })
    : [];
  // Next-object play grants (appliesTo.next) latch on announce-card, but
  // begin-play quotes legality *before* announce. Prospectively match
  // unconsumed future-applicability play-card atoms against this object.
  type ApplicablePlayPermission = {
    readonly parameters: Extract<
      import("../continuous/ir.ts").FabRuleParameters,
      { readonly kind: "play-card" }
    >;
    readonly effectId: string;
    readonly atomId: string;
  };
  const atomAppliesFrom = (
    atom: import("../continuous/ir.ts").FabContinuousAtom,
  ): atom is Extract<import("../continuous/ir.ts").FabContinuousAtom, { kind: "rule" }> & {
    readonly parameters: Extract<
      import("../continuous/ir.ts").FabRuleParameters,
      { readonly kind: "play-card" }
    >;
  } =>
    atom.kind === "rule" &&
    atom.mode === "allow" &&
    atom.action === "play" &&
    atom.parameters.kind === "play-card" &&
    (atom.parameters.fromZones === null || atom.parameters.fromZones.includes(request.from));

  const applicablePermissions: ApplicablePlayPermission[] = playRules.flatMap((rule) =>
    rule.mode === "allow" &&
    rule.parameters.kind === "play-card" &&
    (rule.parameters.fromZones === null || rule.parameters.fromZones.includes(request.from))
      ? [{ parameters: rule.parameters, effectId: rule.effectId, atomId: rule.atomId }]
      : [],
  );
  if (object) {
    for (const instance of state.continuousEffectInstances) {
      if (instance.controllerId !== request.actorId) continue;
      if (!continuousEffectInstanceIsActive(state, instance)) continue;
      const future = instance.futureApplicability;
      const prospective =
        future !== null &&
        future.remaining > 0 &&
        futureApplicabilityIncludesEvent(future.events, "play") &&
        view.matchesFilter(object, future.filter, {
          controllerId: instance.controllerId,
          source: instance.source.ref,
          bindings:
            instance.origin === "layer"
              ? instance.lockedBindings
              : { objects: {}, numbers: {}, strings: {} },
        });
      // Direct grants belong to the captured object incarnation (CR 3.0.9).
      // Future grants retain their authored filter/count.
      const direct =
        future === null &&
        instance.initialSubjects.some(
          (subject) =>
            subject.instanceId === object.ref.instanceId &&
            subject.incarnation === object.ref.incarnation,
        );
      if (!prospective && !direct) continue;
      for (const atom of instance.atoms) {
        if (!atomAppliesFrom(atom)) continue;
        applicablePermissions.push({
          parameters: atom.parameters,
          effectId: instance.effectId,
          atomId: atom.atomId,
        });
      }
    }
  }
  const permissionById = new Map<string, ApplicablePlayPermission>();
  for (const permission of applicablePermissions) {
    permissionById.set(`${permission.effectId}#${permission.atomId}`, permission);
  }
  const listedPermissions = [...permissionById.values()];
  // Origin-authorizing grants name fromZones. Timing/cost modifiers omit
  // fromZones (compiled as null) and never open a new origin by themselves
  // (CR 5.1.1a / 5.1.2b). Teklovossen's next-Evo-as-instant composes with
  // the separate banished-Evo origin permission.
  const isOriginAuthorizing = (parameters: ApplicablePlayPermission["parameters"]): boolean =>
    parameters.fromZones !== null && parameters.fromZones.includes(request.from);
  const isTimingModifier = (parameters: ApplicablePlayPermission["parameters"]): boolean =>
    parameters.fromZones === null;
  const originAuthorizingPermissions = listedPermissions.filter((permission) =>
    isOriginAuthorizing(permission.parameters),
  );
  const timingModifiers = listedPermissions.filter((permission) =>
    isTimingModifier(permission.parameters),
  );
  const originAuthorizedByPermission = originAuthorizingPermissions.length > 0;
  const basePermissionAvailable =
    originOwnerId === request.actorId && (request.from === "hand" || request.from === "arsenal");
  const originAuthorized = basePermissionAvailable || originAuthorizedByPermission;
  let playPermissionOptions: FabPlayQuoteBase["playPermissionOptions"] = [
    ...(basePermissionAvailable ? [{ id: "base", kind: "base" as const, effectId: null }] : []),
    ...[...permissionById.entries()]
      .filter(
        ([, permission]) =>
          isOriginAuthorizing(permission.parameters) ||
          (isTimingModifier(permission.parameters) && originAuthorized),
      )
      .map(([id, permission]) => ({
        id,
        kind: "effect" as const,
        effectId: permission.effectId,
      })),
  ];
  const requestedPermissionId = request.playPermissionId;
  const defaultEffectPermission = (): ApplicablePlayPermission | undefined => {
    if (!originAuthorized) return originAuthorizingPermissions[0];
    const instant = [...timingModifiers, ...originAuthorizingPermissions].find(
      (permission) => permission.parameters.asType?.toLowerCase() === "instant",
    );
    return instant ?? originAuthorizingPermissions[0] ?? timingModifiers[0];
  };
  const playPermission =
    requestedPermissionId === "base"
      ? undefined
      : requestedPermissionId
        ? permissionById.get(requestedPermissionId)
        : defaultEffectPermission();
  const invalidPlayPermission =
    requestedPermissionId !== undefined &&
    requestedPermissionId !== "base" &&
    requestedPermissionId !== "keyword:rune-gate" &&
    !permissionById.has(requestedPermissionId);
  const faceDownExternalPermission = playPermission
    ? state.continuousEffectInstances.some(
        (instance) =>
          instance.effectId === playPermission.effectId &&
          instance.source.ref.instanceId !== request.instanceId,
      )
    : false;
  const baseCostModification =
    playPermission?.parameters.kind === "play-card"
      ? playPermission.parameters.costModification
      : null;
  // CR 8.3.27 rune-gate: if the card has rune-gate and is played from banished
  // with no other permission, count Runechants in arena; when enough are
  // controlled, the play is free (not merely reduced).
  const hasRuneGate =
    object?.current.keywords.some((keyword) => keyword.name === "rune-gate") ?? false;
  const runeGateApplies =
    request.from === "banished" && !originAuthorizedByPermission && hasRuneGate && object !== null;
  const runeGateRunechantCount = runeGateApplies
    ? countControlledTokens(state, request.actorId, "token:runechant")
    : 0;
  const runeGateFree =
    runeGateApplies && runeGateRunechantCount >= (object?.current.numeric.cost ?? 0);
  if (runeGateFree) {
    playPermissionOptions = [
      ...playPermissionOptions,
      { id: "keyword:rune-gate", kind: "effect", effectId: null },
    ];
  }
  const invalidRuneGatePermission = requestedPermissionId === "keyword:rune-gate" && !runeGateFree;
  const selectedPlayPermissionId = playPermission
    ? ([...permissionById.entries()].find(([, permission]) => permission === playPermission)?.[0] ??
      null)
    : requestedPermissionId === "keyword:rune-gate"
      ? runeGateFree
        ? "keyword:rune-gate"
        : null
      : basePermissionAvailable
        ? "base"
        : runeGateFree
          ? "keyword:rune-gate"
          : null;
  const costModification: FabPlayQuoteBase["costModification"] = runeGateFree
    ? "free"
    : baseCostModification;
  const types = object?.current.typeBox.types ?? [];
  const subtypes = object?.current.typeBox.subtypes ?? [];
  const isAction = types.includes("Action");
  const isInstant = types.includes("Instant");
  const isAttackReaction = types.includes("Attack Reaction");
  const isDefenseReaction = types.includes("Defense Reaction");
  const isAttack = subtypes.includes("Attack");
  const attackTargets =
    isAttack && object
      ? quoteFabAttackTargets(
          state,
          { actorId: request.actorId, attackInstanceId: request.instanceId },
          view,
        ).candidates
      : [];
  const attackTargetCandidate = isAttack
    ? request.attackTargetId
      ? attackTargets.find((candidate) => candidate.targetId === request.attackTargetId)
      : attackTargets.find((candidate) => candidate.kind === "hero")
    : undefined;
  const grantedInstantTiming =
    playPermission?.parameters.kind === "play-card" &&
    playPermission.parameters.asType?.toLowerCase() === "instant";
  const timing: FabPlayTiming | null = grantedInstantTiming
    ? "instant"
    : isAttackReaction && !isDefenseReaction && !isAction && !isInstant
      ? "attack-reaction"
      : isDefenseReaction && !isAttackReaction && !isAction && !isInstant
        ? "defense-reaction"
        : isAction && !isAttackReaction && !isDefenseReaction
          ? "action"
          : isInstant && !isAttackReaction && !isDefenseReaction
            ? "instant"
            : null;
  const isReaction = timing === "attack-reaction" || timing === "defense-reaction";
  const actionPointCost = timing === "action" ? 1 : 0;
  // CR 2.2.4 / 8.3.38b: cost is immutable. Meld replaces the starting
  // asset-cost with twice the declared face's printed/base cost; increases
  // and reductions are applied exactly once below.
  const printedCost = object?.base.numeric.cost ?? 0;
  // CR 8.3.38b: meld sets the asset-cost before increases/decreases — double base.
  const meldBaseCost = splitPlayMethod?.kind === "meld" ? printedCost * 2 : printedCost;
  // Cost quotes must include both already-applied continuous deltas (Frostbite)
  // and unlatched future deltas that match this play declaration (Heart of Ice,
  // next-attack reductions). Activation costs use their own typed modifier.
  const continuousCostDelta = object
    ? continuousPlayCostDelta(view, object.ref, state, request.actorId)
    : 0;
  const authoredCostReduction = object
    ? playStaticResourceCostReduction(view, state, request.actorId, object)
    : 0;
  const resourceCost =
    costModification === "free"
      ? 0
      : costModification !== null &&
          typeof costModification === "object" &&
          "increase" in costModification &&
          typeof costModification.increase === "number"
        ? Math.max(0, meldBaseCost + costModification.increase + continuousCostDelta)
        : costModification !== null &&
            typeof costModification === "object" &&
            "reduce" in costModification &&
            typeof costModification.reduce === "number"
          ? Math.max(0, meldBaseCost - costModification.reduce + continuousCostDelta)
          : Math.max(0, meldBaseCost - authoredCostReduction + continuousCostDelta);
  const declarations = object
    ? requiredPlayDeclarations(view, request.actorId, object.current.abilities)
    : [];
  const additionalCosts = object
    ? object.current.abilities.flatMap((ability) =>
        ability.kind === "static" && ability.playEffect?.role === "additional-cost"
          ? [ability.id]
          : [],
      )
    : [];
  const alternativeCosts = object
    ? object.current.abilities.flatMap((ability) =>
        ability.kind === "static" && ability.playEffect?.role === "alternative-cost"
          ? [ability.id]
          : [],
      )
    : [];
  const primaryAttackTarget = attackTargetCandidate?.target ?? null;
  const additionalHero =
    isAttack && object
      ? resolveAdditionalHeroAttackTarget(
          state,
          request.actorId,
          request.instanceId,
          primaryAttackTarget,
          request.additionalAttackTargetId,
          view,
        )
      : null;
  const base: FabPlayQuoteBase = {
    stateID: state.stateID,
    request,
    object: object?.ref ?? null,
    allowedOrigins,
    playPermissionOptions,
    selectedPlayPermissionId,
    requiredDeclarations: declarations,
    alternativeCosts,
    additionalCosts,
    costModification,
    resourceCost: object ? resourceCost : null,
    actionPointCost: object ? actionPointCost : null,
    effectIds: [
      ...new Set([
        ...playRules.map((rule) => rule.effectId),
        ...applicablePermissions.map((permission) => permission.effectId),
      ]),
    ],
    isAttack,
    timing,
    attackTarget: primaryAttackTarget,
    additionalAttackTargets: additionalHero ? [additionalHero] : [],
    splitPlayMethod,
    splitBase: declaredBase,
  };
  const denied = (reasonCode: FabPlayDenialReason, reason: string): FabPlayQuote => ({
    ...base,
    allowed: false,
    reasonCode,
    reason,
  });
  if (state.rulesProcess || state.decision)
    return denied("rules_process_pending", "Finish the current rules process first.");
  if (!player || state.priority?.holderPlayerId !== request.actorId)
    return denied("not_priority_player", "Only the player with priority may begin this play.");
  if (!allowedOrigins.includes(request.from))
    return denied("card_not_in_zone", "The card is not in the declared play zone.");
  if (
    invalidPlayPermission ||
    invalidRuneGatePermission ||
    (requestedPermissionId === "base" && !basePermissionAvailable)
  )
    return denied(
      "unsupported_play_permission",
      "The selected play permission is not available for this card and origin.",
    );
  if (crossOwnerBaseZone && !originAuthorizedByPermission)
    return denied(
      "card_not_in_zone",
      "Hand and arsenal plays must originate from the acting player's own zones.",
    );
  // CR 8.2.6a: an Arrow requires arsenal origin AND bow control, checked as
  // two independent gates. A printed continuous allow-play rule can waive
  // both; Ranger heroes do not print that waiver.
  if (object?.current.typeBox.subtypes.includes("Arrow")) {
    const arrowAllowRule = view.rules("play").some((rule) => {
      if (rule.mode !== "allow" || rule.controllerId !== request.actorId) return false;
      return (
        rule.filter === null ||
        view.matchesFilter(object, rule.filter, {
          controllerId: rule.controllerId,
          source: null,
          subject: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })
      );
    });
    if (request.from !== "arsenal" && !arrowAllowRule) {
      return denied(
        "arrow_must_come_from_arsenal",
        "An arrow can only be played from the arsenal.",
      );
    }
    if (!controlsABow(state, request.actorId, state.cardDefinitions) && !arrowAllowRule) {
      return denied("arrow_requires_bow", "An arrow can only be played if you control a bow.");
    }
  }
  if (declarationError) return denied("unsupported_play_declaration", declarationError);
  if (!object) return denied("card_object_missing", "The card object is missing or not evaluable.");
  // CR 8.3.7 specialization is a meta-static deckbuilding restriction (pregame),
  // not an in-match play permission.
  // A face-down banished card is private. Its ordinary play-static abilities
  // are not functional there, so they cannot grant permission to play it.
  // A card that explicitly declares banished as a functional zone remains
  // eligible for a future private-zone exception.
  if (
    request.from === "banished" &&
    record?.markers.some((marker) => marker.kind === "face-down") &&
    !faceDownExternalPermission &&
    !object.current.abilities.some(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "play" &&
        ability.functionalZones?.includes("banished"),
    )
  ) {
    return denied(
      "unsupported_play_permission",
      "A face-down banished card cannot use this play permission.",
    );
  }
  const playCondition = object.current.abilities.find(
    (ability) =>
      ability.kind === "static" &&
      ability.staticKind === "play" &&
      ability.playEffect?.role === "condition" &&
      ability.condition !== undefined &&
      // "This can only be played from arsenal" is represented as a played-this
      // onlySource condition. At quote time no play move has occurred yet, so
      // the request's declared source zone is the authoritative bounded fact.
      !(
        ability.condition.type === "played-this" &&
        ability.condition.onlySource === true &&
        ability.condition.filter.playedFromZones?.includes(request.from as never)
      ) &&
      !evaluateCanonicalCondition(
        state,
        ability.condition,
        {
          controllerId: request.actorId,
          source: snapshotObject(state, request.instanceId, request.actorId, request.from, view),
        },
        null,
      ),
  );
  if (playCondition)
    return denied("play_condition_failed", "The card's play condition is not satisfied.");
  const playRestriction = playRules.find(
    (rule) => rule.mode === "restrict" && restrictCapReached(state, request.actorId, rule),
  );
  if (playRestriction)
    return denied(
      object.current.typeBox.types.includes("Defense Reaction")
        ? "defense_reactions_blocked"
        : "restricted_by_rule",
      object.current.typeBox.types.includes("Defense Reaction")
        ? "Defense reaction cards cannot be played for this chain link."
        : playRestriction.parameters.kind === "freeze"
          ? "That object is frozen and cannot be played."
          : "A rules effect restricts this object from being played.",
    );
  // CR 7.4.2c: "A defense reaction card cannot be played if a rule or effect
  // would prevent the player from defending with that card." A
  // restrict/defend rule-modification (e.g. Widowmaker AZL015 "Defense
  // reactions can't be played to Widowmaker's chain link", projected while
  // the attack sits on the combat chain) therefore governs PLAYING defense
  // reactions during that defend/reaction window: defense reactions enter
  // play through this play path — quoteDefense rejects them as declared
  // defenders (defense_reaction_not_defend). Game-level rules apply by filter
  // match; rules latched onto the active attack carry the printed restriction
  // of that attack's chain link. Count-cap rules (maxDefenders — Confidence,
  // CR 8.6.35) are NOT per-card blocks: per CR 7.3.2b(C)/7.4.2c the play is
  // prevented only once the card cannot become a defending card (cap
  // saturated), which the declaration-time counting pass enforces — an
  // unsaturated cap prevents nothing here. Object scope is always non-empty;
  // a stale latched attack rule is omitted by evaluation and cannot become a
  // game-scoped restriction.
  if (object.current.typeBox.types.includes("Defense Reaction")) {
    const combatAttack = view.combat()?.attack;
    const defendRestriction = view
      .rules("defend")
      .find(
        (rule) =>
          rule.mode === "restrict" &&
          rule.parameters.kind === "rule-modification" &&
          !rule.parameters.maxDefenders &&
          (rule.scope.kind === "objects" && rule.scope.selection === "latched"
            ? combatAttack !== undefined &&
              rule.scope.subjects.some(
                (subject) =>
                  subject.instanceId === combatAttack.ref.instanceId &&
                  subject.incarnation === combatAttack.ref.incarnation,
              )
            : rule.scope.kind === "game") &&
          (rule.filter === null ||
            playRestrictionFilterMatches(
              view,
              object,
              request.from,
              rule.filter,
              rule.controllerId,
              continuousRuleSource(state, rule.effectId),
            )),
      );
    if (defendRestriction)
      return denied(
        "defense_reactions_blocked",
        "Defense reaction cards cannot be played for this chain link.",
      );
  }
  // mode:"require" + filter = "you may only play cards matching filter"
  // (Oath of Loyalty / Warmonger's Diplomacy). playRules above only keeps
  // filter-matching rules, so scan game-level require rules separately and
  // deny objects that fail the filter. Scope to the acting seat: a printed
  // "you may only" restriction never constrains the other player.
  if (object) {
    const requireOnlyRules = view
      .rules("play")
      .filter(
        (rule) =>
          rule.mode === "require" &&
          rule.action === "play" &&
          rule.controllerId === request.actorId &&
          rule.scope.kind === "game" &&
          rule.filter !== null,
      );
    for (const rule of requireOnlyRules) {
      if (
        !view.matchesFilter(object, rule.filter!, {
          controllerId: rule.controllerId,
          source: null,
          subject: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })
      ) {
        return denied(
          "restricted_by_rule",
          "A rules effect requires this play to match a printed filter.",
        );
      }
    }
    // CIN027 Put in Context: "This can only defend an attack with 3 or less
    // base {p}." mode require + subjectFilter on the active attack. Enforce at
    // begin-play of the defense reaction, not after it is already on the stack.
    if (object.current.typeBox.types.includes("Defense Reaction")) {
      const attack = view.combat()?.attack;
      const attackCtx = {
        controllerId: state.combat?.activeLink?.attackingPlayerId ?? request.actorId,
        source: attack?.ref ?? object.ref,
        subject: attack?.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      };
      for (const rule of view.rules("play")) {
        if (rule.mode !== "require" || rule.action !== "play") continue;
        if (rule.parameters.kind !== "rule-modification") continue;
        const subjectFilter = rule.parameters.subjectFilter;
        if (!subjectFilter) continue;
        const selfFilter = rule.filter;
        if (
          selfFilter &&
          !view.matchesFilter(object, selfFilter, {
            controllerId: rule.controllerId,
            source: null,
            subject: object.ref,
            bindings: { objects: {}, numbers: {}, strings: {} },
          })
        ) {
          continue;
        }
        if (!attack || !view.matchesFilter(attack, subjectFilter, attackCtx)) {
          return denied(
            "restricted_by_rule",
            "This can only defend an attack with 3 or less base {p}.",
          );
        }
      }
    }
  }
  if (request.from === "banished" && !originAuthorizedByPermission && !runeGateFree) {
    const authoredPermissionFromOrigin = object.current.abilities.some(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "play" &&
        ability.playEffect?.role === "permission" &&
        ability.playEffect.fromZones.includes(request.from),
    );
    return denied(
      runeGateApplies
        ? "rune_gate"
        : authoredPermissionFromOrigin
          ? "play_condition_failed"
          : "unsupported_play_permission",
      runeGateApplies
        ? `Rune Gate requires ${object?.current.numeric.cost ?? 0} Runechants in the arena; found ${runeGateRunechantCount}.`
        : authoredPermissionFromOrigin
          ? "The card's play condition is not satisfied."
          : "Playing from banished requires a migrated permission effect.",
    );
  }
  if (request.from === "deck" && !originAuthorizedByPermission) {
    return denied(
      "unsupported_play_permission",
      "Playing from the deck requires a migrated permission effect (e.g. top-deck as instant).",
    );
  }
  // Gravy Bones / watery-grave: "you may play cards with watery grave from your
  // graveyard" — permission-only origin, same gate pattern as banished/deck.
  if (request.from === "graveyard" && !originAuthorizedByPermission) {
    return denied(
      "unsupported_play_permission",
      "Playing from the graveyard requires a migrated permission effect.",
    );
  }
  if (timing === null)
    return denied(
      "unsupported_play_type",
      "This card type is not supported by the play procedure.",
    );
  if (isReaction) {
    const link = state.combat?.activeLink;
    const legalController = isAttackReaction ? link?.attackingPlayerId : link?.defendingPlayerId;
    if (
      isDefenseReaction &&
      link?.defendingPlayerId === request.actorId &&
      !isHeroAttackTarget(state, link.attackTargetRef)
    )
      return denied(
        "ally_target_no_defend",
        "Defense reactions cannot be played when an ally or permanent is attacked.",
      );
    if (
      !state.combat?.open ||
      state.combat.step !== "reaction" ||
      legalController !== request.actorId
    )
      return denied(
        "illegal_reaction_timing",
        "That reaction is not legal in the current reaction step.",
      );
    if (
      isDefenseReaction &&
      request.from === "hand" &&
      link &&
      fabPrimaryDefenders(link).some(
        (instanceId) => link.defendingOrigins[instanceId]?.kind === "hand",
      )
    ) {
      const attackRecord = state.objects[link.activeAttack.sourceObjectId];
      const attack = attackRecord
        ? view.object({
            instanceId: attackRecord.instanceId,
            incarnation: attackRecord.incarnation,
          })
        : null;
      if (attack?.current.keywords.some((keyword) => keyword.name === "dominate"))
        return denied("dominate", "Dominate allows at most one defending card from hand.");
    }
  } else if (timing === "action") {
    // CR 7.0.1a / 7.6.3a: while the combat chain is open, action cards are
    // illegal except attacks (and attack-layers) during the Resolution Step.
    // That is how multi-link chains (go again → next attack) are started.
    const resolutionAttackContinue =
      isAttack &&
      state.combat?.open === true &&
      state.combat.step === "resolution" &&
      state.rulesStack.length === 0 &&
      request.actorId === state.activePlayerId &&
      state.phase === "action";
    const illegalOutsideCombat =
      request.actorId !== state.activePlayerId ||
      state.phase !== "action" ||
      state.rulesStack.length > 0;
    const illegalWhileCombatOpen = state.combat?.open === true && !resolutionAttackContinue;
    if (illegalOutsideCombat || illegalWhileCombatOpen) {
      return denied(
        "illegal_action_timing",
        "An action card is not legal in the current layer position.",
      );
    }
  }
  if (declarations.includes("effect-cost"))
    return denied(
      "unsupported_play_declaration",
      "This card requires an unmigrated effect-cost declaration.",
    );
  if (isAttack && !attackTargetCandidate)
    return denied("illegal_attack_target", "Choose a legal attack target.");
  if (player.actionPoints < actionPointCost)
    return denied("insufficient_action_points", "The action-point cost cannot be paid.");
  if (object) {
    const announced = snapshotObject(
      state,
      request.instanceId,
      request.actorId,
      request.from,
      view,
    );
    const unpayableSoulBanish = playCostSpecs(announced).some((spec) => {
      if (spec.optional || spec.role === "alternative-cost") return false;
      if (!isSoulBanishPlayCost(spec.cost) || isSoulBanishXPlayCost(spec.cost)) return false;
      if (isUpToCount(spec.cost.count)) return false;
      const needed = soulBanishPlayCostMax(spec.cost) ?? 0;
      if (needed < 1) return false;
      return (
        zonePlayCostCandidates(
          state,
          request.actorId,
          request.instanceId,
          "soul",
          playCostFilter(spec.cost),
        ).length < needed
      );
    });
    if (unpayableSoulBanish) {
      return denied("play_condition_failed", "The additional soul-banish cost cannot be paid.");
    }
  }
  // Quotes are also the legal-command contract for the UI and automation.
  // Keep their resource result aligned with payment.ts so callers do not
  // advertise commands that will deterministically fail during payment.
  if (resourceCost !== null && resourceCost > 0) {
    const announced = snapshotObject(
      state,
      request.instanceId,
      request.actorId,
      request.from,
      view,
    );
    const alternativeCoversResources = playCostSpecs(announced).some(
      (spec) =>
        spec.role === "alternative-cost" &&
        optionalPlayCostIsPayable(state, request.actorId, request.instanceId, spec),
    );
    if (alternativeCoversResources) {
      // CR 5.1.3c / 5.1.6c: a payable alternative may replace the resource
      // asset-cost. Do not deny the quote for printed {r} that will be zeroed
      // if the alternative is declared.
    } else {
      const hand = state.containers.zonesByPlayerId[request.actorId]?.hand ?? [];
      const otherPitch = hand.reduce((sum, instanceId) => {
        if (instanceId === request.instanceId) return sum;
        const record = state.objects[instanceId];
        const held = record
          ? view.object({ instanceId: record.instanceId, incarnation: record.incarnation })
          : null;
        const pitch = held?.current.numeric.pitch ?? 0;
        if (pitch <= 0) return sum;
        return sum + pitch;
      }, 0);
      if (player.chiPoints + player.resourcePoints + otherPitch < resourceCost) {
        return denied("insufficient_resources", "The resource cost cannot be paid.");
      }
    }
  }
  return { ...base, allowed: true, reasonCode: null, reason: null };
}

/**
 * CR 7.4.2c: a restrict/defend filter's `playedFromZones` is the zone the
 * defense reaction is being played from (hand / arsenal), not a completed
 * stack move. Matches `defenderMatchesDefendFilter` in defense.ts.
 */
function continuousRuleSource(state: FabRulesSnapshot, effectId: string): FabObjectRef | null {
  const instance = state.continuousEffectInstances.find((entry) => entry.effectId === effectId);
  return instance?.source.ref ?? null;
}

function playRestrictionFilterMatches(
  view: FabRulesView,
  object: NonNullable<ReturnType<FabRulesView["object"]>>,
  origin: FabPlayOrigin,
  filter: FabCardFilter,
  controllerId: string,
  source: FabObjectRef | null = null,
): boolean {
  if (filter.playedFromZones && filter.playedFromZones.length > 0) {
    if (!filter.playedFromZones.includes(origin)) return false;
  }
  const { playedFromZones: _zones, ...rest } = filter;
  if (Object.keys(rest).length === 0) return true;
  return view.matchesFilter(object, rest, {
    controllerId,
    source,
    subject: object.ref,
    bindings: { objects: {}, numbers: {}, strings: {} },
  });
}

function requiredPlayDeclarations(
  _view: FabRulesView,
  _actorId: string,
  abilities: readonly FleshAndBloodAbility[],
): ("mode" | "target" | "effect-cost")[] {
  const required = new Set<"mode" | "target" | "effect-cost">();
  for (const ability of abilities) {
    if (ability.kind === "static" && ability.playEffect) {
      if (ability.playEffect.role === "cost-reduction") continue;
      const cost = ability.playEffect.cost;
      if (!cost) continue;
      const optional =
        ability.playEffect.optional === true || ability.playEffect.role === "alternative-cost";
      if (isPayablePlayCost(cost, optional)) continue;
      required.add("effect-cost");
      continue;
    }
    if (ability.kind !== "resolution" && ability.kind !== "modal") continue;
    const effects: FabEffect[] = [];
    if (ability.kind === "modal") {
      required.add("mode");
      if (ability.additionalCost && !isPayablePlayCost(ability.additionalCost, false)) {
        required.add("effect-cost");
      }
      if (ability.effect) effects.push(ability.effect);
      effects.push(...ability.modes.map((mode) => mode.effect));
    } else if (ability.effect) {
      effects.push(ability.effect);
    }
    if (
      effects.some((effect, index) => collectDeclaredTargets(effect, `quote-${index}`).length > 0)
    ) {
      required.add("target");
    }
  }
  return [...required];
}

const EMPTY_BINDINGS = { objects: {}, numbers: {}, strings: {} } as const;

const COST_REDUCTION_SOURCE_ZONES = [
  "arena",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
] as const;

function evaluatePlayResourceAmount(
  view: FabRulesView,
  actorId: string,
  source: import("../continuous/ir.ts").FabObjectRef,
  amount: import("@tcg/flesh-and-blood-types").FabAmount,
): number {
  if (typeof amount === "number") return Math.max(0, amount);
  try {
    const resolved = view.evaluateAmount(amount, {
      controllerId: actorId,
      source,
      bindings: EMPTY_BINDINGS,
    }).value;
    return typeof resolved === "number" && Number.isFinite(resolved) ? Math.max(0, resolved) : 0;
  } catch {
    return 0;
  }
}

/**
 * CR 5.1.6a step 4: play-static cost-reductions, including count/X amounts
 * and filter-bearing reductions on other controlled objects (Evo heads).
 */
export function playStaticResourceCostReduction(
  view: FabRulesView,
  state: FabRulesSnapshot,
  actorId: string,
  object: import("../rules-view.ts").FabEvaluatedObject,
  bindings: import("../continuous/ir.ts").FabResolvedBindings = EMPTY_BINDINGS,
): number {
  let total = 0;
  const addReduction = (
    source: import("../rules-view.ts").FabEvaluatedObject,
    requireFilter: boolean,
  ): void => {
    for (const ability of source.current.abilities) {
      if (
        ability.kind !== "static" ||
        ability.playEffect?.role !== "cost-reduction" ||
        ability.playEffect.cost?.class !== "asset" ||
        ability.playEffect.cost.type !== "resources"
      ) {
        continue;
      }
      const filter = ability.playEffect.filter;
      if (requireFilter && !filter) continue;
      if (
        filter &&
        !view.matchesFilter(object, filter, {
          controllerId: actorId,
          source: source.ref,
          bindings: EMPTY_BINDINGS,
        })
      ) {
        continue;
      }
      if (
        ability.condition &&
        !view.evaluateCondition(ability.condition, {
          controllerId: actorId,
          source: source.ref,
          subject: source.ref,
          bindings,
        }) &&
        !costReductionWaitsForDeclaredIt(ability.condition, bindings)
      ) {
        continue;
      }
      total += evaluatePlayResourceAmount(
        view,
        actorId,
        source.ref,
        ability.playEffect.cost.amount,
      );
    }
  };
  addReduction(object, false);
  const zones = state.containers.zonesByPlayerId[actorId];
  if (!zones) return total;
  for (const zone of COST_REDUCTION_SOURCE_ZONES) {
    for (const instanceId of zones[zone] ?? []) {
      if (instanceId === object.ref.instanceId) continue;
      const record = state.objects[instanceId];
      if (!record) continue;
      const source = view.object({
        instanceId: record.instanceId,
        incarnation: record.incarnation,
      });
      if (source) addReduction(source, true);
    }
  }
  return total;
}

/** Quote-time: a play-static reduction gated on declared `it` is still possible. */
function costReductionWaitsForDeclaredIt(
  condition: FabCondition,
  bindings: import("../continuous/ir.ts").FabResolvedBindings,
): boolean {
  if (condition.type === "binding-matches") {
    return (bindings.objects[condition.binding]?.length ?? 0) === 0;
  }
  if (condition.type === "and") {
    return condition.conditions.some((inner) => costReductionWaitsForDeclaredIt(inner, bindings));
  }
  return false;
}
