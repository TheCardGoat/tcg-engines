/**
 * Player-facing target identity for the fluent harness.
 *
 * `.target(card)` is an intent verb: "I mean this object as the parameter."
 * It is not a protocol probe. CR 1.8.6c determined sets never open a chooser;
 * CR 1.4.3 attack-proxies are a distinct object from their source. The resolver
 * maps the named card onto the legal candidate the player meant.
 */

import type { FabActiveAttackRef } from "../game/combat.ts";
import { fabCardRefId } from "./test-fixtures.ts";
import { isFabCardInstanceRef, type FabFluentCardRef } from "./card-ref.ts";

/** Default `"attack"` prefers a live attack-proxy of the named source (CR 1.4.3). */
export type FabTargetIdentity = "attack" | "source";

export interface FabTargetOptions {
  /**
   * Default `"attack"`: if the named card is an attack-source and its live
   * attack-proxy is among the legal candidates, pick the proxy (CR 1.4.3a).
   * `"source"` forces the original object.
   */
  readonly identity?: FabTargetIdentity;
}

export function isFabTargetOptions(value: unknown): value is FabTargetOptions {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  if (!("identity" in value)) return false;
  const identity = (value as { identity?: unknown }).identity;
  return identity === "attack" || identity === "source";
}

export function parseFabTargetArgs<T>(args: readonly (T | FabTargetOptions)[]): {
  readonly refs: readonly T[];
  readonly options: FabTargetOptions;
} {
  if (args.length === 0) {
    return { refs: [], options: {} };
  }
  const last = args[args.length - 1];
  if (isFabTargetOptions(last)) {
    const refs = args.slice(0, -1) as T[];
    if (refs.length === 1 && Array.isArray(refs[0])) {
      return { refs: refs[0] as T[], options: last };
    }
    return { refs, options: last };
  }
  if (args.length === 1 && Array.isArray(args[0])) {
    return { refs: args[0] as T[], options: {} };
  }
  return { refs: args as T[], options: {} };
}

/**
 * Map a named source instance onto a legal entity-target candidate.
 *
 * Default identity `"attack"`: unique live proxy of this source wins, else the
 * source itself if it is a candidate. `"source"` skips the proxy and requires
 * the original instance.
 */
export function resolveAttackTargetInstanceId(input: {
  readonly sourceInstanceId: string;
  readonly candidates: readonly { readonly instanceId: string }[];
  readonly attackProxies: Readonly<Record<string, { readonly sourceId: string }>>;
  readonly activeAttack?: FabActiveAttackRef | null;
  readonly identity?: FabTargetIdentity;
}): string {
  const identity = input.identity ?? "attack";
  const candidateIds = input.candidates.map((candidate) => candidate.instanceId);
  const inCandidates = (instanceId: string) => candidateIds.includes(instanceId);

  const proxyIds = proxyIdsForSource(
    input.sourceInstanceId,
    input.attackProxies,
    input.activeAttack,
  );
  const proxyCandidates = proxyIds.filter(inCandidates);

  if (identity === "source") {
    if (inCandidates(input.sourceInstanceId)) return input.sourceInstanceId;
    throw new Error(`Source ${input.sourceInstanceId} is not a legal target (identity: "source")`);
  }

  if (proxyCandidates.length === 1) return proxyCandidates[0]!;
  if (proxyCandidates.length > 1) {
    throw new Error(
      `Attack-proxy for ${input.sourceInstanceId} is ambiguous among ${proxyCandidates.join(", ")}.`,
    );
  }
  if (inCandidates(input.sourceInstanceId)) return input.sourceInstanceId;
  throw new Error(`Target ${input.sourceInstanceId} is not a legal target`);
}

/** Resolve a typed card reference against one public entity-target decision. */
export function resolveFabCardTargetInstanceId(input: {
  readonly target: FabFluentCardRef;
  readonly candidates: readonly { readonly instanceId: string }[];
  readonly objects: Readonly<Record<string, { readonly canonicalId: string }>>;
  readonly attackProxies: Readonly<Record<string, { readonly sourceId: string }>>;
  readonly activeAttack?: FabActiveAttackRef | null;
  readonly identity?: FabTargetIdentity;
}): string {
  const sourceInstanceId = isFabCardInstanceRef(input.target)
    ? input.target.instanceId
    : (() => {
        const matches = candidateInstanceIdsForCanonicalId({
          canonicalId: fabCardRefId(input.target),
          candidates: input.candidates,
          objects: input.objects,
          attackProxies: input.attackProxies,
          activeAttack: input.activeAttack,
        });
        const sourceMatches = [
          ...new Set(
            matches.map((instanceId) =>
              candidateSourceInstanceId(instanceId, input.attackProxies, input.activeAttack),
            ),
          ),
        ];
        if (sourceMatches.length !== 1) {
          throw new Error(
            `Target "${fabCardRefId(input.target)}" matched ${sourceMatches.length} legal sources.`,
          );
        }
        return sourceMatches[0]!;
      })();
  return resolveAttackTargetInstanceId({
    sourceInstanceId,
    candidates: input.candidates,
    attackProxies: input.attackProxies,
    activeAttack: input.activeAttack,
    identity: input.identity,
  });
}

function candidateSourceInstanceId(
  instanceId: string,
  attackProxies: Readonly<Record<string, { readonly sourceId: string }>>,
  activeAttack: FabActiveAttackRef | null | undefined,
): string {
  const proxySource = attackProxies[instanceId]?.sourceId;
  if (proxySource) return proxySource;
  if (activeAttack?.kind === "proxy" && activeAttack.proxyId === instanceId) {
    return activeAttack.sourceObjectId;
  }
  return instanceId;
}

/**
 * Restrict a printed/canonical identity to the open candidate list. `.target(card)`
 * means "this card among the legal parameters", not "the unique instance in every zone."
 */
export function candidateInstanceIdsForCanonicalId(input: {
  readonly canonicalId: string;
  readonly candidates: readonly { readonly instanceId: string }[];
  readonly objects: Readonly<Record<string, { readonly canonicalId: string }>>;
  readonly attackProxies: Readonly<Record<string, { readonly sourceId: string }>>;
  readonly activeAttack?: FabActiveAttackRef | null;
}): readonly string[] {
  return input.candidates
    .map((candidate) => candidate.instanceId)
    .filter((instanceId) => candidateCanonicalId(instanceId, input) === input.canonicalId);
}

function candidateCanonicalId(
  instanceId: string,
  input: {
    readonly objects: Readonly<Record<string, { readonly canonicalId: string }>>;
    readonly attackProxies: Readonly<Record<string, { readonly sourceId: string }>>;
    readonly activeAttack?: FabActiveAttackRef | null;
  },
): string | undefined {
  const direct = input.objects[instanceId]?.canonicalId;
  if (direct) return direct;
  const proxySource = input.attackProxies[instanceId]?.sourceId;
  if (proxySource) return input.objects[proxySource]?.canonicalId;
  if (input.activeAttack?.kind === "proxy" && input.activeAttack.proxyId === instanceId) {
    return input.objects[input.activeAttack.sourceObjectId]?.canonicalId;
  }
  return undefined;
}

function proxyIdsForSource(
  sourceInstanceId: string,
  attackProxies: Readonly<Record<string, { readonly sourceId: string }>>,
  activeAttack: FabActiveAttackRef | null | undefined,
): readonly string[] {
  const ids = new Set<string>();
  for (const [proxyId, proxy] of Object.entries(attackProxies)) {
    if (proxy.sourceId === sourceInstanceId) ids.add(proxyId);
  }
  if (activeAttack?.kind === "proxy" && activeAttack.sourceObjectId === sourceInstanceId) {
    ids.add(activeAttack.proxyId);
  }
  return [...ids];
}
