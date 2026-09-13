import type { FabEffect, FabZone } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import {
  baseEvent,
  equipmentDestination,
  fabZoneForSnapshot,
  nextFreeWeaponSlot,
  nonWeaponEquipmentSeatOccupied,
  objectTargets,
  playersForFabPlayer,
  unsupported,
} from "../shared.ts";
import { treats2hSwordAs1h, isEquipRestricted } from "../../equip-restrictions.ts";
import { proposeContinuousRuleEffect } from "../continuous-rule-effects.ts";
import { nextFabDestinationRef } from "../../snapshots.ts";
import { weaponOccupantForDefinition, type FabWeaponOccupant } from "../../weapons/weapon-area.ts";

/** CR 8.5.35 / 8.5.53 / 8.5.54 share one control-change primitive. */
type ControlChangeType = "gain-control" | "give" | "steal";

/** CR 8.5.53a / 8.5.54a: "considered to have given/stolen" provenance on the move. */
export function controlChangeReason(type: ControlChangeType): "give" | "steal" | "rule" {
  if (type === "give") return "give";
  if (type === "steal") return "steal";
  return "rule";
}

/**
 * CR 8.5.35 Gain control (and 8.5.53 Give / 8.5.54 Steal, which share the
 * primitive) — with a duration, prefer continuous control atoms. Without (or
 * when continuous fails), move the object into the new controller's matching
 * zone (arena for permanents), stamped with a give/steal/rule reason so the
 * control change is distinguishable in the event journal.
 */
export function proposeGainControl(
  ctx: ProposalContext,
  effect: FabEffect & { type: ControlChangeType },
): FabEffectProposalResult {
  if (effect.duration !== undefined) {
    const continuous = proposeContinuousRuleEffect(ctx, effect);
    if (continuous?.supported) {
      // Also move the object so arena occupancy is CR-visible for the new
      // controller (leaf contracts / ally theft).
      const moved = proposeDiscreteGainControl(ctx, effect);
      if (moved.supported) {
        return {
          supported: true,
          events: [...continuous.events, ...moved.events],
          eventGroups: [
            ...(continuous.eventGroups ?? [continuous.events]),
            ...(moved.eventGroups ?? [moved.events]),
          ],
        };
      }
      return continuous;
    }
  }
  return proposeDiscreteGainControl(ctx, effect);
}

function proposeDiscreteGainControl(
  ctx: ProposalContext,
  effect: FabEffect & { type: ControlChangeType },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
  if (!objects) return unsupported(effect, "gain-control target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  const controllers = playersForFabPlayer(
    state,
    layer.controllerId,
    effect.controller,
    layer.bindings,
  );
  if (!controllers || controllers.length !== 1) {
    return unsupported(effect, "gain-control controller is unresolved");
  }
  const newControllerId = controllers[0]!;

  const events: ProposedEvent[] = [];
  // Track weapon seats claimed within this one multi-target control-change so
  // two stolen/given weapons don't both resolve to the same seat against the
  // pre-loop state (mirrors the equip path in card-movement-effects.ts). Each
  // assigned slot is stamped so the next weapon in the loop sees it occupied.
  const claimedWeaponSlots = new Map<"weapon1" | "weapon2", FabWeaponOccupant>();
  for (const object of objects) {
    const from = fabZoneForSnapshot(object.zone);
    if (!from) return unsupported(effect, "gain-control source zone is unknown");
    // CR 8.5.35a / 8.5.53b / 8.5.54b: an equipped object is re-equipped by the
    // new controller as part of the control change. Route it to the matching
    // equipment/weapon seat and FAIL if the seat is occupied or the new
    // controller cannot equip it. Only objects currently sitting in an
    // equipment/weapon seat are equipped — a permanent in the arena that also
    // carries Weapon/Equipment types (Nitro Mechanoid) is not equipped, so its
    // control change keeps the arena routing (materials follow the host).
    const equippedZones = [
      "equipment-head",
      "equipment-chest",
      "equipment-arms",
      "equipment-legs",
      "weapon",
    ] as const;
    const equipDest = (equippedZones as readonly string[]).includes(object.zone)
      ? equipmentDestination(object)
      : null;
    let to: FabZone;
    let equipmentSlot: "weapon1" | "weapon2" | undefined;
    if (equipDest) {
      if (isEquipRestricted(state, newControllerId, object)) {
        // CR 8.5.35a: cannot be equipped by the new controller → skip (fail).
        continue;
      }
      if (equipDest === "weapon") {
        const slot = nextFreeWeaponSlot(state, newControllerId, object, claimedWeaponSlots);
        if (!slot) continue; // no free weapon seat → skip (fail)
        to = "weapon";
        equipmentSlot = slot;
        claimedWeaponSlots.set(
          slot,
          weaponOccupantForDefinition(
            object.canonicalId ? state.cardDefinitions[object.canonicalId] : undefined,
            treats2hSwordAs1h(state, newControllerId, object),
          ),
        );
      } else {
        if (nonWeaponEquipmentSeatOccupied(state, newControllerId, equipDest)) {
          continue; // seat occupied → skip (fail, CR 8.5.53b/8.5.54b)
        }
        to = equipDest;
      }
    } else {
      // Prefer arena for permanent theft; keep same engine zone family otherwise.
      to = from === "permanent" || object.zone === "arena" ? "permanent" : from;
    }
    events.push({
      ...baseEvent(layer, processId),
      name: "move-zone" as const,
      affected: [object],
      data: {
        object,
        // Control changes move a permanent between players' arena zones, but
        // do not reset it (CR 8.5.35); a reset ref would make the zone reducer
        // reject this same-zone-family move.
        destinationRef: to === from ? null : nextFabDestinationRef(state, object),
        from,
        to,
        reason: controlChangeReason(effect.type),
        destinationPlayerId: newControllerId,
        ...(equipmentSlot ? { equipmentSlot } : {}),
      },
    });
  }
  return { supported: true, events };
}
