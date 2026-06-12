import { expect, test } from "vite-plus/test";

import {
  alphaCards,
  cards,
  getStructuredCardBySlug,
  getCardBySlug,
  getStructuredPromoCardBySlug,
  getRawCardBySlug,
  getStructuredAlphaCardBySlug,
  getStructuredSpoilerCardBySlug,
  promoCards,
  rawCards,
  spoilerCards,
  structuredCards,
} from "../src/index.ts";

test("generated card snapshots stay aligned across raw and normalized exports", () => {
  expect(rawCards.length).toBe(cards.length);
  expect(rawCards.length).toBeGreaterThan(0);
  expect(new Set(rawCards.map((card) => `${card.set.code}:${card.slug}`)).size).toBe(
    rawCards.length,
  );
  expect(new Set(cards.map((card) => card.id)).size).toBe(cards.length);
});

test("lookup helpers return a known generated card", () => {
  const rawCard = getRawCardBySlug("reboot-optics");
  const card = getCardBySlug("reboot-optics");

  expect(rawCard?.display_name).toBe("Reboot Optics");
  expect(card?.displayName).toBe("Reboot Optics");
  expect(card?.type).toBe("program");
  expect(card?.printNumber).toBe(rawCard?.print_number);
});

test("structured set exports expose parsed abilities", () => {
  expect(alphaCards).toHaveLength(28);
  expect(spoilerCards).toHaveLength(27);
  expect(promoCards).toHaveLength(1);
  expect(structuredCards).toHaveLength(90);

  const corpoSecurity = getStructuredAlphaCardBySlug("corpo-security");
  const viktor = getStructuredAlphaCardBySlug("viktor-vektor-sit-down-and-relax");
  const spoilerGoro = getStructuredSpoilerCardBySlug("goro-takemura-vengeful-bodyguard");
  const chromeReverie = getStructuredSpoilerCardBySlug("chrome-reverie");
  const mamanBrigitte = getStructuredSpoilerCardBySlug("maman-brigitte");
  const lucyna = getStructuredPromoCardBySlug("lucyna-kushinada");
  const afterparty = getStructuredCardBySlug("afterparty-at-lizzie-s");

  expect(corpoSecurity?.keywords).toContain("blocker");
  expect(corpoSecurity?.abilities.map((ability) => ability.kind)).toEqual(["keyword", "static"]);
  expect(viktor?.abilities[0]).toMatchObject({
    kind: "triggered",
    trigger: {
      trigger: "call",
    },
  });
  expect(viktor?.abilities[0]?.effects[0]).toMatchObject({
    effect: "searchDeck",
    lookCount: 5,
    select: {
      max: 2,
    },
  });
  expect(spoilerGoro?.keywords).toEqual([]);
  expect(
    spoilerGoro?.abilities.some((ability) =>
      ability.effects.some((effect) => effect.effect === "grantRule" && effect.rule === "blocker"),
    ),
  ).toBe(true);
  expect(lucyna?.abilities).toEqual([]);
  expect(afterparty?.set.code).toBe("spoiler");
  expect(chromeReverie?.abilities[0]?.effects.map((effect) => effect.effect)).toEqual([
    "grantRule",
    "callLegend",
  ]);
  expect(mamanBrigitte?.classifications).toEqual(["Mystic", "Netrunner", "Voodoo Boys"]);
});
