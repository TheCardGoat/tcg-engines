import { expect, test } from "vite-plus/test";

import { cards, getCardBySlug, getMergedCyberpunkCards, getRawCardBySlug } from "../src/index.ts";

/**
 * Regression coverage for the Night City Brawl import (bd740e1b1f): the raw
 * generated pool now carries several slugs twice — an older
 * `cyberpunk:<slug>` spoiler row plus a newer `cb-<slug>` retail row — and a
 * first-match slug lookup silently returned the spoiler entry instead of the
 * canonical retail card every merged consumer resolves to.
 */

const DUPLICATED_RAW_SLUGS = [...new Set(cards.map((card) => card.slug))].filter(
  (slug) => cards.filter((card) => card.slug === slug).length > 1,
);

test("the raw pool still contains the cross-set duplicate slugs this guards against", () => {
  // If the import data is ever deduped upstream this test stays green for the
  // lookup contract; it only documents the hazard when duplicates exist.
  expect(DUPLICATED_RAW_SLUGS).toContain("afterparty-at-lizzie-s");
  expect(DUPLICATED_RAW_SLUGS).toContain("kiroshi-optics");
  expect(DUPLICATED_RAW_SLUGS).toContain("floor-it");
});

test("slug lookups resolve to the merged canonical, never the oldest scraped row", () => {
  const merged = getMergedCyberpunkCards().find((card) => card.slug === "afterparty-at-lizzie-s");
  expect(merged).toBeDefined();
  // The canonical Afterparty at Lizzie's is the released retail printing, not
  // the earlier spoiler row with its superseded rules text.
  expect(merged?.set.code).toBe("welcometonightcityretail");

  const card = getCardBySlug("afterparty-at-lizzie-s");
  expect(card?.id).toBe(merged?.id);
  expect(card?.set.code).toBe("welcometonightcityretail");
  expect(card?.rulesText).toBe(merged?.rulesText);

  const raw = getRawCardBySlug("afterparty-at-lizzie-s");
  expect(raw?.set.code).toBe("welcometonightcityretail");
  expect(raw?.rules_text).toBe(merged?.rulesText);
});

test("every duplicated slug resolves to the merged canonical set", () => {
  for (const slug of DUPLICATED_RAW_SLUGS) {
    const merged = getMergedCyberpunkCards().find((card) => card.slug === slug);
    expect(merged, `merged pool must contain ${slug}`).toBeDefined();
    expect(getCardBySlug(slug)?.id).toBe(merged!.id);
    expect(getRawCardBySlug(slug)?.set.code).toBe(merged!.set.code);
  }
});

test.each(["gilded-maton", "chrome-reverie", "peace-offering"])(
  "%s selects the released raw row even when the merged id is legacy",
  (slug) => {
    expect(getRawCardBySlug(slug)?.set.code).toBe("welcometonightcityretail");
  },
);

test("an unknown slug resolves to undefined rather than an arbitrary card", () => {
  expect(getCardBySlug("not-a-real-cyberpunk-slug")).toBeUndefined();
  expect(getRawCardBySlug("not-a-real-cyberpunk-slug")).toBeUndefined();
});
