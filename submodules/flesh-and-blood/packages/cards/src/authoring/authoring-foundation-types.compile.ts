import type {
  CrushRiderAbility,
  FabEffect,
  FabModalAbility,
  FabTriggeredStaticAbility,
  FabKeyword,
} from "@tcg/flesh-and-blood-types/authoring";

import type {
  CardBehaviorOptions,
  CanonicalCardIdentity,
  ExactCardBehaviorOptions,
  RulesOnlyAbility,
  SemanticAbilityMap,
  SemanticModalAbility,
  SemanticTriggeredStaticAbility,
} from "./card.ts";
import type {
  DefinedVariantFamily,
  ExactVariantMap,
  VariantFamilyIdentity,
  VariantMap,
} from "./variant-family.ts";

type Expect<Condition extends true> = Condition;
type IsAssignable<From, To> = From extends To ? true : false;

type SingletonIdentityHasNoPrintingFields = Expect<
  "set" extends keyof CanonicalCardIdentity
    ? false
    : "collectorNumber" extends keyof CanonicalCardIdentity
      ? false
      : true
>;

type BehaviorHasNoIdentityFields = Expect<
  "canonicalId" extends keyof CardBehaviorOptions
    ? false
    : "types" extends keyof CardBehaviorOptions
      ? false
      : "pitch" extends keyof CardBehaviorOptions
        ? false
        : true
>;

type TwoVariants = {
  readonly alpha: CanonicalCardIdentity;
  readonly beta: CanonicalCardIdentity;
};

type FamilyRetainsExactVariantKeys = Expect<
  keyof DefinedVariantFamily<
    TwoVariants,
    VariantMap<undefined, keyof TwoVariants>
  >["cards"] extends keyof TwoVariants
    ? keyof TwoVariants extends keyof DefinedVariantFamily<
        TwoVariants,
        VariantMap<undefined, keyof TwoVariants>
      >["cards"]
      ? true
      : false
    : false
>;

type MissingVariantParameterIsRejected = Expect<
  IsAssignable<
    { readonly alpha: undefined },
    VariantMap<undefined, keyof TwoVariants>
  > extends false
    ? true
    : false
>;

type FamilyIdentityRejectsNonIdentityVariant = Expect<
  IsAssignable<
    { readonly familyKey: "sample"; readonly variants: { readonly alpha: { readonly id: "bad" } } },
    VariantFamilyIdentity<Readonly<Record<string, CanonicalCardIdentity>>>
  > extends false
    ? true
    : false
>;

type BehaviorKeywordsRemainRulesOnly = Expect<
  IsAssignable<{ readonly keywords: readonly FabKeyword[] }, CardBehaviorOptions>
>;

type IdentityFieldsAreRejectedFromExactBehavior = Expect<
  IsAssignable<
    { readonly keywords: readonly FabKeyword[]; readonly canonicalId: "not-behavior" },
    ExactCardBehaviorOptions<{
      readonly keywords: readonly FabKeyword[];
      readonly canonicalId: "not-behavior";
    }>
  > extends false
    ? true
    : false
>;

type ExtraVariantParameterIsRejected = Expect<
  IsAssignable<
    { readonly alpha: 1; readonly beta: 2; readonly gamma: 3 },
    ExactVariantMap<
      number,
      keyof TwoVariants,
      { readonly alpha: 1; readonly beta: 2; readonly gamma: 3 }
    >
  > extends false
    ? true
    : false
>;

type SampleEffect = Extract<FabEffect, { readonly type: "draw" }>;

type KeyedModalIsAccepted = Expect<
  IsAssignable<
    {
      readonly chooseMode: SemanticModalAbility<{
        readonly drawCard: SampleEffect;
      }>;
    },
    SemanticAbilityMap
  >
>;

type DirectModalArrayIsRejected = Expect<
  IsAssignable<
    { readonly chooseMode: RulesOnlyAbility<FabModalAbility> },
    SemanticAbilityMap
  > extends false
    ? true
    : false
>;

type KeyedTriggeredModalIsAccepted = Expect<
  IsAssignable<
    {
      readonly chooseOnTrigger: SemanticTriggeredStaticAbility<{
        readonly drawCard: SampleEffect;
      }>;
    },
    SemanticAbilityMap
  >
>;

type DirectTriggeredModalUnionIsRejected = Expect<
  IsAssignable<
    { readonly trigger: RulesOnlyAbility<FabTriggeredStaticAbility> },
    SemanticAbilityMap
  > extends false
    ? true
    : false
>;

type RulesOnlyHelperResultIsAccepted = Expect<
  IsAssignable<{ readonly crush: CrushRiderAbility }, SemanticAbilityMap>
>;

type RedundantAbilityIdIsRejected = Expect<
  IsAssignable<
    {
      readonly drawCard: {
        readonly kind: "resolution";
        readonly id: "drawCard";
        readonly effect: SampleEffect;
      };
    },
    SemanticAbilityMap
  > extends false
    ? true
    : false
>;

export type AuthoringFoundationCompileContract = readonly [
  SingletonIdentityHasNoPrintingFields,
  BehaviorHasNoIdentityFields,
  FamilyRetainsExactVariantKeys,
  MissingVariantParameterIsRejected,
  FamilyIdentityRejectsNonIdentityVariant,
  BehaviorKeywordsRemainRulesOnly,
  IdentityFieldsAreRejectedFromExactBehavior,
  ExtraVariantParameterIsRejected,
  KeyedModalIsAccepted,
  DirectModalArrayIsRejected,
  KeyedTriggeredModalIsAccepted,
  DirectTriggeredModalUnionIsRejected,
  RulesOnlyHelperResultIsAccepted,
  RedundantAbilityIdIsRejected,
];
