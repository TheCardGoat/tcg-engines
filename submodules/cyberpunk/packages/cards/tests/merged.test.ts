import { describe, expect, it } from "vite-plus/test";

import {
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
  structuredCards,
} from "../src/index.ts";

// Dum Dum exists in the runtime retail pool with multiple released printings.
// Preview-only ids remain absent from the runtime merged lookup.
const DUM_DUM_RETAIL_ID = "3b3f941d-aa58-4337-99dc-4af3fd3ccd47";
const DUM_DUM_PREVIEW_ONLY_ID = "15e5c60e-56c4-4a1a-a7cf-f208c5ffbee8";
const DUM_DUM_SLUG = "dum-dum-maelstrom-triggerman";
const PRINTING_RETAIL = "aaac486c-dbfd-4137-b373-24a2df29522c";
const PRINTING_BETA = "33cfbdb0-a169-458a-86dc-9123697654d7";
const PRINTING_PREVIEW_ONLY = "fabf7f53-bf0e-4ddf-90ca-e0165ac7b99c";

describe("getMergedCyberpunkCardsById", () => {
  it("resolves the Dum Dum retail id to a legend carrying released cross-set printings", () => {
    const merged = getMergedCyberpunkCardsById().get(DUM_DUM_RETAIL_ID);
    expect(merged).toBeDefined();
    const printingIds = merged!.printings.map((printing) => printing.id);

    expect(printingIds).toContain(PRINTING_RETAIL);
    expect(printingIds).toContain(PRINTING_BETA);
    expect(printingIds).not.toContain(PRINTING_PREVIEW_ONLY);
  });

  it("does not resolve a preview-only Dum Dum id", () => {
    expect(getMergedCyberpunkCardsById().get(DUM_DUM_PREVIEW_ONLY_ID)).toBeUndefined();
  });

  it("returns undefined for a truly-unknown card id (strict rejection preserved)", () => {
    expect(
      getMergedCyberpunkCardsById().get("00000000-0000-0000-0000-000000000000"),
    ).toBeUndefined();
  });

  it("exposes an entry for every authored card id in the pool", () => {
    const byId = getMergedCyberpunkCardsById();
    for (const card of structuredCards) {
      expect(byId.has(card.id)).toBe(true);
    }
  });
});

describe("getMergedCyberpunkCards", () => {
  it("returns a slug-unique array", () => {
    const merged = getMergedCyberpunkCards();
    const slugs = merged.map((card) => card.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps the Dum Dum runtime entry slug-unique without preview printings", () => {
    const merged = getMergedCyberpunkCards();
    const dumDum = merged.filter((card) => card.slug === DUM_DUM_SLUG);
    expect(dumDum).toHaveLength(1);

    const printingIds = dumDum[0]!.printings.map((printing) => printing.id);
    expect(printingIds).toContain(PRINTING_RETAIL);
    expect(printingIds).toContain(PRINTING_BETA);
    expect(printingIds).not.toContain(PRINTING_PREVIEW_ONLY);
  });
});
