import type { FabEffect } from "@tcg/flesh-and-blood-types/authoring";

import type {
  CanonicalCardIdentity,
  SemanticLocalizationContract,
  SemanticModalAbility,
  SemanticTriggeredStaticAbility,
} from "./card.ts";
import { defineFamilyI18n, type FamilyLocales } from "./family-i18n.ts";
import type { DefinedPitchFamily, PitchFamilyMap } from "./pitch-family.ts";
import type { DefinedVariantFamily, VariantMap } from "./variant-family.ts";

type DrawEffect = Extract<FabEffect, { readonly type: "draw" }>;
type LocalizationContract = SemanticLocalizationContract<{
  readonly drawCard: DrawEffect;
  readonly chooseOne: SemanticModalAbility<{
    readonly draw: DrawEffect;
    readonly discard: Extract<FabEffect, { readonly type: "discard" }>;
  }>;
  readonly chooseOnTrigger: SemanticTriggeredStaticAbility<{
    readonly gainLife: Extract<FabEffect, { readonly type: "gain-life" }>;
  }>;
}>;
type Locales = FamilyLocales<undefined, "red", LocalizationContract>;
type UnionLocalizationContract = SemanticLocalizationContract<
  | { readonly common: DrawEffect; readonly redOnly: DrawEffect }
  | {
      readonly common: DrawEffect;
      readonly blueOnly: Extract<FabEffect, { readonly type: "gain-life" }>;
    }
>;
type UnionLocales = FamilyLocales<undefined, "red", UnionLocalizationContract>;
type VariantModalLocalizationContract = SemanticLocalizationContract<
  | {
      readonly common: SemanticModalAbility<{
        readonly redMode: DrawEffect;
      }>;
    }
  | {
      readonly common: SemanticModalAbility<{
        readonly blueMode: DrawEffect;
      }>;
    }
>;
type VariantModalLocales = FamilyLocales<undefined, "red", VariantModalLocalizationContract>;

declare const family: DefinedPitchFamily<
  PitchFamilyMap<undefined, "red">,
  "red",
  Extract<keyof LocalizationContract, string>,
  { readonly [Key in keyof LocalizationContract]: LocalizationContract[Key]["modeKeys"] }
>;
declare const familyWithoutAbilities: DefinedPitchFamily<PitchFamilyMap<undefined, "red">, "red">;
declare const variantFamily: DefinedVariantFamily<
  Readonly<Record<"red", CanonicalCardIdentity>>,
  VariantMap<undefined, "red">,
  Extract<keyof LocalizationContract, string>,
  { readonly [Key in keyof LocalizationContract]: LocalizationContract[Key]["modeKeys"] }
>;
declare const unbrandedFamily: {
  readonly parameters: PitchFamilyMap<undefined, "red">;
  readonly cards: typeof family.cards;
};

const validLocales = {
  en: {
    name: "Localized card",
    typeText: "Action",
    abilities: {
      drawCard: { text: "Draw a card." },
      chooseOne: { modes: { draw: "Draw", discard: "Discard" } },
      chooseOnTrigger: { modes: { gainLife: "Gain life" } },
    },
  },
} as const satisfies Locales;
const validUnionLocales = {
  en: {
    name: "Union family",
    typeText: "Action",
    abilities: { common: { text: "Common" } },
  },
} as const satisfies UnionLocales;
const invalidUnionLocales = {
  en: {
    name: "Invalid union family",
    typeText: "Action",
    abilities: {
      // @ts-expect-error family-wide overrides are restricted to keys common to every variant
      redOnly: { text: "Red" },
    },
  },
} as const satisfies UnionLocales;
const invalidVariantModalLocales = {
  en: {
    name: "Invalid variant modal family",
    typeText: "Action",
    abilities: {
      common: {
        // @ts-expect-error family-wide mode overrides require a mode present on every variant
        modes: { redMode: "Red" },
      },
    },
  },
} as const satisfies VariantModalLocales;
const invalidOtherVariantModalLocales = {
  en: {
    name: "Invalid other variant modal family",
    typeText: "Action",
    abilities: {
      common: {
        // @ts-expect-error family-wide mode overrides require a mode present on every variant
        modes: { blueMode: "Blue" },
      },
    },
  },
} as const satisfies VariantModalLocales;

defineFamilyI18n(family, validLocales);
defineFamilyI18n(variantFamily, validLocales);
// @ts-expect-error localization contracts must originate from a family constructor
defineFamilyI18n(unbrandedFamily, validLocales);

defineFamilyI18n(family, {
  en: {
    name: "Invalid ability key",
    typeText: "Action",
    abilities: {
      // @ts-expect-error localization keys must be authored semantic ability keys
      unknownAbility: { text: "Unknown" },
    },
  },
});

defineFamilyI18n(family, {
  en: {
    name: "Invalid modes on non-modal ability",
    typeText: "Action",
    abilities: {
      drawCard: {
        // @ts-expect-error only modal abilities accept localized mode keys
        modes: { draw: "Draw" },
      },
    },
  },
});

defineFamilyI18n(familyWithoutAbilities, {
  en: {
    name: "Invalid ability on behaviorless family",
    typeText: "Action",
    abilities: {
      // @ts-expect-error families without authored abilities have no localization keys
      drawCard: { text: "Draw a card." },
    },
  },
});

defineFamilyI18n(family, {
  en: {
    name: "Invalid mode key",
    typeText: "Action",
    abilities: {
      chooseOne: {
        modes: {
          // @ts-expect-error modal localization keys must be authored semantic mode keys
          unknownMode: "Unknown",
        },
      },
    },
  },
});

export type FamilyI18nCompileContract = readonly [
  Locales,
  typeof validUnionLocales,
  typeof invalidUnionLocales,
  typeof invalidVariantModalLocales,
  typeof invalidOtherVariantModalLocales,
];
