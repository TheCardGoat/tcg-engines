import { banishedObjectForRules } from "../../banish-observation.ts";
import {
  reloadEffect,
  type FabCondition,
  type FabEffect,
  type FabModalAbility,
  type FabResolutionAbility,
  type FleshAndBloodAbility,
  type FabZone,
} from "@tcg/flesh-and-blood-types";
import { FAB_ZONE_KINDS, type FabMatchState, type FabZoneKind } from "../../../state.ts";
import { withoutFabScopedAutoPass } from "../../../state.ts";
import type { FabObjectSnapshot, ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { nextFabDestinationRef, snapshotObject, snapshotPlayerId } from "../../snapshots.ts";
import type { FabObjectRef } from "../../continuous/ir.ts";
import {
  engineZone,
  engineZoneOrSelf,
  internMoveLki,
  isArenaZone,
  moveKnownObject,
} from "../shared.ts";
export { isArenaZone } from "../shared.ts";
import { closeFabPriority, openFabPriority } from "../../../priority.ts";
import { fabCombatDamageResolved } from "../../../game/combat.ts";
import { fabObjectInstanceId, type FabObjectInstanceId } from "../../../game/identity.ts";
import { clearFabHostedDescendants } from "../../hosted-card-transitions.ts";

export type ZoneMoveEventName =
  | "announce-card"
  | "play"
  | "move-zone"
  | "enter-arena"
  | "leave-arena"
  | "enter-or-leave-arena"
  | "put-into-graveyard"
  | "banish"
  | "destroy"
  | "dies"
  | "search"
  | "shuffle-zone"
  | "create"
  | "discard"
  | "draw"
  | "reveal"
  | "look"
  | "opt"
  | "random-token-request"
  | "roll-request"
  | "equip";

export type ZoneMoveEvent = Extract<ProposedEvent, { name: ZoneMoveEventName }>;

// --- Zone-move domain helpers ---

export type FabPrimaryZoneEvent = Extract<
  ProposedEvent,
  { readonly name: "banish" | "destroy" | "dies" | "move-zone" }
>;

/**
 * CR 8.1.8a / CR 3.0.12a: tokens only exist in the arena. A token that leaves
 * the arena ceases to exist — it does not enter the graveyard or banished zone.
 */
export function isTokenObject(_state: Readonly<FabMatchState>, object: FabObjectSnapshot): boolean {
  return object.objectKind === "created-token";
}

/**
 * Cease a token's existence: remove from its current zone, delete from
 * `state.objects`, and do not push into graveyard/banished (CR 8.1.8a /
 * 3.0.12a). A living token still dies as it ceases (CR 2.5.3g / 8.2.8a).
 */
export function ceaseTokenExistence(
  state: FabMatchState,
  event: FabPrimaryZoneEvent,
): FabEventReduction {
  const object = event.data.object;
  if (state.containers.subcardsByHostId[object.instanceId])
    clearFabHostedDescendants(state, fabObjectInstanceId(object.ref.instanceId));
  const activeAttackCeasedBeforeDamage =
    state.combat?.activeLink?.activeAttack.sourceObjectId === object.instanceId &&
    !fabCombatDamageResolved(state.combat.activeLink);
  const playerId = object.zoneRef.playerId ?? object.controllerId ?? object.ownerId;
  const player = state.players[playerId];
  if (player) {
    for (const zone of Object.values(state.containers.zonesByPlayerId[playerId]!)) {
      const idx = zone.indexOf(object.instanceId);
      if (idx >= 0) {
        zone.splice(idx, 1);
        break;
      }
    }
  }
  ceaseStackedAttackProxiesForSource(state, object);
  internMoveLki(state, object, object.canonicalId ?? object.instanceId);
  delete state.objects[object.instanceId];
  // CR 7.7.2c: when the active attack ceases before damage is calculated and
  // no queued attack remains, Close begins as a game-state action. Tokens do
  // not move to a destination zone, so this must be stamped on the cease path.
  if (activeAttackCeasedBeforeDamage && state.combat) {
    state.combat.step = "close";
    closeFabPriority(state);
    // CR 7.7.3: forcing Close clears leftover attacks, attack-layers, and
    // reactions from the stack and queue.
    clearStackedCombatLayers(state);
  }
  const bindings = { ...event.bindings, resultingEvent: true };
  const transition = {
    before: object,
    after: null,
    identity: "ceased" as const,
  };
  const followUpEvents: ProposedEvent[] = [];
  // CR 2.5.3g / 8.2.8a: ceasing from the arena is dying for a living object.
  // Observation uses the pre-cease snapshot (CR 5.4.6a LKI).
  if (livingObjectDiesOnCease(object) && event.name !== "dies") {
    followUpEvents.push({
      ...event,
      name: "dies",
      bindings,
      data: { ...event.data, transition, reason: "die" },
    });
  }
  followUpEvents.push(
    {
      ...event,
      name: "leave-arena",
      bindings,
      data: { ...event.data, transition, reason: "leave-arena" },
    },
    {
      ...event,
      name: "enter-or-leave-arena",
      bindings,
      data: { ...event.data, transition, reason: "leave-arena" },
    },
  );
  return { state, followUpEvents };
}

/** CR 2.5.3g / 8.2.8a: Allies and other living objects die when they cease. */
function livingObjectDiesOnCease(object: FabObjectSnapshot): boolean {
  if (object.current.keywords.some((keyword) => keyword.name === "incarnate")) return false;
  return (
    object.current.typeBox.subtypes.includes("Ally") || object.current.numeric.life !== undefined
  );
}

/**
 * CR 8.3.21b Ephemeral cease: a card that would be put into a graveyard from
 * anywhere instead ceases to exist — removed from the game with no further
 * interaction (no graveyard event, no leave-arena triggers).
 */
export function ceaseEphemeralCard(
  state: FabMatchState,
  object: FabObjectSnapshot,
): FabEventReduction {
  if (state.containers.subcardsByHostId[object.instanceId])
    clearFabHostedDescendants(state, fabObjectInstanceId(object.ref.instanceId));
  const playerId = object.zoneRef.playerId ?? object.controllerId ?? object.ownerId;
  const player = playerId ? state.players[playerId] : undefined;
  if (player) {
    for (const zone of Object.values(state.containers.zonesByPlayerId[playerId]!)) {
      const idx = zone.indexOf(object.instanceId);
      if (idx >= 0) {
        zone.splice(idx, 1);
        break;
      }
    }
  }
  ceaseStackedAttackProxiesForSource(state, object);
  internMoveLki(state, object, object.canonicalId ?? object.instanceId);
  delete state.objects[object.instanceId];
  return { state };
}

/**
 * CR 1.5.1–1.5.3 Macro cease: Macros are not cards, tokens, or permanents.
 * When a Macro leaves the arena it ceases to exist — removed from the game
 * with no graveyard routing or leave-arena/enter-or-leave-arena triggers.
 */
export function ceaseMacroExistence(
  state: FabMatchState,
  object: FabObjectSnapshot,
): FabEventReduction {
  if (state.containers.subcardsByHostId[object.instanceId])
    clearFabHostedDescendants(state, fabObjectInstanceId(object.ref.instanceId));
  const playerId = object.zoneRef.playerId ?? object.controllerId ?? object.ownerId;
  const player = playerId ? state.players[playerId] : undefined;
  if (player) {
    for (const zone of Object.values(state.containers.zonesByPlayerId[playerId]!)) {
      const idx = zone.indexOf(object.instanceId);
      if (idx >= 0) {
        zone.splice(idx, 1);
        break;
      }
    }
  }
  ceaseStackedAttackProxiesForSource(state, object);
  internMoveLki(state, object, object.canonicalId ?? object.instanceId);
  delete state.objects[object.instanceId];
  return { state };
}

/** Whether an object carries a macro marker (CR 1.5.1–1.5.3). */
export function isMacroObject(object: FabObjectSnapshot): boolean {
  return object.objectKind === "macro";
}

/** Whether an object carries a keyword (printed on the definition or granted live). */
export function objectHasKeyword(
  state: FabMatchState,
  object: FabObjectSnapshot,
  keywordName: string,
): boolean {
  const canonicalId = object.canonicalId;
  if (canonicalId !== null) {
    const def = state.cardDefinitions[canonicalId];
    const printed = def?.base.keywords ?? [];
    if (printed.some((keyword) => keyword.name === keywordName)) {
      return true;
    }
  }
  return object.current.keywords.some((keyword) => keyword.name === keywordName);
}

export function resultingZoneEvents(
  state: Readonly<FabMatchState>,
  event: FabPrimaryZoneEvent,
): readonly ProposedEvent[] {
  const events: ProposedEvent[] = [];
  const bindings = { ...event.bindings, resultingEvent: true };
  const destination = destinationZone(event.data);
  const live = state.objects[event.data.object.instanceId];
  const after =
    live && destination
      ? snapshotObject(
          state,
          event.data.object.instanceId,
          event.data.destinationPlayerId ??
            event.data.object.controllerId ??
            event.data.object.ownerId,
          destination,
        )
      : null;
  const transition = {
    before: event.data.object,
    after,
    identity:
      after === null
        ? ("ceased" as const)
        : after.ref.incarnation === event.data.object.ref.incarnation
          ? ("preserved" as const)
          : ("reset" as const),
  };
  // CR 1.9.1b: a destroy-reason zone clear is observed as a destroy event so
  // "when this is destroyed" triggers (Halo of Lumina, etc.) match. Destination
  // may be banished when a put-into-graveyard replacement rewrote the zone
  // (Frankie, Mark of the Beast, etc.).
  if (
    event.name !== "destroy" &&
    event.data.reason === "destroy" &&
    (event.data.to === "graveyard" || event.data.to === "banished")
  ) {
    events.push({
      ...event,
      name: "destroy",
      bindings,
      data: { ...event.data, transition, reason: "destroy" },
    });
  }
  // CR 8.5.1: banish is the instruction "move the object to its owner's
  // banished zone". Emitters whose printed effect IS a banish but whose
  // pipeline name differs (choose-same-name-group CRU027, "instead, banish
  // it" replacement rewrites) carry reason "banish" — derive the canonical
  // observation event so printed "whenever a card is banished" triggers,
  // contract progress (contract-progress.ts), and the kernel banish-color
  // stamps see one name. CR 8.5.1a: moves into the banished zone made by a
  // non-banish instruction (reason "move"/"give"/"steal") are NOT banishing
  // and derive nothing; CR 8.5.1b is the converse (a banish rewrote elsewhere
  // is still a banish) and needs no derivation here.
  if (event.name !== "banish" && event.data.to === "banished" && event.data.reason === "banish") {
    events.push({
      ...event,
      name: "banish",
      bindings,
      data: { ...event.data, transition, reason: "banish" },
    });
  }
  if (
    event.name !== "dies" &&
    isArenaZone(event.data.from) &&
    !isArenaZone(event.data.to) &&
    !event.data.object.current.keywords.some((keyword) => keyword.name === "incarnate") &&
    (event.data.object.current.typeBox.subtypes.includes("Ally") ||
      event.data.object.current.numeric.life !== undefined)
  ) {
    events.push({
      ...event,
      name: "dies",
      bindings,
      data: { ...event.data, transition, reason: "die" },
    });
  }
  // Equipment/permanents that defended are modeled on the combat chain while
  // still "in the arena" for CR purposes. Blade Break / destroy then moves
  // combat-chain → GY; that must still fire leave-arena so "when this leaves
  // the arena" triggers (PEN107 Shroud of the Fate Watcher → Sigil of Fate).
  // Attack action cards on the chain are in the arena (CR 3.0.5 / 7.0.3f);
  // chain-close to GY still fires leave-arena (Shimmering Specter).
  if (shouldEmitLeaveArena(event)) {
    events.push({
      ...event,
      name: "leave-arena",
      bindings,
      data: { ...event.data, transition, reason: "leave-arena" },
    });
    events.push({
      ...event,
      name: "enter-or-leave-arena",
      bindings,
      data: { ...event.data, transition, reason: "leave-arena" },
    });
  }
  if (!isArenaZone(event.data.from) && isArenaZone(event.data.to) && after) {
    events.push({
      ...event,
      name: "enter-arena",
      affected: [after],
      bindings,
      data: { ...event.data, object: after, transition, reason: "move" },
    });
    events.push({
      ...event,
      name: "enter-or-leave-arena",
      affected: [after],
      bindings,
      data: { ...event.data, object: after, transition, reason: "move" },
    });
  }
  if (event.data.to === "graveyard") {
    events.push({
      ...event,
      name: "put-into-graveyard",
      bindings,
      data: { ...event.data, transition, reason: "put-into-graveyard" },
    });
  }
  return events;
}

/**
 * True when a zone ref is an arena permanent seat. Accepts both catalog
 * vocabulary (equipment-head, permanent, weapon) and engine seats (head,
 * weapon1) because event.data.from is not always normalized to catalog form.
 */
/**
 * CR 3.0.5: leave-arena only when the object leaves the arena collection.
 * Intra-arena moves (permanent ↔ combat chain, equipment defending) stay in
 * the arena. Attack-action cards on the chain are in the arena; chain-close
 * to GY/banished is leave-arena, same as defending equipment.
 */
function shouldEmitLeaveArena(event: FabPrimaryZoneEvent): boolean {
  if (isArenaZone(event.data.to)) return false;
  const from = event.data.from;
  if (from === "combat-chain") {
    return isArenaPermanentLeavingCombatChain(event);
  }
  return isArenaZone(from);
}

/**
 * Objects on the combat chain that leave into GY/banished leave the arena
 * (CR 3.0.5). That includes defending equipment, tokens, and attack cards.
 */
function isArenaPermanentLeavingCombatChain(event: FabPrimaryZoneEvent): boolean {
  if (event.data.from !== "combat-chain") return false;
  return event.data.to === "graveyard" || event.data.to === "banished";
}

export function objectIsInZone(
  state: Readonly<FabMatchState>,
  data: {
    readonly object: FabObjectSnapshot;
    readonly to: FabZone | "arena" | "unknown";
    readonly equipmentSlot?: "weapon1" | "weapon2";
  },
): boolean {
  const zone = destinationZone(data);
  return (
    zone !== null &&
    (state.containers.zonesByPlayerId[
      data.object.zoneRef.playerId ?? data.object.controllerId ?? data.object.ownerId
    ]![zone].includes(data.object.instanceId) ??
      false)
  );
}

export function moveForZoneEvent(
  state: FabMatchState,
  data: {
    readonly object: FabObjectSnapshot;
    readonly destinationRef: FabObjectRef | null;
    readonly from: FabZone | "arena" | "unknown";
    readonly to: FabZone | "arena" | "unknown";
    readonly position?: "top" | "bottom" | { readonly index: number };
    readonly equipmentSlot?: "weapon1" | "weapon2";
    readonly destinationPlayerId?: string;
    readonly destinationHostId?: FabObjectInstanceId | null;
  },
  destroysActiveAttack = false,
): boolean {
  // Snapshots store catalog zones (`weapon`, `equipment-arms`) while the live
  // seat is engine-side (`weapon1`, `arms`). Prefer zoneRef when present so
  // effect destroy of weapons (Danger Digits / Throw Dagger) actually moves.
  const zoneRefSeat = data.object.zoneRef?.zone;
  const fromSeat: FabZoneKind | null =
    zoneRefSeat && (FAB_ZONE_KINDS as readonly string[]).includes(zoneRefSeat)
      ? (zoneRefSeat as FabZoneKind)
      : null;
  const fromCatalog =
    data.from === "unknown" ? null : engineZoneOrSelf(data.from === "arena" ? "arena" : data.from);
  // A proposed move is not allowed to overwrite its declared origin with an
  // unrelated snapshot zone. Keep engine-seat fidelity for arena/equipment
  // objects, but reject an explicit ordinary-zone mismatch (for example an
  // event claiming graveyard → banished for a card still in hand).
  if (fromCatalog && data.from !== "arena" && fromSeat && fromSeat !== fromCatalog) {
    return false;
  }
  const from: FabZoneKind | null = fromSeat ?? fromCatalog;
  const to = destinationZone(data);
  if (!from || !to) return false;
  // A proposed move carries both the source zone and an LKI zone reference.
  // They must agree unless the catalog source is an aggregate arena zone. A
  // weapon snapshot deliberately reports `weapon`, which has no single engine
  // seat; its zoneRef preserves whether it is in weapon1 or weapon2.
  if (
    fromSeat !== null &&
    fromCatalog !== null &&
    data.from !== "unknown" &&
    data.from !== "arena" &&
    fromCatalog !== null &&
    fromCatalog !== "arena" &&
    fromSeat !== fromCatalog
  ) {
    return false;
  }
  const activeAttackDestroyedBeforeDamage =
    destroysActiveAttack &&
    state.combat?.activeLink?.activeAttack.sourceObjectId === data.object.instanceId &&
    !fabCombatDamageResolved(state.combat.activeLink);
  // CR 3.4.2 / 3.8.2: banished and graveyard zones can contain only their
  // owner's cards. This matters when a controlled-but-not-owned permanent
  // leaves the arena; an explicit destination still wins for replacement
  // effects that redirect the move.
  const destinationPlayerId =
    data.destinationPlayerId ??
    (to === "banished" || to === "graveyard" ? data.object.ownerId : undefined);
  const moved = moveKnownObject(
    state,
    data.object,
    from,
    to,
    data.destinationRef,
    data.position,
    destinationPlayerId,
    data.destinationHostId ?? null,
  );
  if (moved && data.destinationRef !== null) {
    ceaseStackedAttackProxiesForSource(state, data.object);
  }
  if (
    moved &&
    data.destinationRef !== null &&
    state.containers.subcardsByHostId[data.object.instanceId]
  )
    clearFabHostedDescendants(state, fabObjectInstanceId(data.object.ref.instanceId));
  if (moved && to === "banished") {
    noteBanishedPower6(state, banishedObjectForRules(data));
  }
  if (moved && to === "soul") {
    noteCardPutIntoSoul(state, data.object, data.destinationPlayerId);
    noteHeraldPutIntoSoul(state, data.object, data.destinationPlayerId);
  }
  // CR 7.7.2c / 8.3.13: destroying the active attack before damage begins
  // makes the chain link proceed directly to Resolution/Close. Keep this on the generic
  // destroy transition so keyword triggers and ordinary card effects share
  // the same lifecycle rule.
  if (moved && activeAttackDestroyedBeforeDamage && state.combat) {
    state.combat.step = "resolution";
    openFabPriority(state, state.activePlayerId, "combat", "resolution");
  }
  return moved;
}

/**
 * CR 1.4.3c: a stacked attack-proxy ceases to exist when its attack-source
 * ceases to exist. Activated attack-layers remain independent of their source
 * (CR 1.7.1a), so only layers explicitly identified as proxies are removed.
 */
function ceaseStackedAttackProxiesForSource(state: FabMatchState, source: FabObjectSnapshot): void {
  // Once the Attack Step has begun, the proxy and its source have already
  // moved onto the active chain link (CR 7.2.2b). The resolving layer may
  // remain in rulesStack briefly as transaction bookkeeping, but it is no
  // longer a stacked proxy governed by the first condition in CR 1.4.3c.
  if (state.combat?.step !== "layer" || state.combat.activeLink) return;

  state.rulesStack = state.rulesStack.filter(
    (layer) =>
      !(
        layer.kind === "activated" &&
        layer.role === "attack" &&
        layer.attackKind === "proxy" &&
        layer.source.ref.instanceId === source.ref.instanceId &&
        layer.source.ref.incarnation === source.ref.incarnation
      ),
  );
  if (state.combat?.step === "layer" && !state.combat.activeLink && state.rulesStack.length === 0) {
    state.combat = null;
    // An aborted layer-step chain is still a chain close: retire "this
    // combat" auto-pass scopes with it.
    state.automationPreferences = withoutFabScopedAutoPass(state.automationPreferences, "combat");
  }
}

/**
 * Levia / residual "if you've banished a card with 6 or more {p} this turn":
 * stamp the turn history when a power-6+ card enters the banished zone.
 * Power is read from the pre-move snapshot (LKI) so zone resets cannot erase it.
 */
/** CR 7.7.3: Close clears leftover attacks, attack-layers, and reactions. */
export function clearStackedCombatLayers(state: FabMatchState): void {
  const leftover = state.rulesStack.filter((layer) => {
    if (layer.kind === "card") {
      return (
        layer.role === "attack" ||
        layer.role === "attack-reaction" ||
        layer.role === "defense-reaction"
      );
    }
    return layer.kind === "activated" && layer.role === "attack";
  });
  if (leftover.length === 0) return;
  const leftoverIds = new Set(leftover.map((layer) => layer.layerId));
  for (const layer of leftover) {
    const instanceId = layer.source.instanceId;
    const playerId = snapshotPlayerId(layer.source);
    const onStack = state.containers.zonesByPlayerId[playerId]?.stack.includes(instanceId) === true;
    if (!onStack) continue;
    const object = snapshotObject(state, instanceId, playerId, "stack");
    moveKnownObject(state, object, "stack", "graveyard", nextFabDestinationRef(state, object));
  }
  state.rulesStack = state.rulesStack.filter((layer) => !leftoverIds.has(layer.layerId));
}

export function noteBanishedPower6(state: FabMatchState, object: FabObjectSnapshot): void {
  const power = object.current.numeric.power;
  if (power === undefined || power < 6) return;
  const playerId = snapshotPlayerId(object);
  const player = state.players[playerId];
  if (!player) return;
  player.history.turn.banishedPower6 = true;
}

/**
 * Vestige of Sol family: "If a card has been put into your hero's soul this
 * turn…". Stamp for the soul destination seat on any move into soul.
 */
export function noteCardPutIntoSoul(
  state: FabMatchState,
  object: FabObjectSnapshot,
  destinationPlayerId?: string,
): void {
  const playerId =
    destinationPlayerId ?? object.controllerId ?? object.ownerId ?? snapshotPlayerId(object);
  if (!playerId) return;
  const player = state.players[playerId];
  if (!player) return;
  player.history.turn.cardPutIntoSoulThisTurn = true;
  const color = object.current.color ?? object.base.color;
  if (color === "yellow") {
    player.history.turn.yellowCardPutIntoSoulThisTurn = true;
  }
}

/**
 * Empyrean Rapture / Herald-soul family: "If a card with Herald in its name
 * has been put into your hero's soul during your turn…". Stamp only when the
 * soul owner is the turn player (printed "during your turn") and the card's
 * name/moniker includes Herald (slug-derived when catalog base.name is null).
 */
export function noteHeraldPutIntoSoul(
  state: FabMatchState,
  object: FabObjectSnapshot,
  destinationPlayerId?: string,
): void {
  const playerId =
    destinationPlayerId ?? object.controllerId ?? object.ownerId ?? snapshotPlayerId(object);
  if (!playerId || state.activePlayerId !== playerId) return;
  const player = state.players[playerId];
  if (!player) return;
  const names =
    object.current.names.length > 0
      ? object.current.names
      : object.base.names.length > 0
        ? object.base.names
        : [nameFromCanonicalIdentity(object.canonicalId) ?? ""];
  if (!names.some((name) => normalizeNameToken(name).includes("herald"))) return;
  player.history.turn.heraldPutIntoSoulThisTurn = true;
}

function normalizeNameToken(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}

function nameFromCanonicalIdentity(canonicalId: string | null | undefined): string | null {
  if (!canonicalId) return null;
  const slug = canonicalId.startsWith("token:")
    ? canonicalId.slice("token:".length)
    : canonicalId.includes("-")
      ? canonicalId
      : null;
  if (!slug) return null;
  const parts = slug.split("-").filter((part) => !["red", "yellow", "blue"].includes(part));
  if (parts.length === 0) return null;
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function destinationZone(data: {
  readonly to: FabZone | "arena" | "unknown";
  readonly equipmentSlot?: "weapon1" | "weapon2";
}): FabZoneKind | null {
  if (data.to !== "weapon") return engineZone(data.to);
  return data.equipmentSlot ?? null;
}

/**
 * Seed keyword-defined counters when a permanent enters the arena during
 * gameplay. Three sources drive seeding:
 *
 * 1. Keywords whose counter quantity is intrinsic (`suspense` → 2 suspense counters).
 * 2. Replacement effects on the definition's static abilities that modify
 *    `enter-arena` with `add-counter` modifications (e.g. Zen State's
 *    "enters with a balance counter", Golden Cog's "enters with a steam
 *    counter").
 * 3. Slug-based supplementary seeding for tokens whose catalog definition
 *    lacks a declarative field (Hyper Driver enters with 1 steam counter).
 */
export function seedEnterArenaKeywordState(
  state: FabMatchState,
  instanceId: string,
): readonly { readonly kind: "named"; readonly name: string; readonly count: number }[] {
  const object = state.objects[instanceId];
  if (!object) return [];
  // Keyword names from the live object snapshot (base properties), not
  // cardDefinitions registry field access (direct-property-access boundary).
  let controllerId = object.ownerId;
  for (const playerId of state.playerIds) {
    if (state.containers.zonesByPlayerId[playerId]?.arena.includes(instanceId)) {
      controllerId = playerId;
      break;
    }
  }
  const snapshot = snapshotObject(state, instanceId, controllerId, "arena");
  const keywordNames = new Set(snapshot.current.keywords.map((k) => k.name));
  const has = (name: string) => keywordNames.has(name as never);
  // Incarnate: mark the permanent as awakened when it enters via incarnate.
  if (has("incarnate") && !object.markers.some((m) => m.kind === "awakened")) {
    state.objects[instanceId] = {
      ...object,
      markers: [...object.markers, { kind: "awakened" }],
    };
  }
  // Re-read after possible awakened marker write.
  const current = state.objects[instanceId]!;
  const additions: { kind: "named"; name: string; count: number }[] = [];
  const existing = (name: string) =>
    current.counters.some((c) => c.kind === "named" && c.name === name && c.count > 0) ||
    additions.some((c) => c.name === name && c.count > 0);
  if (has("suspense") && !existing("suspense"))
    additions.push({ kind: "named", name: "suspense", count: 2 });
  // Scan static abilities for replacement effects that seed counters on
  // enter-arena (Zen State balance, Golden Cog steam, etc.).
  for (const ability of snapshot.base.abilities) {
    if (ability.kind !== "static" || ability.staticKind !== "continuous") continue;
    const effect = ability.effect;
    if (!effect || effect.type !== "replacement") continue;
    if (effect.replaces?.name !== "enter-arena") continue;
    const mod = effect.modification;
    if (!mod || mod.type !== "add-counter") continue;
    const counterName = mod.counter?.kind === "named" ? mod.counter.name : null;
    if (!counterName || existing(counterName)) continue;
    const count = typeof mod.count === "number" ? mod.count : 1;
    additions.push({ kind: "named", name: counterName, count });
  }

  if (additions.length === 0) return [];
  state.objects[instanceId] = {
    ...current,
    counters: [...current.counters, ...additions],
  };
  return additions;
}

/** Resolution abilities that generate effects when the card/layer resolves. */
export function isResolvingResolutionAbility(
  ability: FleshAndBloodAbility,
): ability is FabResolutionAbility | FabModalAbility {
  return ability.kind === "resolution" || ability.kind === "modal";
}

export function resolutionEffects(
  ability: FabResolutionAbility | FabModalAbility,
  selectedModeIds: readonly string[],
): FabEffect[] {
  const wrapCondition = (condition: FabCondition | undefined, effect: FabEffect): FabEffect =>
    condition ? { type: "conditional", condition, then: effect } : effect;
  const effects: FabEffect[] = [];

  if (ability.effect) {
    effects.push(wrapCondition(ability.condition, ability.effect));
  }
  if ("modal" in ability) {
    // Repeatable modes (CR 1.7.5 allowRepeat) apply once per declared pick,
    // not once per unique mode id — Blood on Her Hands "choose each mode twice".
    for (const modeId of selectedModeIds) {
      const mode = ability.modes.find((candidate) => candidate.id === modeId);
      if (!mode) continue;
      effects.push(wrapCondition(ability.condition, wrapCondition(mode.condition, mode.effect)));
    }
  }

  return effects;
}

/** CR 8.5.23: optional "you may put a hand card into empty arsenal face-down". */
export function reloadResolutionEffect(): FabEffect {
  return reloadEffect();
}

/** True when the layer effects already include an Opt leaf (CR 8.5.22). */
export function resolutionLayerHasOpt(effects: readonly FabEffect[]): boolean {
  const visit = (node: unknown): boolean => {
    if (!node || typeof node !== "object") return false;
    const effect = node as Record<string, unknown>;
    if (effect.type === "opt") return true;
    if (Array.isArray(effect.steps) && effect.steps.some((step) => visit(step))) return true;
    if (effect.effect && visit(effect.effect)) return true;
    if (effect.then && visit(effect.then)) return true;
    if (effect.else && visit(effect.else)) return true;
    if (Array.isArray(effect.modes)) {
      for (const mode of effect.modes) {
        if (mode && typeof mode === "object" && "effect" in mode && visit(mode.effect)) {
          return true;
        }
      }
    }
    return false;
  };
  return effects.some((effect) => visit(effect));
}

/**
 * Expand printed ability keywords that are pure resolution effects into layer
 * effects. Go-again is handled separately as an observation event; opt is a
 * partition + opt event (CR 8.5.22).
 *
 * `authoredEffects` are the resolving ability AST. Opt N, then X cards author
 * the opt leaf so it precedes the follow-up; the keyword stays metadata.
 * Synthesizing another trailing opt would run Opt twice (Blood Tribute).
 * Fate Foreseen-style keyword-only Opt still synthesizes when the AST has none.
 */
export function keywordEffectsFromPrintedKeywords(
  keywords: readonly { readonly name: string; readonly value?: unknown }[],
  authoredEffects: readonly FabEffect[] = [],
): FabEffect[] {
  const skipOpt = resolutionLayerHasOpt(authoredEffects);
  const effects: FabEffect[] = [];
  for (const keyword of keywords) {
    if (keyword.name === "opt" && typeof keyword.value === "number" && !skipOpt) {
      effects.push({ type: "opt", count: keyword.value });
    }
    // Sharpen cards carry their target and effect in the authored resolution
    // AST. The keyword remains metadata; synthesizing another effect here
    // would sharpen twice for every real printed card.
    // CR 8.5.23 Reload is an optional discrete effect. Offer it only when
    // arsenal is empty and the hand still has a card; the player may decline.
    // Accepting moves the chosen hand card into arsenal face-down.
    if (keyword.name === "reload") {
      effects.push(reloadResolutionEffect());
    }
  }
  return effects;
}

export function assertNeverZoneMove(event: never): never {
  throw new Error(`Unhandled FAB zone-move event: ${JSON.stringify(event)}`);
}
