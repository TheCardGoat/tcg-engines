import type {
  FleshAndBloodCard,
  FleshAndBloodCardI18n,
  FleshAndBloodCardLocaleText,
} from "@tcg/flesh-and-blood-types/authoring";

import type {
  SemanticLocalizationContractCarrier,
  SemanticLocalizationContractShape,
} from "./card.ts";
import { normalizeAbilityOverrides, type AbilityLocaleOverrides } from "./family-i18n.ts";

type CardLocaleText<Contract extends SemanticLocalizationContractShape> = Omit<
  FleshAndBloodCardLocaleText,
  "abilities"
> & { readonly abilities?: AbilityLocaleOverrides<Contract> };

type CardLocales<Contract extends SemanticLocalizationContractShape> = Readonly<
  Record<string, CardLocaleText<Contract>>
> & { readonly en: CardLocaleText<Contract> };

/** Localize one authored card with compile-time checked semantic ability keys. */
export function defineCardI18n<Contract extends SemanticLocalizationContractShape>(
  card: FleshAndBloodCard & SemanticLocalizationContractCarrier<Contract>,
  locales: CardLocales<NoInfer<Contract>>,
): FleshAndBloodCardI18n {
  const normalized = (text: CardLocaleText<Contract>): FleshAndBloodCardLocaleText => {
    const { abilities, ...rest } = text;
    return abilities === undefined
      ? rest
      : { ...rest, abilities: normalizeAbilityOverrides(abilities) };
  };
  return {
    canonicalId: card.canonicalId,
    locales: {
      ...Object.fromEntries(
        Object.entries(locales).map(([locale, text]) => [locale, normalized(text)]),
      ),
      en: normalized(locales.en),
    },
  };
}
