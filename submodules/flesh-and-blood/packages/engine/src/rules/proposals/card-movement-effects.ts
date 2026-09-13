import type { FabEffect, FabZone } from "@tcg/flesh-and-blood-types";
import { nextRandom } from "../../random.ts";
import { fabObjectInstanceId } from "../../game/identity.ts";
import {
  treats2hSwordAs1h,
  isEquipRestricted,
  pairsPartnerMissing,
} from "../equip-restrictions.ts";
import { isFabZonePublic } from "../public-zone.ts";
import {
  buildFabRulesView,
  effectivePlayerIntellect,
  matchesFabSnapshotFilter,
} from "../state-rules-view.ts";
import type { FabObjectSnapshot, ProposedEvent } from "../events.ts";
import { libraryPlayerId } from "../shared-library.ts";

import {
  destinationRefForFabMove,
  fabZoneMoveResetsObject,
  nextFabDestinationRef,
  snapshotObject,
  snapshotPlayerId,
} from "../snapshots.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import {
  type FabEffectProposalResult,
  type ProposalContext,
  baseEvent,
  canonicalEngineZone,
  discardTargets,
  equipmentDestination,
  eventZoneForSnapshot,
  fabZoneForSnapshot,
  findObject,
  nextFreeWeaponSlot,
  nonWeaponEquipmentSeatOccupied,
  isObjectSnapshot,
  lookCohortBindingRole,
  objectTargets,
  playersForFabPlayer,
  resolveLayerAmount,
  resolveSearchCount,
  unsupported,
} from "./shared.ts";
import { weaponOccupantForDefinition, type FabWeaponOccupant } from "../weapons/weapon-area.ts";
import { proposeContinuousRuleEffect } from "./continuous-rule-effects.ts";
import { isEquipmentSeatName } from "../../procedures/activate-ability/helpers.ts";

/**
 * CR / printed "can't be destroyed by opponents' effects" (PEN252 Dynastic
 * Diadem). Continuous `be-destroyed` restrict rules with optional filter and
 * `sourceRestriction: opponents-effects` skip destroy events when the
 * destroying layer is controlled by an opponent of the protected object.
 */
/** CR 8.5.6 + Cranial Crush: a restrict-draw rule on the drawing hero no-ops the draw. */
function playerCannotDraw(state: FabRulesSnapshot, playerId: string): boolean {
  const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
  return buildFabRulesView(state)
    .rules("draw")
    .some((rule) => {
      if (rule.mode !== "restrict") return false;
      if (rule.scope.kind === "game") return true;
      return (
        heroId !== undefined && rule.scope.subjects.some((subject) => subject.instanceId === heroId)
      );
    });
}

function objectIsProtectedFromOpponentDestroy(
  state: FabRulesSnapshot,
  object: FabObjectSnapshot,
  destroyControllerId: string,
): boolean {
  // Self-destroy (controller's own effects / Fealty Instant) always allowed.
  if (object.controllerId === destroyControllerId) return false;
  const view = buildFabRulesView(state);
  for (const rule of view.rules("be-destroyed")) {
    if (rule.mode !== "restrict") continue;
    if (rule.parameters.kind !== "rule-modification") continue;
    // Protect objects the continuous effect's controller controls.
    if (object.controllerId !== rule.controllerId) continue;
    if (rule.filter) {
      if (!matchesFabSnapshotFilter(state, object, rule.filter, undefined, rule.controllerId))
        continue;
    }
    const sourceRestriction = rule.parameters.sourceRestriction;
    if (sourceRestriction === "opponents-effects" || sourceRestriction === null) {
      // null treated as opponents-effects for be-destroyed (only printed form).
      return true;
    }
  }
  return false;
}

/** Zone-movement leaf effects: draw, search, shuffle, discard, banish, destroy, move, equip, pitch, reveal, opt, intimidate. */
export function proposeCardMovementEffect(
  ctx: ProposalContext,
  effect: FabEffect,
): FabEffectProposalResult | null {
  if (effect.type === "bind-aura") {
    if (!ctx.layer.source) return unsupported(effect, "bind-aura requires a resolving card source");
    const hosts = objectTargets(
      ctx.state,
      ctx.layer,
      effect.target,
      ctx.targetPath,
      ctx.effectTargets,
      ctx.effectPath,
    );
    if (!hosts || hosts.length !== 1) return unsupported(effect, "bind-aura target is unresolved");
    const [host] = hosts;
    const source = findObject(ctx.state, ctx.layer.source.instanceId);
    if (!source || fabZoneForSnapshot(source.zone) !== "stack") {
      return unsupported(effect, "bind-aura source is not on the stack");
    }
    if (
      source.current.typeBox.subtypes?.includes("Aura") !== true ||
      host.current.typeBox.subtypes?.includes("Ally") !== true ||
      host.controllerId !== ctx.layer.controllerId
    ) {
      return unsupported(effect, "bind-aura requires an Aura source and an Ally you control");
    }
    return {
      supported: true,
      events: [
        {
          ...baseEvent(ctx.layer, ctx.processId),
          name: "move-zone",
          affected: [source],
          bindings: { ...ctx.layer.bindings },
          data: {
            object: source,
            destinationRef: destinationRefForFabMove(ctx.state, source, "under", 0),
            from: source.zone,
            to: "under",
            reason: "move",
            destinationHostId: fabObjectInstanceId(host.instanceId),
          },
        },
      ],
    };
  }
  const {
    state,
    layer,
    processId,
    effectPartitions,
    effectTargets,
    effectOptions,
    effectPath,
    targetPath,
  } = ctx;

  if (effect.type === "opt") {
    const resolved =
      typeof effect.count === "number"
        ? effect.count
        : (resolveLayerAmount(state, layer, effect.count) ?? 0);
    if (!Number.isFinite(resolved) || resolved < 0) {
      return unsupported(effect, "opt requires a resolvable count");
    }
    const count = Math.floor(resolved);
    const partition = effectPartitions[effectPath.join(".")];
    // Default: keep all looked cards on top (no reordering) when no decision yet.
    // Decision resumer supplies an explicit partition for interactive opts.
    const deck = state.containers.zonesByPlayerId[layer.controllerId]?.deck ?? [];
    const looked = deck.slice(Math.max(0, deck.length - count)).reverse();
    const top = partition?.top ?? looked;
    const bottom = partition?.bottom ?? [];
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          name: "opt",
          affected: [],
          data: {
            playerId: layer.controllerId,
            count,
            top,
            bottom,
          },
        },
      ],
    };
  }

  if (effect.type === "reorder-deck") {
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    if (!objects) return unsupported(effect, "reorder-deck target is unresolved");
    if (objects.length === 0) return { supported: true, events: [] };
    const selected =
      effectPartitions[effectPath.join(".")]?.[effect.position] ??
      objects.map((object) => object.instanceId);
    const deckOwnerIds = new Set(
      objects.map((object) => libraryPlayerId(state, object.ownerId, "deck")),
    );
    if (deckOwnerIds.size !== 1) {
      return unsupported(effect, "reorder-deck cohort must belong to one deck");
    }
    const deckOwnerId = [...deckOwnerIds][0]!;
    const deck = state.containers.zonesByPlayerId[deckOwnerId]?.deck ?? [];
    const cohort = objects.map((object) => object.instanceId);
    if (
      selected.length !== cohort.length ||
      new Set(selected).size !== selected.length ||
      !selected.every((instanceId) => cohort.includes(instanceId)) ||
      !selected.every((instanceId) => deck.includes(instanceId))
    ) {
      return unsupported(effect, "reorder-deck answer must order exactly the bound deck cohort");
    }
    return {
      supported: true,
      events: [
        {
          ...baseEvent(layer, processId),
          // The existing deck-order reducer is also used by Opt. This effect is
          // intentionally not Opt: it never offers an alternate destination.
          name: "opt",
          affected: [],
          data: {
            playerId: deckOwnerId,
            count: cohort.length,
            top: effect.position === "top" ? selected : [],
            bottom: effect.position === "bottom" ? selected : [],
          },
        },
      ],
    };
  }

  if (effect.type === "draw") {
    const playerIds = playersForFabPlayer(state, layer.controllerId, effect.player, layer.bindings);
    if (!playerIds) return unsupported(effect, "draw player requires a binding or outcome");
    const drawablePlayerIds = playerIds.filter((playerId) => !playerCannotDraw(state, playerId));
    if (drawablePlayerIds.length === 0) return { supported: true, events: [] };
    const perHeroCount =
      typeof effect.count === "object" &&
      effect.count.type === "up-to" &&
      typeof effect.count.amount === "object" &&
      effect.count.amount.type === "hero-property" &&
      effect.count.amount.player === "each"
        ? effect.count.amount
        : null;
    // Resolve ordinary counts once. "Each hero draws up to their intellect"
    // is per-player, so evaluate the hero-property against the current draw
    // recipient instead of the multi-hero layer context.
    const sharedCount =
      typeof effect.count === "number" ||
      (typeof effect.count === "object" && perHeroCount === null)
        ? resolveLayerAmount(state, layer, effect.count)
        : null;
    if (sharedCount !== null && (!Number.isFinite(sharedCount) || sharedCount < 0)) {
      return unsupported(effect, "non-constant draw count");
    }
    const events: ProposedEvent[] = [];
    const priorDrawn =
      typeof layer.bindings["drawn-this-way"] === "number"
        ? (layer.bindings["drawn-this-way"] as number)
        : 0;
    for (const playerId of drawablePlayerIds) {
      const count = perHeroCount
        ? perHeroCount.property === "intellect"
          ? effectivePlayerIntellect(state, playerId)
          : null
        : sharedCount;
      if (count === null || !Number.isFinite(count) || count < 0) {
        return unsupported(effect, "non-constant draw count");
      }
      // Yorick: draws pull from the shared-library host deck.
      const deckOwnerId = libraryPlayerId(state, playerId, "deck");
      const deck = state.containers.zonesByPlayerId[deckOwnerId]?.deck ?? [];
      for (const instanceId of deck.slice(Math.max(0, deck.length - count)).reverse()) {
        const object = snapshotObject(state, instanceId, deckOwnerId, "deck");
        events.push({
          ...baseEvent(layer, processId),
          name: "draw",
          affected: [object],
          bindings: {
            ...layer.bindings,
            "drawn-this-way": priorDrawn + events.length + 1,
            "event-amount": priorDrawn + events.length + 1,
          },
          data: {
            playerId,
            object,
            destinationRef: nextFabDestinationRef(state, object, events.length),
          },
        });
      }
    }
    const occurrenceEvents =
      events.length > 1
        ? events.map((event) => ({
            ...event,
            multiEvent: {
              occurrenceId: `occurrence-${processId}-${layer.layerId}-${targetPath}-draw` as const,
              namedEvent: "draw",
            },
          }))
        : events;
    return { supported: true, events: occurrenceEvents };
  }

  if (effect.type === "search") {
    const resolved = resolveSearchCount(state, layer, effect);
    if (resolved === null || effect.to.position === "top-or-bottom" || effect.to.asAttacking)
      return unsupported(
        effect,
        "search shape requires unsupported binding or destination behavior",
      );
    const count = resolved.count;
    let selected = effectTargets[effectPath.join(".")];
    const playerIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.player ?? "controller",
      layer.bindings,
    );
    if (!playerIds) return unsupported(effect, "searched player requires a binding or outcome");
    const fromBound = effect.fromBinding
      ? objectTargets(
          state,
          layer,
          { selector: "binding", binding: effect.fromBinding },
          targetPath,
          effectTargets,
          effectPath,
        )
      : null;
    if (effect.fromBinding && !fromBound) {
      return unsupported(effect, "search fromBinding is unresolved");
    }
    // Default: scan searched zones for filter matches (name / moniker tutor),
    // not merely the top N cards (which almost never match a named search).
    // fromBinding searches (Reel In) restrict that scan to the looked cohort.
    if (!selected) {
      if (fromBound) {
        selected = fromBound
          .filter((object) =>
            matchesFabSnapshotFilter(
              state,
              object,
              effect.filter,
              layer.bindings,
              layer.controllerId,
            ),
          )
          .slice(0, count)
          .map((object) => ({ kind: "object" as const, ref: object.ref }));
      } else {
        if (playerIds.length !== 1) {
          return unsupported(effect, "search selection is unresolved");
        }
        const playerId = playerIds[0]!;
        const matching: import("../targets.ts").FabTargetRef[] = [];
        for (const zoneName of effect.zones) {
          const engineZone = zoneName === "deck" ? "deck" : canonicalEngineZone(zoneName as never);
          if (!engineZone) continue;
          const zone = state.containers.zonesByPlayerId[playerId]?.[engineZone] ?? [];
          for (const instanceId of zone) {
            if (matching.length >= count) break;
            const object = findObject(state, instanceId);
            if (
              object &&
              matchesFabSnapshotFilter(
                state,
                object,
                effect.filter,
                layer.bindings,
                layer.controllerId,
              )
            ) {
              matching.push({ kind: "object", ref: object.ref });
            }
          }
          if (matching.length >= count) break;
        }
        selected = matching;
      }
    }
    const found = selected.flatMap((target) => {
      if (target.kind !== "object") return [];
      const object = findObject(state, target.ref.instanceId);
      if (object?.ref.incarnation !== target.ref.incarnation) return [];
      const sourceZone = object ? fabZoneForSnapshot(object.zone) : null;
      const inSearchedZone = effect.fromBinding
        ? Boolean(fromBound?.some((bound) => bound.instanceId === object?.instanceId) && sourceZone)
        : Boolean(sourceZone && effect.zones.includes(sourceZone));
      return object &&
        playerIds.includes(snapshotPlayerId(object)) &&
        inSearchedZone &&
        matchesFabSnapshotFilter(state, object, effect.filter, layer.bindings, layer.controllerId)
        ? [object]
        : [];
    });
    if (found.length === 0) {
      const emptySearchEvents = (): ProposedEvent[] =>
        playerIds.map((playerId) => ({
          ...baseEvent(layer, processId),
          name: "search" as const,
          affected: [],
          data: { playerId, found: [] as const },
        }));
      // Author-declared mayFail searches may resolve empty (backward compatible
      // with cards like Call to the Grave). The CR 8.5.19 visibility-aware
      // legality below governs searches that are not declared mayFail.
      if (effect.mayFail === true) return { supported: true, events: emptySearchEvents() };
      // CR 8.5.19: a non-mayFail search that produced nothing either failed
      // outright (empty zone, 8.5.19d) or the player chose to fail. The latter
      // is legal only when the filter is specified and no PUBLIC card matches
      // (8.5.19a); it is illegal when no filter is specified on a non-empty
      // zone (8.5.19c) or when a public match exists (8.5.19b).
      const filterSpecified =
        effect.filter !== undefined &&
        Object.entries(effect.filter).some(
          ([, value]) => value !== undefined && !(Array.isArray(value) && value.length === 0),
        );
      let anyCardInZone = false;
      let publicMatch = false;
      for (const zoneName of effect.zones) {
        const engineZone = zoneName === "deck" ? "deck" : canonicalEngineZone(zoneName as never);
        if (!engineZone) continue;
        const zonePublic = isFabZonePublic(zoneName);
        for (const playerId of playerIds) {
          const zone = state.containers.zonesByPlayerId[playerId]?.[engineZone] ?? [];
          if (zone.length > 0) anyCardInZone = true;
          if (zonePublic) {
            for (const instanceId of zone) {
              const object = findObject(state, instanceId);
              if (
                object &&
                matchesFabSnapshotFilter(
                  state,
                  object,
                  effect.filter,
                  layer.bindings,
                  layer.controllerId,
                )
              ) {
                publicMatch = true;
              }
            }
          }
        }
      }
      // 8.5.19d: an empty zone makes the search effect fail (resolve empty).
      if (!anyCardInZone) return { supported: true, events: emptySearchEvents() };
      // 8.5.19b: cannot fail if a PUBLIC card matches; 8.5.19c: cannot fail if
      // no filter is specified on a non-empty zone. Otherwise (8.5.19a: filter
      // specified, no public match) the player may fail.
      const cannotFail = publicMatch || !filterSpecified;
      if (cannotFail) return unsupported(effect, "search selection is no longer legal");
      return { supported: true, events: emptySearchEvents() };
    }
    if (found.length > count || (found.length !== selected.length && effect.mayFail !== true)) {
      return unsupported(effect, "search selection is no longer legal");
    }
    const events: ProposedEvent[] = [];
    let resetOffset = 0;
    // Stage bindings across multi-event search proposals. baseEvent copies the
    // pre-search layer.bindings; without re-staging, a later shuffle/search
    // event would re-spread the old "it" (e.g. the hit attack) over the
    // tutored card from move-zone outputBinding (Katsu/Zen play permission).
    let stagedBindings: ProposedEvent["bindings"] = { ...layer.bindings };
    const outputBinding =
      "outputBinding" in effect && typeof effect.outputBinding === "string"
        ? effect.outputBinding
        : null;
    for (const playerId of playerIds) {
      const playerFound = found.filter((object) => object.controllerId === playerId);
      events.push({
        ...baseEvent(layer, processId),
        name: "search",
        affected: playerFound,
        bindings: stagedBindings,
        data: { playerId, found: playerFound },
      });
    }
    const searchDeck = effect.zones.includes("deck") || Boolean(effect.fromBinding);
    const destIsDeck = effect.to.zone === "deck";
    const emitShuffle = (): void => {
      if (!searchDeck) return;
      for (const playerId of playerIds) {
        events.push({
          ...baseEvent(layer, processId),
          name: "shuffle-zone",
          affected: [],
          bindings: stagedBindings,
          data: { playerId, zone: "deck" },
        });
      }
    };
    // CR 8.5.19 + 8.5.20: search a deck then put the chosen card on top/bottom
    // of that same deck shuffles the remainder first, then repositions. Putting
    // on top and then shuffling would bury the tutored card.
    if (destIsDeck) emitShuffle();
    for (const object of found) {
      const sourceZone = fabZoneForSnapshot(object.zone);
      if (!sourceZone) return unsupported(effect, "searched object has no canonical zone");
      if (outputBinding) {
        stagedBindings = { ...stagedBindings, [outputBinding]: object };
      }
      const sameZone = sourceZone === effect.to.zone;
      const position =
        effect.to.position ?? (sameZone || destIsDeck ? ("top" as const) : undefined);
      if (effect.to.zone === "permanent") {
        const priorArena = Array.isArray(stagedBindings["put-into-arena-this-way"])
          ? stagedBindings["put-into-arena-this-way"]
          : [];
        const arenaCohort = [...priorArena, object];
        stagedBindings = {
          ...stagedBindings,
          "put-into-arena-this-way": arenaCohort,
          "put-into-arena-this-way-count": arenaCohort.length,
        };
      }
      // Mentor "put it face-up in arsenal" is destination visibility, the same
      // mapping move-card already uses. A top-level faceDown flag still wins.
      let faceDown = effect.faceDown;
      if (faceDown === undefined) {
        if (effect.to.visibility === "face-up") faceDown = false;
        else if (effect.to.visibility === "face-down") faceDown = true;
      }
      events.push({
        ...baseEvent(layer, processId),
        name: "move-zone",
        affected: [object],
        bindings: stagedBindings,
        data: {
          object,
          destinationRef: sameZone
            ? null
            : destinationRefForFabMove(state, object, effect.to.zone, resetOffset),
          from: sourceZone,
          to: effect.to.zone,
          reason: "search",
          ...(position ? { position } : {}),
          ...(faceDown !== undefined ? { faceDown } : {}),
        },
      });
      if (!sameZone && fabZoneMoveResetsObject(effect.to.zone)) resetOffset += 1;
    }
    if (!destIsDeck) emitShuffle();
    return { supported: true, events };
  }

  if (effect.type === "shuffle") {
    const zone = effect.zone ?? "deck";
    const playerIds = playersForFabPlayer(
      state,
      layer.controllerId,
      effect.player ?? "controller",
      layer.bindings,
    );
    if (!playerIds) return unsupported(effect, "shuffle player requires a deterministic hero set");
    return {
      supported: true,
      events: playerIds.map((playerId) => ({
        ...baseEvent(layer, processId),
        name: "shuffle-zone",
        affected: [],
        // A shuffle can appear between a selection/move and a later sequence
        // leaf that consumes that selection's output binding (for example,
        // Zen's searched combo card). Preserve the accumulated resolution
        // bindings rather than resetting to the layer's original bindings.
        bindings: layer.bindings,
        data: { playerId, zone },
      })),
    };
  }

  if (effect.type === "reveal" || effect.type === "look") {
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    if (!objects)
      return unsupported(effect, `${effect.type} target requires an unsupported selection`);
    // look = private observation; reveal = public. Both bind LKI for follow-up steps.
    const eventName = effect.type === "look" ? "look" : "reveal";
    return {
      supported: true,
      events: objects.map((object) => ({
        ...baseEvent(layer, processId),
        name: eventName,
        affected: [object],
        bindings: {
          ...layer.bindings,
          ...(effect.outputBinding
            ? { [effect.outputBinding]: objects.length === 1 ? object : objects }
            : {}),
          // A reveal can expose a hand or another cohort. Preserve that exact
          // cohort for sequence conditions; the per-event output binding above
          // remains available for effects that intentionally reference one.
          "revealed-this-way": objects,
          // "that hero puts it on the bottom then draws" (Pry) reads the
          // revealed seat the same way move-card stamps target-controller.
          ...(object.controllerId ? { "target-controller": object.controllerId } : {}),
        },
        data: { playerId: snapshotPlayerId(object), object },
      })),
    };
  }

  if (effect.type === "equip") {
    let objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    if (!objects) return unsupported(effect, "equipment target is unresolved");
    // Self on a resolving attack is not equipment — equip a hand equipment card.
    if (
      objects.length === 1 &&
      !objects[0]!.current.typeBox.types.includes("Equipment") &&
      !objects[0]!.current.typeBox.types.includes("Weapon")
    ) {
      const hand = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
      for (const handId of hand) {
        if (handId === layer.source.instanceId) continue;
        const candidate = snapshotObject(state, handId, layer.controllerId, "hand");
        if (
          candidate.current.typeBox.types.includes("Equipment") ||
          candidate.current.typeBox.types.includes("Weapon")
        ) {
          objects = [candidate];
          break;
        }
      }
    }
    const events: ProposedEvent[] = [];
    // Equip onto the layer controller (Frankie re-equipping from any GY), not
    // the card's prior zone owner.
    const equipperId = layer.controllerId;
    // Track weapon seats claimed earlier in this multi-equip proposal so
    // "equip up to 2 daggers" (Cindra) can fill weapon1 then weapon2 without
    // double-booking the first free seat.
    // CR 8.2.15a: carry the real occupant marker (incl. `2h-weapon-bow`) per
    // claimed seat so a later equip in the same multi-equip proposal resolves
    // against accurate seat state, not a generic `1h-weapon` placeholder.
    const claimedWeaponSlots = new Map<"weapon1" | "weapon2", FabWeaponOccupant>();
    // CR 8.3.26a: a pairs card may equip alongside a partner being seated in
    // the same multi-equip proposal, so collect every canonical being equipped
    // here before the per-object partner check.
    const sameEventCanonicals = new Set(
      objects.map((object) => object.canonicalId ?? "").filter(Boolean),
    );
    for (const object of objects) {
      // Bolfar "You can't equip weapons" and similar continuous equip bans.
      if (isEquipRestricted(state, equipperId, object)) {
        return unsupported(
          effect,
          "A continuous effect prevents this player from equipping that object.",
        );
      }
      // CR 8.3.26a: a pairs card may only be equipped when its partner object
      // is already equipped (or is being equipped in this same event). Enforced
      // at proposal time so the engine equip path — not just start-of-game
      // fixture seating — honours the pairs restriction.
      if (pairsPartnerMissing(state, equipperId, object, sameEventCanonicals)) {
        return unsupported(
          effect,
          "A card with pairs may only be equipped alongside its paired object.",
        );
      }
      // CR 8.5.41: Equip may name a zone. Modular (CR 8.3.30) has no printed
      // equipment subtype until seated, so the activation-declared seat is the
      // destination. Printed subtype still wins when no seat was named.
      const declaredSeat = declaredEquipDestinationSeat(ctx);
      const modular = object.current.keywords.some((keyword) => keyword.name === "modular");
      const destination =
        (declaredSeat ? equipmentCatalogZoneForSeat(declaredSeat) : null) ??
        (modular ? null : equipmentDestination(object)) ??
        effect.zone;
      const from = eventZoneForSnapshot(object.zone);
      if (!from || !destination) {
        return unsupported(effect, "equipment destination is ambiguous");
      }
      let equipmentSlot: "weapon1" | "weapon2" | undefined;
      if (destination === "weapon") {
        const slot = nextFreeWeaponSlot(state, equipperId, object, claimedWeaponSlots);
        if (!slot) {
          return unsupported(effect, "no free weapon seat for equip");
        }
        equipmentSlot = slot;
        claimedWeaponSlots.set(
          slot,
          weaponOccupantForDefinition(
            object.canonicalId ? state.cardDefinitions[object.canonicalId] : undefined,
            treats2hSwordAs1h(state, equipperId, object),
          ),
        );
      } else {
        if (!canonicalEngineZone(destination)) {
          return unsupported(effect, "equipment destination is ambiguous");
        }
        // CR 8.5.41c: non-weapon seats are single-occupancy — fail if occupied.
        if (nonWeaponEquipmentSeatOccupied(state, equipperId, destination)) {
          return unsupported(effect, "equipment seat is already occupied");
        }
      }
      const sourcePlayerId = snapshotPlayerId(object);
      // CR 8.3.36 cloaked: "Equip this face-down." Stamp the face-down marker on
      // the equip move-zone event so a cloaked card equipped at any point — not
      // just via start-of-game fixture seating — lands face-down. The move-zone
      // reducer persists data.faceDown via setFaceDownMarker (move.ts:64-66).
      const isCloaked = object.current.keywords.some((keyword) => keyword.name === "cloaked");
      const zoneData = {
        object,
        destinationRef: null as null,
        from,
        to: destination,
        reason: "equip" as const,
        ...(equipmentSlot ? { equipmentSlot } : {}),
        ...(sourcePlayerId !== equipperId ? { destinationPlayerId: equipperId } : {}),
        ...(isCloaked ? { faceDown: true as const } : {}),
      };
      events.push(
        {
          ...baseEvent(layer, processId),
          name: "move-zone",
          affected: [object],
          data: zoneData,
        },
        {
          ...baseEvent(layer, processId),
          name: "equip",
          affected: [object],
          data: {
            playerId: equipperId,
            ...zoneData,
          },
        },
      );
    }
    return { supported: true, events };
  }

  if (effect.type === "pitch-card") {
    let objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    if (!objects) return unsupported(effect, "pitch target is unresolved");
    // Self on a resolving attack is not pitchable — pitch a hand card instead.
    if (
      objects.length === 1 &&
      (objects[0]!.zone === "combat-chain" || objects[0]!.instanceId === layer.source.instanceId)
    ) {
      const hand = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
      const handId = hand.find((id) => id !== layer.source.instanceId);
      if (!handId) return unsupported(effect, "pitched object is not in hand or deck");
      objects = [snapshotObject(state, handId, layer.controllerId, "hand")];
    }
    // Pitch is legal from hand (payment / effects), deck (Tuffnut "pitch the
    // top card of your deck"), or graveyard (PEN168 "pitch a blue card from
    // your graveyard"). Other origins are not a printed pitch path.
    if (
      objects.some(
        (object) => object.zone !== "hand" && object.zone !== "deck" && object.zone !== "graveyard",
      )
    ) {
      return unsupported(effect, "pitched object is not in hand, deck, or graveyard");
    }
    const events: ProposedEvent[] = [];
    for (const object of objects) {
      const generated = object.current.numeric.pitch ?? 0;
      if (generated <= 0) return unsupported(effect, "pitched object has no canonical pitch value");
      const outputBinding = effect.outputBinding;
      events.push({
        ...baseEvent(layer, processId),
        name: "pitch",
        affected: [object],
        bindings: {
          ...layer.bindings,
          pitchedCard: object,
          ...(outputBinding ? { [outputBinding]: object } : {}),
        },
        data: {
          playerId: snapshotPlayerId(object),
          object,
          destinationRef: nextFabDestinationRef(state, object, events.length),
          resourcesGenerated: generated,
        },
      });
    }
    return { supported: true, events };
  }

  if (effect.type === "intimidate") {
    let playerIds = playersForFabPlayer(state, layer.controllerId, effect.target);
    // "any" returns all players; in a 2-player game resolve to the opponent.
    if ((!playerIds || playerIds.length !== 1) && effect.target === "any") {
      playerIds = state.playerIds.filter((id) => id !== layer.controllerId);
    }
    if (!playerIds || playerIds.length !== 1)
      return unsupported(effect, "intimidate target is unresolved");
    const playerId = playerIds[0]!;
    const hand = state.containers.zonesByPlayerId[playerId]?.hand ?? [];
    const intimidateEvent: ProposedEvent = {
      ...baseEvent(layer, processId),
      name: "intimidate",
      affected: [],
      data: { actorId: layer.controllerId, playerId },
    };
    if (hand.length === 0) return { supported: true, events: [intimidateEvent] };
    const roll = nextRandom(state.rngState);
    const instanceId = hand[Math.floor(roll.value * hand.length)]!;
    const object = snapshotObject(state, instanceId, playerId, "hand");
    return {
      supported: true,
      events: [
        intimidateEvent,
        {
          ...baseEvent(layer, processId),
          name: "banish",
          affected: [object],
          bindings: { ...layer.bindings, intimidatedCard: object },
          data: {
            object,
            destinationRef: nextFabDestinationRef(state, object),
            from: "hand",
            to: "banished",
            reason: "banish",
            faceDown: true,
            random: true,
            returnAtEndPhase: true,
          },
        },
      ],
    };
  }

  if (effect.type === "discard" || effect.type === "banish" || effect.type === "destroy") {
    // CR 8.5.1c: banish "until <condition>" returns the object to its previous
    // zone when the condition is met. returnAtEndPhase returns at end of turn,
    // so it only models the this-turn window. "while-in-arena" models
    // "until <source> leaves the arena" (Tranquil Passing): a delayed
    // leave-arena watcher returns the banished object, keyed by binding.
    let untilSourceLeaves = false;
    if (effect.type === "banish" && effect.until && effect.until !== "this-turn") {
      if (effect.until !== "while-in-arena" || !layer.source) {
        return unsupported(effect, "banish until-duration return window is not yet reduced");
      }
      untilSourceLeaves = true;
    }
    // "Destroy this at the beginning of the end phase" (Helio's Mitre, Quell
    // family, Solray Plating). Rewrite to delayed-trigger end-phase destroy.
    if (effect.type === "destroy" && effect.delay === "end-phase") {
      return (
        proposeContinuousRuleEffect(ctx, {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: { kind: "any" },
              observes: { kind: "none" },
            },
          },
          policy: { kind: "windowed", duration: "this-turn", matching: "first" },
          resolution: {
            kind: "effect",
            effect: { type: "destroy", target: effect.target },
          },
        }) ?? unsupported(effect, "end-phase delayed destroy registration failed")
      );
    }
    if (effect.type === "destroy" && effect.delay) {
      return unsupported(effect, "delayed destruction is not yet reduced");
    }
    const objects =
      effect.type === "discard"
        ? discardTargets(
            state,
            layer,
            effect.target,
            targetPath,
            effectTargets,
            effectPath,
            effect.random === true,
          )
        : objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    // A missing dynamic binding is an empty parameter set, not an unsupported
    // effect. This occurs when an earlier optional effect was declined or its
    // target ceased to exist; later effects continue to be generated (CR
    // 1.8.6, 5.3.4b) but move no objects.
    if (
      !objects &&
      effect.target.selector === "binding" &&
      !layer.bindings[effect.target.binding]
    ) {
      return { supported: true, events: [] };
    }
    if (!objects) return unsupported(effect, "object target is unresolved");
    // Multi-object this-way lists for follow-up counts (Teklo Foundry Heart:
    // gain {r} for each Mechanologist banished this way). Single-object still
    // stamps a one-element array so evaluateCount can filter uniformly.
    const banishedThisWay = effect.type === "banish" ? objects : null;
    const discardedThisWay = effect.type === "discard" ? objects : null;
    const destroyedThisWay =
      effect.type === "destroy"
        ? objects.filter(
            (object) => !objectIsProtectedFromOpponentDestroy(state, object, layer.controllerId),
          )
        : null;
    const events: ProposedEvent[] = [];
    for (const object of objects) {
      // Dynastic Diadem / "can't be destroyed by opponents' effects": skip
      // protected objects rather than failing the whole multi-target destroy.
      if (
        effect.type === "destroy" &&
        objectIsProtectedFromOpponentDestroy(state, object, layer.controllerId)
      ) {
        continue;
      }
      if (effect.type === "discard") {
        // Honor outputBinding ("it") so follow-up binding-matches can see the
        // discarded card (Buzzard Helm: if it has 6+ {p} …). Always stamp
        // discarded-this-way for this-way status / count consumers.
        events.push({
          ...baseEvent(layer, processId),
          name: "discard",
          affected: [object],
          bindings: {
            ...layer.bindings,
            ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
            // Preserve the whole atomic discard cohort for follow-up
            // "that many" counts. A per-event singleton would leave only the
            // last discarded card after sequence binding merge.
            "discarded-this-way": discardedThisWay ?? [],
            "discarded-this-way-count": discardedThisWay?.length ?? 0,
            "put-into-graveyard-this-way": discardedThisWay ?? [],
            "put-into-graveyard-this-way-count": discardedThisWay?.length ?? 0,
          },
          data: {
            playerId: snapshotPlayerId(object),
            object,
            destinationRef: nextFabDestinationRef(state, object, events.length),
            random: effect.random === true,
            reason: "effect",
          },
        });
      } else {
        const to: FabZone = effect.type === "banish" ? "banished" : "graveyard";
        // Stamp outputBinding first, then the multi-object this-way cohort last.
        // Cards often set outputBinding: "banished-this-way"; if the single-object
        // stamp wins, follow-up count filters only see the last banished card
        // (Teklo Foundry Heart: top 2 → only 1 counted).
        const moveBindings: Record<string, unknown> = {
          ...layer.bindings,
          ...(effect.outputBinding
            ? {
                [effect.outputBinding]: objects.length === 1 ? object : objects,
              }
            : {}),
          // "Its controller" follow-ups (Midas Touch Gold) read this seat.
          ...(object.controllerId ? { "target-controller": object.controllerId } : {}),
        };
        if (banishedThisWay) {
          // Sequential banishes on the same layer (Bonds of Memory: deck-top
          // then GY) must keep the full cohort. A this-step overwrite would
          // leave follow-up same-name / same-color counts looking at only the
          // last banish. Unique by instance+incarnation so a multi-object
          // atomic banish still stamps the cohort once.
          const priorRaw = layer.bindings["banished-this-way"];
          const prior = Array.isArray(priorRaw) ? priorRaw : [];
          const seen = new Set(
            prior.flatMap((snapshot) =>
              snapshot && typeof snapshot === "object" && "ref" in snapshot
                ? [`${snapshot.ref.instanceId}:${snapshot.ref.incarnation}`]
                : [],
            ),
          );
          const cohort = [...prior];
          for (const snapshot of banishedThisWay) {
            const key = `${snapshot.ref.instanceId}:${snapshot.ref.incarnation}`;
            if (seen.has(key)) continue;
            seen.add(key);
            cohort.push(snapshot);
          }
          moveBindings["banished-this-way"] = cohort;
          moveBindings["banished-this-way-count"] = cohort.length;
        }
        if (destroyedThisWay) {
          moveBindings["destroyed-this-way"] = destroyedThisWay;
          moveBindings["put-into-graveyard-this-way"] = destroyedThisWay;
          moveBindings["put-into-graveyard-this-way-count"] = destroyedThisWay.length;
        }
        events.push({
          ...baseEvent(layer, processId),
          name: effect.type,
          affected: [object],
          bindings: moveBindings as typeof layer.bindings,
          data: {
            object,
            destinationRef: nextFabDestinationRef(state, object, events.length),
            from: object.zone,
            to,
            reason: effect.type,
            // Malice / similar: "banish it face-down" stamps the face-down marker
            // in reduceMove (banish case already honors data.faceDown).
            ...(effect.type === "banish" && effect.faceDown ? { faceDown: true as const } : {}),
            // CR 8.5.1c: banish until a condition → return to previous zone at
            // end of phase (returnAtEndPhase handled by the move-zone reducer,
            // same mechanism as intimidate). while-in-arena instead registers
            // a leave-arena watcher on the source that returns the object.
            ...(effect.type === "banish" && effect.until && !untilSourceLeaves
              ? { returnAtEndPhase: true as const }
              : {}),
          },
        });
        if (untilSourceLeaves) {
          // The banish resets the object's incarnation; the fire-time binding
          // must carry the POST-banish identity or it goes stale (the watcher
          // fires in a later batch, so matcher reanchoring cannot fix it).
          const banishResetOffset = events.length - 1;
          const postBanish: typeof object = {
            ...object,
            ref: nextFabDestinationRef(state, object, banishResetOffset),
          };
          events.push({
            ...baseEvent(layer, processId),
            name: "register-delayed-trigger",
            affected: [layer.source!],
            bindings: { ...layer.bindings, banishedUntilSourceLeaves: postBanish },
            data: {
              delayedTriggerId: `${processId}:${layer.layerId}:${targetPath}:until-source-leaves`,
              controllerId: layer.controllerId,
              source: layer.source!,
              trigger: {
                kind: "event",
                event: {
                  name: "leave-arena",
                  actor: { kind: "any" },
                  observes: {
                    kind: "source",
                    selector: "moved-object",
                  },
                },
              } as const,
              resolution: {
                kind: "effect" as const,
                effect: {
                  type: "move-card" as const,
                  target: { selector: "binding" as const, binding: "banishedUntilSourceLeaves" },
                  // CR 8.5.1c: return to the pre-banish zone. The watcher is
                  // registered in the same proposal as the banish, so the
                  // object's CURRENT zone is that previous zone ("permanent"
                  // for auras; snapshots normalize arena to permanent).
                  to: { zone: (object.zone === "banished" ? "permanent" : object.zone) as never },
                },
              },
              policy: {
                kind: "windowed" as const,
                expiresAt: { kind: "source" as const, ref: layer.source!.ref },
                matching: "first" as const,
              },
              bindings: {
                banishedUntilSourceLeaves: postBanish,
                ...(layer.bindings.it ? { it: layer.bindings.it } : {}),
              },
            },
          });
        }
      }
    }
    return { supported: true, events };
  }

  if (effect.type === "move-card") {
    let objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    // Default: top of the first legal zone when at-resolution selection is empty
    // (leaf-contract / auto-resolve path for deterministic single-card moves).
    if (
      !objects &&
      effect.target.selector === "object" &&
      effect.target.declared === "at-resolution"
    ) {
      const iterationSubject = layer.bindings["iteration-subject"];
      const player =
        effect.target.player === "opponent"
          ? state.playerIds.find((id) => id !== layer.controllerId)
          : typeof iterationSubject === "string" &&
              state.playerIds.some((id) => id === iterationSubject)
            ? iterationSubject
            : layer.controllerId;
      if (player) {
        for (const catalogZone of effect.target.zones) {
          const engineZ = catalogZone === "deck" ? "deck" : canonicalEngineZone(catalogZone);
          if (!engineZ) continue;
          const zone = state.containers.zonesByPlayerId[player]?.[engineZ] ?? [];
          const topId = zone[zone.length - 1];
          if (!topId) continue;
          objects = [snapshotObject(state, topId, player, engineZ)];
          break;
        }
      }
    }
    // Missing / empty at-resolution or binding parameters are a legal no-op
    // (empty arsenal in a for-each, recycle with no matching graveyard card).
    if (
      !objects &&
      effect.target.selector === "binding" &&
      !layer.bindings[effect.target.binding]
    ) {
      return { supported: true, events: [] };
    }
    if (
      !objects &&
      effect.target.selector === "object" &&
      effect.target.declared === "at-resolution"
    ) {
      return { supported: true, events: [] };
    }
    if (!objects) return unsupported(effect, "move target is unresolved");
    if (objects.length === 0) return { supported: true, events: [] };
    let moving = objects;
    const cohortRole = lookCohortBindingRole(layer, effectPath, effect);
    if (cohortRole === "top-pick") {
      const selected = effectTargets[effectPath.join(".")];
      if (selected) {
        const picked = selected.flatMap((target) => {
          if (target.kind !== "object") return [];
          return moving.filter(
            (object) =>
              object.instanceId === target.ref.instanceId &&
              object.ref.incarnation === target.ref.incarnation,
          );
        });
        if (picked.length === 0) return { supported: true, events: [] };
        moving = picked;
      } else if (moving.length > 1) {
        return unsupported(effect, "look-cohort top pick requires a decision");
      }
    }
    if (cohortRole === "bottom-rest") {
      const topPicked = layer.bindings["put-on-top-this-way"];
      const topEntries = Array.isArray(topPicked) ? topPicked : topPicked ? [topPicked] : [];
      const excludeIds = new Set(
        topEntries.flatMap((entry) => (isObjectSnapshot(entry) ? [entry.instanceId] : [])),
      );
      if (excludeIds.size > 0) {
        moving = moving.filter((object) => !excludeIds.has(object.instanceId));
      }
    }
    if (moving.length === 0) return { supported: true, events: [] };
    let position = effect.to.position;
    // top-or-bottom is answered via a synthetic choice (option-0 = top, option-1 = bottom)
    // opened in findDecision when the position is still unresolved.
    if (position === "top-or-bottom") {
      const selected = effectOptions[effectPath.join(".")];
      if (selected === "option-0") position = "top";
      else if (selected === "option-1") position = "bottom";
      else return unsupported(effect, "destination position requires a decision");
    }
    // CR 8.5.20b: "shuffle cards into a zone" puts them there; a sibling shuffle
    // leaf (Hope Merchant's Hood, Potion of Luck) randomizes afterwards.
    // Uzuri: put a banished card onto the active chain link as the attacking
    // card. Requires an open combat link; identity is preserved on the chain.
    if (effect.to.asAttacking) {
      if (effect.to.zone !== "combat-chain") {
        return unsupported(effect, "asAttacking requires combat-chain destination");
      }
      if (!state.combat?.activeLink) {
        return unsupported(effect, "asAttacking requires an open combat chain");
      }
    }
    // CR 3.0.14a: "under" only exists by rule or effect instruction — a
    // move-card into `under` hosts on the ability's source ("put it under
    // this", EVO011 Hyper X3 / EVO146 Fabricate). Fail closed without one.
    if (effect.to.zone === "under" && !layer.source) {
      return unsupported(effect, "move into under requires a hosted source");
    }
    // Map destination visibility onto the move-zone faceDown flag so arsenal
    // face-up loads (Bull's Eye Bracers, Azalea, etc.) fire face-up triggers.
    let faceDown = effect.faceDown;
    if (effect.to.visibility === "face-up") faceDown = false;
    else if (effect.to.visibility === "face-down") faceDown = true;
    else if (effect.to.visibility) {
      return unsupported(
        effect,
        "destination visibility, shuffle, or attacking state is not yet reduced",
      );
    }
    let resetOffset = 0;
    // Deck-bound moves that feed "shuffle then draw that many" (Hope Merchant's
    // Hood, surge family) stamp shuffled-this-way cardinality on every event so
    // the follow-up draw amount can resolve after partial sequence commits.
    const shuffledThisWay = effect.to.zone === "deck" ? moving.length : undefined;
    // Sift / Potion of Luck: draw equal to cards put on the bottom (or shuffled
    // into the deck). Stamp cardinality for evaluateCount.
    const putOnBottomThisWay =
      effect.to.zone === "deck" && (position === "bottom" || effect.to.shuffle === true)
        ? moving.length
        : undefined;
    const putIntoArsenalThisWay = effect.to.zone === "arsenal" ? moving.length : undefined;
    const putIntoGraveyardThisWay = effect.to.zone === "graveyard" ? moving : undefined;
    // Each proposal stamps only the objects it moves. Structural sequence and
    // repeat nodes own accumulation; carrying their prior cohort here would
    // count both the pre-move LKI and its re-anchored live incarnation.
    const putIntoHandThisWay = effect.to.zone === "hand" ? moving : undefined;
    return {
      supported: true,
      events: moving.map((object) => {
        // Same-zone reorder (reveal top N, put them back) does not reset
        // identity. Stamping a destinationRef here inflates incarnation
        // accounting and makes the resolving card's graveyard cleanup miss.
        const sameZone = fabZoneForSnapshot(object.zone) === effect.to.zone;
        const destinationRef = sameZone
          ? null
          : destinationRefForFabMove(state, object, effect.to.zone, resetOffset);
        if (!sameZone && fabZoneMoveResetsObject(effect.to.zone)) resetOffset += 1;
        return {
          ...baseEvent(layer, processId),
          name: "move-zone",
          affected: [object],
          bindings: {
            ...layer.bindings,
            ...(object.controllerId ? { "target-controller": object.controllerId } : {}),
            ...(shuffledThisWay !== undefined ? { "shuffled-this-way": shuffledThisWay } : {}),
            ...(putOnBottomThisWay !== undefined
              ? { "put-on-bottom-this-way": putOnBottomThisWay }
              : {}),
            ...(cohortRole === "top-pick" ? { "put-on-top-this-way": moving } : {}),
            ...(putIntoArsenalThisWay !== undefined
              ? { "put-into-arsenal-this-way-count": putIntoArsenalThisWay }
              : {}),
            ...(putIntoGraveyardThisWay
              ? {
                  "put-into-graveyard-this-way": putIntoGraveyardThisWay,
                  "put-into-graveyard-this-way-count": putIntoGraveyardThisWay.length,
                }
              : {}),
            ...(putIntoHandThisWay
              ? {
                  "put-into-hand-this-way": putIntoHandThisWay,
                  "put-into-hand-this-way-count": putIntoHandThisWay.length,
                }
              : {}),
            ...(effect.outputBinding ? { [effect.outputBinding]: object } : {}),
          },
          data: {
            object,
            destinationRef,
            from: object.zone,
            to: effect.to.zone,
            reason: "move",
            ...(effect.to.player === "owner" ? { destinationPlayerId: object.ownerId } : {}),
            ...(position ? { position } : {}),
            ...(faceDown !== undefined ? { faceDown } : {}),
            ...(effect.to.asAttacking ? { asAttacking: true as const } : {}),
            ...(effect.to.zone === "under"
              ? { destinationHostId: fabObjectInstanceId(layer.source!.instanceId) }
              : {}),
          },
        };
      }),
    };
  }

  return null;
}

function declaredEquipDestinationSeat(
  ctx: ProposalContext,
): "head" | "chest" | "arms" | "legs" | null {
  const seat = ctx.layer.kind === "activated" ? ctx.layer.equipDestination : null;
  return seat && isEquipmentSeatName(seat) ? seat : null;
}

function equipmentCatalogZoneForSeat(
  seat: "head" | "chest" | "arms" | "legs",
): "equipment-head" | "equipment-chest" | "equipment-arms" | "equipment-legs" {
  switch (seat) {
    case "head":
      return "equipment-head";
    case "chest":
      return "equipment-chest";
    case "arms":
      return "equipment-arms";
    case "legs":
      return "equipment-legs";
  }
}
