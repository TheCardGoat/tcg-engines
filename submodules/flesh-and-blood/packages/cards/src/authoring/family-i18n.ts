import type {
  FleshAndBloodAbilityLocaleText,
  FleshAndBloodCard,
  FleshAndBloodCardI18n,
  FleshAndBloodCardLocaleText,
} from "@tcg/flesh-and-blood-types/authoring";

import type {
  SemanticLocalizationContractCarrier,
  SemanticLocalizationContractShape,
} from "./card.ts";
import type { VariantMap } from "./variant-family.ts";

type LocalizedValue<Parameter, Variant extends string> =
  | string
  | ((parameter: Parameter, variant: Variant) => string);

export type AbilityLocaleOverride<Contract extends { readonly modeKeys: string }> = {
  readonly text?: string;
  readonly displayName?: string;
  readonly modes?: [Contract["modeKeys"]] extends [never]
    ? never
    : Partial<Record<Contract["modeKeys"], string>>;
};

export type AbilityLocaleOverrides<Contract extends SemanticLocalizationContractShape> = [
  Extract<keyof Contract, string>,
] extends [never]
  ? never
  : {
      readonly [Key in Extract<keyof Contract, string>]?: AbilityLocaleOverride<Contract[Key]>;
    };

export type FamilyLocaleText<
  Parameter,
  Variant extends string,
  Contract extends SemanticLocalizationContractShape,
> = {
  readonly name: LocalizedValue<Parameter, Variant>;
  readonly typeText: LocalizedValue<Parameter, Variant>;
  readonly text?: LocalizedValue<Parameter, Variant>;
  readonly abilities?:
    | AbilityLocaleOverrides<Contract>
    | ((parameter: Parameter, variant: Variant) => AbilityLocaleOverrides<Contract>);
};

export type FamilyLocales<
  Parameter,
  Variant extends string,
  Contract extends SemanticLocalizationContractShape,
> = Readonly<Record<string, FamilyLocaleText<Parameter, Variant, Contract>>> & {
  readonly en: FamilyLocaleText<Parameter, Variant, Contract>;
};

type FamilyDefinition<
  Parameter,
  Variant extends string,
  Contract extends SemanticLocalizationContractShape,
> = {
  readonly parameters: VariantMap<Parameter, Variant>;
  readonly cards: VariantMap<FleshAndBloodCard, Variant>;
} & SemanticLocalizationContractCarrier<Contract>;

export type DefinedFamilyI18n<Variant extends string> = {
  readonly cards: VariantMap<FleshAndBloodCardI18n, Variant>;
};

export function defineFamilyI18n<
  Parameter,
  Variant extends string,
  Contract extends SemanticLocalizationContractShape,
>(
  family: FamilyDefinition<Parameter, Variant, Contract>,
  locales: FamilyLocales<Parameter, Variant, NoInfer<Contract>>,
): DefinedFamilyI18n<Variant> {
  const variants = objectKeys(family.cards);
  const cards = Object.fromEntries(
    variants.map((variant) => {
      const localized = Object.fromEntries(
        Object.entries(locales).map(([locale, text]) => [
          locale,
          localeText(text, family.parameters[variant], variant),
        ]),
      ) as FleshAndBloodCardI18n["locales"];
      return [
        variant,
        {
          canonicalId: family.cards[variant].canonicalId,
          locales: localized,
        },
      ] as const;
    }),
  ) as VariantMap<FleshAndBloodCardI18n, Variant>;

  return { cards };
}

function localeText<
  Parameter,
  Variant extends string,
  Contract extends SemanticLocalizationContractShape,
>(
  text: FamilyLocaleText<Parameter, Variant, Contract>,
  parameter: Parameter,
  variant: Variant,
): FleshAndBloodCardLocaleText {
  return {
    name: resolveLocalized(text.name, parameter, variant),
    typeText: resolveLocalized(text.typeText, parameter, variant),
    ...(text.text === undefined ? {} : { text: resolveLocalized(text.text, parameter, variant) }),
    ...(text.abilities === undefined
      ? {}
      : {
          abilities: normalizeAbilityOverrides(
            typeof text.abilities === "function"
              ? text.abilities(parameter, variant)
              : text.abilities,
          ),
        }),
  };
}

function normalizeAbilityOverrides<Contract extends SemanticLocalizationContractShape>(
  overrides: AbilityLocaleOverrides<Contract>,
): Readonly<Record<string, FleshAndBloodAbilityLocaleText>> {
  const entries = Object.entries(overrides).filter(
    (entry): entry is [string, FleshAndBloodAbilityLocaleText] => entry[1] !== undefined,
  );
  return Object.fromEntries(entries);
}

function resolveLocalized<Parameter, Variant extends string>(
  value: LocalizedValue<Parameter, Variant>,
  parameter: Parameter,
  variant: Variant,
): string {
  return typeof value === "function" ? value(parameter, variant) : value;
}

function objectKeys<const Value extends object>(
  value: Value,
): readonly Extract<keyof Value, string>[] {
  return Object.keys(value).filter((key): key is Extract<keyof Value, string> => key in value);
}
