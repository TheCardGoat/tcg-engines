import {
  GUNDAM_CATALOG_REGION,
  getGundamSetRelease,
  type GundamCatalogReleaseState,
} from "./catalog-release.ts";
import type { GundamPublisherReleaseEventEvidence } from "./catalog-source-policy.ts";

/**
 * Minimal catalog identity used by the reconciliation check. This deliberately
 * excludes rules text and engine data: DB-01 compares identity and printing
 * coverage, not card behavior.
 */
export interface GundamReconciliationCard {
  canonicalId: string;
  cardNumber?: string;
  name?: string;
  printings: readonly {
    id: string;
    setCode: string;
  }[];
}

export interface GundamObservedPrinting {
  id: string;
  /**
   * Optional printing-level product provenance for rolling publisher
   * namespaces. This is stronger than the namespace bucket, but only for this
   * exact printing.
   */
  releaseEvidence?: GundamPublisherReleaseEventEvidence;
}

export interface GundamObservedProductGroup {
  /** Identifier used by the locally observed publisher-site snapshot. */
  sourceSetId: string;
  /**
   * Explicit mapping to the EN-US product release registry. Null means the
   * namespace has not been reconciled to an official product release.
   */
  releaseSetCode: string | null;
  /** Count declared by the snapshot manifest. */
  manifestCount: number;
  /** Printing identities read from the matching local snapshot file. */
  printings: readonly GundamObservedPrinting[];
  provenancePath: string;
}

export interface GundamObservedCatalogSnapshot {
  sourceUrl: string;
  observedAt: string;
  checkpoint: string;
  manifestPath: string;
  groups: readonly GundamObservedProductGroup[];
}

export interface GundamCatalogReconciliationInput {
  asOf: string;
  cards: readonly GundamReconciliationCard[];
  observedSnapshot?: GundamObservedCatalogSnapshot;
}

export interface GundamCatalogReconciliationReport {
  requestedAsOf: string;
  evidenceAsOf: string;
  region: typeof GUNDAM_CATALOG_REGION;
  comparison:
    | {
        status: "not_compared";
        completenessClaim: "not_established";
      }
    | {
        status: "compared_to_observed_snapshot";
        completenessClaim: "not_established";
        sourceUrl: string;
        observedAt: string;
        checkpoint: string;
        manifestPath: string;
        requestedAsOfBeyondSnapshot: boolean;
      };
  counts: {
    authoredDefinitions: number;
    canonicalCards: number;
    releasedCanonicalCards: number;
    runtimePrintingsInEvidenceScope: number;
    observedReleasedPrintings: number | null;
    matchedPrintings: number | null;
  };
  matched: string[];
  missingFromRuntime: string[];
  extraInRuntime: string[];
  zeroPrintingCanonicals: string[];
  conflictingCanonicalDefinitions: Array<{
    canonicalId: string;
    definitionCount: number;
  }>;
  canonicalDefinitionAliases: Array<{
    canonicalId: string;
    definitionCount: number;
  }>;
  duplicateRuntimePrintingIdentities: Array<{
    printingId: string;
    canonicalIds: string[];
    setCodes: string[];
    classification: "canonical_alias" | "conflicting_owner";
    metadataConsistent: boolean;
  }>;
  duplicateSourcePrintingIdentities: Array<{
    printingId: string;
    sourceSetIds: string[];
  }>;
  sourceManifestMismatches: Array<{
    sourceSetId: string;
    manifestCount: number;
    observedCount: number;
    provenancePath: string;
  }>;
  unscopedNamespaces: Array<{
    sourceSetId: string;
    releaseSetCode: string | null;
    state: GundamCatalogReleaseState | "unmapped" | "partially_mapped";
    provenancePath: string;
  }>;
  printingReleaseEvidence: Array<{
    printingId: string;
    sourceSetId: string;
    productSetCodes: string[];
    sourceLabel: string;
    state: GundamCatalogReleaseState;
    provenancePath: string;
  }>;
  unscopedPrintings: Array<{
    printingId: string;
    sourceSetId: string;
    state: GundamCatalogReleaseState | "unmapped";
    provenancePath: string;
  }>;
  matchesObservedSnapshot: boolean | null;
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

function normalizeIdentity(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/_P(\d+)$/i, "-P$1");
}

function normalizeCanonicalCardNumber(value: string): string {
  return normalizeIdentity(value).replace(/-P\d+$/i, "");
}

function sorted(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function snapshotDate(snapshot: GundamObservedCatalogSnapshot): string {
  const observedDate = snapshot.observedAt.slice(0, 10);
  assertIsoDate(observedDate, "observedSnapshot.observedAt");
  return observedDate;
}

function printingEvidenceState(
  evidence: GundamPublisherReleaseEventEvidence,
  asOf: string,
): GundamCatalogReleaseState {
  const states = evidence.productSetCodes.map(
    (setCode) => getGundamSetRelease(setCode, asOf).state,
  );
  if (states.some((state) => state === "unknown")) return "unknown";
  return states.every((state) => state === "released") ? "released" : "preview";
}

/**
 * Reconcile the authored catalog with an optional, locally observed EN-US
 * publisher-site snapshot.
 *
 * A successful comparison proves parity with that exact snapshot only. It
 * never establishes that the snapshot was licensed, exhaustive, or current.
 * When `asOf` is later than the snapshot observation date, the evidence scope
 * is capped at the observation date rather than implying later completeness.
 */
export function reconcileGundamReleasedCatalog(
  input: GundamCatalogReconciliationInput,
): GundamCatalogReconciliationReport {
  assertIsoDate(input.asOf, "asOf");

  const evidenceAsOf = input.observedSnapshot
    ? input.asOf < snapshotDate(input.observedSnapshot)
      ? input.asOf
      : snapshotDate(input.observedSnapshot)
    : input.asOf;

  const definitionsByCanonical = new Map<string, GundamReconciliationCard[]>();
  for (const card of input.cards) {
    const canonicalId = normalizeIdentity(card.canonicalId);
    const definitions = definitionsByCanonical.get(canonicalId) ?? [];
    definitions.push(card);
    definitionsByCanonical.set(canonicalId, definitions);
  }

  const zeroPrintingCanonicals: string[] = [];
  const conflictingCanonicalDefinitions: Array<{
    canonicalId: string;
    definitionCount: number;
  }> = [];
  const canonicalDefinitionAliases: Array<{
    canonicalId: string;
    definitionCount: number;
  }> = [];
  const printingReferences = new Map<string, Array<{ canonicalId: string; setCode: string }>>();
  let releasedCanonicalCards = 0;

  for (const [canonicalId, definitions] of definitionsByCanonical) {
    const uniquePrintingIds = new Set(
      definitions.flatMap((card) =>
        card.printings.map((printing) => normalizeIdentity(printing.id)),
      ),
    );
    if (uniquePrintingIds.size === 0) zeroPrintingCanonicals.push(canonicalId);

    const signatures = new Set(
      definitions.map((card) =>
        JSON.stringify({
          cardNumber: normalizeCanonicalCardNumber(card.cardNumber ?? ""),
          name: card.name?.trim() ?? "",
        }),
      ),
    );
    if (definitions.length > 1) {
      const destination =
        signatures.size === 1 ? canonicalDefinitionAliases : conflictingCanonicalDefinitions;
      destination.push({ canonicalId, definitionCount: definitions.length });
    }

    let canonicalReleased = false;
    for (const card of definitions) {
      for (const printing of card.printings) {
        const printingId = normalizeIdentity(printing.id);
        const setCode = normalizeIdentity(printing.setCode);
        const references = printingReferences.get(printingId) ?? [];
        references.push({ canonicalId, setCode });
        printingReferences.set(printingId, references);
        if (getGundamSetRelease(setCode, evidenceAsOf).state === "released") {
          canonicalReleased = true;
        }
      }
    }
    if (canonicalReleased) releasedCanonicalCards += 1;
  }

  const duplicateRuntimePrintingIdentities = [...printingReferences.entries()]
    .flatMap(([printingId, references]) => {
      const canonicalIds = sorted(new Set(references.map((reference) => reference.canonicalId)));
      const setCodes = sorted(new Set(references.map((reference) => reference.setCode)));
      return references.length > 1
        ? [
            {
              printingId,
              canonicalIds,
              setCodes,
              classification:
                canonicalIds.length === 1
                  ? ("canonical_alias" as const)
                  : ("conflicting_owner" as const),
              metadataConsistent: setCodes.length === 1,
            },
          ]
        : [];
    })
    .sort((left, right) => left.printingId.localeCompare(right.printingId));

  let releasedRuntimeIds = new Set(
    [...printingReferences.entries()].flatMap(([printingId, references]) =>
      references.some(
        (reference) => getGundamSetRelease(reference.setCode, evidenceAsOf).state === "released",
      )
        ? [printingId]
        : [],
    ),
  );

  let matched: string[] = [];
  let missingFromRuntime: string[] = [];
  let extraInRuntime: string[] = [];
  let duplicateSourcePrintingIdentities: Array<{
    printingId: string;
    sourceSetIds: string[];
  }> = [];
  let sourceManifestMismatches: Array<{
    sourceSetId: string;
    manifestCount: number;
    observedCount: number;
    provenancePath: string;
  }> = [];
  let unscopedNamespaces: Array<{
    sourceSetId: string;
    releaseSetCode: string | null;
    state: GundamCatalogReleaseState | "unmapped" | "partially_mapped";
    provenancePath: string;
  }> = [];
  let printingReleaseEvidence: Array<{
    printingId: string;
    sourceSetId: string;
    productSetCodes: string[];
    sourceLabel: string;
    state: GundamCatalogReleaseState;
    provenancePath: string;
  }> = [];
  let unscopedPrintings: Array<{
    printingId: string;
    sourceSetId: string;
    state: GundamCatalogReleaseState | "unmapped";
    provenancePath: string;
  }> = [];
  let observedReleasedPrintings: number | null = null;
  let matchesObservedSnapshot: boolean | null = null;

  if (input.observedSnapshot) {
    const sourceReferences = new Map<string, string[]>();
    const observedReleasedIds = new Set<string>();
    const allObservedIds = new Set<string>();

    for (const group of input.observedSnapshot.groups) {
      if (group.manifestCount !== group.printings.length) {
        sourceManifestMismatches.push({
          sourceSetId: group.sourceSetId,
          manifestCount: group.manifestCount,
          observedCount: group.printings.length,
          provenancePath: group.provenancePath,
        });
      }

      const namespaceState = group.releaseSetCode
        ? getGundamSetRelease(group.releaseSetCode, evidenceAsOf).state
        : "unmapped";
      let hasPrintingReleaseEvidence = false;
      let hasUnscopedPrintings = false;
      for (const printing of group.printings) {
        const printingId = normalizeIdentity(printing.id);
        allObservedIds.add(printingId);
        const printingState = printing.releaseEvidence
          ? printingEvidenceState(printing.releaseEvidence, evidenceAsOf)
          : namespaceState;

        if (printing.releaseEvidence) {
          hasPrintingReleaseEvidence = true;
          printingReleaseEvidence.push({
            printingId,
            sourceSetId: group.sourceSetId,
            productSetCodes: [...printing.releaseEvidence.productSetCodes],
            sourceLabel: printing.releaseEvidence.sourceLabel,
            state: printingState === "unmapped" ? "unknown" : printingState,
            provenancePath: group.provenancePath,
          });
        }

        if (printingState !== "released") {
          hasUnscopedPrintings = true;
          unscopedPrintings.push({
            printingId,
            sourceSetId: group.sourceSetId,
            state: printingState,
            provenancePath: group.provenancePath,
          });
          continue;
        }

        observedReleasedIds.add(printingId);
        const sourceSetIds = sourceReferences.get(printingId) ?? [];
        sourceSetIds.push(group.sourceSetId);
        sourceReferences.set(printingId, sourceSetIds);
      }

      if (namespaceState !== "released" && hasUnscopedPrintings) {
        unscopedNamespaces.push({
          sourceSetId: group.sourceSetId,
          releaseSetCode: group.releaseSetCode,
          state: hasPrintingReleaseEvidence ? "partially_mapped" : namespaceState,
          provenancePath: group.provenancePath,
        });
      }
    }

    duplicateSourcePrintingIdentities = [...sourceReferences.entries()]
      .flatMap(([printingId, sourceSetIds]) =>
        sourceSetIds.length > 1 ? [{ printingId, sourceSetIds: [...sourceSetIds].sort() }] : [],
      )
      .sort((left, right) => left.printingId.localeCompare(right.printingId));
    const allRuntimeIds = new Set(printingReferences.keys());
    // An observed printing's product group is stronger release evidence than
    // its card-number namespace (token and promo IDs do not encode a product).
    // Runtime-only identities still fall back to the explicit release registry
    // so a genuinely unexplained extra cannot disappear from the report.
    releasedRuntimeIds = new Set(
      [...allRuntimeIds].filter(
        (printingId) =>
          observedReleasedIds.has(printingId) ||
          (!allObservedIds.has(printingId) &&
            printingReferences
              .get(printingId)
              ?.some(
                (reference) =>
                  getGundamSetRelease(reference.setCode, evidenceAsOf).state === "released",
              )),
      ),
    );
    releasedCanonicalCards = [...definitionsByCanonical.values()].filter((definitions) =>
      definitions.some((card) =>
        card.printings.some((printing) => releasedRuntimeIds.has(normalizeIdentity(printing.id))),
      ),
    ).length;

    matched = sorted(
      [...observedReleasedIds].filter((printingId) => allRuntimeIds.has(printingId)),
    );
    missingFromRuntime = sorted(
      [...observedReleasedIds].filter((printingId) => !allRuntimeIds.has(printingId)),
    );
    extraInRuntime = sorted(
      [...releasedRuntimeIds].filter((printingId) => !observedReleasedIds.has(printingId)),
    );
    observedReleasedPrintings = observedReleasedIds.size;
    matchesObservedSnapshot =
      missingFromRuntime.length === 0 &&
      extraInRuntime.length === 0 &&
      !duplicateRuntimePrintingIdentities.some(
        (duplicate) =>
          duplicate.classification === "conflicting_owner" || !duplicate.metadataConsistent,
      ) &&
      duplicateSourcePrintingIdentities.length === 0 &&
      sourceManifestMismatches.length === 0 &&
      zeroPrintingCanonicals.length === 0 &&
      conflictingCanonicalDefinitions.length === 0;
  }

  return {
    requestedAsOf: input.asOf,
    evidenceAsOf,
    region: GUNDAM_CATALOG_REGION,
    comparison: input.observedSnapshot
      ? {
          status: "compared_to_observed_snapshot",
          completenessClaim: "not_established",
          sourceUrl: input.observedSnapshot.sourceUrl,
          observedAt: input.observedSnapshot.observedAt,
          checkpoint: input.observedSnapshot.checkpoint,
          manifestPath: input.observedSnapshot.manifestPath,
          requestedAsOfBeyondSnapshot: input.asOf > snapshotDate(input.observedSnapshot),
        }
      : {
          status: "not_compared",
          completenessClaim: "not_established",
        },
    counts: {
      authoredDefinitions: input.cards.length,
      canonicalCards: definitionsByCanonical.size,
      releasedCanonicalCards,
      runtimePrintingsInEvidenceScope: releasedRuntimeIds.size,
      observedReleasedPrintings,
      matchedPrintings: input.observedSnapshot ? matched.length : null,
    },
    matched,
    missingFromRuntime,
    extraInRuntime,
    zeroPrintingCanonicals: zeroPrintingCanonicals.sort(),
    conflictingCanonicalDefinitions: conflictingCanonicalDefinitions.sort((left, right) =>
      left.canonicalId.localeCompare(right.canonicalId),
    ),
    canonicalDefinitionAliases: canonicalDefinitionAliases.sort((left, right) =>
      left.canonicalId.localeCompare(right.canonicalId),
    ),
    duplicateRuntimePrintingIdentities,
    duplicateSourcePrintingIdentities,
    sourceManifestMismatches: sourceManifestMismatches.sort((left, right) =>
      left.sourceSetId.localeCompare(right.sourceSetId),
    ),
    unscopedNamespaces: unscopedNamespaces.sort((left, right) =>
      left.sourceSetId.localeCompare(right.sourceSetId),
    ),
    printingReleaseEvidence: printingReleaseEvidence.sort((left, right) =>
      left.printingId.localeCompare(right.printingId),
    ),
    unscopedPrintings: unscopedPrintings.sort((left, right) =>
      left.printingId.localeCompare(right.printingId),
    ),
    matchesObservedSnapshot,
  };
}
