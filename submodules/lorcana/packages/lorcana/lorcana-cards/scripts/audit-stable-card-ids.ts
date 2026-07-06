#!/usr/bin/env bun
import legacyPrintingsData from "../src/data/printings.json" with { type: "json" };
import {
  cardsAuxKv,
  canonicalCardsByPrintingId,
  lorcanaCardIdentityRegistry,
  printings,
} from "../src/data";

interface PrintingLike {
  id: string;
  gameCardId: string;
}

interface DangerousCollision {
  id: string;
  legacyPrintingId: string;
  legacyCard: string | undefined;
  currentPrintingId: string;
  currentCard: string | undefined;
  expectedCurrentId: string;
}

interface IdDrift {
  printingId: string;
  legacyId: string;
  currentId: string;
  card: string | undefined;
}

const legacyPrintings = legacyPrintingsData as Record<string, PrintingLike>;
const strict = process.argv.includes("--strict");
const json = process.argv.includes("--json");

function duplicateIds(entries: Iterable<PrintingLike>): Array<[string, string[]]> {
  const byId = new Map<string, string[]>();
  for (const printing of entries) {
    const ids = byId.get(printing.gameCardId) ?? [];
    ids.push(printing.id);
    byId.set(printing.gameCardId, ids);
  }
  return [...byId.entries()].filter(([, printingIds]) => printingIds.length > 1);
}

const currentByShortId = new Map<string, string>();
for (const printing of Object.values(printings)) {
  currentByShortId.set(printing.gameCardId, printing.id);
}

const drift: IdDrift[] = [];
const dangerousCollisions: DangerousCollision[] = [];
const missingCurrentPrintingIds: string[] = [];

for (const legacyPrinting of Object.values(legacyPrintings)) {
  const currentId =
    cardsAuxKv.printingIdToShortId[legacyPrinting.id] ?? printings[legacyPrinting.id]?.gameCardId;

  if (!currentId) {
    missingCurrentPrintingIds.push(legacyPrinting.id);
    continue;
  }

  if (currentId === legacyPrinting.gameCardId) {
    continue;
  }

  drift.push({
    printingId: legacyPrinting.id,
    legacyId: legacyPrinting.gameCardId,
    currentId,
    card: canonicalCardsByPrintingId[legacyPrinting.id]?.fullName,
  });

  const currentOwnerPrintingId = currentByShortId.get(legacyPrinting.gameCardId);
  if (currentOwnerPrintingId && currentOwnerPrintingId !== legacyPrinting.id) {
    dangerousCollisions.push({
      id: legacyPrinting.gameCardId,
      legacyPrintingId: legacyPrinting.id,
      legacyCard: canonicalCardsByPrintingId[legacyPrinting.id]?.fullName,
      currentPrintingId: currentOwnerPrintingId,
      currentCard: canonicalCardsByPrintingId[currentOwnerPrintingId]?.fullName,
      expectedCurrentId: currentId,
    });
  }
}

const duplicateLegacyIds = duplicateIds(Object.values(legacyPrintings));
const duplicateCurrentIds = duplicateIds(Object.values(printings));
const registryEntries = Object.values(lorcanaCardIdentityRegistry);
const activeRegistryEntries = registryEntries.filter((entry) => entry.status === "active");
const duplicateRegistryShortIds = duplicateIds(
  activeRegistryEntries.map((entry) => ({ id: entry.printingId, gameCardId: entry.shortId })),
);
const missingRegistryEntries: string[] = [];
const extraActiveRegistryEntries: string[] = [];
const registryMismatches: string[] = [];
const auxMismatches: string[] = [];

for (const [printingId, printing] of Object.entries(printings)) {
  const registryEntry = lorcanaCardIdentityRegistry[printingId];
  if (!registryEntry) {
    missingRegistryEntries.push(printingId);
    continue;
  }
  if (registryEntry.status !== "active") {
    registryMismatches.push(`${printingId}: current printing is marked ${registryEntry.status}`);
  }
  if (registryEntry.shortId !== printing.gameCardId) {
    registryMismatches.push(
      `${printingId}: registry shortId ${registryEntry.shortId} != current ${printing.gameCardId}`,
    );
  }
  const currentCanonicalId = canonicalCardsByPrintingId[printingId]?.canonicalId;
  if (currentCanonicalId && registryEntry.canonicalId !== currentCanonicalId) {
    registryMismatches.push(
      `${printingId}: registry canonicalId ${registryEntry.canonicalId} != current ${currentCanonicalId}`,
    );
  }
  if (cardsAuxKv.printingIdToShortId[printingId] !== registryEntry.shortId) {
    auxMismatches.push(`${printingId}: aux printingIdToShortId mismatch`);
  }
  if (cardsAuxKv.printingIdToCanonicalId[printingId] !== registryEntry.canonicalId) {
    auxMismatches.push(`${printingId}: aux printingIdToCanonicalId mismatch`);
  }
  if (cardsAuxKv.shortIdToPrintingId[registryEntry.shortId] !== printingId) {
    auxMismatches.push(`${printingId}: aux shortIdToPrintingId mismatch`);
  }
}

for (const entry of activeRegistryEntries) {
  if (!printings[entry.printingId]) {
    extraActiveRegistryEntries.push(entry.printingId);
  }
}

const report = {
  legacyPrintingCount: Object.keys(legacyPrintings).length,
  currentPrintingCount: Object.keys(printings).length,
  driftCount: drift.length,
  dangerousCollisionCount: dangerousCollisions.length,
  missingCurrentPrintingCount: missingCurrentPrintingIds.length,
  duplicateLegacyIdCount: duplicateLegacyIds.length,
  duplicateCurrentIdCount: duplicateCurrentIds.length,
  duplicateRegistryShortIdCount: duplicateRegistryShortIds.length,
  missingRegistryEntryCount: missingRegistryEntries.length,
  extraActiveRegistryEntryCount: extraActiveRegistryEntries.length,
  registryMismatchCount: registryMismatches.length,
  auxMismatchCount: auxMismatches.length,
  dangerousCollisions,
  drift,
  missingCurrentPrintingIds,
  duplicateLegacyIds,
  duplicateCurrentIds,
  duplicateRegistryShortIds,
  missingRegistryEntries,
  extraActiveRegistryEntries,
  registryMismatches,
  auxMismatches,
};

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Legacy printings: ${report.legacyPrintingCount}`);
  console.log(`Current printings: ${report.currentPrintingCount}`);
  console.log(`Legacy/current ID drift: ${report.driftCount}`);
  console.log(`Dangerous legacy-current collisions: ${report.dangerousCollisionCount}`);
  console.log(`Missing current printings: ${report.missingCurrentPrintingCount}`);
  console.log(`Duplicate legacy IDs: ${report.duplicateLegacyIdCount}`);
  console.log(`Duplicate current IDs: ${report.duplicateCurrentIdCount}`);
  console.log(`Duplicate active registry IDs: ${report.duplicateRegistryShortIdCount}`);
  console.log(`Missing registry entries: ${report.missingRegistryEntryCount}`);
  console.log(`Extra active registry entries: ${report.extraActiveRegistryEntryCount}`);
  console.log(`Registry mismatches: ${report.registryMismatchCount}`);
  console.log(`Aux/registry mismatches: ${report.auxMismatchCount}`);

  if (dangerousCollisions.length > 0) {
    console.log("\nDangerous collisions:");
    for (const collision of dangerousCollisions) {
      console.log(
        `- ${collision.id}: legacy ${collision.legacyPrintingId} (${collision.legacyCard}) conflicts with current ${collision.currentPrintingId} (${collision.currentCard}); legacy should map to ${collision.expectedCurrentId}`,
      );
    }
  }

  if (registryMismatches.length > 0) {
    console.log("\nRegistry mismatches:");
    for (const mismatch of registryMismatches.slice(0, 50)) {
      console.log(`- ${mismatch}`);
    }
  }

  if (auxMismatches.length > 0) {
    console.log("\nAux/registry mismatches:");
    for (const mismatch of auxMismatches.slice(0, 50)) {
      console.log(`- ${mismatch}`);
    }
  }
}

if (
  strict &&
  (duplicateCurrentIds.length > 0 ||
    duplicateRegistryShortIds.length > 0 ||
    missingRegistryEntries.length > 0 ||
    extraActiveRegistryEntries.length > 0 ||
    registryMismatches.length > 0 ||
    auxMismatches.length > 0)
) {
  process.exit(1);
}
