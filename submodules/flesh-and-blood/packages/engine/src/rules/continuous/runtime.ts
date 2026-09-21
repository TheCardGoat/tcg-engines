import type { FabActiveContinuousAtom } from "../rules-view.ts";
import type { FabFutureApplicabilityEvent } from "@tcg/flesh-and-blood-types";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import { isOnCombatChain } from "../zones.ts";
import type {
  FabContinuousEffectInstance,
  FabContinuousExpiry,
  FabContinuousInitialSubject,
  FabExactAttackRef,
  FabObjectRef,
} from "./ir.ts";

export function futureApplicabilityIncludesEvent(
  events: readonly FabFutureApplicabilityEvent[] | null,
  event: FabFutureApplicabilityEvent,
): boolean {
  return events === null || events.includes(event);
}

export function continuousEffectInstanceApplies(
  state: Pick<
    FabRulesSnapshot,
    "turnNumber" | "activePlayerId" | "phase" | "combat" | "objects" | "containers" | "playerIds"
  >,
  instance: Pick<
    FabContinuousEffectInstance,
    "expiresAt" | "futureApplicability" | "initialSubjects"
  >,
): boolean {
  if (!continuousEffectInstanceIsActive(state, instance)) return false;
  if (instance.expiresAt.kind === "player-action-phase-window") {
    return (
      state.turnNumber === instance.expiresAt.windowTurnNumber &&
      state.activePlayerId === instance.expiresAt.playerId &&
      state.phase === "action"
    );
  }
  if (instance.expiresAt.kind === "player-end-phase-window") {
    return (
      state.turnNumber === instance.expiresAt.windowTurnNumber &&
      state.activePlayerId === instance.expiresAt.playerId &&
      state.phase === "end"
    );
  }
  return true;
}

export function activeContinuousAtoms(state: FabRulesSnapshot): readonly FabActiveContinuousAtom[] {
  return state.continuousEffectInstances
    .filter((instance) => continuousEffectInstanceApplies(state, instance))
    .flatMap((instance) =>
      instance.atoms
        .filter((atom) => atomIsEligibleInCurrentProcess(state, instance, atom))
        .map((atom) => ({
          effectId: instance.effectId,
          controllerId: instance.controllerId,
          source: instance.source.ref,
          atom,
          timestamp: instance.timestamp,
          lockedBindings:
            instance.origin === "layer"
              ? instance.lockedBindings
              : declarationBindings(state, instance.source.ref),
          simultaneousOrder: persistedAtomOrder(state, atom.atomId),
          acceptedApplications: instance.applications.filter(
            (application) => application.atomId === atom.atomId,
          ),
          latchedSubjects: activeLatchedSubjects(state, instance, atom),
        })),
    );
}

function declarationBindings(
  state: FabRulesSnapshot,
  source: FabObjectRef,
): ReturnType<typeof emptyBindings> {
  const record = state.objects[source.instanceId];
  if (!record || record.incarnation !== source.incarnation) return emptyBindings();
  const numbers = Object.fromEntries(
    (record.declarationFacts ?? [])
      .filter((fact) => fact.kind === "numeric-binding")
      .map((fact) => [fact.binding, fact.value]),
  );
  return { objects: {}, numbers, strings: {} };
}

function atomIsEligibleInCurrentProcess(
  state: FabRulesSnapshot,
  instance: FabContinuousEffectInstance,
  atom: FabContinuousEffectInstance["atoms"][number],
): boolean {
  if (
    instance.origin !== "static" ||
    instance.introducedAtStage === null ||
    instance.introducedDuringProcessId !== state.rulesProcess?.processId
  )
    return true;
  return atom.applicationStage !== "rule" && atom.applicationStage >= instance.introducedAtStage;
}

function persistedAtomOrder(state: FabRulesSnapshot, atomId: string): number | null {
  for (const decision of state.continuousOrderingDecisions) {
    const index = decision.orderedAtomIds.indexOf(atomId);
    if (index !== -1) return index;
  }
  return null;
}

function activeLatchedSubjects(
  state: FabRulesSnapshot,
  instance: FabContinuousEffectInstance,
  atom: FabContinuousEffectInstance["atoms"][number],
) {
  // A direct play permission authorizes the captured incarnation in its
  // origin zone. Once that object resets, it must not authorize a replay
  // of the same physical card (CR 3.0.9).
  const isPlayPermission = atom.kind === "rule" && atom.parameters.kind === "play-card";
  const subjects: FabObjectRef[] = [
    ...instance.initialSubjects,
    ...(instance.futureApplicability?.latchedSubjects ?? []),
  ].flatMap((subject) => {
    if (isPlayPermission && state.objects[subject.instanceId]?.incarnation !== subject.incarnation)
      return [];
    return exactSubjectObjectRef(state, subject) ?? [];
  });
  if (subjects.length === 0) {
    return instance.futureApplicability ||
      instance.initialSubjects.some(isExactAttackRef) ||
      instance.initialSubjects.length > 0
      ? []
      : undefined;
  }
  if (
    atom.kind !== "rule" ||
    atom.parameters.kind !== "play-card" ||
    atom.target?.selector !== "object"
  )
    return subjects;
  const target = atom.target;
  return subjects.filter((subject) => {
    if (!target.zones.some((zone) => objectIsInCatalogZone(state, subject.instanceId, zone))) {
      return false;
    }
    // Exact-card permissions normally retain their declared subject even if
    // that card's characteristics later change. Visibility is different: a
    // face-down card in a public zone is private and cannot keep a permission
    // that explicitly requires it to remain face-up (Malice, CR 3.0.8/3.0.9).
    const requiredStatus = target.filter?.hasStatus;
    if (requiredStatus !== "face-up" && requiredStatus !== "face-down") return true;
    const isFaceDown =
      state.objects[subject.instanceId]?.markers.some((marker) => marker.kind === "face-down") ??
      false;
    return requiredStatus === "face-down" ? isFaceDown : !isFaceDown;
  });
}

function objectHasType(state: FabRulesSnapshot, instanceId: string, type: "Weapon"): boolean {
  const record = state.objects[instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  return definition?.base.typeBox.types.includes(type) === true;
}

function objectIsArenaPermanent(state: FabRulesSnapshot, instanceId: string): boolean {
  const record = state.objects[instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  const types = definition?.base.typeBox.types ?? [];
  const subtypes = definition?.base.typeBox.subtypes ?? [];
  return (
    types.includes("Weapon") ||
    types.includes("Equipment") ||
    types.includes("Token") ||
    subtypes.includes("Ally") ||
    subtypes.includes("Aura") ||
    subtypes.includes("Item")
  );
}

function objectIsInCatalogZone(state: FabRulesSnapshot, instanceId: string, zone: string): boolean {
  // Active attack counts as combat-chain even if the object never left its
  // weapon/arena seat (Dromai dragons while attacking, weapon attacks).
  if (zone === "combat-chain" && isOnCombatChain(state, instanceId)) return true;
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    switch (zone) {
      case "combat-chain":
        if (zones.combatChain.includes(instanceId)) return true;
        break;
      case "permanent":
        if (zones.arena.includes(instanceId)) return true;
        if (isOnCombatChain(state, instanceId) && objectIsArenaPermanent(state, instanceId)) {
          return true;
        }
        break;
      case "hero":
        if (zones.heroZone.includes(instanceId)) return true;
        break;
      case "weapon":
        if (zones.weapon1.includes(instanceId) || zones.weapon2.includes(instanceId)) return true;
        if (isOnCombatChain(state, instanceId) && objectHasType(state, instanceId, "Weapon")) {
          return true;
        }
        break;
      case "equipment-head":
        if (zones.head.includes(instanceId)) return true;
        break;
      case "equipment-chest":
        if (zones.chest.includes(instanceId)) return true;
        break;
      case "equipment-arms":
        if (zones.arms.includes(instanceId)) return true;
        break;
      case "equipment-legs":
        if (zones.legs.includes(instanceId)) return true;
        break;
      case "deck":
        if (zones.deck.includes(instanceId)) return true;
        break;
      case "hand":
        if (zones.hand.includes(instanceId)) return true;
        break;
      case "graveyard":
        if (zones.graveyard.includes(instanceId)) return true;
        break;
      case "banished":
        if (zones.banished.includes(instanceId)) return true;
        break;
      case "arsenal":
        if (zones.arsenal.includes(instanceId)) return true;
        break;
      case "pitch":
        if (zones.pitch.includes(instanceId)) return true;
        break;
      case "stack":
        if (zones.stack.includes(instanceId)) return true;
        break;
      case "soul":
        if (zones.soul.includes(instanceId)) return true;
        break;
      case "inventory":
        if (zones.inventory.includes(instanceId)) return true;
        break;
      default:
        break;
    }
  }
  return false;
}

export function continuousEffectInstanceIsActive(
  state: Pick<
    FabRulesSnapshot,
    "turnNumber" | "activePlayerId" | "phase" | "combat" | "objects" | "containers" | "playerIds"
  >,
  instance: Pick<
    FabContinuousEffectInstance,
    "expiresAt" | "futureApplicability" | "initialSubjects"
  >,
): boolean {
  const exactAttacks = instance.initialSubjects.filter(isExactAttackRef);
  if (
    exactAttacks.length > 0 &&
    !exactAttacks.some(
      (subject) => exactAttackIsCurrent(state, subject) || attackAnnouncedOnStack(state, subject),
    )
  ) {
    return false;
  }
  // The current combat procedure clears one resolved link at a time. Keep a
  // still-unconsumed "next object this combat chain" effect live through that
  // boundary so the following go-again attack can latch it.
  if (
    instance.expiresAt.kind === "combat-chain" &&
    (instance.futureApplicability?.remaining ?? 0) > 0 &&
    state.combat !== null
  ) {
    return true;
  }
  if (
    instance.expiresAt.kind === "combat-chain" &&
    (instance.futureApplicability?.latchedSubjects ?? []).some((subject) =>
      state.playerIds.some((playerId) => {
        const zones = state.containers.zonesByPlayerId[playerId];
        return (
          zones?.stack.includes(subject.instanceId) === true ||
          zones?.combatChain.includes(subject.instanceId) === true
        );
      }),
    )
  ) {
    return true;
  }
  // CR 8.3.9 boost: the go-again grant is generated during the attack play
  // journal while the attack is in Layer. Keep it live while its subject is
  // still announced on the stack or already moved onto the combat chain so
  // reconciliation does not cease it before the attack event opens a link.
  if (
    instance.expiresAt.kind === "combat-chain" &&
    (state.combat === null || state.combat.step === "layer") &&
    (instance.initialSubjects ?? []).some(
      (subject) =>
        exactSubjectObjectRef(state, subject) !== null &&
        state.playerIds.some((playerId) => {
          const ref = exactSubjectObjectRef(state, subject);
          if (!ref) return false;
          const zones = state.containers.zonesByPlayerId[playerId];
          return (
            zones?.stack.includes(ref.instanceId) === true ||
            zones?.combatChain.includes(ref.instanceId) === true
          );
        }),
    )
  ) {
    return true;
  }
  return continuousExpiryIsActive(state, instance.expiresAt);
}

function isExactAttackRef(subject: FabContinuousInitialSubject): subject is FabExactAttackRef {
  return "attack" in subject;
}

/** Liveness widening for card-kind exact-attack subjects whose window has
 * not opened yet: the announced attack may still be paying on the stack with
 * no active link (play preview reconciliation runs mid-payment). Without
 * this, a projection generated at announcement flaps generate/cease forever;
 * with it, the instance stays live from announcement through its Defend /
 * Reaction Steps (CR 7.3.1/7.4.2) and dies once the card leaves the stack and
 * is no longer the active attack (link resolution, chain close, a later
 * link's attack, or a cancelled declaration). Subject resolution
 * (exactSubjectObjectRef) is deliberately unaffected — applications still
 * wait for the live attack. */
function attackAnnouncedOnStack(
  state: Pick<FabRulesSnapshot, "objects" | "containers" | "playerIds">,
  attack: FabExactAttackRef,
): boolean {
  if (attack.attack.kind !== "card") return false;
  const live = state.objects[attack.instanceId];
  if (!live || live.incarnation !== attack.incarnation) return false;
  return state.playerIds.some(
    (playerId) =>
      state.containers.zonesByPlayerId[playerId]?.stack.includes(attack.instanceId) === true,
  );
}

function exactAttackIsCurrent(
  state: Pick<FabRulesSnapshot, "combat" | "objects">,
  attack: FabExactAttackRef,
): boolean {
  const active = state.combat?.activeLink?.activeAttack;
  const live = state.objects[attack.instanceId];
  return (
    live?.incarnation === attack.incarnation &&
    active?.kind === attack.attack.kind &&
    active.sourceObjectId === attack.instanceId &&
    (active.kind !== "proxy" ||
      (attack.attack.kind === "proxy" && active.proxyId === attack.attack.proxyId))
  );
}

function exactSubjectObjectRef(
  state: Pick<FabRulesSnapshot, "combat" | "objects">,
  subject: FabContinuousInitialSubject,
): FabObjectRef | null {
  if (isExactAttackRef(subject)) {
    return exactAttackIsCurrent(state, subject)
      ? { instanceId: subject.instanceId, incarnation: subject.incarnation }
      : null;
  }
  // CR 3.0.9: a duration does not carry a locked effect onto a new object.
  // Moving a card to the stack does not reset it; genuine zone resets do.
  const live = state.objects[subject.instanceId];
  if (!live || live.incarnation !== subject.incarnation) return null;
  return subject;
}

function continuousExpiryIsActive(
  state: Pick<
    FabRulesSnapshot,
    "turnNumber" | "activePlayerId" | "phase" | "combat" | "objects" | "containers" | "playerIds"
  >,
  expiry: FabContinuousExpiry,
): boolean {
  switch (expiry.kind) {
    case "permanent":
      return true;
    case "turn":
      return expiry.turnNumber >= state.turnNumber;
    case "player-turn-start":
      return !(
        state.turnNumber > expiry.afterTurnNumber &&
        state.activePlayerId === expiry.playerId &&
        state.phase === "start"
      );
    // CR 6.2.2a: active through the anchor player's next turn, expiring as it
    // ends — the anchored turn number is that player's turn, so this evaluates
    // exactly like the plain turn expiry.
    case "player-turn-end":
      return expiry.turnNumber >= state.turnNumber;
    case "player-action-phase-window":
      // Keep the instance through the window turn. Atoms apply only during
      // that player's action phase; do not cease when the turn counter
      // advances while the previous seat is still in the end phase.
      return state.turnNumber <= expiry.windowTurnNumber;
    case "player-end-phase-window":
      return state.turnNumber <= expiry.windowTurnNumber;
    case "combat-chain": {
      // -1 = printed "this combat chain" (while combat is open).
      if (expiry.combatNumber < 0) return state.combat?.open === true;
      const current = state.combat?.chainLinkNumber;
      if (state.combat?.open === true && state.combat.activeLink != null) {
        return expiry.combatNumber === current;
      }
      // Generated on a resolving attack layer (combat open, no active link
      // yet, chainLinkNumber 0). Keep the pending numbered link live.
      return expiry.combatNumber === (current ?? 0) + 1;
    }
    case "source": {
      const record = state.objects[expiry.ref.instanceId];
      if (!record) return false;
      return state.playerIds.some((playerId) => {
        const zones = state.containers.zonesByPlayerId[playerId];
        return (
          zones !== undefined &&
          [
            zones.arena,
            zones.heroZone,
            zones.weapon1,
            zones.weapon2,
            zones.head,
            zones.chest,
            zones.arms,
            zones.legs,
          ].some((zone) => zone.includes(expiry.ref.instanceId))
        );
      });
    }
  }
}

function emptyBindings() {
  return { objects: {}, numbers: {}, strings: {} } as const;
}
