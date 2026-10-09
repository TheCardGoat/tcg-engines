import { expect, test } from "vite-plus/test";
import { createCardCatalog } from "../src/bundle.ts";
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById } from "../src/merged.ts";

test("runtime catalogs resolve every accepted stored identity to its canonical definition", () => {
  const catalog = createCardCatalog();
  for (const [alias, definition] of getMergedCyberpunkCardsById()) {
    expect(catalog.get(alias), alias).toBe(definition);
    expect(catalog.get(definition.canonicalId)).toBe(definition);
  }
  expect([...catalog.entries()]).toHaveLength(getMergedCyberpunkCards().length);
  expect(catalog.size).toBe(getMergedCyberpunkCards().length);
  expect(catalog.get("not-a-card")).toBeUndefined();
});

test("reported Animals Wrecker UUID and canonical id resolve identically", () => {
  const catalog = createCardCatalog();
  expect(catalog.get("e8aa7757-e5e3-4137-8970-4fa546b9bed9")).toBe(catalog.get("animals-wrecker"));
  expect(catalog.get("animals-wrecker")?.name).toBe("Animals Wrecker");
});
