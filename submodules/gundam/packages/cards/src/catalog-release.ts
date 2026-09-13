/**
 * Official English-US product release facts for the Gundam Card Game catalog.
 *
 * Catalog inclusion and release eligibility are intentionally separate:
 * preview cards remain searchable, while consumers can use the injected
 * `asOf` date to decide whether a printing is available for legal deck
 * construction. Unmapped namespaces remain explicit `unknown` values; this
 * module never guesses a release date from a card number.
 */

export const GUNDAM_CATALOG_REGION = "en-US" as const;
export const GUNDAM_EDITORIAL_GAME_SLUG = "gundam" as const;

export type GundamCatalogRegion = typeof GUNDAM_CATALOG_REGION;
export type GundamCatalogReleaseState = "preview" | "released" | "unknown";
export type GundamProductType =
  | "edition_beta"
  | "starter_deck"
  | "ultimate_deck"
  | "booster_pack"
  | "extra_booster"
  | "deck_build_box";
export type GundamEditorialCycleRole = "anchor" | "companion" | "excluded";

export interface GundamProductRelease {
  setCode: string;
  title: string;
  productType: GundamProductType;
  region: GundamCatalogRegion;
  releaseDate: string;
  sourceUrl: string;
  editorialCycleId: string | null;
  editorialCycleRole: GundamEditorialCycleRole;
}

export type GundamSetRelease =
  | (GundamProductRelease & {
      state: "preview" | "released";
    })
  | {
      setCode: string;
      region: GundamCatalogRegion;
      releaseDate: null;
      sourceUrl: null;
      state: "unknown";
    };

export interface GundamSetCodeReference {
  code: string;
}

export interface GundamPrintingSetReference {
  setCode: string;
}

export interface GundamCanonicalPrintingReference {
  printings: readonly GundamPrintingSetReference[];
}

export interface GundamEditorialReleaseCycle {
  cycleId: string;
  gameSlug: typeof GUNDAM_EDITORIAL_GAME_SLUG;
  region: GundamCatalogRegion;
  title: string;
  productType: GundamProductType;
  releaseDate: string;
  sourceUrl: string;
  anchorProductCode: string;
  productCodes: readonly string[];
  editorialEligible: true;
}

const officialProductUrl = (setCode: string): string =>
  `https://www.gundam-gcg.com/en/products/${setCode.toLowerCase()}.html`;

const editorialCycleId = (anchorSetCode: string): string =>
  `gundam-en-us-${anchorSetCode.toLowerCase()}`;

interface ProductReleaseInput {
  setCode: string;
  title: string;
  productType: GundamProductType;
  releaseDate: string;
  editorialCycleAnchor?: string;
  editorialCycleRole?: Exclude<GundamEditorialCycleRole, "excluded">;
  sourceUrl?: string;
}

const productRelease = ({
  setCode,
  title,
  productType,
  releaseDate,
  editorialCycleAnchor,
  editorialCycleRole,
  sourceUrl = officialProductUrl(setCode),
}: ProductReleaseInput): GundamProductRelease => ({
  setCode,
  title,
  productType,
  region: GUNDAM_CATALOG_REGION,
  releaseDate,
  sourceUrl,
  editorialCycleId: editorialCycleAnchor ? editorialCycleId(editorialCycleAnchor) : null,
  editorialCycleRole: editorialCycleRole ?? "excluded",
});

export const GUNDAM_EN_US_PRODUCT_RELEASES = {
  BETA: productRelease({
    setCode: "BETA",
    title: "GUNDAM CARD GAME Edition Beta",
    productType: "edition_beta",
    releaseDate: "2024-12-07",
    sourceUrl: "https://www.gundam-gcg.com/en/products/limitedbox-beta.html",
  }),
  ST01: productRelease({
    setCode: "ST01",
    title: "Heroic Beginnings",
    productType: "starter_deck",
    releaseDate: "2025-07-11",
  }),
  ST02: productRelease({
    setCode: "ST02",
    title: "Wings of Advance",
    productType: "starter_deck",
    releaseDate: "2025-07-11",
  }),
  ST03: productRelease({
    setCode: "ST03",
    title: "Zeon's Rush",
    productType: "starter_deck",
    releaseDate: "2025-07-11",
  }),
  ST04: productRelease({
    setCode: "ST04",
    title: "SEED Strike",
    productType: "starter_deck",
    releaseDate: "2025-07-11",
  }),
  GD01: productRelease({
    setCode: "GD01",
    title: "Newtype Rising",
    productType: "booster_pack",
    releaseDate: "2025-07-25",
    editorialCycleAnchor: "GD01",
    editorialCycleRole: "anchor",
  }),
  ST05: productRelease({
    setCode: "ST05",
    title: "Iron Bloom",
    productType: "starter_deck",
    releaseDate: "2025-09-26",
  }),
  GD02: productRelease({
    setCode: "GD02",
    title: "Dual Impact",
    productType: "booster_pack",
    releaseDate: "2025-10-24",
    editorialCycleAnchor: "GD02",
    editorialCycleRole: "anchor",
  }),
  ST06: productRelease({
    setCode: "ST06",
    title: "Clan Unity",
    productType: "starter_deck",
    releaseDate: "2025-10-24",
    editorialCycleAnchor: "GD02",
    editorialCycleRole: "companion",
  }),
  ST07: productRelease({
    setCode: "ST07",
    title: "Celestial Drive",
    productType: "starter_deck",
    releaseDate: "2026-01-16",
  }),
  ST08: productRelease({
    setCode: "ST08",
    title: "Flash of Radiance",
    productType: "starter_deck",
    releaseDate: "2026-01-16",
  }),
  GD03: productRelease({
    setCode: "GD03",
    title: "Steel Requiem",
    productType: "booster_pack",
    releaseDate: "2026-01-30",
    editorialCycleAnchor: "GD03",
    editorialCycleRole: "anchor",
  }),
  ST09: productRelease({
    setCode: "ST09",
    title: "Destiny Ignition",
    productType: "ultimate_deck",
    releaseDate: "2026-03-27",
  }),
  GD04: productRelease({
    setCode: "GD04",
    title: "Phantom Aria",
    productType: "booster_pack",
    releaseDate: "2026-04-24",
    editorialCycleAnchor: "GD04",
    editorialCycleRole: "anchor",
  }),
  EB01: productRelease({
    setCode: "EB01",
    title: "Eternal Nexus",
    productType: "extra_booster",
    releaseDate: "2026-06-26",
    editorialCycleAnchor: "EB01",
    editorialCycleRole: "anchor",
  }),
  ST10: productRelease({
    setCode: "ST10",
    title: "Generation Pulse",
    productType: "starter_deck",
    releaseDate: "2026-06-26",
    editorialCycleAnchor: "EB01",
    editorialCycleRole: "companion",
  }),
  GD05: productRelease({
    setCode: "GD05",
    title: "Freedom Ascension",
    productType: "booster_pack",
    releaseDate: "2026-07-24",
    editorialCycleAnchor: "GD05",
    editorialCycleRole: "anchor",
  }),
  SC01: productRelease({
    setCode: "SC01",
    title: "Deck Build Box Freedom Ascension",
    productType: "deck_build_box",
    releaseDate: "2026-07-24",
    editorialCycleAnchor: "GD05",
    editorialCycleRole: "companion",
    sourceUrl: "https://www.gundam-gcg.com/en/products/deck-build-box.html",
  }),
} as const satisfies Record<string, GundamProductRelease>;

function buildEditorialReleaseCycles(): readonly GundamEditorialReleaseCycle[] {
  const releases = Object.values(GUNDAM_EN_US_PRODUCT_RELEASES);
  return releases
    .filter((release) => release.editorialCycleRole === "anchor")
    .map((anchor) => ({
      cycleId: anchor.editorialCycleId!,
      gameSlug: GUNDAM_EDITORIAL_GAME_SLUG,
      region: anchor.region,
      title: anchor.title,
      productType: anchor.productType,
      releaseDate: anchor.releaseDate,
      sourceUrl: anchor.sourceUrl,
      anchorProductCode: anchor.setCode,
      productCodes: releases
        .filter((release) => release.editorialCycleId === anchor.editorialCycleId)
        .map((release) => release.setCode),
      editorialEligible: true,
    }));
}

/**
 * Gundam-owned release-cycle facts for cross-game editorial consumers.
 *
 * An anchor represents one editorial cycle. Companion products add relevant
 * release context without creating a second cycle for the same release.
 */
export const GUNDAM_EN_US_EDITORIAL_RELEASE_CYCLES = buildEditorialReleaseCycles();

function normalizeSetCode(setCode: string): string {
  return setCode.trim().toUpperCase();
}

function assertIsoDate(value: string, fieldName: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${fieldName} must be an ISO date in YYYY-MM-DD format`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new TypeError(`${fieldName} must be a valid calendar date`);
  }
}

function findProductRelease(setCode: string): GundamProductRelease | undefined {
  return (GUNDAM_EN_US_PRODUCT_RELEASES as Readonly<Record<string, GundamProductRelease>>)[setCode];
}

export function getGundamSetRelease(
  set: string | GundamSetCodeReference,
  asOf: string,
): GundamSetRelease {
  assertIsoDate(asOf, "asOf");
  const setCode = normalizeSetCode(typeof set === "string" ? set : set.code);
  const release = findProductRelease(setCode);

  if (!release) {
    return {
      setCode,
      region: GUNDAM_CATALOG_REGION,
      releaseDate: null,
      sourceUrl: null,
      state: "unknown",
    };
  }

  return {
    ...release,
    state: asOf < release.releaseDate ? "preview" : "released",
  };
}

export function getGundamPrintingRelease(
  printing: GundamPrintingSetReference,
  asOf: string,
): GundamSetRelease {
  return getGundamSetRelease(printing.setCode, asOf);
}

export function isGundamSetReleased(set: string | GundamSetCodeReference, asOf: string): boolean {
  return getGundamSetRelease(set, asOf).state === "released";
}

export function isGundamPrintingReleased(
  printing: GundamPrintingSetReference,
  asOf: string,
): boolean {
  return getGundamPrintingRelease(printing, asOf).state === "released";
}

/**
 * A gameplay identity is release-eligible when at least one of its physical
 * printings has released. A future reprint therefore cannot make an already
 * released canonical card unavailable.
 */
export function isGundamCanonicalCardReleaseEligible(
  card: GundamCanonicalPrintingReference,
  asOf: string,
): boolean {
  return card.printings.some((printing) => isGundamPrintingReleased(printing, asOf));
}
