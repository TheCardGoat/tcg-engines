import type { FabAttackTargetRef } from "../state.ts";
import { snapshotObject } from "./snapshots.ts";
import type { FabObjectSnapshot } from "./events.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

type AttackTargetState = {
  readonly playerIds: readonly string[];
  readonly containers: {
    readonly zonesByPlayerId: Readonly<
      Record<string, { readonly heroZone: readonly string[]; readonly arena: readonly string[] }>
    >;
  };
  readonly players: Readonly<
    Record<
      string,
      {
        readonly heroCardId?: string | null;
      }
    >
  >;
};

export function heroPlayerForAttackTarget(
  state: AttackTargetState,
  target: FabAttackTargetRef | undefined,
): string | null {
  if (!target) return null;
  return target.kind === "hero" ? target.playerId : null;
}

export function isHeroAttackTarget(
  state: AttackTargetState,
  target: FabAttackTargetRef | undefined,
): boolean {
  // Low-level legacy fixtures may construct a combat link without seated hero
  // objects. Persisted snapshots reject that shape; treating it as a hero here
  // keeps those white-box procedure fixtures from acquiring target semantics.
  return target === undefined || heroPlayerForAttackTarget(state, target) !== null;
}

export function snapshotDeclaredAttackTarget(
  state: FabRulesSnapshot,
  target: FabAttackTargetRef | undefined,
): FabObjectSnapshot | { readonly kind: "hero"; readonly playerId: string } | null {
  if (target?.kind === "hero") return { kind: "hero", playerId: target.playerId };
  if (
    !target ||
    !state.containers.zonesByPlayerId[target.controllerIdAtDeclaration]?.arena.includes(
      target.ref.instanceId,
    )
  ) {
    return null;
  }
  const object = state.objects[target.ref.instanceId];
  if (!object || object.incarnation !== target.ref.incarnation) return null;
  return snapshotObject(state, target.ref.instanceId, target.controllerIdAtDeclaration, "arena");
}
