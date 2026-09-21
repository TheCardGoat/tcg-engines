import {
  createEmptyFabZones,
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  type FabMatchState,
  type FabPlayerState,
  type FabZones,
} from "./state.ts";
import type { FabRulesStackLayer } from "./rules/layers.ts";
import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import type { FabRulesView } from "./rules/rules-view.ts";
import { buildFabRulesView } from "./rules/state-rules-view.ts";
import { projectFabViewerEffects, type FabViewerEffect } from "./viewer-effects.ts";
import { eligibleOptionalTriggerSources } from "./rules/optional-trigger-automation.ts";
import {
  fabPriorityWindowContext,
  fabPriorityWindowManualOnly,
  fabScopedAutoPassActive,
  type FabPriorityWindowContext,
} from "./rules/automation-verdict.ts";
import type { FabCounterRecord } from "./game/objects.ts";
import type {
  FabActivatedAbility,
  FabNumericProperty,
  FabSingleTriggerEventPattern,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import { projectFabViewerHeroSignals, type FabViewerHeroSignal } from "./viewer-hero-signals.ts";
import { reduceFabEventJournal } from "./kernel/event-journal.ts";
import {
  activationLimitUsageCount,
  effectiveActivationLimit,
} from "./procedures/activate-ability/helpers.ts";

export type { FabViewerHeroSignal } from "./viewer-hero-signals.ts";

/**
 * Viewer projection for Flesh and Blood (CR 3.0 visibility).
 *
 * - Deck: hidden from everyone including owner (CR 3.0.3a / 3.7.4)
 * - Hand, Arsenal: private to owner
 * - Pitch, Graveyard, Banished, Combat chain, Stack, Equipment: public
 */
export const FAB_FACE_DOWN = "face-down";

export type FabViewer =
  | { role: "player"; actorId: string }
  | { role: "spectator" }
  | { role: "replay" };

export interface FabViewerState {
  readonly playerIds: readonly string[];
  readonly players: Record<string, FabViewerPlayerState>;
  readonly firstTurnPlayerId: string;
  activePlayerId: string;
  priorityPlayerId: string | null;
  turnNumber: number;
  phase: FabMatchState["phase"];
  combat: FabViewerCombatState | null;
  rulesStack: readonly FabViewerRulesStackLayer[];
  /** Public, semantic effects that are currently armed or applying. */
  effects: readonly FabViewerEffect[];
  /** Public CR 3.0.14 topology; private top-cards redact child identities. */
  subcardsByHostId: Readonly<Record<string, readonly string[]>>;
  /** Stable active face identities for cards whose identity this viewer may inspect. */
  activeFaceIdsByInstanceId: Readonly<Record<string, readonly string[]>>;
  /** Viewer-safe identities of visible cards that are currently face-down. */
  faceDownInstanceIds: readonly string[];
  /** Public permanent/object state needed to render the physical table. */
  tappedInstanceIds?: readonly string[];
  /** Public rules counters keyed by the object they are physically on. */
  countersByInstanceId?: Readonly<Record<string, readonly FabCounterRecord[]>>;
  /**
   * Current evaluated numeric properties for cards this viewer can identify.
   * These values include continuous effects, so presentation must not
   * reimplement card conditions from printed text.
   */
  currentNumericByInstanceId?: Readonly<
    Record<string, Readonly<Partial<Record<FabNumericProperty, number>>>>
  >;
  /** Public remaining attack activations for arena weapons, keyed by physical object. */
  attackActivationsByInstanceId?: Readonly<Record<string, FabViewerAttackActivations>>;
  /**
   * Cards revealed this turn (CR 8.5.17) that presentation keeps inspectable
   * for the rest of the turn, validated against current zones. Public to
   * every viewer; empty once the turn ends (the turn ledger resets).
   * Optional so viewer states projected before this field existed still parse.
   */
  readonly turnReveals?: readonly FabViewerTurnReveal[];
  /** Owner-private source configuration; empty for spectators and replay. */
  readonly optionalTriggerAutomation: readonly {
    readonly sourceInstanceId: string;
    readonly mode: import("./state.ts").FabOptionalTriggerAutomationMode;
  }[];
  /**
   * Owner-private automation profile for the viewing seat. Null for spectators
   * and replay; a missing seat fails closed to the default profile.
   */
  readonly automation: import("./state.ts").FabAutomationPreferences | null;
  /**
   * Owner-private one-shot priority-hold arm for the viewing seat. True only
   * while the seat is armed; null for spectators and replay.
   */
  readonly priorityHoldArmed: boolean | null;
  /**
   * Owner-private one-shot auto-pass scope for the viewing seat while inside
   * its boundary ("this combat" / "the opponent's turn"); null when unarmed,
   * expired, for spectators, and for replay.
   */
  readonly scopedAutoPass: import("./state.ts").FabScopedAutoPassScope | null;
  /**
   * Engine-computed stop-points for the viewing seat's current window (the
   * {@link fabPriorityWindowManualOnly} doctrine). True windows must never be
   * closed by any automation — client countdown included. Null for
   * spectators and replay.
   */
  readonly priorityManualOnly: boolean | null;
  /** Rules-native meaning of this viewer's current priority window. */
  readonly priorityWindow: FabPriorityWindowContext | null;
  stateID: number;
  gameEnded: boolean;
  winnerId: string | null;
  endReason: string | null;
}

export interface FabViewerAttackActivations {
  readonly controllerId: string;
  readonly total: number;
  readonly used: number;
  readonly remaining: number;
}

/**
 * A card revealed this turn (CR 8.5.17) that presentation keeps inspectable
 * for the rest of the turn. Deck-edge entries are revalidated against the
 * current deck order on every projection — a revealed card that moved deeper
 * into the deck is dropped rather than disclosed; hand entries must still be
 * in their owner's hand.
 */
export type FabViewerTurnReveal =
  | {
      readonly kind: "deck-edge";
      readonly ownerId: string;
      readonly instanceId: string;
      readonly canonicalId: string | null;
      readonly position: "top" | "bottom";
    }
  | {
      readonly kind: "hand";
      readonly ownerId: string;
      readonly instanceId: string;
      readonly canonicalId: string | null;
    };

/**
 * Validate this turn's reveal ledger entries against current zone membership.
 * Only the deck's two edge positions can be presented without disclosing the
 * rest of the deck (CR 3.7.1), and a revealed hand card only stays inspectable
 * while it remains there.
 */
function projectTurnReveals(state: FabRulesSnapshot): readonly FabViewerTurnReveal[] {
  const reveals: FabViewerTurnReveal[] = [];
  const seen = new Set<string>();
  for (const playerId of state.playerIds) {
    const revealed = state.players[playerId]?.history.turn.revealedPrivateInstancesThisTurn ?? [];
    for (const entry of revealed) {
      if (seen.has(entry.instanceId)) continue;
      const ownerZones = state.containers.zonesByPlayerId[entry.ownerId];
      if (!ownerZones) continue;
      if (entry.zoneKind === "deck") {
        const position =
          ownerZones.deck.at(-1) === entry.instanceId
            ? "top"
            : ownerZones.deck[0] === entry.instanceId
              ? "bottom"
              : null;
        if (!position) continue;
        seen.add(entry.instanceId);
        reveals.push({
          kind: "deck-edge",
          ownerId: entry.ownerId,
          instanceId: entry.instanceId,
          canonicalId: state.objects[entry.instanceId]?.canonicalId ?? null,
          position,
        });
      } else {
        if (!ownerZones.hand.includes(entry.instanceId)) continue;
        seen.add(entry.instanceId);
        reveals.push({
          kind: "hand",
          ownerId: entry.ownerId,
          instanceId: entry.instanceId,
          canonicalId: state.objects[entry.instanceId]?.canonicalId ?? null,
        });
      }
    }
  }
  return reveals;
}

export type FabViewerCombatState = Omit<NonNullable<FabRulesSnapshot["combat"]>, "activeLink"> & {
  readonly activeLink: FabViewerChainLink | null;
  /** Public arena identities keyed by instanceId:incarnation after a target leaves play. */
  readonly departedTargetCardIds?: Readonly<Record<string, string>>;
};

export type FabViewerChainLink = NonNullable<
  NonNullable<FabRulesSnapshot["combat"]>["activeLink"]
> & {
  readonly attackPower: number;
  readonly keywords: readonly string[];
  /** CR 8.3.38a rules fact; not a keyword. */
  readonly melded: boolean;
};

export interface FabViewerRulesStackLayer {
  readonly layerId: string;
  readonly kind: FabRulesStackLayer["kind"];
  readonly controllerId: string;
  readonly sourceInstanceId: string;
  readonly sourceCanonicalId: string | null;
  readonly sourceName: string | null;
  readonly label: string;
  readonly playTiming: import("./rules/legality-quotes.ts").FabPlayTiming | null;
  readonly melded: boolean;
}

export interface FabViewerPlayerState {
  readonly playerId: string;
  heroCardId: string | null;
  life: number;
  actionPoints: number;
  resourcePoints: number;
  chiPoints: number;
  intellect: number;
  marked: boolean;
  /** Public, active-only facts that are signature conditions of this hero. */
  readonly heroSignals: readonly FabViewerHeroSignal[];
  zones: FabZones;
}

export interface FabViewerResources {
  readonly cardInstances: Readonly<Record<string, string>>;
  readonly cardDefinitions: Readonly<Record<string, FabRulesSnapshot["cardDefinitions"][string]>>;
}

type FabEvaluatedAttack = NonNullable<ReturnType<FabRulesView["combat"]>>["attack"] | null;

/** Viewer-safe identity map + the definitions needed to render it. */
export function projectFabViewerResources(
  state: FabRulesSnapshot,
  viewer: FabViewer,
): FabViewerResources {
  const presentationState = fabPaymentPresentationState(state);
  const visibleInstanceIds = new Set<string>();
  const visibleCanonicalIds = new Set<string>();
  for (const playerId of presentationState.playerIds) {
    const player = presentationState.players[playerId];
    if (!player) continue;
    if (player.heroCardId) visibleCanonicalIds.add(player.heroCardId);
    const zones = projectZones(
      presentationState,
      presentationState.containers.zonesByPlayerId[playerId]!,
      viewer.role === "player" && viewer.actorId === playerId,
    );
    for (const zone of Object.values(zones)) {
      for (const instanceId of zone) {
        if (instanceId !== FAB_FACE_DOWN) visibleInstanceIds.add(instanceId);
      }
    }
  }
  for (const subcardIds of Object.values(projectHostedCards(presentationState, viewer))) {
    for (const instanceId of subcardIds) {
      if (instanceId !== FAB_FACE_DOWN) visibleInstanceIds.add(instanceId);
    }
  }
  const cardInstances: Record<string, string> = {};
  for (const instanceId of visibleInstanceIds) {
    const canonicalId = presentationState.objects[instanceId]?.canonicalId;
    if (!canonicalId) continue;
    cardInstances[instanceId] = canonicalId;
    visibleCanonicalIds.add(canonicalId);
  }
  const cardDefinitions: Record<string, FabRulesSnapshot["cardDefinitions"][string]> = {};
  for (const canonicalId of Object.values(departedCombatTargetCardIds(presentationState))) {
    visibleCanonicalIds.add(canonicalId);
  }
  // A reconnecting viewer still needs artwork/text for known active effects
  // whose physical source has since moved into a private zone. Supply the
  // disclosed definition without adding a hidden instance to cardInstances.
  for (const effect of projectFabViewerEffects(presentationState, viewer)) {
    if (effect.source.canonicalId) visibleCanonicalIds.add(effect.source.canonicalId);
  }
  // Declared layers publicly identify their source (CR 3.15.1, 5.2.4b, 5.4.7b).
  // Keep that catalog identity after the live object leaves play — Flurry
  // destroys itself as the first resolution step while the rest of the layer
  // is still on the stack.
  for (const layer of presentationState.rulesStack) {
    if (layer.source.canonicalId) visibleCanonicalIds.add(layer.source.canonicalId);
  }
  // A card revealed this turn (CR 8.5.17) stays inspectable presentation-side
  // for the turn, wherever it moves afterwards — the reveal already made its
  // identity public. Disclose the definition without adding a hidden instance
  // to cardInstances, the same boundary as active-effect sources above.
  for (const playerId of presentationState.playerIds) {
    for (const entry of presentationState.players[playerId]?.history.turn
      .revealedPrivateInstancesThisTurn ?? []) {
      const canonicalId = presentationState.objects[entry.instanceId]?.canonicalId;
      if (canonicalId) visibleCanonicalIds.add(canonicalId);
    }
  }
  for (const [definitionKey, definition] of Object.entries(presentationState.cardDefinitions)) {
    if (visibleCanonicalIds.has(definitionKey) || visibleCanonicalIds.has(definition.canonicalId)) {
      cardDefinitions[definitionKey] = structuredClone(definition);
    }
  }
  return { cardInstances, cardDefinitions };
}

export function projectFabViewerState(state: FabRulesSnapshot, viewer: FabViewer): FabViewerState {
  const presentationState = fabPaymentPresentationState(state);
  const rulesView = buildFabRulesView(presentationState);
  const projectedPlayers: Record<string, FabViewerPlayerState> = {};
  for (const playerId of presentationState.playerIds) {
    const player = presentationState.players[playerId];
    if (!player) continue;
    const isSelf = viewer.role === "player" && viewer.actorId === playerId;
    projectedPlayers[playerId] = {
      playerId,
      heroCardId: player.heroCardId,
      life: player.life,
      actionPoints: player.actionPoints,
      resourcePoints: player.resourcePoints,
      chiPoints: player.chiPoints,
      intellect: player.intellect,
      marked: player.marked,
      heroSignals: projectFabViewerHeroSignals(presentationState, player),
      zones: projectZones(
        presentationState,
        presentationState.containers.zonesByPlayerId[playerId]!,
        isSelf,
      ),
    };
  }

  const publicObjectState = projectPublicObjectState(presentationState, projectedPlayers);
  const currentNumericByInstanceId = projectViewerNumericState(
    presentationState,
    projectedPlayers,
    rulesView,
  );
  const attackActivationsByInstanceId = projectWeaponAttackActivations(presentationState);
  return {
    playerIds: presentationState.playerIds,
    players: projectedPlayers,
    firstTurnPlayerId: presentationState.firstTurnPlayerId,
    activePlayerId: presentationState.activePlayerId,
    priorityPlayerId: presentationState.priority?.holderPlayerId ?? null,
    turnNumber: presentationState.turnNumber,
    phase: presentationState.phase,
    combat: projectCombat(presentationState, rulesView),
    rulesStack: presentationState.rulesStack.map(projectRulesStackLayer),
    effects: projectFabViewerEffects(presentationState, viewer),
    subcardsByHostId: projectHostedCards(presentationState, viewer),
    activeFaceIdsByInstanceId: projectActiveFaces(presentationState, projectedPlayers),
    faceDownInstanceIds: projectFaceDownInstances(presentationState, projectedPlayers),
    tappedInstanceIds: publicObjectState.tappedInstanceIds,
    countersByInstanceId: publicObjectState.countersByInstanceId,
    currentNumericByInstanceId,
    attackActivationsByInstanceId,
    turnReveals: projectTurnReveals(presentationState),
    optionalTriggerAutomation:
      viewer.role === "player"
        ? [
            ...new Set(
              eligibleOptionalTriggerSources(presentationState, viewer.actorId).map(
                (source) => source.source.instanceId,
              ),
            ),
          ].map((sourceInstanceId) => ({
            sourceInstanceId,
            mode:
              presentationState.optionalTriggerAutomation[viewer.actorId]?.[sourceInstanceId] ??
              "ask",
          }))
        : [],
    automation:
      viewer.role === "player"
        ? (presentationState.automationPreferences[viewer.actorId] ??
          FAB_DEFAULT_AUTOMATION_PREFERENCES)
        : null,
    priorityHoldArmed:
      viewer.role === "player"
        ? presentationState.priorityHoldArmed[viewer.actorId] === true
        : null,
    scopedAutoPass:
      viewer.role === "player" && fabScopedAutoPassActive(presentationState, viewer.actorId)
        ? ((
            presentationState.automationPreferences[viewer.actorId] ??
            FAB_DEFAULT_AUTOMATION_PREFERENCES
          ).scopedAutoPass ?? null)
        : null,
    priorityManualOnly:
      viewer.role === "player"
        ? fabPriorityWindowManualOnly(presentationState, viewer.actorId)
        : null,
    priorityWindow:
      viewer.role === "player" ? fabPriorityWindowContext(presentationState, viewer.actorId) : null,
    stateID: presentationState.stateID,
    gameEnded: presentationState.gameEnded,
    winnerId: presentationState.winnerId,
    endReason: presentationState.endReason,
  };
}

function projectWeaponAttackActivations(
  state: FabRulesSnapshot,
): Record<string, FabViewerAttackActivations> {
  const projected: Record<string, FabViewerAttackActivations> = {};
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    for (const instanceId of [...zones.weapon1, ...zones.weapon2]) {
      const object = state.objects[instanceId];
      const definition = object ? state.cardDefinitions[object.canonicalId] : undefined;
      if (!object || !definition) continue;
      const attackAbilities = definition.base.abilities.filter(isAttackActivatedAbility);
      if (attackAbilities.length !== 1) continue;
      const ability = attackAbilities[0]!;
      const total = effectiveActivationLimit({
        state,
        actorId: playerId,
        instanceId,
        incarnation: object.incarnation,
        ability,
      });
      if (total === null || !Number.isFinite(total)) continue;
      const used = activationLimitUsageCount({
        state,
        actorId: playerId,
        instanceId,
        incarnation: object.incarnation,
        ability,
      });
      projected[instanceId] = {
        controllerId: playerId,
        total,
        used,
        remaining: Math.max(0, total - used),
      };
    }
  }
  return projected;
}

function isAttackActivatedAbility(ability: FleshAndBloodAbility): ability is FabActivatedAbility {
  return (
    ability.kind === "activated" &&
    (ability.abilityType === "attack" || ability.effect.type === "attack-with")
  );
}

/**
 * A play journal stays reversible until every cost succeeds, but pitching is
 * still a physical, public action (CR 1.14.3). Project the successfully reduced
 * journal while the next one-at-a-time payment decision is open so every
 * viewer sees announced and pitched cards in their current zones without
 * publishing tentative state as authoritative.
 */
function fabPaymentPresentationState(state: FabRulesSnapshot): FabRulesSnapshot {
  const process = state.rulesProcess;
  const procedure = process?.procedure;
  if (
    state.decision?.kind !== "payment" ||
    process?.stage !== "procedure" ||
    (procedure?.kind !== "play-card" && procedure?.kind !== "activate") ||
    procedure.eventGroups.length === 0
  ) {
    return state;
  }
  const preview = reduceFabEventJournal(state, procedure.eventGroups);
  return preview.committed ? preview.state : state;
}

/**
 * Current properties are evaluated by the rules engine, then limited to the
 * identities the viewer already receives through their projected zones. This
 * keeps private opponent cards redacted while allowing a player to see the
 * actual values of conditional cards in hand or arsenal.
 */
function projectViewerNumericState(
  state: FabRulesSnapshot,
  players: Readonly<Record<string, FabViewerPlayerState>>,
  rulesView: FabRulesView,
): Readonly<Record<string, Readonly<Partial<Record<FabNumericProperty, number>>>>> {
  const visibleHandOwnerByInstanceId = new Map<string, string>();
  for (const player of Object.values(players)) {
    for (const instanceId of player.zones.hand) {
      if (instanceId !== FAB_FACE_DOWN)
        visibleHandOwnerByInstanceId.set(instanceId, player.playerId);
    }
  }
  const visibleIds = new Set(
    Object.values(players).flatMap((player) =>
      Object.values(player.zones).flatMap((ids) => ids.filter((id) => id !== FAB_FACE_DOWN)),
    ),
  );
  const values: Record<string, Readonly<Partial<Record<FabNumericProperty, number>>>> = {};
  for (const instanceId of visibleIds) {
    const object = state.objects[instanceId];
    if (!object) continue;
    const numeric = rulesView.object({ instanceId, incarnation: object.incarnation })?.current
      .numeric;
    const handOwnerId = visibleHandOwnerByInstanceId.get(instanceId);
    let payableHandCost: number | null = null;
    if (handOwnerId) {
      try {
        payableHandCost = rulesView.quotePlay({
          actorId: handOwnerId,
          instanceId,
          from: "hand",
        }).resourceCost;
      } catch {
        // Some incomplete authored play conditions intentionally fail loud.
        // A viewer projection must remain available and can safely retain the
        // evaluated object cost when no complete play quote can be produced.
      }
    }
    const projectedNumeric = {
      ...numeric,
      ...(payableHandCost !== null ? { cost: payableHandCost } : {}),
    };
    if (Object.keys(projectedNumeric).length > 0) values[instanceId] = projectedNumeric;
  }
  return values;
}

/**
 * Tapped state and counters are physical information on public objects. Keep
 * private and face-down objects out of this projection even if their owner can
 * identify the card through a private zone.
 */
function projectPublicObjectState(
  state: FabRulesSnapshot,
  players: Readonly<Record<string, FabViewerPlayerState>>,
): {
  readonly tappedInstanceIds: readonly string[];
  readonly countersByInstanceId: Readonly<Record<string, readonly FabCounterRecord[]>>;
} {
  const visibleIds = new Set(
    Object.values(players).flatMap((player) =>
      Object.values(player.zones).flatMap((ids) => ids.filter((id) => id !== FAB_FACE_DOWN)),
    ),
  );
  const tappedInstanceIds: string[] = [];
  const countersByInstanceId: Record<string, readonly FabCounterRecord[]> = {};
  for (const instanceId of visibleIds) {
    const object = state.objects[instanceId];
    if (
      !object ||
      object.visibility !== "public" ||
      object.markers.some((marker) => marker.kind === "face-down")
    ) {
      continue;
    }
    if (object.markers.some((marker) => marker.kind === "tapped")) {
      tappedInstanceIds.push(instanceId);
    }
    const counters = object.counters.filter((counter) => counter.kind !== "damage");
    if (counters.length > 0) countersByInstanceId[instanceId] = counters;
  }
  return { tappedInstanceIds, countersByInstanceId };
}

function projectFaceDownInstances(
  state: FabRulesSnapshot,
  players: Readonly<Record<string, FabViewerPlayerState>>,
): readonly string[] {
  const visibleIds = new Set(
    Object.values(players).flatMap((player) =>
      Object.values(player.zones).flatMap((ids) => ids.filter((id) => id !== FAB_FACE_DOWN)),
    ),
  );
  return [...visibleIds].filter((instanceId) =>
    state.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down"),
  );
}

function projectActiveFaces(
  state: FabRulesSnapshot,
  players: Readonly<Record<string, FabViewerPlayerState>>,
): Readonly<Record<string, readonly string[]>> {
  const visibleIds = new Set(
    Object.values(players).flatMap((player) =>
      Object.values(player.zones).flatMap((ids) => ids.filter((id) => id !== FAB_FACE_DOWN)),
    ),
  );
  const result: Record<string, readonly string[]> = {};
  for (const instanceId of visibleIds) {
    const activeFace = state.objects[instanceId]?.activeFace;
    if (activeFace?.kind === "paired") result[instanceId] = [...activeFace.activeFaceIds];
  }
  return result;
}

function projectHostedCards(
  state: FabRulesSnapshot,
  viewer: FabViewer,
): Readonly<Record<string, readonly string[]>> {
  const projected: Record<string, readonly string[]> = {};
  for (const [hostId, subcardIds] of Object.entries(state.containers.subcardsByHostId)) {
    if (hostId.startsWith("soul:")) {
      projected[hostId] = [...subcardIds];
      continue;
    }
    const host = state.objects[hostId];
    const canSee =
      host?.visibility === "public" ||
      (viewer.role === "player" && host?.ownerId === viewer.actorId);
    projected[hostId] = canSee ? [...subcardIds] : faceDownList(subcardIds.length);
  }
  return projected;
}

function departedCombatTargetCardIds(state: FabRulesSnapshot): Record<string, string> {
  const links = [state.combat?.activeLink, ...(state.combat?.closedLinks ?? [])];
  const identities: Record<string, string> = {};
  for (const link of links) {
    if (!link) continue;
    for (const target of [link.attackTargetRef, ...(link.additionalAttackTargetRefs ?? [])]) {
      if (target.kind !== "object") continue;
      const current = state.objects[target.ref.instanceId];
      if (current?.incarnation === target.ref.incarnation) continue;
      const previous = Object.values(state.lkiArena).find(
        (snapshot) =>
          snapshot.ref.instanceId === target.ref.instanceId &&
          snapshot.ref.incarnation === target.ref.incarnation &&
          snapshot.zone.zone === "arena",
      );
      if (previous) {
        identities[`${target.ref.instanceId}:${target.ref.incarnation}`] = previous.canonicalId;
      }
    }
  }
  return identities;
}

function projectCombat(state: FabRulesSnapshot, view: FabRulesView): FabViewerCombatState | null {
  const combat = state.combat;
  if (!combat) return null;
  const link = combat.activeLink;
  const departedTargetCardIds = departedCombatTargetCardIds(state);
  if (!link) return { ...structuredClone(combat), activeLink: null, departedTargetCardIds };
  const evaluatedCombat = view.combat();
  const attack = evaluatedCombat?.attack ?? null;
  const phantasmDestroyed = evaluatedCombat?.phantasmDestroyed ?? false;
  return {
    ...structuredClone(combat),
    departedTargetCardIds,
    activeLink: {
      ...structuredClone(link),
      attackPower: evaluatedCombat?.attackPower ?? 0,
      keywords: [
        ...(attack?.current.keywords.map((keyword) => keyword.name) ?? []),
        // A hit trigger on this attack is player-relevant combat information,
        // even though "on-hit" is not a printed FAB keyword. Read the
        // evaluated abilities so conditional and granted triggers only appear
        // after the rules engine has made them active.
        ...(hasActiveOnHitEffect(attack) ? ["on-hit"] : []),
        // CR 8.3.13: surface the derived phantasm destruction to viewers.
        ...(phantasmDestroyed ? ["phantasm-destroyed"] : []),
      ],
      melded:
        attack !== null && state.objects[attack.ref.instanceId]?.cardPropertyState.kind === "meld",
    },
  };
}

/** True when the current attack itself has an active trigger for its hit event. */
function hasActiveOnHitEffect(attack: FabEvaluatedAttack): boolean {
  return (
    attack?.current.abilities.some(
      (ability) =>
        ability.kind === "static" &&
        ability.staticKind === "triggered" &&
        (ability.trigger.kind === "event" || ability.trigger.kind === "event-and-state") &&
        triggerExpressionHasSourceAttackHit(ability.trigger.event),
    ) ?? false
  );
}

function triggerExpressionHasSourceAttackHit(
  event: Extract<
    Extract<
      NonNullable<FabEvaluatedAttack>["current"]["abilities"][number],
      { readonly kind: "static"; readonly staticKind: "triggered" }
    >["trigger"],
    { readonly kind: "event" | "event-and-state" }
  >["event"],
): boolean {
  return "patterns" in event ? event.patterns.some(isSourceAttackHit) : isSourceAttackHit(event);
}

function isSourceAttackHit(pattern: FabSingleTriggerEventPattern): boolean {
  return (
    pattern.name === "hit" &&
    pattern.observes.kind === "source" &&
    pattern.observes.selector === "attack"
  );
}

function projectRulesStackLayer(
  layer: FabRulesSnapshot["rulesStack"][number],
): FabViewerRulesStackLayer {
  const sourceName = layer.source.current.names.join(" // ") || null;
  const sourceLabel = sourceName ?? layer.source.canonicalId ?? layer.source.instanceId;
  switch (layer.kind) {
    case "card":
      return stackLayer(layer, sourceName, sourceLabel);
    case "activated":
      return stackLayer(layer, sourceName, `${sourceLabel} — ${layer.abilityId}`);
    case "triggered":
      const names =
        layer.trigger.kind === "state"
          ? []
          : "patterns" in layer.trigger.event
            ? layer.trigger.event.patterns.map((pattern) => pattern.name)
            : [layer.trigger.event.name];
      const triggerLabel = names.length > 0 ? `${names.join(" / ")} trigger` : "state trigger";
      return stackLayer(layer, sourceName, `${sourceLabel} — ${triggerLabel}`);
  }
}

function stackLayer(
  layer: FabRulesSnapshot["rulesStack"][number],
  sourceName: string | null,
  label: string,
): FabViewerRulesStackLayer {
  return {
    layerId: layer.layerId,
    kind: layer.kind,
    controllerId: layer.controllerId,
    sourceInstanceId: layer.source.instanceId,
    sourceCanonicalId: layer.source.canonicalId,
    sourceName,
    label,
    playTiming: layer.kind === "card" ? layer.playTiming : null,
    melded: layer.kind === "card" && layer.propertyState.kind === "meld",
  };
}

function projectZones(
  state: FabRulesSnapshot,
  zones: FabRulesSnapshot["containers"]["zonesByPlayerId"][string],
  isSelf: boolean,
): FabZones {
  return {
    deck: faceDownList(zones.deck.length),
    hand: isSelf ? zones.hand.slice() : faceDownList(zones.hand.length),
    arsenal: isSelf ? zones.arsenal.slice() : faceDownList(zones.arsenal.length),
    pitch: zones.pitch.slice(),
    graveyard: zones.graveyard.slice(),
    // CR 3.0.8: a face-down card in a public zone is private information.
    // Its owner can identify it, while every other viewer receives only a
    // positional placeholder (the same privacy boundary as hand/arsenal).
    banished: zones.banished.map((instanceId) =>
      isSelf || !state.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down")
        ? instanceId
        : FAB_FACE_DOWN,
    ),
    // CR 8.5.29: soul is a public zone (charged cards are visible to all).
    soul: zones.soul.slice(),
    // CR 4.1.6: inventory is private to its owner (Taylor / Librarian).
    inventory: isSelf ? zones.inventory.slice() : faceDownList(zones.inventory.length),
    under: zones.under.slice(),
    combatChain: zones.combatChain.slice(),
    stack: zones.stack.slice(),
    arena: zones.arena.slice(),
    head: zones.head.slice(),
    chest: zones.chest.slice(),
    arms: zones.arms.slice(),
    legs: zones.legs.slice(),
    weapon1: zones.weapon1.slice(),
    weapon2: zones.weapon2.slice(),
    heroZone: zones.heroZone.slice(),
  };
}

function faceDownList(length: number): string[] {
  return Array.from({ length }, () => FAB_FACE_DOWN);
}

export { createEmptyFabZones };
export type { FabPlayerState };
