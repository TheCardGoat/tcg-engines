/**
 * Abilities (CR 1.7.3, 5.2, 5.3, 5.4).
 *
 * Target contract: docs/architecture/foundation-types.md
 */

import type { FabAmount, FabSelectionCount } from "./amount.ts";
import type { FabCondition } from "./condition.ts";
import type { FabCost } from "./cost.ts";
import type { FabEffect } from "./effect.ts";
import type { FabKeyword, FabLabel } from "./keyword.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabNumericProperty, FabPlayOrigin, FabZone } from "./primitives.ts";
import type { FabTriggerCondition } from "./trigger.ts";

// ---------------------------------------------------------------------------
// Abilities (1.7.3, 5.2, 5.3, 5.4)
// ---------------------------------------------------------------------------

export type FabAbilityType =
  | "action"
  | "instant"
  | "attack-reaction"
  | "defense-reaction"
  | "attack";

export interface FabAbilityLimit {
  count: number;
  per: "turn" | "chain-link" | "combat-chain" | "game" | "attack";
  /** Ordinal triggers: "The first time each turn" (6.6.1b). */
  ordinals?: readonly number[];
  /** "The first time each hero ...": keep the limit and ordinal ledger per event actor. */
  scope?: "actor";
}

export interface FabAbilityBase {
  /** Stable per-card id, e.g. "WTR190-a1". */
  id: string;
  /** Printed wording, verbatim. */
  text: string;
  /** Concise localized name used when a player chooses between abilities. */
  displayName?: string;
  limit?: FabAbilityLimit;
  label?: FabLabel;
  /** Keywords printed at the end of the ability's own text, applying to the
   * layer the ability creates (CR 8.3.5, 5.3.5) — e.g. a trailing "Go again".
   * Distinct from card-level keywords and from "gets go again" grants (1.7.2). */
  layerKeywords?: readonly FabKeyword[];
  /** Functionality exceptions beyond "public and in the arena" (1.7.4). */
  functionalZones?: readonly FabZone[];
}

export interface FabActivatedAbility extends FabAbilityBase {
  kind: "activated";
  /** Sets the activated-layer's types and thereby its timing (5.2.1b, 8.1). */
  abilityType: FabAbilityType;
  /**
   * Who may activate (CR 5.2: default is the controller). Printed
   * "Any hero may activate this ability" widens this to every seated hero.
   */
  activatableBy?: "controller" | "any-hero";
  cost: FabCost;
  /** Discount on the activation cost ("This ability costs {r} less for each
   * Draconic chain link you control."). */
  costReduction?: { amount: FabAmount };
  /** Surcharge on the activation cost ("This ability costs an additional {r}
   * to activate for each Runechant you control."). Evaluated at quote/begin
   * with the same amount engine as costReduction. */
  costIncrease?: { amount: FabAmount };
  condition?: FabCondition;
  effect: FabEffect;
}

export interface FabResolutionAbility extends FabAbilityBase {
  kind: "resolution";
  condition?: FabCondition;
  effect: FabEffect;
}

/** Modal ability (1.7.5): modes declared when the layer enters the stack. */
export interface FabModalAbility extends FabAbilityBase {
  kind: "modal";
  modal: { choose: FabSelectionCount; allowRepeat?: boolean; random?: boolean };
  modes: readonly FabResolutionAbility[];
  condition?: FabCondition;
  /** Cost-gated modal: "As an additional cost to play this, …. Choose that
   * many modes plus 1:". */
  additionalCost?: FabCost;
  /**
   * Non-modal resolution effects that always generate with the chosen modes
   * (CR 1.7.5): e.g. Heron's Flight "it gains +2{p} and you choose 1".
   */
  effect?: FabEffect;
}

export type FabStaticKind = "continuous" | "triggered" | "meta" | "play" | "property" | "while";

type FabNonEmptyPlayOrigins = readonly [FabPlayOrigin, ...FabPlayOrigin[]];

/**
 * Play-static modification (5.4.4).
 *
 * A condition controls whether the ordinary play is legal. A permission
 * changes how or where a card may be played and must declare every origin in
 * which it functions. Keeping those shapes disjoint prevents a play-only-if
 * gate from silently becoming a broad play permission.
 */
export type FabPlayModification = {
  cost?: FabCost;
  /**
   * When playing from a ordered zone (deck), restrict the permission to this
   * position (Dash I/O: Mechanologist item from the top of the deck).
   */
  position?: "top" | "bottom";
  /** Restricts which cards the modification applies to ("an action card with
   * blood debt from your banished zone"). */
  filter?: FabCardFilter;
  asType?: FabAbilityType;
  /**
   * Cost adjustment while exercising this permission (Dash I/O: +1{r} surcharge
   * on the top-deck item play).
   */
  costModification?: "free" | { reduce: FabAmount } | { increase: number };
  optional?: boolean;
  /** Status set even when an optional cost fails (boosted, fused — 8.3.9a). */
  setsStatus?: string;
  /** Connected effect when an optional additional cost is paid ("As an
   * additional cost …, you may banish …. When you do, this gains +1{p}."). */
  then?: FabEffect;
} & (
  | {
      role: "permission";
      /** Explicit origins in which the permission is functional. */
      fromZones: FabNonEmptyPlayOrigins;
    }
  | {
      role: "condition";
      fromZones?: never;
    }
  | {
      role: "additional-cost" | "alternative-cost" | "cost-reduction";
      fromZones?: readonly FabPlayOrigin[];
    }
);

interface FabStaticAbilityBase extends FabAbilityBase {
  kind: "static";
  condition?: FabCondition;
  /** staticKind "play" (5.4.4). */
  playEffect?: FabPlayModification;
  /** staticKind "property" (5.4.5). */
  property?: FabNumericProperty;
  value?: FabAmount;
}

export type FabTriggeredResolution =
  | { readonly kind: "effect"; readonly effect: FabEffect }
  | {
      readonly kind: "modal";
      readonly choose: FabSelectionCount;
      readonly allowRepeat?: boolean;
      readonly random?: boolean;
      readonly modes: readonly FabResolutionAbility[];
      readonly effect?: FabEffect;
    };

/** CR 5.4.6: a triggered-static ability generates one static-triggered effect. */
export interface FabTriggeredStaticAbility extends FabAbilityBase {
  readonly kind: "static";
  readonly staticKind: "triggered";
  readonly trigger: FabTriggerCondition;
  readonly resolution: FabTriggeredResolution;
  /** Resolution-time condition; trigger-condition state belongs in `trigger`. */
  readonly condition?: FabCondition;
  /** Effect-cost paid as the triggered layer is generated/resolved. */
  readonly additionalCost?: FabCost;
  readonly effect?: never;
  readonly playEffect?: never;
  readonly property?: never;
  readonly value?: never;
}

export interface FabNonTriggeredStaticAbility extends FabStaticAbilityBase {
  readonly staticKind: Exclude<FabStaticKind, "triggered">;
  readonly effect?: FabEffect;
  readonly trigger?: never;
  readonly resolution?: never;
}

export type FabStaticAbility = FabTriggeredStaticAbility | FabNonTriggeredStaticAbility;

export type FleshAndBloodAbility =
  | FabActivatedAbility
  | FabResolutionAbility
  | FabModalAbility
  | FabStaticAbility;
