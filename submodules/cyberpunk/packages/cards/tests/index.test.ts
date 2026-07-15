import { expect, test } from "vite-plus/test";

import {
  cards,
  createCardCatalog,
  getStructuredCardBySlug,
  getCardBySlug,
  getStructuredPromoCardBySlug,
  getStructuredPrm01CardBySlug,
  getRawCardBySlug,
  pickCanonicalAndMergePrintings,
  promoCards,
  rawCards,
  SET_PRIORITY,
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
  expect(promoCards).toHaveLength(1);
  expect(structuredCards.length).toBeGreaterThan(0);

  const corpoSecurity = getStructuredCardBySlug("corpo-security");
  const viktor = getStructuredCardBySlug("viktor-vektor-sit-down-and-relax");
  const currentGoro = getStructuredCardBySlug("goro-takemura-vengeful-bodyguard");
  const chromeReverie = getStructuredCardBySlug("chrome-reverie");
  const mamanBrigitte = getStructuredCardBySlug("maman-brigitte-spirit-of-death");
  const lucyna = getStructuredPromoCardBySlug("lucyna-kushinada");
  const rebecca = getStructuredPrm01CardBySlug("rebecca-having-a-moment");
  const afterparty = getStructuredCardBySlug("afterparty-at-lizzie-s");
  const augmentedNegotiators = getStructuredCardBySlug("augmented-negotiators");
  const jackedInVoodooBoy = getStructuredCardBySlug("jacked-in-voodoo-boy");

  expect(corpoSecurity?.keywords).toContain("blocker");
  expect(corpoSecurity?.abilities.map((ability) => ability.kind)).toEqual(["keyword", "static"]);
  expect(viktor?.abilities[0]).toMatchObject({
    kind: "triggered",
    trigger: {
      trigger: "call",
    },
  });
  expect(viktor?.abilities[0]?.effects[0]).toMatchObject({
    effect: "scry",
    amount: 5,
    destinations: expect.arrayContaining([
      expect.objectContaining({
        zone: "hand",
        min: 0,
        max: 2,
      }),
    ]),
  });
  expect(currentGoro?.keywords).toContain("quick");
  expect(
    currentGoro?.abilities.some((ability) =>
      ability.effects.some((effect) => effect.effect === "grantRule" && effect.rule === "blocker"),
    ),
  ).toBe(true);
  expect(lucyna?.abilities).toEqual([]);
  expect(rebecca?.ram).toBeNull();
  expect(afterparty?.set.code).toBe("welcometonightcityretail");
  expect(chromeReverie?.abilities[0]?.effects.map((effect) => effect.effect)).toEqual([
    "grantRule",
    "callLegend",
  ]);
  expect(mamanBrigitte?.classifications).toEqual(["Mystic", "Netrunner", "Voodoo Boys"]);
  expect(augmentedNegotiators?.abilities[1]).toMatchObject({
    trigger: {
      trigger: "event",
      event: {
        event: "blockerActivated",
      },
    },
    effects: [{ effect: "discardFromHand", player: "rival", amount: 1 }],
  });
  expect(jackedInVoodooBoy?.abilities[0]?.effects[0]).toMatchObject({
    effect: "grantRule",
    rule: "requiresProgramPlayedThisTurn",
  });
});

test("every generated runtime-set card is available as a structured card", () => {
  const runtimeSetCodes = new Set(Object.keys(SET_PRIORITY));
  const catalog = createCardCatalog();
  const catalogKeys = new Set(
    Array.from(catalog.entries()).map(([, card]) => `${card.set.code}:${card.slug}`),
  );
  const structuredKeys = new Set(structuredCards.map((card) => `${card.set.code}:${card.slug}`));
  const missing = cards
    .filter((card) => runtimeSetCodes.has(card.set.code))
    .filter((card) => !structuredKeys.has(`${card.set.code}:${card.slug}`))
    .map((card) => `${card.set.code}:${card.slug}`);
  const missingFromCatalog = cards
    .filter((card) => runtimeSetCodes.has(card.set.code))
    .filter((card) => !catalogKeys.has(`${card.set.code}:${card.slug}`))
    .map((card) => `${card.set.code}:${card.slug}`);

  expect(missing).toEqual([]);
  expect(missingFromCatalog).toEqual([]);
});

test("retail starter deck printings win over lower-priority previews when merging canonical cards", () => {
  const preview = {
    id: "preview-minotaur",
    slug: "minotaur",
    set: { code: "preview" },
    printings: [{ id: "preview-printing" }],
  };
  const retailStarter = {
    id: "retail-minotaur",
    slug: "minotaur",
    set: { code: "embracingpowerretailstarterdeck" },
    printings: [{ id: "retail-printing" }],
  };

  const merged = pickCanonicalAndMergePrintings([preview, retailStarter]);

  expect(merged.id).toBe("retail-minotaur");
  expect(merged.printings.map((printing) => printing.id)).toEqual([
    "retail-printing",
    "preview-printing",
  ]);
});
