import type { FleshAndBloodAbility, FabFaceId, FabKeyword } from "./abilities/index.ts";
import {
  FAB_CLASS_SUPERTYPES,
  FAB_METATYPES,
  FAB_SUBTYPES,
  FAB_TALENT_SUPERTYPES,
  FAB_TRAITS,
  FAB_TYPES,
  type FabBaseObjectProperties,
  type FabColor,
  type FabSupertypeSets,
  type FabTypeBox,
} from "./base-object-properties.ts";

/** Loose printed-property input accepted only at authoring/load boundaries. */
export interface FabBaseObjectPropertiesInput {
  readonly canonicalId: string;
  readonly faceId?: FabFaceId;
  readonly textBoxId?: string;
  readonly name?: string;
  readonly types?: readonly string[];
  readonly supertypeSets?: FabSupertypeSets;
  readonly traits?: readonly string[];
  readonly color?: string;
  readonly pitch?: string | number;
  readonly cost?: number;
  readonly power?: number;
  readonly defense?: number;
  readonly health?: number;
  readonly intelligence?: number;
  readonly arcane?: number;
  readonly keywords?: readonly (string | FabKeyword)[];
  readonly abilities?: readonly FleshAndBloodAbility[];
}

/**
 * Convert loose catalog/authoring aliases into the sole runtime printed-property record.
 * Rules consumers must receive the returned record and never reclassify flat tokens.
 */
export function normalizeBaseObjectProperties(
  card: FabBaseObjectPropertiesInput,
): FabBaseObjectProperties {
  const typeTokens = card.types ?? [];
  const numeric: Partial<Record<keyof FabBaseObjectProperties["numeric"], number>> = {};
  const pitch = numericValue(card.pitch);
  if (pitch !== undefined) numeric.pitch = pitch;
  if (card.cost !== undefined) numeric.cost = card.cost;
  if (card.power !== undefined) numeric.power = card.power;
  if (card.defense !== undefined) numeric.defense = card.defense;
  if (card.health !== undefined) numeric.life = card.health;
  if (card.intelligence !== undefined) numeric.intellect = card.intelligence;
  if (card.arcane !== undefined) numeric.arcane = card.arcane;
  const typeBox = typeBoxFromTokens(typeTokens, card.supertypeSets);
  return {
    names: [card.name ?? card.canonicalId],
    activeFaceIds: [card.faceId ?? `${card.canonicalId}:face:front`],
    color: normalizeColor(card.color),
    typeBoxes: [typeBox],
    typeBox,
    traits: collectTraits(card.traits ?? []),
    textBoxIds: [card.textBoxId ?? card.canonicalId],
    numeric,
    keywords: (card.keywords ?? []).filter(
      (keyword): keyword is FabKeyword => typeof keyword !== "string",
    ),
    abilities: card.abilities ?? [],
  };
}

/** Classify a generated flat type line once, before it reaches runtime consumers. */
export function typeBoxFromTokens(
  typeTokens: readonly string[],
  supertypeSets?: FabSupertypeSets,
): FabTypeBox {
  assertKnownTypeTokens(typeTokens);
  const supertypes = [...FAB_CLASS_SUPERTYPES, ...FAB_TALENT_SUPERTYPES].filter((value) =>
    typeTokens.includes(value),
  );
  if (supertypeSets?.some((set) => set.some((value) => !supertypes.includes(value)))) {
    throw new Error("hybrid supertype group contains a supertype absent from its type box");
  }
  return {
    metatypes: FAB_METATYPES.filter((value) => typeTokens.includes(value)),
    ...(supertypeSets ? { supertypeSets } : {}),
    supertypes,
    types: FAB_TYPES.filter((value) => typeTokens.includes(value)),
    subtypes: FAB_SUBTYPES.filter((value) => typeTokens.includes(value)),
  };
}

/** Temporary generated-face bridge while face layouts still emit flat typed tokens. */
export function typeBoxTokens(
  typeBox: FabTypeBox,
): readonly import("./base-object-properties.ts").FabTypeBoxToken[] {
  const tokens: import("./base-object-properties.ts").FabTypeBoxToken[] = [];
  const classless =
    typeBox.supertypes.length === 0 &&
    typeBox.types.some((type) => type === "Action" || type === "Instant" || type === "Resource");
  if (classless) tokens.push("Generic");
  tokens.push(...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes);
  return tokens;
}

/** Derive the rules-visible printed name used when an authored identity only carries a slug. */
export function cardNameFromSlug(slug: string, pitch?: string | number): string {
  const hasPitchProperty = [1, 2, 3, 4].includes(typeof pitch === "number" ? pitch : Number(pitch));
  const identitySlug = hasPitchProperty ? slug.replace(/-(red|yellow|blue)$/i, "") : slug;
  return identitySlug
    .replace(/-s(?=-|$)/g, "'s")
    .split("-")
    .filter(Boolean)
    .map((part) => {
      if (part.endsWith("'s") && part.length > 2) {
        const base = part.slice(0, -2);
        return `${base[0]?.toUpperCase() ?? ""}${base.slice(1)}'s`;
      }
      return `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`;
    })
    .join(" ");
}

function numericValue(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  const numeric = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isNaN(numeric) ? undefined : numeric;
}

function normalizeColor(value: string | undefined): FabColor | null {
  switch (value?.toLowerCase()) {
    case "purple":
    case "red":
    case "yellow":
    case "blue":
      return value.toLowerCase() as FabColor;
    default:
      return null;
  }
}

function collectTraits(values: readonly string[]) {
  const unknown = values.find((value) => !(FAB_TRAITS as readonly string[]).includes(value));
  if (unknown) throw new Error(`unsupported FAB trait vocabulary token ${unknown}`);
  return FAB_TRAITS.filter((value) => values.includes(value));
}

function assertKnownTypeTokens(values: readonly string[]): void {
  const known = new Set<string>([
    "Generic",
    ...FAB_METATYPES,
    ...FAB_CLASS_SUPERTYPES,
    ...FAB_TALENT_SUPERTYPES,
    ...FAB_TYPES,
    ...FAB_SUBTYPES,
  ]);
  const unknown = values.find((value) => !known.has(value));
  if (unknown) throw new Error(`unsupported FAB type-box vocabulary token ${unknown}`);
}
