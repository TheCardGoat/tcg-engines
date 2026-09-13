import type { GrandArchiveAmount, GrandArchiveSelectionCount } from "./amount.ts";
import type { GrandArchiveCondition } from "./condition.ts";
import type { GrandArchiveAbilityCost } from "./cost.ts";
import type {
  GrandArchiveContinuousEffect,
  GrandArchiveContinuousPlayerStateEffect,
  GrandArchiveEffect,
  GrandArchiveModeEffect,
  GrandArchiveReplacementEffect,
  GrandArchiveRuleModification,
  GrandArchiveTriggerMultiplierEffect,
  GrandArchiveAbilityMultiplierEffect,
  GrandArchiveAttackTargetDelegationEffect,
} from "./effect.ts";
import type { GrandArchiveAbilityLabel, GrandArchiveKeyword } from "./keyword.ts";
import type { GrandArchiveAbilityId, GrandArchiveZone } from "./primitives.ts";
import type { GrandArchiveTargetDeclaration } from "./selection.ts";
import type { GrandArchiveTrigger } from "./trigger.ts";

export type GrandArchiveRulesAbilityKind = "activated" | "triggered" | "static";

export interface GrandArchiveAbilityBase {
  readonly id: GrandArchiveAbilityId;
  /** Verbatim printed paragraph, retained for display and implementation audit. */
  readonly text: string;
  /** Intrinsic/label provenance; the expanded ability remains fully executable. */
  readonly keyword?: GrandArchiveKeyword;
  readonly label?: GrandArchiveAbilityLabel;
  /** Omit to use the rules-defined functional zone for the source card/type. */
  readonly functionalZones?: readonly GrandArchiveZone[];
  /** Some text printed on a card is executed by the object hosting that card. */
  readonly executionSource?: "lineage-host" | "linked-object";
  readonly restrictions?: readonly GrandArchiveAbilityRestriction[];
  readonly variables?: readonly GrandArchiveVariableDeclaration[];
}

/**
 * A static restriction is checked when announcing and remains attached to the
 * stack item. An inline restriction is evaluated only as its instruction resolves.
 */
export interface GrandArchiveAbilityRestriction {
  readonly kind: "static" | "inline";
  readonly name?:
    | "champion-bonus"
    | "champion-restriction"
    | "class-bonus"
    | "class-locked"
    | "class-restriction"
    | "damage-restriction"
    | "element-bonus"
    | "element-restriction"
    | "level-locked"
    | "level-restriction"
    | "memory-restriction"
    | "sheen-restriction";
  readonly condition: GrandArchiveCondition;
}

export interface GrandArchiveModeDeclaration {
  readonly choose: GrandArchiveSelectionCount;
  readonly declared: "announcement" | "stack-entry" | "resolution";
  readonly allowRepeat?: boolean;
  readonly random?: boolean;
  readonly modes: readonly [
    GrandArchiveModeEffect,
    GrandArchiveModeEffect,
    ...GrandArchiveModeEffect[],
  ];
}

/**
 * Cascade is selected before an ability is put onto the Effects Stack. Its
 * progress belongs to the source object instance, rather than to a counter on
 * that object, and therefore survives a failed resolution but not a zone
 * change that creates a new object.
 */
export interface GrandArchiveCascadeDeclaration {
  readonly kind: "cascade";
  readonly advanceOn: "activation" | "trigger";
  readonly tracking: {
    readonly scope: "source-instance";
    readonly includesCurrent: true;
    readonly advancesIfStackEntryFailsToResolve: true;
  };
  readonly copiedAbility: "repeat-pending-effect-without-advancing";
  readonly modes: readonly [
    GrandArchiveCascadeMode,
    GrandArchiveCascadeMode,
    ...GrandArchiveCascadeMode[],
  ];
}

export interface GrandArchiveCascadeMode extends GrandArchiveModeEffect {
  /** One printed effect may correspond to multiple cascade counts. */
  readonly counts: readonly [number, ...number[]];
}

export type GrandArchiveVariableDeclaration =
  | {
      readonly symbol: "X" | "Y" | "Z";
      readonly kind: "chosen";
      readonly minimum: GrandArchiveAmount;
      readonly maximum?: GrandArchiveAmount;
    }
  | {
      readonly symbol: "X" | "Y" | "Z";
      readonly kind: "derived";
      readonly amount: GrandArchiveAmount;
    };

interface GrandArchiveActivatedAbilityFields extends GrandArchiveAbilityBase {
  readonly kind: "activated";
  /** Activated abilities are fast unless the ability explicitly says otherwise. */
  readonly speed?: "fast" | "slow";
  readonly activation: "ability" | "attack";
  /** Printed permission allowing a non-controller to activate this ability. */
  readonly activationAuthority?: "any-player";
  readonly limit?: {
    readonly count: number;
    readonly per: "source-instance" | "turn" | "game";
    readonly whoseTurn?: "controller" | "any";
  };
  readonly cost: GrandArchiveAbilityCost;
  readonly costModifiers?: readonly {
    readonly operation: "add" | "subtract" | "set";
    readonly amount: GrandArchiveAmount;
    readonly condition?: GrandArchiveCondition;
  }[];
  readonly stackBehavior?: {
    readonly canBeNegated?: false;
  };
  readonly condition?: GrandArchiveCondition;
  readonly targets?: readonly GrandArchiveTargetDeclaration[];
  readonly modes?: GrandArchiveModeDeclaration;
}

export type GrandArchiveActivatedAbility = GrandArchiveActivatedAbilityFields &
  (
    | { readonly effect: GrandArchiveEffect; readonly cascade?: never }
    | {
        readonly cascade: GrandArchiveCascadeDeclaration;
        readonly effect?: never;
        readonly modes?: never;
      }
  );

interface GrandArchiveEffectTriggeredAbilityFields extends GrandArchiveAbilityBase {
  readonly kind: "triggered";
  /** The triggered ability resolves with this rules-source classification. */
  readonly resolutionAs?: "spell";
  readonly trigger: GrandArchiveTrigger;
  readonly limit?: {
    readonly count: number;
    readonly per: "source-instance" | "turn" | "game";
  };
  /** Rechecked on both trigger detection and resolution (intervening condition). */
  readonly interveningCondition?: GrandArchiveCondition;
  /** Declared as the triggered ability is placed onto the Effects Stack. */
  readonly targets?: readonly GrandArchiveTargetDeclaration[];
  readonly modes?: GrandArchiveModeDeclaration;
}

export type GrandArchiveEffectTriggeredAbility = GrandArchiveEffectTriggeredAbilityFields &
  (
    | { readonly effect: GrandArchiveEffect; readonly cascade?: never }
    | {
        readonly cascade: GrandArchiveCascadeDeclaration;
        readonly effect?: never;
        readonly modes?: never;
      }
  );

/** Trigger and resolution are supplied by the intrinsic-keyword registry. */
export interface GrandArchiveIntrinsicTriggeredAbility extends GrandArchiveAbilityBase {
  readonly kind: "triggered";
  readonly intrinsic: true;
  readonly keyword: GrandArchiveKeyword;
  readonly additionalKeywords?: readonly [GrandArchiveKeyword, ...GrandArchiveKeyword[]];
  readonly trigger?: never;
  readonly interveningCondition?: never;
  readonly targets?: never;
  readonly modes?: never;
  readonly effect?: never;
}

export type GrandArchiveTriggeredAbility =
  | GrandArchiveEffectTriggeredAbility
  | GrandArchiveIntrinsicTriggeredAbility;

export interface GrandArchiveEffectStaticAbility extends GrandArchiveAbilityBase {
  readonly kind: "static";
  readonly staticKind: "effects";
  readonly condition?: GrandArchiveCondition;
  readonly effects: readonly [
    (
      | GrandArchiveContinuousEffect
      | GrandArchiveContinuousPlayerStateEffect
      | import("./effect.ts").GrandArchiveContinuousPlayerPropertyEffect
      | GrandArchiveReplacementEffect
      | GrandArchiveRuleModification
      | GrandArchiveTriggerMultiplierEffect
      | GrandArchiveAbilityMultiplierEffect
      | GrandArchiveAttackTargetDelegationEffect
    ),
    ...(
      | GrandArchiveContinuousEffect
      | GrandArchiveContinuousPlayerStateEffect
      | import("./effect.ts").GrandArchiveContinuousPlayerPropertyEffect
      | GrandArchiveReplacementEffect
      | GrandArchiveRuleModification
      | GrandArchiveTriggerMultiplierEffect
      | GrandArchiveAbilityMultiplierEffect
      | GrandArchiveAttackTargetDelegationEffect
    )[],
  ];
}

/** Executable through the engine's versioned intrinsic-keyword registry. */
export interface GrandArchiveIntrinsicStaticAbility extends GrandArchiveAbilityBase {
  readonly kind: "static";
  readonly staticKind: "intrinsic";
  readonly keyword: GrandArchiveKeyword;
  readonly additionalKeywords?: readonly [GrandArchiveKeyword, ...GrandArchiveKeyword[]];
  readonly condition?: GrandArchiveCondition;
  readonly effects?: never;
}

export type GrandArchiveStaticAbility =
  | GrandArchiveEffectStaticAbility
  | GrandArchiveIntrinsicStaticAbility;

/** One printed line may declare intrinsic keywords with different CR ability kinds. */
export interface GrandArchiveKeywordGroupAbility extends GrandArchiveAbilityBase {
  readonly kind: "keyword-group";
  readonly keywords: readonly [GrandArchiveKeyword, GrandArchiveKeyword, ...GrandArchiveKeyword[]];
}

/**
 * Engine declaration for instructions performed by resolving a card activation
 * or materialization. It is deliberately not presented as a fourth CR ability type.
 */
export interface GrandArchiveCardResolution extends GrandArchiveAbilityBase {
  readonly kind: "card-resolution";
  /** Extra announcement cost printed with this card's resolving instructions. */
  readonly additionalCost?: GrandArchiveAbilityCost;
  /** Activation-pipeline rules printed in the same paragraph as this resolution. */
  readonly activationRules?: readonly [
    GrandArchiveRuleModification,
    ...GrandArchiveRuleModification[],
  ];
  readonly condition?: GrandArchiveCondition;
  readonly targets?: readonly GrandArchiveTargetDeclaration[];
  readonly modes?: GrandArchiveModeDeclaration;
  readonly effect: GrandArchiveEffect;
}

/**
 * A printed paragraph that changes the nearest preceding non-modifier ability.
 *
 * Some Grand Archive cards print class/level upgrades as separate paragraphs
 * (for example, “Deal 4 damage to that unit instead.”). They are neither
 * standalone resolutions nor triggered/static abilities. The engine folds
 * these declarations into the referenced ability, in printed order, while
 * retaining their restrictions as conditions on the transformation.
 */
export interface GrandArchiveAbilityModifier extends GrandArchiveAbilityBase {
  readonly kind: "ability-modifier";
  readonly modifies: { readonly kind: "preceding-non-modifier-ability" };
  readonly when?: GrandArchiveCondition;
  readonly operation:
    | { readonly kind: "replace-effect"; readonly effect: GrandArchiveEffect }
    | { readonly kind: "append-effect"; readonly effect: GrandArchiveEffect }
    | { readonly kind: "repeat-effect"; readonly additionalTimes: GrandArchiveAmount };
}

/** Rule installed while constructing a game, before normal turn events exist. */
export interface GrandArchiveGameSetupAbility extends GrandArchiveAbilityBase {
  readonly kind: "game-setup";
  readonly rule:
    | {
        readonly kind: "summon-source-token";
        readonly gameMode: "pantheon";
        readonly players: "each-player";
        readonly timing: "game-beginning";
      }
    | {
        readonly kind: "modify-starting-deck-limit";
        readonly zone: "main-deck" | "material-deck";
        readonly operation: "add-to-maximum";
        readonly amount: number;
        readonly appliesIfIncluded: true;
      }
    | {
        readonly kind: "optional-start-on-field";
        readonly from: "material-deck";
        readonly condition: "source-in-starting-deck";
      };
}

export type GrandArchiveNonCompositeAbility =
  | GrandArchiveActivatedAbility
  | GrandArchiveTriggeredAbility
  | GrandArchiveStaticAbility
  | GrandArchiveKeywordGroupAbility
  | GrandArchiveCardResolution
  | GrandArchiveAbilityModifier
  | GrandArchiveGameSetupAbility;

/**
 * One printed paragraph may install independently registered abilities of
 * different rules kinds. Components retain stable IDs for trigger/rule ownership.
 */
export interface GrandArchiveCompositeAbility extends GrandArchiveAbilityBase {
  readonly kind: "composite";
  readonly abilities: readonly [
    GrandArchiveNonCompositeAbility,
    GrandArchiveNonCompositeAbility,
    ...GrandArchiveNonCompositeAbility[],
  ];
}

export type GrandArchiveAbility = GrandArchiveNonCompositeAbility | GrandArchiveCompositeAbility;

export type GrandArchiveExecutableAbility = GrandArchiveAbility;

/** Explicit parser debt. Engines must reject this at executable-card admission. */
export interface GrandArchiveUnparsedAbility {
  readonly id: GrandArchiveAbilityId;
  readonly kind: "unparsed";
  readonly text: string;
  readonly unparsedSegments: readonly [string, ...string[]];
}

export type GrandArchiveAbilityDefinition =
  | GrandArchiveExecutableAbility
  | GrandArchiveUnparsedAbility;
