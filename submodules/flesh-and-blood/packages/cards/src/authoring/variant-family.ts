import {
  type AuthoringHasStatusConstraint,
  type FabKeyword,
  type FleshAndBloodCard,
} from "@tcg/flesh-and-blood-types/authoring";

import {
  carrySemanticLocalizationContract,
  defineCard,
  type CanonicalCardIdentity,
  type SemanticAbilityMap,
  type SemanticLocalizationContractCarrier,
  type SemanticLocalizationContractFromKeys,
  type SemanticLocalizationModeKeysOf,
} from "./card.ts";
import {
  toRuntimeCardLayout,
  type FabAuthoredCardLayout,
  type FabCanonicalIdentityRef,
} from "./layouts.ts";

export type VariantMap<Value, Variant extends string> = {
  readonly [Key in Variant]: Value;
};

export type ExactVariantMap<
  Value,
  Variant extends string,
  Candidate extends VariantMap<Value, Variant>,
> = Candidate & Record<Exclude<keyof Candidate, Variant>, never>;

export type VariantFamilyIdentity<
  Variants extends Readonly<Record<string, CanonicalCardIdentity>>,
> = { readonly familyKey: string; readonly variants: Variants };

export type VariantFamilyContext<Variant extends string> = {
  readonly canonicalId: string;
  readonly identity: CanonicalCardIdentity;
  readonly variant: Variant;
};

export type DefinedVariantFamily<
  Variants extends Readonly<Record<string, CanonicalCardIdentity>>,
  Parameters extends VariantMap<unknown, Extract<keyof Variants, string>>,
  AbilityKeys extends string = never,
  ModeKeys extends Readonly<Record<AbilityKeys, string>> = Readonly<Record<AbilityKeys, never>>,
> = {
  readonly identity: VariantFamilyIdentity<Variants>;
  readonly parameters: Parameters;
  readonly cards: VariantMap<FleshAndBloodCard, Extract<keyof Variants, string>>;
} & SemanticLocalizationContractCarrier<
  SemanticLocalizationContractFromKeys<AbilityKeys, ModeKeys>
>;

type VariantFamilyOptions<
  Parameter,
  Variant extends string,
  Abilities extends SemanticAbilityMap,
> = {
  readonly parameters?: VariantMap<Parameter, Variant>;
  readonly layouts?: VariantMap<FabAuthoredCardLayout<FabCanonicalIdentityRef>, Variant>;
  readonly keywords?:
    | readonly FabKeyword[]
    | ((parameter: Parameter, context: VariantFamilyContext<Variant>) => readonly FabKeyword[]);
  readonly abilities?: (parameter: Parameter, context: VariantFamilyContext<Variant>) => Abilities;
};

export type VariantCardOptions<
  Parameter,
  Variant extends string,
  Abilities extends SemanticAbilityMap,
> = Omit<VariantFamilyOptions<Parameter, Variant, Abilities>, "parameters">;

type NoExtraFamilyOptions<Options> = Record<
  Exclude<keyof Options, keyof VariantFamilyOptions<unknown, string, SemanticAbilityMap>>,
  never
>;

export function defineVariantFamily<
  const Variants extends Readonly<Record<string, CanonicalCardIdentity>>,
  const Parameters extends VariantMap<unknown, Extract<keyof Variants, string>> = VariantMap<
    undefined,
    Extract<keyof Variants, string>
  >,
  const Abilities extends SemanticAbilityMap = Readonly<Record<never, never>>,
  const AbilityKeys extends string = Extract<keyof Abilities, string>,
  const ModeKeys extends Readonly<Record<AbilityKeys, string>> = {
    readonly [Key in AbilityKeys]: SemanticLocalizationModeKeysOf<Abilities[Key]>;
  },
  const Options extends VariantFamilyOptions<
    Parameters[Extract<keyof Variants, string>],
    Extract<keyof Variants, string>,
    Abilities
  > = VariantFamilyOptions<
    Parameters[Extract<keyof Variants, string>],
    Extract<keyof Variants, string>,
    Abilities
  >,
>(
  identity: VariantFamilyIdentity<Variants>,
  options: Options &
    NoExtraFamilyOptions<Options> &
    AuthoringHasStatusConstraint<Abilities> & {
      readonly parameters?: ExactVariantMap<
        Parameters[Extract<keyof Variants, string>],
        Extract<keyof Variants, string>,
        Parameters
      >;
    },
): DefinedVariantFamily<Variants, Parameters, AbilityKeys, ModeKeys> {
  const variants = objectKeys(identity.variants);
  const parameters = (options.parameters ??
    Object.fromEntries(variants.map((variant) => [variant, undefined]))) as Parameters;
  const cards = defineVariantCards(identity.variants, parameters, options);

  return {
    identity,
    parameters,
    cards,
    ...carrySemanticLocalizationContract<
      SemanticLocalizationContractFromKeys<AbilityKeys, ModeKeys>
    >(),
  };
}

/** Shared strict constructor used by declared variant specializations. */
export function defineVariantCards<
  const Variants extends Readonly<Record<string, CanonicalCardIdentity>>,
  const Parameters extends VariantMap<unknown, Extract<keyof Variants, string>>,
  const Abilities extends SemanticAbilityMap = Readonly<Record<never, never>>,
>(
  identities: Variants,
  parameters: Parameters,
  options: VariantCardOptions<
    Parameters[Extract<keyof Variants, string>],
    Extract<keyof Variants, string>,
    Abilities
  >,
): VariantMap<FleshAndBloodCard, Extract<keyof Variants, string>> {
  type Variant = Extract<keyof Variants, string>;
  const variants = objectKeys(identities);
  const cards = Object.fromEntries(
    variants.map((variant) => {
      const variantIdentity = identities[variant];
      const context: VariantFamilyContext<Variant> = {
        canonicalId: variantIdentity.canonicalId,
        identity: variantIdentity,
        variant,
      };
      const parameter = parameters[variant];
      const keywords =
        typeof options.keywords === "function"
          ? options.keywords(parameter, context)
          : options.keywords;
      const abilities = options.abilities?.(parameter, context);
      const authoredLayout = options.layouts?.[variant];
      if (authoredLayout && authoredLayout.physicalCanonicalId !== variantIdentity.canonicalId) {
        throw new Error(
          `Layout ${authoredLayout.physicalCanonicalId} does not match variant ${variantIdentity.canonicalId}`,
        );
      }
      const card = defineCard(variantIdentity, {
        ...(keywords && keywords.length > 0 ? { keywords } : {}),
        ...(abilities ? { abilities } : {}),
        ...(authoredLayout ? { layout: toRuntimeCardLayout(authoredLayout) } : {}),
      });
      return [variant, card] as const;
    }),
  ) as VariantMap<FleshAndBloodCard, Variant>;
  return cards;
}

function objectKeys<const Value extends object>(
  value: Value,
): readonly Extract<keyof Value, string>[] {
  return Object.keys(value).filter((key): key is Extract<keyof Value, string> => key in value);
}
