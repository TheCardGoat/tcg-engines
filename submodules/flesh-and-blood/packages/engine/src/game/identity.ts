declare const FAB_IDENTITY: unique symbol;

type FabIdentity<Kind extends string> = string & {
  readonly [FAB_IDENTITY]: Kind;
};

/** Stable, serialized identity domains carried by the authoritative match snapshot. */
export type FabPlayerId = FabIdentity<"player">;
export type FabObjectInstanceId = FabIdentity<"object-instance">;
/** A non-card attack object created by an attack source (CR 1.4.3). */
export type FabAttackProxyId = FabIdentity<"attack-proxy">;
export type FabCanonicalCardId = FabIdentity<"canonical-card">;

function identity<Kind extends string>(value: string, kind: Kind): FabIdentity<Kind> {
  if (value.length === 0) throw new Error(`FAB ${kind} identity must not be empty.`);
  return value as FabIdentity<Kind>;
}

export function fabPlayerId(value: string): FabPlayerId {
  return identity(value, "player");
}

export function fabObjectInstanceId(value: string): FabObjectInstanceId {
  return identity(value, "object-instance");
}

export function fabAttackProxyId(value: string): FabAttackProxyId {
  return identity(value, "attack-proxy");
}

export function fabCanonicalCardId(value: string): FabCanonicalCardId {
  return identity(value, "canonical-card");
}
