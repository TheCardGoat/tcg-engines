import { describe, expect, it } from "vitest";
import {
  mergePresentationRecords,
  PresentationBundleSchema,
  PresentationEnvelopeSchema,
  type PresentationRecords,
} from "./presentation";
const records: PresentationRecords = {
  records: {
    card: {
      canonicalId: "card",
      slug: "card",
      name: "Card",
      defaultPrintingId: "plain",
      printings: { plain: { locale: "en-US" } },
      imageAspectRatio: 0.7,
      keywords: [],
    },
  },
  aliases: { plain: "card" },
};
describe("optional frozen presentation", () => {
  it("validates explicit unavailable pairs and rejects partial images", () => {
    const bundle = {
      schemaVersion: 1,
      manifestId: "a".repeat(64),
      catalog: { revision: "b".repeat(64), url: "https://example.com/catalog.json" },
      ...records,
    };
    expect(PresentationBundleSchema.parse(bundle).records.card?.printings.plain).toEqual({
      locale: "en-US",
    });
    expect(() =>
      PresentationBundleSchema.parse({
        ...bundle,
        records: {
          card: {
            ...records.records.card,
            printings: {
              plain: { locale: "en-US", boardImageUrl: "https://example.com/board.webp" },
            },
          },
        },
      }),
    ).toThrow();
  });
  it("adds printings without mutating the base and rejects conflicting aliases or metadata", () => {
    const added = structuredClone(records);
    added.records.card!.printings.alt = { locale: "fr-FR" };
    added.aliases.alt = "card";
    const union = mergePresentationRecords(records, added);
    expect(Object.keys(union.records.card!.printings)).toEqual(["plain", "alt"]);
    expect(records.records.card!.printings.alt).toBeUndefined();
    expect(mergePresentationRecords(union, structuredClone(union))).toEqual(union);
    expect(() =>
      mergePresentationRecords(records, { records: {}, aliases: { plain: "other" } }),
    ).toThrow();
    added.records.card!.name = "Changed historical name";
    expect(() => mergePresentationRecords(records, added)).toThrow();
  });
  it("requires a manifest reference for cumulative updates", () => {
    expect(
      PresentationEnvelopeSchema.safeParse({
        kind: "reference",
        supplements: records,
        bindings: { printingIdByInstanceId: {} },
      }).success,
    ).toBe(false);
  });
});
