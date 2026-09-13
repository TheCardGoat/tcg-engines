/**
 * Lean per-card module types for the generated `packages/cards/src/cards/`
 * tree: the runtime card and its localizable sibling.
 */

import type {
  FabCardLayout,
  FabFaceId,
  FabKeyword,
  FleshAndBloodAbility,
} from "./abilities/index.ts";
import {
  assignAbilityIds,
  ensureLabelKeywords,
  expandLabelKeywordAbilities,
  PITCH_TO_COLOR,
  rejectUnknownHasStatus,
  rejectOutOfScopeIdentity,
  type PitchValue,
} from "./abilities/index.ts";
import {
  type FabBaseObjectProperties,
  type FabSupertypeSets,
  type FabTypeBoxToken,
  type FabTypeBox,
} from "./base-object-properties.ts";
import {
  normalizeBaseObjectProperties,
  cardNameFromSlug,
  typeBoxTokens,
  typeBoxFromTokens,
} from "./normalize-base-object-properties.ts";
import type { AuthoringHasStatusConstraint } from "./status-markers.ts";

/** Runtime executable card. `base` is the only printed-property record. */
export interface FleshAndBloodCard {
  readonly canonicalId: string;
  readonly slug: string;
  readonly layout: FabCardLayout;
  readonly base: FabBaseObjectProperties;
}

export type FleshAndBloodCardSource = {
  readonly canonicalId: string;
  readonly slug: string;
  readonly layout?: FabCardLayout;
  /** Parser-only input used to preserve slash-delimited supertype grouping. */
  readonly supertypeSets?: FabSupertypeSets;
  /** Flat type-box tokens (grandfathered). Prefer `typeBox`. */
  readonly types?: readonly FabTypeBoxToken[];
  /** Structured type-box authoring (metatypes / supertypes / types / subtypes). */
  readonly typeBox?: FabTypeBox;
  readonly traits?: readonly string[];
  readonly color?: string;
  readonly pitch?: string;
  readonly cost?: number;
  readonly power?: number;
  readonly defense?: number;
  readonly health?: number;
  readonly intelligence?: number;
  readonly arcane?: number;
  readonly keywords?: readonly FabKeyword[];
  readonly abilities?: readonly FleshAndBloodAbility[];
};

/** Load-time normalize without the authoring has-status constraint. */
export function defineFleshAndBloodCardUnchecked(
  card: FleshAndBloodCardSource | FleshAndBloodCard,
): FleshAndBloodCard {
  if ("base" in card) return card;
  const { supertypeSets, typeBox: authoredTypeBox, ...source } = card;
  const tokens = (source.types ??
    (authoredTypeBox ? typeBoxTokens(authoredTypeBox) : [])) as readonly FabTypeBoxToken[];
  const sourceTraits = card.traits ?? [];

  const displayColor = derivedDisplayColor(card);

  const splitFaces = card.layout?.kind === "split" ? card.layout.faces : null;
  if (splitFaces && supertypeSets) {
    throw new Error(
      "hybrid supertype groups on split cards require a per-face type-box representation",
    );
  }
  const activeFaceIds: readonly [FabFaceId, ...FabFaceId[]] = splitFaces
    ? [`${card.canonicalId}:face:left`, `${card.canonicalId}:face:right`]
    : [`${card.canonicalId}:face:front`];
  const derivedName = cardNameFromSlug(card.slug, card.pitch);
  const names: readonly [string, ...string[]] = splitFaces
    ? [splitFaces[0].name, splitFaces[1].name]
    : [derivedName];
  const typeBoxes: readonly [FabTypeBox, ...FabTypeBox[]] = splitFaces
    ? [typeBoxFromTokens(splitFaces[0].types), typeBoxFromTokens(splitFaces[1].types)]
    : authoredTypeBox
      ? [authoredTypeBox]
      : [typeBoxFromTokens(tokens, supertypeSets)];
  const faceTraits = splitFaces ? splitFaces.flatMap((face) => face.traits) : sourceTraits;
  const rawAbilities = splitFaces
    ? splitFaces.flatMap((face) => face.abilities)
    : (card.abilities ?? []);
  rejectUnknownHasStatus(rawAbilities, card.canonicalId);
  rejectOutOfScopeIdentity(rawAbilities, card.canonicalId);
  const faceAbilities =
    assignAbilityIds(
      expandLabelKeywordAbilities(rawAbilities, { arcane: card.arcane }),
      card.canonicalId,
    ) ?? [];
  const faceKeywords =
    ensureLabelKeywords(
      splitFaces ? splitFaces.flatMap((face) => face.keywords) : (card.keywords ?? []),
      faceAbilities,
    ) ?? [];
  const normalizedBase = normalizeBaseObjectProperties({
    ...card,
    name: derivedName,
    types: tokens,
    traits: faceTraits,
    color: displayColor,
    keywords: faceKeywords,
    abilities: faceAbilities,
  });
  return {
    canonicalId: card.canonicalId,
    slug: card.slug,
    layout: source.layout ?? { kind: "single" },
    base: {
      ...normalizedBase,
      names,
      activeFaceIds,
      typeBoxes,
      typeBox: mergeTypeBoxes(typeBoxes),
      textBoxIds: splitFaces
        ? [`${card.canonicalId}:textbox:left`, `${card.canonicalId}:textbox:right`]
        : [card.canonicalId],
      keywords: [...new Set(faceKeywords)],
      abilities: [...new Set(faceAbilities)],
    },
  };
}

/** Construct a generated card with an exact normalized rules base record. */
export function defineFleshAndBloodCard(card: FleshAndBloodCard): FleshAndBloodCard;
export function defineFleshAndBloodCard<const S extends FleshAndBloodCardSource>(
  card: S & AuthoringHasStatusConstraint<S>,
): FleshAndBloodCard;
export function defineFleshAndBloodCard(
  card: FleshAndBloodCardSource | FleshAndBloodCard,
): FleshAndBloodCard {
  return defineFleshAndBloodCardUnchecked(card);
}

function derivedDisplayColor(card: { color?: string; pitch?: string }): string | undefined {
  if (card.color) return card.color;
  const pitch = card.pitch;
  if (pitch === "1" || pitch === "2" || pitch === "3" || pitch === "4") {
    return PITCH_TO_COLOR[pitch satisfies PitchValue];
  }
  return undefined;
}

function mergeTypeBoxes(typeBoxes: readonly FabTypeBox[]): FabTypeBox {
  const merge = <Value>(values: readonly (readonly Value[])[]): readonly Value[] => [
    ...new Set(values.flat()),
  ];
  return {
    metatypes: merge(typeBoxes.map((value) => value.metatypes)),
    ...(typeBoxes.length === 1 && typeBoxes[0]?.supertypeSets
      ? { supertypeSets: typeBoxes[0].supertypeSets }
      : {}),
    supertypes: merge(typeBoxes.map((value) => value.supertypes)),
    types: merge(typeBoxes.map((value) => value.types)),
    subtypes: merge(typeBoxes.map((value) => value.subtypes)),
  };
}

/** Localizable display text for one locale. */
export interface FleshAndBloodAbilityLocaleText {
  /** Player-facing wording for the ability. */
  text?: string;
  /** Concise player-facing name for menus that choose an ability. */
  displayName?: string;
  /** Optional wording overrides keyed by the authored semantic modal-mode key. */
  modes?: Readonly<Record<string, string>>;
}

export interface FleshAndBloodCardLocaleText {
  name: string;
  /** Functional rules text, plain form. */
  text?: string;
  typeText: string;
  /** Optional exact overrides keyed by authored semantic ability path. */
  abilities?: Readonly<Record<string, FleshAndBloodAbilityLocaleText>>;
  /**
   * Card-face asset URL for this locale (default printing whose printing
   * locale matches), derived from catalog printings — never hand-authored.
   */
  imageUrl?: string;
  /** Board asset URL for this locale, derived alongside `imageUrl`. */
  boardImageUrl?: string;
}

/** Per-card localizable content, keyed by locale (`en` always present). */
export interface FleshAndBloodCardI18n {
  canonicalId: string;
  locales: Record<string, FleshAndBloodCardLocaleText> & { en: FleshAndBloodCardLocaleText };
}
