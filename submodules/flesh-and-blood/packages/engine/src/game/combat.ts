import type { FabEffect, FabZone } from "@tcg/flesh-and-blood-types";
import type { FabAttackProxyId, FabObjectInstanceId, FabPlayerId } from "./identity.ts";
import type { FabObjectRef } from "../rules/continuous/ir.ts";

/** Combat steps (CR 7.0.1). */
export type FabCombatStep =
  | "layer"
  | "attack"
  | "defend"
  | "reaction"
  | "damage"
  | "resolution"
  | "close";

export type FabDefendOrigin =
  | { kind: "hand" }
  | { kind: "arsenal" }
  | { kind: "deck" }
  | { kind: "reaction"; from: FabZone }
  | {
      kind: "equipment";
      zone: "head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2";
    };

export type FabAttackTarget =
  | { kind: "hero"; playerId: FabPlayerId }
  | { kind: "ally"; ref: FabObjectRef; controllerId: FabPlayerId }
  | { kind: "spectra"; ref: FabObjectRef; controllerId: FabPlayerId }
  | { kind: "permanent"; ref: FabObjectRef; controllerId: FabPlayerId };

/** Persisted declared target identity; attackability stays a rules-view query. */
export type FabAttackTargetRef =
  | { readonly kind: "hero"; readonly playerId: FabPlayerId }
  | {
      readonly kind: "object";
      readonly ref: FabObjectRef;
      readonly controllerIdAtDeclaration: FabPlayerId;
    };

export function fabAttackTargetKey(target: FabAttackTargetRef): string {
  return target.kind === "hero" ? target.playerId : target.ref.instanceId;
}

export function fabAttackTargetRefsEqual(
  left: FabAttackTargetRef,
  right: FabAttackTargetRef,
): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === "hero" && right.kind === "hero") return left.playerId === right.playerId;
  return (
    left.kind === "object" &&
    right.kind === "object" &&
    left.ref.instanceId === right.ref.instanceId &&
    left.ref.incarnation === right.ref.incarnation
  );
}

/** One active-attack identity; proxies cannot masquerade as physical cards. */
export type FabActiveAttackRef =
  | {
      readonly kind: "card";
      readonly sourceObjectId: FabObjectInstanceId;
    }
  | {
      readonly kind: "proxy";
      readonly proxyId: FabAttackProxyId;
      readonly sourceObjectId: FabObjectInstanceId;
    };

/** Stable identity of the current attack, distinct from a proxy's physical source. */
export function fabActiveAttackIdentity(
  attack: FabActiveAttackRef | null | undefined,
): FabAttackProxyId | FabObjectInstanceId | null {
  if (!attack) return null;
  return attack.kind === "proxy" ? attack.proxyId : attack.sourceObjectId;
}

/** Actual physical damage dealt by the active attack to one declared target. */
export interface FabCombatDamageOutcome {
  readonly target: FabAttackTargetRef;
  damageDealtByActiveAttack: number;
}

/** Target-scoped combat damage is accumulated, then sealed at CR 7.5.4. */
export interface FabCombatDamageState {
  status: "pending" | "resolved";
  outcomes: FabCombatDamageOutcome[];
}

type FabCombatDamageView = {
  readonly damage: {
    readonly status: "pending" | "resolved";
    readonly outcomes: readonly {
      readonly target: FabAttackTargetRef;
      readonly damageDealtByActiveAttack: number;
    }[];
  };
};

export function fabCombatDamageResolved(link: FabCombatDamageView): boolean {
  return link.damage.status === "resolved";
}

export function fabCombatDidHit(link: FabCombatDamageView): boolean {
  return link.damage.outcomes.some((outcome) => outcome.damageDealtByActiveAttack > 0);
}

export function fabCombatDamageForTarget(
  link: FabCombatDamageView,
  target: FabAttackTargetRef,
): number {
  return (
    link.damage.outcomes.find((outcome) => fabAttackTargetRefsEqual(outcome.target, target))
      ?.damageDealtByActiveAttack ?? 0
  );
}

/** Actual physical damage dealt by the active attack to one target identity. */
export function fabCombatDamageForObjectId(
  link: FabCombatDamageView,
  objectId: FabObjectInstanceId,
): number {
  return (
    link.damage.outcomes.find(
      (outcome) => outcome.target.kind === "object" && outcome.target.ref.instanceId === objectId,
    )?.damageDealtByActiveAttack ?? 0
  );
}

type FabDefenderView = {
  readonly attackTargetRef?: FabAttackTargetRef;
  readonly defendingInstanceIdsByTarget: Readonly<Record<string, readonly FabObjectInstanceId[]>>;
};

export function fabDefendersForTarget(
  link: FabDefenderView,
  target: FabAttackTargetRef,
): readonly FabObjectInstanceId[] {
  return link.defendingInstanceIdsByTarget[fabAttackTargetKey(target)] ?? [];
}

export function fabPrimaryDefenders(link: FabDefenderView): readonly FabObjectInstanceId[] {
  return link.attackTargetRef ? fabDefendersForTarget(link, link.attackTargetRef) : [];
}

export function fabAllDefenders(
  link: Pick<FabDefenderView, "defendingInstanceIdsByTarget">,
): readonly FabObjectInstanceId[] {
  return Object.values(link.defendingInstanceIdsByTarget).flat();
}

/**
 * Stable identity for one wager attached to a chain link. It is allocated by
 * the resolving rules process, then survives combat resolution and snapshot
 * restoration without depending on a card id or the wager's array position.
 */
export type FabWagerId = `wager-${string}`;

/** Stable identity of one clash and every replacement/prize continuation it owns. */
export type FabClashId = `clash-${string}`;

/** A wager prize captured when the wager happens, before its winner exists. */
export interface FabWagerTokenPrize {
  readonly kind: "create-token";
  /** Canonical created-object identities, never display names or card slugs. */
  readonly canonicalIds: readonly string[];
}

/** Printed "the winner {effect}" prizes (search, discard) captured at the wager. */
export interface FabWagerEffectPrize {
  readonly kind: "effect";
  readonly effect: FabEffect;
}

export type FabWagerPrize = FabWagerTokenPrize | FabWagerEffectPrize;

export interface FabWager {
  readonly wagerId: FabWagerId;
  readonly controllerId: FabPlayerId;
  readonly attackingPlayerId: FabPlayerId;
  readonly defendingPlayerId: FabPlayerId;
  readonly prize: FabWagerPrize | null;
}

export interface FabChainLink {
  /** The active attacking card or CR 1.4.3 attack-proxy. */
  readonly activeAttack: FabActiveAttackRef;
  readonly attackingPlayerId: FabPlayerId;
  readonly defendingPlayerId: FabPlayerId;
  /** The declared targets stored as object identities, not target classifications. */
  readonly attackTargetRef: FabAttackTargetRef;
  readonly additionalAttackTargetRefs?: readonly FabAttackTargetRef[];
  defendingInstanceIdsByTarget: Record<string, FabObjectInstanceId[]>;
  defendingOrigins: Record<string, FabDefendOrigin>;
  damage: FabCombatDamageState;
  /** Atomic resolution-time LKI; absent until combat damage resolves. */
  resolvedAttackLki?: {
    /** Final evaluated CR 7.5.2 power. */
    readonly power: number;
    readonly basePower: number;
    readonly totalDefense: number;
    /** CR 5.3.5a keyword state before on-hit triggers can move the attack. */
    readonly hasGoAgain?: boolean;
  };
  reactionInstanceIds?: FabObjectInstanceId[];
  attackReactionPlayedOrActivated?: boolean;
  /** Attack reactions played or activated on this chain link (Bonds of Agony / Double Trouble). */
  attackReactionCount?: number;
  attackingPlayerPlayedOrActivatedInReaction?: boolean;
  wagers: readonly FabWager[];
}

export interface FabCombatState {
  open: boolean;
  step: FabCombatStep;
  activeLink: FabChainLink | null;
  defenseDeclarationPending: boolean;
  chainLinkNumber?: number;
  closedLinks?: FabChainLink[];
}

export interface FabLastClosedCombat {
  readonly attackingPlayerId: FabPlayerId;
  readonly defendingPlayerId: FabPlayerId;
  readonly defendingInstanceIdsByTarget: Readonly<Record<string, readonly FabObjectInstanceId[]>>;
  /** Exact hit result for every physical attack source on the closed combat chain. */
  readonly attackDidHitByInstanceId: Readonly<Record<string, boolean>>;
  /** Resolved attack powers each physical defender defended across the closed combat chain. */
  readonly defendedAttackPowersByInstanceId: Readonly<Record<string, readonly number[]>>;
}
