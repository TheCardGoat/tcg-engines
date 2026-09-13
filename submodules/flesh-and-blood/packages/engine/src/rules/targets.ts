import type { FabPlayerId } from "../game/identity.ts";
import type { FabObjectRef } from "./continuous/ir.ts";

/**
 * Exact identity selected by a rules target declaration.
 *
 * Object targets include the incarnation which existed at declaration time.
 * Player targets live in a separate identity domain and can therefore never
 * be accidentally resolved as card instance ids.
 */
export type FabTargetRef =
  | { readonly kind: "object"; readonly ref: FabObjectRef }
  | { readonly kind: "player"; readonly playerId: FabPlayerId };

export type FabTargetMap = Readonly<Record<string, readonly FabTargetRef[]>>;
export type MutableFabTargetMap = Record<string, readonly FabTargetRef[]>;

export function fabObjectTarget(ref: FabObjectRef): FabTargetRef {
  return { kind: "object", ref };
}

export function fabPlayerTarget(playerId: FabPlayerId): FabTargetRef {
  return { kind: "player", playerId };
}

/** Stable UI identifier only; never use this value to resolve an object. */
export function fabTargetUiId(target: FabTargetRef): string {
  return target.kind === "object" ? target.ref.instanceId : target.playerId;
}
