import {
  getFabCardCategory,
  specializationHeroNames,
  type FabEffect,
  type FabMetatype,
} from "@tcg/flesh-and-blood-types";
import {
  basePropertiesOf,
  registerFabCardDefinition,
  type FabCardDefinitionInput,
} from "./cards.ts";
import type { FabDeckbuildingRules, FabValidationCard } from "./deck-validation.ts";
import type { FleshAndBloodCatalogCard } from "@tcg/flesh-and-blood-types/catalog";

function heroMetatype(value: FabMetatype): boolean {
  switch (value) {
    case "Arakni":
    case "Puffin":
    case "Scurv":
      return true;
    case "High Seas":
    case "Omens of the Third Age":
    case "Rosetta":
    case "Token":
      return false;
    default: {
      const exhaustive: never = value;
      return exhaustive;
    }
  }
}
function equipRestrictions(effect: FabEffect): FabDeckbuildingRules["equipRestrictions"] {
  if (effect.type === "sequence") return effect.steps.flatMap(equipRestrictions);
  if (
    effect.type !== "rule-modification" ||
    effect.mode !== "restrict" ||
    effect.action !== "equip"
  )
    return [];
  return [
    {
      types: [
        ...(effect.filter?.typeBox?.types ?? []),
        ...(effect.filter?.typeBox?.subtypes ?? []),
        ...(effect.filter?.typeBox?.supertypes ?? []),
      ],
    },
  ];
}
/** Project authored, language-independent facts once at the catalog boundary. */
export function createFabDeckbuildingRules(
  definition: FabCardDefinitionInput,
): FabDeckbuildingRules {
  const base = basePropertiesOf(registerFabCardDefinition(definition));
  const keywords = base.keywords;
  const effects = base.abilities.flatMap((ability) =>
    ability.kind === "static" &&
    (ability.staticKind === "continuous" ||
      ability.staticKind === "meta" ||
      ability.staticKind === "while") &&
    ability.effect
      ? [ability.effect]
      : [],
  );
  return {
    names: base.names,
    heroMetatypes: base.typeBox.metatypes.filter(heroMetatype),
    specializationHeroes: keywords.flatMap((keyword) =>
      keyword.name === "specialization" ? specializationHeroNames(keyword.hero) : [],
    ),
    essence: keywords.flatMap((keyword) => (keyword.name === "essence" ? keyword.supertypes : [])),
    legendary: keywords.some((keyword) => keyword.name === "legendary"),
    unlimited: keywords.some((keyword) => keyword.name === "unlimited"),
    ephemeral: keywords.some((keyword) => keyword.name === "ephemeral"),
    modular: keywords.some((keyword) => keyword.name === "modular"),
    perched: keywords.some((keyword) => keyword.name === "perched"),
    pairsWith: keywords.flatMap((keyword) => (keyword.name === "pairs" ? [keyword.cardName] : [])),
    anySpecialization: effects.some(
      (effect) =>
        effect.type === "rule-modification" &&
        effect.mode === "allow" &&
        effect.action === "have-in-deck" &&
        effect.filter?.hasStatus === "deckbuilding-exception",
    ),
    swordsAsOneHanded: effects.some(
      (effect) =>
        effect.type === "rule-modification" &&
        effect.mode === "allow" &&
        effect.action === "equip" &&
        effect.handedness === "2h-sword-as-1h",
    ),
    equipRestrictions: effects.flatMap(equipRestrictions),
  };
}
export function createFabValidationCard(
  definition: FabCardDefinitionInput,
  metadata?: Pick<FleshAndBloodCatalogCard, "name" | "legalities" | "printings">,
): FabValidationCard {
  const registered = registerFabCardDefinition(definition);
  const base = basePropertiesOf(registered);
  const box = base.typeBox;
  return {
    canonicalId: registered.canonicalId,
    name: metadata?.name ?? base.names[0] ?? registered.canonicalId,
    types: [...box.types, ...box.subtypes, ...box.supertypes],
    supertypeSets: box.supertypeSets ?? [box.supertypes],
    identityTypes: box.supertypes,
    cardCategory: getFabCardCategory(box),
    ...(base.numeric.pitch === undefined ? {} : { pitch: String(base.numeric.pitch) }),
    deckbuilding: createFabDeckbuildingRules(registered),
    legalFormats: metadata
      ? Object.entries(metadata.legalities)
          .filter(([, value]) => value.legal && !value.banned && !value.suspended)
          .map(([key]) => key)
      : [],
    restrictedFormats: metadata
      ? Object.entries(metadata.legalities)
          .filter(([, value]) => value.restricted)
          .map(([key]) => key)
      : [],
    rarities: metadata?.printings.map((printing) => printing.rarity) ?? [],
  };
}
