/**
 * Pure domain model for the weapon-zone area (CR 8.2.1b / 8.2.2b / 8.2.2c /
 * 8.2.10 / 8.2.15). This is the single source of truth for which cards may
 * share a player's two weapon zones.
 *
 * Key CR distinction this encodes: a two-hander is "equipped to" two weapon
 * zones (8.2.2b) but only "occupies" one of them (8.2.2c). The other zone is
 * reserved — free for nothing in general, except a quiver when the two-hander
 * is a bow (8.2.15a). By convention the engine seats a two-hander in weapon1
 * and reserves weapon2, so "reservation" is derivable from weapon1's occupant
 * without any extra stored state.
 */
import { registerFabCardDefinition, type FabCardDefinitionInput } from "../../cards.ts";

import {
  resolveFabWeaponLayout,
  type FabWeaponAreaEntry,
  type FabWeaponSeatKind,
} from "../../deck-validation.ts";
export {
  validateWeaponArea,
  type FabWeaponAreaIssue,
  type FabWeaponAreaEntry,
  type FabWeaponSeatKind,
} from "../../deck-validation.ts";

/**
 * Runtime seat-occupant facts used by {@link resolveEquipSlot}. Bow and Perched facts retain the legal companion exceptions.
 */
export type FabWeaponOccupant = FabWeaponAreaEntry | null;

/** Case-insensitive membership test against a definition's printed types. */
export function hasTypeToken(def: FabCardDefinitionInput | undefined, token: string): boolean {
  if (!def) return false;
  const lower = token.toLowerCase();
  const typeBox = registerFabCardDefinition(def).base.typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes].some(
    (value) => value.toLowerCase() === lower,
  );
}

/** Classify a card definition into a weapon-seat kind. */
export function weaponSeatKind(def: FabCardDefinitionInput | undefined): FabWeaponSeatKind {
  if (hasTypeToken(def, "Quiver")) return "quiver";
  if (hasTypeToken(def, "Off-Hand")) return "off-hand";
  if (!hasTypeToken(def, "Weapon")) return "non-weapon";
  if (hasTypeToken(def, "2H")) return "2h-weapon";
  return "1h-weapon";
}

/** True only for a Weapon that is also a Bow. */
export function isBowDefinition(def: FabCardDefinitionInput | undefined): boolean {
  return hasTypeToken(def, "Weapon") && hasTypeToken(def, "Bow");
}

/**
 * Full weapon facts for runtime seat resolution, after hero handedness effects.
 */
export function weaponOccupantForDefinition(
  def: FabCardDefinitionInput | undefined,
  swordsAsOneHanded = false,
): FabWeaponOccupant {
  if (!def) return null;
  return {
    canonicalId: registerFabCardDefinition(def).canonicalId,
    seat: swordsAsOneHanded && hasTypeToken(def, "Sword") ? "1h-weapon" : weaponSeatKind(def),
    isBow: isBowDefinition(def),
    perched: registerFabCardDefinition(def).base.keywords.some(
      (keyword) => keyword.name === "perched",
    ),
  };
}

/**
 * True if a player currently controls a Bow weapon in either weapon zone.
 * Resolves instance → object → canonical before consulting the definition.
 * Called by the CR 8.2.6a arrow-play gate in `quoteFabPlay` (denial reason
 * `arrow_requires_bow`). The finer-grained permission split (origin vs bow
 * waivers) is tracked by the arrow-subsystem plan
 * (docs/superpowers/plans/2026-08-12-fab-cr-arrow-8.2.6a-subsystem.md).
 */
export function controlsABow(
  state: {
    readonly containers: {
      readonly zonesByPlayerId: Readonly<
        Record<string, Readonly<Record<string, readonly string[]>>>
      >;
    };
    readonly objects: Readonly<Record<string, { readonly canonicalId: string | null }>>;
  },
  playerId: string,
  cardDefinitions: Readonly<Record<string, FabCardDefinitionInput>>,
): boolean {
  for (const slot of ["weapon1", "weapon2"] as const) {
    const instanceId = state.containers.zonesByPlayerId[playerId]?.[slot]?.[0];
    if (!instanceId) continue;
    const canonicalId = state.objects[instanceId]?.canonicalId;
    if (canonicalId && isBowDefinition(cardDefinitions[canonicalId])) return true;
  }
  return false;
}

export interface FabWeaponSeatState {
  readonly weapon1: FabWeaponOccupant;
  readonly weapon2: FabWeaponOccupant;
}

/**
 * Equip never relocates an existing object. Validate the prospective whole
 * area with the same rules as pregame, then return the actual empty slot.
 * An incoming two-hander still requires both zones empty (CR 8.2.2b).
 */
export function resolveEquipSlot(
  state: FabWeaponSeatState,
  incoming: FabWeaponOccupant,
): "weapon1" | "weapon2" | null {
  if (!incoming || incoming.seat === "non-weapon") return null;
  if (incoming.seat === "2h-weapon" && (state.weapon1 || state.weapon2)) return null;
  for (const slot of ["weapon1", "weapon2"] as const) {
    if (state[slot]) continue;
    const result = resolveFabWeaponLayout({
      weapon1: state.weapon1 ?? undefined,
      weapon2: state.weapon2 ?? undefined,
      [slot]: incoming,
    });
    if (result.status === "accepted") return slot;
  }
  return null;
}
