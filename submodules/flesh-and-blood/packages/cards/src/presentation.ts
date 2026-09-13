/** Browser-safe presentation data. No executable registry or full catalog import. */
export interface FabPrintingPresentationRecord {
  readonly locale: string;
  readonly artId?: string;
  readonly boardImageUrl?: string;
  readonly printedImageUrl?: string;
}

export interface FabCardPresentationRecord {
  readonly canonicalId: string;
  readonly slug: string;
  readonly name: string;
  readonly defaultPrintingId?: string;
  readonly boardImageUrl?: string;
  readonly printedImageUrl?: string;
  readonly printings: Readonly<Record<string, FabPrintingPresentationRecord>>;
  readonly imageAspectRatio: number;
  readonly keywords: readonly string[];
  readonly faces?: Readonly<Record<string, string>>;
}

export interface FabPresentationRecords {
  readonly records: Readonly<Record<string, FabCardPresentationRecord>>;
  readonly aliases: Readonly<Record<string, string>>;
}

export interface FabPresentationCatalog extends FabPresentationRecords {
  readonly schemaVersion: 1;
  readonly game: "flesh-and-blood";
}

/** Select explicit/default appearances and same-art translations, never unrelated cosmetics. */
export function selectFabPresentationRecords(
  catalog: FabPresentationRecords,
  references: readonly string[],
  printingIds: readonly string[] = [],
): FabPresentationRecords {
  const requestedPrintings = new Set(printingIds);
  const canonicalIds = new Set(
    [...references, ...printingIds]
      .map((id) => (catalog.records[id] ? id : catalog.aliases[id]))
      .filter((id): id is string => Boolean(id)),
  );
  for (const id of canonicalIds) {
    for (const faceId of Object.values(catalog.records[id]?.faces ?? {})) canonicalIds.add(faceId);
  }
  const records: Record<string, FabCardPresentationRecord> = {};
  for (const canonicalId of canonicalIds) {
    const record = catalog.records[canonicalId];
    if (!record) continue;
    const selected = new Set([
      ...requestedPrintings,
      ...(record.defaultPrintingId ? [record.defaultPrintingId] : []),
    ]);
    const artIds = new Set([...selected].map((id) => record.printings[id]?.artId).filter(Boolean));
    const printings = Object.fromEntries(
      Object.entries(record.printings).filter(
        ([id, printing]) =>
          selected.has(id) || (printing.artId !== undefined && artIds.has(printing.artId)),
      ),
    );
    records[canonicalId] = { ...record, printings };
  }
  const aliases = Object.fromEntries(
    Object.entries(catalog.aliases).filter(([, id]) => canonicalIds.has(id)),
  );
  return { records, aliases };
}
