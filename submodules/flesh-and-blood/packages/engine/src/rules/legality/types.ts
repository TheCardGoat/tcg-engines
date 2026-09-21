import type {
  FabBaseObjectProperties,
  FabPlayOrigin as FabPlayOriginContract,
} from "@tcg/flesh-and-blood-types";
import type { FabSplitPlayMethod } from "../../cards.ts";
import type { FabAttackTarget, FabZoneKind } from "../../state.ts";
import type { FabObjectRef } from "../continuous/ir.ts";

/** Zones a card may legally be played from (base + permission-gated). */
export type FabPlayOrigin = FabPlayOriginContract;

/**
 * Rules timing selected for one play declaration. This is deliberately not
 * inferred by downstream consumers from a merged typebox: a melded
 * Action/Instant uses action timing unless an effect explicitly grants instant
 * timing (Rosetta release notes; CR 5.1.2c and 8.3.38).
 */
export type FabPlayTiming = "action" | "instant" | "attack-reaction" | "defense-reaction";

export type FabPlayDenialReason =
  | "rules_process_pending"
  | "not_priority_player"
  | "card_not_in_zone"
  | "card_object_missing"
  | "unsupported_play_permission"
  | "unsupported_play_type"
  | "illegal_reaction_timing"
  | "dominate"
  | "illegal_action_timing"
  | "unsupported_play_declaration"
  | "play_condition_failed"
  | "restricted_by_rule"
  | "defense_reactions_blocked"
  | "ally_target_no_defend"
  | "illegal_attack_target"
  | "insufficient_action_points"
  | "insufficient_resources"
  | "additional_cost_unpayable"
  | "rune_gate"
  | "arrow_requires_bow"
  | "arrow_must_come_from_arsenal";

export interface FabPlayRequest {
  readonly actorId: string;
  readonly instanceId: string;
  readonly from: FabPlayOrigin;
  /** Explicit CR 5.1.3d play permission. `base` means the ordinary rules
   * procedure; other values are opaque continuous-effect permission ids. */
  readonly playPermissionId?: string;
  readonly attackTargetId?: string | null;
  /**
   * Optional additional opposing hero (player id) when an additional-hero
   * attack-target rule applies to this attack (Bolfar multi-target).
   */
  readonly additionalAttackTargetId?: string | null;
  /** Required declaration for split cards; absent for ordinary cards. */
  readonly playMethod?: FabSplitPlayMethod;
}

export interface FabPlayQuoteBase {
  readonly stateID: number;
  readonly request: FabPlayRequest;
  readonly object: FabObjectRef | null;
  readonly allowedOrigins: readonly FabPlayOrigin[];
  readonly playPermissionOptions: readonly {
    readonly id: string;
    readonly kind: "base" | "effect";
    readonly effectId: string | null;
  }[];
  /** Permission chosen for this exact quote, including ordinary base play. */
  readonly selectedPlayPermissionId: string | null;
  readonly requiredDeclarations: readonly ("mode" | "target" | "effect-cost")[];
  readonly alternativeCosts: readonly string[];
  readonly additionalCosts: readonly string[];
  readonly costModification:
    | "free"
    | { readonly reduce: import("@tcg/flesh-and-blood-types").FabAmount }
    | { readonly increase: number }
    | null;
  readonly resourceCost: number | null;
  readonly actionPointCost: number | null;
  readonly effectIds: readonly string[];
  readonly isAttack: boolean;
  readonly timing: FabPlayTiming | null;
  readonly attackTarget: FabAttackTarget | null;
  /** Extra hero targets when additional-hero grant is active and requested. */
  readonly additionalAttackTargets: readonly FabAttackTarget[];
  /** Captured declaration, persisted into the play procedure and layer LKI. */
  readonly splitPlayMethod: FabSplitPlayMethod | null;
  /** Selected face properties frozen into the procedure/layer when present. */
  readonly splitBase: FabBaseObjectProperties | null;
}

export type FabPlayQuote =
  | (FabPlayQuoteBase & {
      readonly allowed: true;
      readonly reasonCode: null;
      readonly reason: null;
    })
  | (FabPlayQuoteBase & {
      readonly allowed: false;
      readonly reasonCode: FabPlayDenialReason;
      readonly reason: string;
    });

export type FabDefenseOrigin = Extract<
  FabZoneKind,
  "hand" | "arsenal" | "head" | "chest" | "arms" | "legs" | "weapon1" | "weapon2"
>;

export type FabDefenseDenialReason =
  | "not_defend_step"
  | "invalid_defenders"
  | "ally_target_no_defend"
  | "illegal_defense_origin"
  | "card_not_in_hand"
  | "defense_reaction_not_defend"
  | "no_defense"
  | "dominate"
  | "overpower"
  /** Continuous defend restriction (Benji ≤2{p} no hand defense, equipment bans, …). */
  | "restricted_by_rule";

export interface FabDefenseRequest {
  readonly actorId: string;
  readonly instanceIds: readonly string[];
}

export interface FabDefenseQuoteBase {
  readonly stateID: number;
  readonly request: FabDefenseRequest;
  readonly defenders: readonly {
    readonly ref: FabObjectRef;
    readonly origin: FabDefenseOrigin;
  }[];
  readonly attack: FabObjectRef | null;
  readonly effectIds: readonly string[];
}

export type FabDefenseQuote =
  | (FabDefenseQuoteBase & {
      readonly allowed: true;
      readonly reasonCode: null;
      readonly reason: null;
    })
  | (FabDefenseQuoteBase & {
      readonly allowed: false;
      readonly reasonCode: FabDefenseDenialReason;
      readonly reason: string;
    });

export interface FabAttackTargetRequest {
  readonly actorId: string;
  readonly attackInstanceId: string;
}

export interface FabAttackTargetCandidate {
  readonly targetId: string;
  readonly kind: FabAttackTarget["kind"];
  readonly target: FabAttackTarget;
  readonly defendingPlayerId: string;
  readonly object: FabObjectRef | null;
  readonly label: string;
  readonly effectIds: readonly string[];
}

export interface FabAttackTargetQuote {
  readonly stateID: number;
  readonly request: FabAttackTargetRequest;
  readonly allowed: boolean;
  readonly reasonCode: "attack_source_missing" | "no_attack_targets" | null;
  readonly reason: string | null;
  readonly candidates: readonly FabAttackTargetCandidate[];
}
