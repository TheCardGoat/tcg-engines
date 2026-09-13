import { describe, expect, it } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as cardExports from "./cards/index.ts";
import {
  reconcileGundamReleasedCatalog,
  type GundamReconciliationCard,
} from "./catalog-reconciliation.ts";
import { GUNDAM_EN_US_PRODUCT_RELEASES } from "./catalog-release.ts";
import { getGundamRollingPrintingReleaseEvidence } from "./catalog-source-policy.ts";

const snapshot = {
  sourceUrl: "https://publisher.example/cards",
  observedAt: "2026-07-26T07:42:33.107Z",
  checkpoint: "sha256:test",
  manifestPath: "data/manifest.json",
  groups: [
    {
      sourceSetId: "gd01",
      releaseSetCode: "GD01",
      manifestCount: 2,
      printings: [{ id: "GD01-001" }, { id: "GD01-001_p1" }],
      provenancePath: "data/gd01.json",
    },
    {
      sourceSetId: "future",
      releaseSetCode: "GD05",
      manifestCount: 1,
      printings: [{ id: "GD05-001" }],
      provenancePath: "data/future.json",
    },
    {
      sourceSetId: "promotion-card",
      releaseSetCode: null,
      manifestCount: 1,
      printings: [{ id: "P-001" }],
      provenancePath: "data/promotion-card.json",
    },
  ],
} as const;

describe("released Gundam catalog reconciliation", () => {
  it("separates canonical definitions from exact printings at an injected date", () => {
    const report = reconcileGundamReleasedCatalog({
      asOf: "2025-08-01",
      cards: [
        {
          canonicalId: "GD01-001",
          cardNumber: "GD01-001-p1",
          name: "Card One",
          printings: [
            { id: "GD01-001", setCode: "GD01" },
            { id: "GD01-001_p1", setCode: "GD01" },
          ],
        },
        {
          canonicalId: "GD01-001",
          cardNumber: "GD01-001",
          name: "Card One",
          printings: [
            { id: "GD01-001", setCode: "GD01" },
            { id: "GD01-001_p1", setCode: "GD01" },
          ],
        },
      ],
      observedSnapshot: snapshot,
    });

    expect(report.counts).toMatchObject({
      authoredDefinitions: 2,
      canonicalCards: 1,
      releasedCanonicalCards: 1,
      runtimePrintingsInEvidenceScope: 2,
      observedReleasedPrintings: 2,
      matchedPrintings: 2,
    });
    expect(report.canonicalDefinitionAliases).toEqual([
      { canonicalId: "GD01-001", definitionCount: 2 },
    ]);
    expect(report.missingFromRuntime).toEqual([]);
    expect(report.extraInRuntime).toEqual([]);
    expect(report.unscopedNamespaces).toEqual([
      {
        sourceSetId: "future",
        releaseSetCode: "GD05",
        state: "preview",
        provenancePath: "data/future.json",
      },
      {
        sourceSetId: "promotion-card",
        releaseSetCode: null,
        state: "unmapped",
        provenancePath: "data/promotion-card.json",
      },
    ]);
    expect(report.matchesObservedSnapshot).toBe(true);
  });

  it("reports omissions, extras, conflicts, zero-printing canonicals, and source duplicates", () => {
    const report = reconcileGundamReleasedCatalog({
      asOf: "2025-08-01",
      cards: [
        {
          canonicalId: "GD01-001",
          cardNumber: "GD01-001",
          name: "Card One",
          printings: [{ id: "GD01-001", setCode: "GD01" }],
        },
        {
          canonicalId: "GD01-001",
          cardNumber: "OTHER-001",
          name: "Conflicting identity",
          printings: [{ id: "EXTRA-001", setCode: "GD01" }],
        },
        {
          canonicalId: "GD01-002",
          printings: [{ id: "GD01-001", setCode: "ST01" }],
        },
        {
          canonicalId: "GD01-003",
          printings: [],
        },
      ],
      observedSnapshot: {
        ...snapshot,
        groups: [
          {
            sourceSetId: "gd01",
            releaseSetCode: "GD01",
            manifestCount: 3,
            printings: [
              { id: "GD01-001" },
              { id: "GD01-001_p1" },
              { id: "GD01-001" },
              { id: "MISSING-001" },
            ],
            provenancePath: "data/gd01.json",
          },
        ],
      },
    });

    expect(report.missingFromRuntime).toEqual(["GD01-001-P1", "MISSING-001"]);
    expect(report.extraInRuntime).toEqual(["EXTRA-001"]);
    expect(report.zeroPrintingCanonicals).toEqual(["GD01-003"]);
    expect(report.conflictingCanonicalDefinitions).toEqual([
      { canonicalId: "GD01-001", definitionCount: 2 },
    ]);
    expect(report.duplicateRuntimePrintingIdentities).toEqual([
      {
        printingId: "GD01-001",
        canonicalIds: ["GD01-001", "GD01-002"],
        setCodes: ["GD01", "ST01"],
        classification: "conflicting_owner",
        metadataConsistent: false,
      },
    ]);
    expect(report.duplicateSourcePrintingIdentities).toEqual([
      { printingId: "GD01-001", sourceSetIds: ["gd01", "gd01"] },
    ]);
    expect(report.sourceManifestMismatches).toEqual([
      {
        sourceSetId: "gd01",
        manifestCount: 3,
        observedCount: 4,
        provenancePath: "data/gd01.json",
      },
    ]);
    expect(report.matchesObservedSnapshot).toBe(false);
  });

  it("caps evidence at the snapshot date and never claims catalog completeness", () => {
    const report = reconcileGundamReleasedCatalog({
      asOf: "2030-01-01",
      cards: [],
      observedSnapshot: snapshot,
    });

    expect(report.evidenceAsOf).toBe("2026-07-26");
    expect(report.comparison).toMatchObject({
      status: "compared_to_observed_snapshot",
      completenessClaim: "not_established",
      requestedAsOfBeyondSnapshot: true,
    });
  });

  it("can still audit runtime integrity without a local comparison snapshot", () => {
    const report = reconcileGundamReleasedCatalog({
      asOf: "2026-07-28",
      cards: [{ canonicalId: "GD01-001", printings: [] }],
    });

    expect(report.comparison).toEqual({
      status: "not_compared",
      completenessClaim: "not_established",
    });
    expect(report.matchesObservedSnapshot).toBeNull();
    expect(report.zeroPrintingCanonicals).toEqual(["GD01-001"]);
  });

  it("scopes rolling-namespace printings through product evidence, not a bucket date", () => {
    const releaseEvidence = {
      kind: "publisher_product_release_event",
      productSetCodes: ["ST10", "GD05"],
      sourceLabel: "Synthetic combined [ST10]/[GD05] Release Event",
    } as const;
    const cards = [
      {
        canonicalId: "RP-065",
        printings: [{ id: "RP-065", setCode: "RP" }],
      },
    ];
    const observedSnapshot = {
      sourceUrl: "https://publisher.example/cards",
      observedAt: "2026-07-26T07:42:33.107Z",
      checkpoint: "sha256:test",
      manifestPath: "data/manifest.json",
      groups: [
        {
          sourceSetId: "promotion-card",
          releaseSetCode: null,
          manifestCount: 1,
          printings: [{ id: "RP-065", releaseEvidence }],
          provenancePath: "data/promotion-card.json",
        },
      ],
    } as const;

    const preview = reconcileGundamReleasedCatalog({
      asOf: "2026-07-23",
      cards,
      observedSnapshot,
    });
    expect(preview.counts.observedReleasedPrintings).toBe(0);
    expect(preview.printingReleaseEvidence).toMatchObject([
      {
        printingId: "RP-065",
        productSetCodes: ["ST10", "GD05"],
        state: "preview",
      },
    ]);
    expect(preview.unscopedPrintings).toMatchObject([{ printingId: "RP-065", state: "preview" }]);

    const released = reconcileGundamReleasedCatalog({
      asOf: "2026-07-24",
      cards,
      observedSnapshot,
    });
    expect(released.counts).toMatchObject({
      releasedCanonicalCards: 1,
      runtimePrintingsInEvidenceScope: 1,
      observedReleasedPrintings: 1,
      matchedPrintings: 1,
    });
    expect(released.unscopedNamespaces).toEqual([]);
    expect(released.unscopedPrintings).toEqual([]);
    expect(released.matchesObservedSnapshot).toBe(true);
  });

  it("matches the exact released-product scope in the checked-in observed snapshot", () => {
    const gundamRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const snapshotRoot = join(gundamRoot, "tools/gundam-card-parser/data/scraped");
    const manifest = JSON.parse(readFileSync(join(snapshotRoot, "manifest.json"), "utf8")) as {
      source: string;
      scrapedAt: string;
      sets: Array<{ id: string; count: number }>;
    };
    const cards = Object.values(cardExports).flatMap((value): GundamReconciliationCard[] =>
      typeof value === "object" &&
      value !== null &&
      "canonicalId" in value &&
      "printings" in value &&
      Array.isArray((value as { printings?: unknown }).printings)
        ? [value as GundamReconciliationCard]
        : [],
    );
    const report = reconcileGundamReleasedCatalog({
      asOf: "2026-07-26",
      cards,
      observedSnapshot: {
        sourceUrl: manifest.source,
        observedAt: manifest.scrapedAt,
        checkpoint: "test-reads-exact-local-snapshot",
        manifestPath: relative(gundamRoot, join(snapshotRoot, "manifest.json")),
        groups: manifest.sets.map((entry) => {
          const provenancePath = join(snapshotRoot, `${entry.id}.json`);
          const observedPrintings = JSON.parse(readFileSync(provenancePath, "utf8")) as Array<{
            id: string;
            getIt?: string;
          }>;
          const printings = observedPrintings.map((printing) => ({
            id: printing.id,
            releaseEvidence:
              getGundamRollingPrintingReleaseEvidence(entry.id, printing) ?? undefined,
          }));
          const directReleaseCode = entry.id.toUpperCase();
          return {
            sourceSetId: entry.id,
            releaseSetCode:
              entry.id === "edition-beta"
                ? "BETA"
                : Object.hasOwn(GUNDAM_EN_US_PRODUCT_RELEASES, directReleaseCode)
                  ? directReleaseCode
                  : null,
            manifestCount: entry.count,
            printings,
            provenancePath: relative(gundamRoot, provenancePath),
          };
        }),
      },
    });

    expect(report.counts).toEqual({
      authoredDefinitions: 1122,
      canonicalCards: 1055,
      releasedCanonicalCards: 979,
      runtimePrintingsInEvidenceScope: 1555,
      observedReleasedPrintings: 1555,
      matchedPrintings: 1555,
    });
    expect(report.missingFromRuntime).toEqual([]);
    expect(report.extraInRuntime).toEqual([]);
    expect(report.zeroPrintingCanonicals).toEqual([]);
    expect(report.conflictingCanonicalDefinitions).toEqual([]);
    expect(
      report.duplicateRuntimePrintingIdentities.filter(
        (duplicate) => duplicate.classification === "conflicting_owner",
      ),
    ).toEqual([]);
    expect(
      report.duplicateRuntimePrintingIdentities
        .filter((duplicate) => !duplicate.metadataConsistent)
        .map((duplicate) => duplicate.printingId),
    ).toEqual([]);
    expect(report.duplicateSourcePrintingIdentities).toEqual([]);
    expect(report.sourceManifestMismatches).toEqual([]);
    expect(report.unscopedNamespaces.map((namespace) => namespace.sourceSetId)).toEqual([
      "basic-cards",
      "other-product-card",
      "promotion-card",
    ]);
    expect(
      report.unscopedNamespaces.find((namespace) => namespace.sourceSetId === "promotion-card")
        ?.state,
    ).toBe("partially_mapped");
    expect(report.printingReleaseEvidence).toHaveLength(14);
    expect(report.printingReleaseEvidence.every((evidence) => evidence.state === "released")).toBe(
      true,
    );
    expect(report.unscopedPrintings).toHaveLength(222);
    expect(report.matchesObservedSnapshot).toBe(true);
  });
});
