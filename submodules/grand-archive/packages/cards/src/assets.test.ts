import { describe, expect, test } from "vitest";
import {
  grandArchiveAssetCatalog,
  resolveGrandArchiveImage,
  withGrandArchiveAssets,
} from "./assets.ts";
import { grandArchiveCatalog } from "./catalog.ts";

describe("Grand Archive immutable image delivery", () => {
  test("all catalog printings resolve to their exact first-party asset", () => {
    for (const card of grandArchiveCatalog.cards)
      for (const printing of card.printings) {
        expect(printing.imageUrl).toMatch(
          /^https:\/\/cdn\.tcg\.online\/public\/grand-archive\/assets\/full\/[a-f0-9]{64}\.webp$/,
        );
        expect(resolveGrandArchiveImage(card.canonicalId, printing.id)).toBe(printing.imageUrl);
      }
  });
  test("unknown and foreign printings never borrow default art", () => {
    const cards = Object.values(grandArchiveAssetCatalog.records);
    expect(resolveGrandArchiveImage(cards[0]!.canonicalId, "missing")).toBeUndefined();
    expect(
      resolveGrandArchiveImage(cards[0]!.canonicalId, cards[1]!.defaultPrintingId),
    ).toBeUndefined();
  });
  test("catalog/source drift is rejected", () => {
    expect(() =>
      withGrandArchiveAssets({
        ...grandArchiveCatalog,
        provenance: grandArchiveCatalog.provenance
          ? { ...grandArchiveCatalog.provenance, sha256: "changed" }
          : null,
      }),
    ).toThrow("snapshot mismatch");
  });
  test("a pinned resolver remains unchanged when another catalog selects other art", () => {
    const card = Object.values(grandArchiveAssetCatalog.records)[0]!;
    const before = resolveGrandArchiveImage(card.canonicalId);
    const changed = { records: { [card.canonicalId]: { ...card, printings: {} } } };
    expect(resolveGrandArchiveImage(card.canonicalId, undefined, changed)).toBeUndefined();
    expect(resolveGrandArchiveImage(card.canonicalId)).toBe(before);
  });
});
