import type { FabRegisteredCardDefinition } from "@tcg/flesh-and-blood-engine/simulator";
import { isFabFixtureArtPlaceholder } from "./fixture-art-placeholders";
import type {
  FabCardPresentationRecord,
  FabPrintingPresentationRecord,
  FabPresentationRecords,
} from "@tcg/flesh-and-blood-cards/presentation";
export type {
  FabCardPresentationRecord,
  FabPrintingPresentationRecord,
} from "@tcg/flesh-and-blood-cards/presentation";
/** Canonical aspect ratios for FAB card imagery; the single source for every surface. */
export const FAB_CARD_IMAGE_ASPECT_RATIOS = {
  /** Printed card face. */
  printed: 63 / 88,
  /** Square no-text board crop. */
  board: 1,
  /** Horizontal printed cards (e.g. Art of War). */
  horizontal: 2079 / 1488,
} as const;

const STANDARD_FAB_CARD_ASPECT_RATIO = FAB_CARD_IMAGE_ASPECT_RATIOS.printed;

export interface FabPresentationLoadResult {
  readonly missingIds: readonly string[];
  readonly loadedShardCount: number;
}

export interface FabPresentationDefinition {
  /** Explicit catalog identity for a synthetic visual fixture; never inferred from its display name. */
  readonly presentationReference?: string;
  readonly canonicalId: string;
  readonly slug?: string;
  readonly name?: string;
  readonly layout?: FabRegisteredCardDefinition["layout"];
  readonly base?: { readonly names: readonly string[] };
}

interface FabPresentationMatchState {
  readonly objects: Readonly<Record<string, { readonly canonicalId: string }>>;
  readonly cardDefinitions: Readonly<Record<string, FabRegisteredCardDefinition>>;
  /** Declared layers keep their source identity after the live object leaves play. */
  readonly rulesStack?: readonly {
    readonly source: { readonly canonicalId: string | null };
  }[];
}

/**
 * Keep registered token, transform, and test-harness definitions out of the
 * initial route payload. Presentation is needed for cards that currently exist
 * in the match and for disclosed rules-stack sources whose physical object may
 * already have left play. The match presentation hook reloads this bounded set
 * whenever the authoritative state version changes.
 */
export function definitionsForFabMatchPresentation(
  state: FabPresentationMatchState,
): readonly FabRegisteredCardDefinition[] {
  const canonicalIds = new Set(Object.values(state.objects).map((object) => object.canonicalId));
  for (const layer of state.rulesStack ?? []) {
    if (layer.source.canonicalId) canonicalIds.add(layer.source.canonicalId);
  }
  return [...canonicalIds]
    .map((canonicalId) => state.cardDefinitions[canonicalId])
    .filter((definition): definition is FabRegisteredCardDefinition => definition !== undefined);
}

export interface FabCardPresentationIdentity {
  readonly canonicalId?: string;
  /** Chosen atelier printing; printing-keyed CDN art wins over shard defaults. */
  readonly printingId?: string;
  /** Viewer preference, never the card owner's locale. */
  readonly locale?: string;
  readonly slug?: string;
  readonly name?: string;
}
export interface FabCardArt {
  readonly boardImageUrl?: string;
  readonly printedImageUrl?: string;
  /** Aspect of the board asset chosen by ordinary card surfaces. */
  readonly imageAspectRatio: number;
  /** Aspect of the readable full-card preview asset. */
  readonly printedImageAspectRatio: number;
  readonly artVariant: "no-text" | null;
  readonly assetLocale?: string;
  readonly localeFallback?: boolean;
}
export interface FabBoardImageCandidate {
  readonly imageUrl: string;
  readonly imageAspectRatio: number;
  readonly artVariant: "no-text" | "printed-fallback";
}
export type FabCardPresentationLookup = string | FabCardPresentationIdentity;
function looksLikeCatalogCanonicalId(identity: string): boolean {
  return /^[A-Za-z0-9]{21}$/.test(identity);
}

/** Every resolver owns one immutable match-scoped snapshot. */
export function createFabCardArtResolver(
  source: FabPresentationRecords = { records: {}, aliases: {} },
) {
  const recordsByCanonicalId = new Map(Object.entries(source.records));
  const canonicalIdByIdentity = new Map(Object.entries(source.aliases));
  const canonicalIdByPrintingId = new Map<string, string>();
  const faceCanonicalIds = new Map<string, string>();
  for (const record of Object.values(source.records)) {
    canonicalIdByIdentity.set(record.canonicalId, record.canonicalId);
    for (const [faceId, canonicalId] of Object.entries(record.faces ?? {})) {
      canonicalIdByIdentity.set(faceId, canonicalId);
      faceCanonicalIds.set(faceId, canonicalId);
    }
    for (const printingId of Object.keys(record.printings))
      canonicalIdByPrintingId.set(printingId, record.canonicalId);
  }

  function recordForIdentity(
    identity: FabCardPresentationLookup | undefined,
  ): FabCardPresentationRecord | undefined {
    if (!identity) return undefined;
    if (isFabFixtureArtPlaceholder(typeof identity === "string" ? identity : identity.canonicalId))
      return undefined;
    if (typeof identity === "string") {
      const canonicalId = canonicalIdByIdentity.get(identity);
      return canonicalId ? recordsByCanonicalId.get(canonicalId) : undefined;
    }
    const canonicalIdFromPrinting = identity.printingId
      ? canonicalIdForPrinting(identity.printingId)
      : undefined;
    for (const requestedCanonicalId of [canonicalIdFromPrinting, identity.canonicalId]) {
      if (!requestedCanonicalId) continue;
      const catalogCanonicalId =
        canonicalIdByIdentity.get(requestedCanonicalId) ?? requestedCanonicalId;
      const canonicalRecord = recordsByCanonicalId.get(catalogCanonicalId);
      if (canonicalRecord) return canonicalRecord;
    }
    // A real catalog identity is authoritative. Falling through to a shared name
    // or slug could attach a different card's printing assets to this card.
    if (identity.canonicalId && looksLikeCatalogCanonicalId(identity.canonicalId)) return undefined;
    for (const candidate of [identity.slug, identity.name]) {
      if (!candidate) continue;
      const canonicalId = canonicalIdByIdentity.get(candidate);
      const record = canonicalId ? recordsByCanonicalId.get(canonicalId) : undefined;
      if (record) return record;
    }
    return undefined;
  }

  function canonicalIdForPrinting(printingId: string): string | undefined {
    return canonicalIdByPrintingId.get(printingId);
  }

  function nameForFabCardIdentity(
    canonicalId: string,
    slug: string | undefined,
  ): string | undefined {
    return recordForIdentity(canonicalId)?.name ?? recordForIdentity(slug)?.name;
  }

  function imageUrlForFabCard(identity: FabCardPresentationLookup | undefined): string | undefined {
    return resolveFabCardArt(identity).boardImageUrl;
  }

  function imageAspectRatioForFabCard(identity: FabCardPresentationLookup | undefined): number {
    return resolveFabCardArt(identity).imageAspectRatio;
  }

  function boardImageUrlForFabCard(
    identity: FabCardPresentationLookup | undefined,
  ): string | undefined {
    return resolveFabCardArt(identity).boardImageUrl;
  }

  function printingArtForIdentity(
    identity: FabCardPresentationLookup | undefined,
    record: FabCardPresentationRecord,
  ): FabPrintingPresentationRecord | undefined {
    const request = typeof identity === "object" ? identity : undefined;
    return selectFabPrintingArt(record, request?.printingId, request?.locale);
  }

  function normalizeFabAssetLocale(locale: string | undefined): string {
    try {
      return Intl.getCanonicalLocales(locale || "en-US")[0] ?? "en-US";
    } catch {
      return "en-US";
    }
  }

  /** Select square/full as one pair. Exact printing cosmetics are retained unless
   * the catalog explicitly identifies the same art in the requested language. */
  function selectFabPrintingArt(
    record: FabCardPresentationRecord,
    printingId?: string,
    locale?: string,
  ): FabPrintingPresentationRecord | undefined {
    const original = record.printings[printingId ?? record.defaultPrintingId ?? ""];
    if (printingId && !original) return undefined;
    if (!locale) return original;
    const requested = normalizeFabAssetLocale(locale);
    const language = requested.split("-")[0];
    const candidates = Object.values(record.printings).filter(
      (printing) => printing === original || (original?.artId && printing.artId === original.artId),
    );
    return (
      candidates.find((printing) => printing.locale === requested) ??
      candidates.find((printing) => printing.locale.split("-")[0] === language) ??
      original
    );
  }

  /** One printing-aware lookup for every image decision a FAB surface needs. */
  function resolveFabCardArt(identity: FabCardPresentationLookup | undefined): FabCardArt {
    // A reviewed face relationship supports the face default, not an inferred alternate-art pairing.
    if (identity && typeof identity === "object" && identity.canonicalId) {
      const faceCanonicalId = faceCanonicalIds.get(identity.canonicalId);
      if (
        faceCanonicalId &&
        identity.printingId &&
        canonicalIdByPrintingId.get(identity.printingId) !== faceCanonicalId
      ) {
        identity = { ...identity, canonicalId: faceCanonicalId, printingId: undefined };
      }
    }
    const record = recordForIdentity(identity);
    if (!record) {
      return {
        imageAspectRatio: STANDARD_FAB_CARD_ASPECT_RATIO,
        printedImageAspectRatio: STANDARD_FAB_CARD_ASPECT_RATIO,
        artVariant: null,
      };
    }
    const printingArt = printingArtForIdentity(identity, record);
    const hasRequestedPrinting =
      identity && typeof identity !== "string" && Boolean(identity.printingId);
    const boardImageUrl =
      printingArt?.boardImageUrl ?? (hasRequestedPrinting ? undefined : record.boardImageUrl);
    const printedImageUrl =
      printingArt?.printedImageUrl ?? (hasRequestedPrinting ? undefined : record.printedImageUrl);
    return {
      ...(boardImageUrl ? { boardImageUrl } : {}),
      ...(printedImageUrl ? { printedImageUrl } : {}),
      imageAspectRatio: boardImageUrl
        ? FAB_CARD_IMAGE_ASPECT_RATIOS.board
        : record.imageAspectRatio,
      printedImageAspectRatio: record.imageAspectRatio,
      artVariant: boardImageUrl ? "no-text" : null,
      ...(printingArt
        ? {
            assetLocale: printingArt.locale,
            localeFallback:
              typeof identity === "object" &&
              Boolean(identity.locale) &&
              normalizeFabAssetLocale(identity.locale).split("-")[0] !==
                printingArt.locale.split("-")[0],
          }
        : {}),
    };
  }

  /**
   * Ordered image candidates for a public board card. Asset URLs must come from
   * the sibling assets repository's published CDN paths; upstream catalog URLs
   * are provenance only and must never reach a player browser.
   */
  function boardImageCandidatesForFabCard(
    identity: FabCardPresentationLookup | undefined,
    entityFallback?: Pick<FabBoardImageCandidate, "imageUrl" | "imageAspectRatio">,
  ): readonly FabBoardImageCandidate[] {
    const art = resolveFabCardArt(identity);
    const candidates: FabBoardImageCandidate[] = [];
    const seen = new Set<string>();
    const add = (
      imageUrl: string | undefined,
      imageAspectRatio: number,
      artVariant: FabBoardImageCandidate["artVariant"],
    ) => {
      if (!imageUrl || seen.has(imageUrl)) return;
      seen.add(imageUrl);
      candidates.push({ imageUrl, imageAspectRatio, artVariant });
    };

    add(art.boardImageUrl, FAB_CARD_IMAGE_ASPECT_RATIOS.board, "no-text");
    if (entityFallback?.imageUrl.startsWith("https://cdn.tcg.online/public/fab/")) {
      add(entityFallback.imageUrl, entityFallback.imageAspectRatio, "printed-fallback");
    }

    return candidates;
  }

  function keywordsForFabCard(identity: FabCardPresentationLookup | undefined): readonly string[] {
    return recordForIdentity(identity)?.keywords ?? [];
  }

  return {
    nameForFabCardIdentity,
    imageUrlForFabCard,
    imageAspectRatioForFabCard,
    boardImageUrlForFabCard,
    resolveFabCardArt,
    boardImageCandidatesForFabCard,
    keywordsForFabCard,
    normalizeFabAssetLocale,
    selectFabPrintingArt,
  };
}

export type FabCardArtResolver = ReturnType<typeof createFabCardArtResolver>;
export const EMPTY_FAB_CARD_ART: FabCardArtResolver = createFabCardArtResolver();
/** These two helpers use explicit inputs and do not consult a registry. */
export const { normalizeFabAssetLocale, selectFabPrintingArt } = EMPTY_FAB_CARD_ART;
