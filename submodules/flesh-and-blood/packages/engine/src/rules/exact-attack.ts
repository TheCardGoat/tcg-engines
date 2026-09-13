import type { FabActiveAttackRef } from "../game/combat.ts";
import type { FabExactAttackRef } from "./continuous/ir.ts";
import type { FabEventBindings, FabExactAttackBinding, FabObjectSnapshot } from "./events.ts";

/** Preserve one attack declaration independently from its physical source.
 * Weapon and ally attacks use a per-link proxy; card attacks use the announced
 * card incarnation. Carry this binding instead of rebuilding attack identity
 * from a physical-object snapshot later. */
export function exactAttackBinding(
  activeAttack: FabActiveAttackRef,
  object: FabObjectSnapshot,
): FabExactAttackBinding {
  const attack: FabExactAttackRef =
    activeAttack.kind === "proxy"
      ? { ...object.ref, attack: { kind: "proxy", proxyId: activeAttack.proxyId } }
      : { ...object.ref, attack: { kind: "card" } };
  return { kind: "exact-attack", attack, object };
}

/** If an event already knows that an observed object is the active attack,
 * retain that exact identity under any card-authored binding name. */
export function bindingForObservedAttack(
  state: Pick<import("../kernel/transaction-kernel.ts").FabRulesSnapshot, "combat">,
  bindings: FabEventBindings,
  object: FabObjectSnapshot,
): FabExactAttackBinding | FabObjectSnapshot {
  const exact = Object.values(bindings).find(
    (value): value is FabExactAttackBinding =>
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      "kind" in value &&
      value.kind === "exact-attack" &&
      "object" in value &&
      value.object.ref.instanceId === object.ref.instanceId &&
      value.object.ref.incarnation === object.ref.incarnation,
  );
  if (exact) return exact;
  const active = state.combat?.activeLink?.activeAttack;
  return active?.sourceObjectId === object.ref.instanceId
    ? exactAttackBinding(active, object)
    : object;
}
