import {
  COLOR_TO_PITCH,
  type AuthoringHasStatusConstraint,
  type FabKeyword,
  type FabSupertypeSets,
  type FabTypeBox,
  type FleshAndBloodCard,
  type PitchColor,
  type PitchValue,
} from "@tcg/flesh-and-blood-types/authoring";

import {
  carrySemanticLocalizationContract,
  semanticModalAbility,
  type SemanticAbility,
  type SemanticAbilityMap,
  type SemanticModalAbility,
  type SemanticModalMode,
  type SemanticModalModeMap,
  type SemanticLocalizationContractCarrier,
  type SemanticLocalizationContractFromKeys,
  type SemanticLocalizationModeKeysOf,
} from "./card.ts";
import { type FabAuthoredCardLayout, type FabCanonicalIdentityRef } from "./layouts.ts";
import { defineVariantCards } from "./variant-family.ts";

export const PITCH_FAMILY_COLORS = ["red", "yellow", "blue"] as const;

export type PitchFamilyColor = (typeof PITCH_FAMILY_COLORS)[number];
export type PitchFamilyMap<Value, Colors extends PitchFamilyColor = PitchFamilyColor> = {
  readonly [Color in Colors]: Value;
};
export type PartialPitchFamilyMap<Value> = Partial<PitchFamilyMap<Value>>;
export type ExactPitchFamilyMap<Value extends PartialPitchFamilyMap<unknown>> =
  Exclude<keyof Value, PitchFamilyColor> extends never ? Value : never;
export type PitchFamilyParameters<Value extends PartialPitchFamilyMap<unknown>> = Value &
  ExactPitchFamilyMap<Value>;

type PitchFamilyNumericProperties = {
  readonly cost?: number;
  readonly power?: number;
  readonly defense?: number;
  readonly health?: number;
  readonly intelligence?: number;
  readonly arcane?: number;
};

export type PitchFamilySharedIdentity = PitchFamilyNumericProperties & {
  readonly typeBox: FabTypeBox;
  readonly traits?: readonly string[];
};

export type PitchFamilyVariantIdentity = PitchFamilyNumericProperties & {
  readonly canonicalId: string;
  readonly slug: string;
};

export type PitchFamilyIdentity<Colors extends PitchFamilyColor = PitchFamilyColor> = {
  readonly slug: string;
  readonly shared: PitchFamilySharedIdentity;
  readonly variants: PitchFamilyMap<PitchFamilyVariantIdentity, Colors>;
};

export type PitchFamilyIdentityCatalog = Readonly<
  Record<string, { [Color in PitchFamilyColor]: PitchFamilyIdentity<Color> }[PitchFamilyColor]>
>;

export type PitchFamilyAbility = SemanticAbility;

/**
 * A modal ability whose modes are keyed by semantic names rather than an
 * array position. The keys become part of each generated card's stable mode
 * identity when the family is expanded.
 */
export type PitchFamilyModalMode = SemanticModalMode;
export type PitchFamilyModalModeMap = SemanticModalModeMap;
export type PitchFamilyModalAbility<
  Modes extends PitchFamilyModalModeMap = PitchFamilyModalModeMap,
> = SemanticModalAbility<Modes>;

export function modalAbility<const Modes extends PitchFamilyModalModeMap>(
  ability: SemanticModalAbility<Modes>,
): PitchFamilyModalAbility<Modes> {
  return semanticModalAbility(ability);
}

export type PitchFamilyAbilityMap = SemanticAbilityMap;

/**
 * Shared keywords may be supplied once, while pitch-sensitive keywords can be
 * supplied per printing with pitchMap({ red: [...], yellow: [...], blue: [...] }).
 */
export type PitchFamilyKeywords<Colors extends PitchFamilyColor = PitchFamilyColor> =
  | readonly FabKeyword[]
  | PitchFamilyMap<readonly FabKeyword[], Colors>;

export type PitchFamilyAbilityContext = {
  readonly canonicalId: string;
  readonly color: PitchColor;
  readonly pitch: PitchValue;
};

export type DefinedPitchFamily<
  Parameters extends PartialPitchFamilyMap<unknown>,
  Colors extends PitchFamilyColor = Extract<keyof Parameters, PitchFamilyColor>,
  AbilityKeys extends string = never,
  ModeKeys extends Readonly<Record<AbilityKeys, string>> = Readonly<Record<AbilityKeys, never>>,
> = {
  readonly identity: PitchFamilyIdentity<Colors>;
  readonly parameters: Parameters;
  readonly cards: PitchFamilyMap<FleshAndBloodCard, Colors>;
} & SemanticLocalizationContractCarrier<
  SemanticLocalizationContractFromKeys<AbilityKeys, ModeKeys>
>;

type PitchFamilyOptions<
  Parameter,
  Abilities extends PitchFamilyAbilityMap,
  Colors extends PitchFamilyColor,
> = {
  readonly supertypeSets?: FabSupertypeSets;
  readonly layouts?: PitchFamilyMap<FabAuthoredCardLayout<FabCanonicalIdentityRef>, Colors>;
  readonly keywords?: PitchFamilyKeywords<Colors>;
  readonly abilities?: (parameter: Parameter, context: PitchFamilyAbilityContext) => Abilities;
};

const EMPTY_PARAMETERS: PitchFamilyMap<undefined> = {
  red: undefined,
  yellow: undefined,
  blue: undefined,
};

const DISPLAY_COLOR = {
  red: "Red",
  yellow: "Yellow",
  blue: "Blue",
} as const satisfies PitchFamilyMap<PitchColor>;

export function pitchMap<const Value extends PitchFamilyMap<unknown>>(
  value: Value & ExactPitchFamilyMap<Value>,
): Value {
  return value;
}

export function definePitchFamily<
  const Colors extends PitchFamilyColor,
  const Parameters extends PitchFamilyMap<unknown, Colors> = PitchFamilyMap<undefined, Colors>,
  const Abilities extends PitchFamilyAbilityMap = Readonly<Record<never, never>>,
  const AbilityKeys extends string = Extract<keyof Abilities, string>,
  const ModeKeys extends Readonly<Record<AbilityKeys, string>> = {
    readonly [Key in AbilityKeys]: SemanticLocalizationModeKeysOf<Abilities[Key]>;
  },
>(
  identity: PitchFamilyIdentity<Colors>,
  options: PitchFamilyOptions<Parameters[Colors], Abilities, Colors> &
    AuthoringHasStatusConstraint<Abilities> & {
      readonly parameters?: PitchFamilyParameters<Parameters>;
    },
): DefinedPitchFamily<Parameters, Colors, AbilityKeys, ModeKeys>;
export function definePitchFamily<
  Colors extends PitchFamilyColor,
  Parameters extends PitchFamilyMap<unknown, Colors>,
>(
  identity: PitchFamilyIdentity<Colors>,
  options: PitchFamilyOptions<unknown, PitchFamilyAbilityMap, Colors> & {
    readonly parameters?: Parameters;
  },
): DefinedPitchFamily<Parameters, Colors, string, Readonly<Record<string, string>>> {
  const familyColors = PITCH_FAMILY_COLORS.filter((color): color is Colors =>
    Object.hasOwn(identity.variants, color),
  );
  const parameters = (options.parameters ?? EMPTY_PARAMETERS) as Parameters;
  const variants = mapPitchColors(familyColors, (familyColor) => {
    const variant = identity.variants[familyColor];
    const color = DISPLAY_COLOR[familyColor];
    const pitch = COLOR_TO_PITCH[color];
    return {
      ...identity.shared,
      ...variant,
      color,
      pitch,
      ...(options.supertypeSets
        ? { typeBox: { ...identity.shared.typeBox, supertypeSets: options.supertypeSets } }
        : {}),
    };
  });
  const authoredAbilities = options.abilities;
  const cards = defineVariantCards(variants, parameters, {
    ...(options.layouts ? { layouts: options.layouts } : {}),
    keywords: (_parameter, context) => resolveKeywords(options.keywords, context.variant),
    ...(authoredAbilities
      ? {
          abilities: (parameter, context) => {
            const color = DISPLAY_COLOR[context.variant];
            return authoredAbilities(parameter, {
              canonicalId: context.canonicalId,
              color,
              pitch: COLOR_TO_PITCH[color],
            });
          },
        }
      : {}),
  }) as PitchFamilyMap<FleshAndBloodCard, Colors>;

  return {
    identity,
    parameters,
    cards,
    ...carrySemanticLocalizationContract<
      SemanticLocalizationContractFromKeys<string, Readonly<Record<string, string>>>
    >(),
  };
}

function resolveKeywords<Colors extends PitchFamilyColor>(
  keywords: PitchFamilyKeywords<Colors> | undefined,
  familyColor: Colors,
): readonly FabKeyword[] {
  if (keywords === undefined) return [];
  return isPitchFamilyKeywordMap(keywords) ? keywords[familyColor] : keywords;
}

function isPitchFamilyKeywordMap<Colors extends PitchFamilyColor>(
  keywords: PitchFamilyKeywords<Colors>,
): keywords is PitchFamilyMap<readonly FabKeyword[], Colors> {
  return !Array.isArray(keywords);
}

function mapPitchColors<Colors extends PitchFamilyColor, Value>(
  colors: readonly Colors[],
  map: (color: Colors) => Value,
): PitchFamilyMap<Value, Colors> {
  const result: PartialPitchFamilyMap<Value> = {};
  for (const color of colors) result[color] = map(color);
  return result as PitchFamilyMap<Value, Colors>;
}
