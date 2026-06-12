import { describe, expect, it } from "bun:test";
import type { I18nProperties } from "@tcg/lorcana-types";
import {
  buildEnglishI18nProperties,
  buildLocalizedI18nProperties,
  cardTextToRulesText,
  embedI18nInCanonicalCards,
  splitLocalizedCardText,
  splitKeywordAwareCardText,
} from "../embed-card-i18n";
import type { CanonicalCard, CardsAuxKv, LocalizationData } from "../types";

function createCanonicalCard(overrides: Partial<CanonicalCard> = {}): CanonicalCard {
  return {
    id: "abc",
    canonicalId: "ci_shared",
    cardType: "action",
    name: "Test Card",
    version: "",
    inkType: ["amber"],
    cost: 2,
    inkable: true,
    i18n: {} as Record<"en" | "de" | "fr" | "it", I18nProperties>,
    vanilla: false,
    rulesText: "Draw a card.",
    ...overrides,
  };
}

function createAuxKv(overrides: Partial<CardsAuxKv> = {}): CardsAuxKv {
  return {
    canonicalIdByShortId: {},
    representativeShortIdByCanonicalId: { ci_shared: "abc" },
    printingIdToShortId: {},
    printingIdsByCanonicalId: {},
    baseReprintIdsByCanonicalId: {},
    localizationShortIdByCultureInvariantId: {},
    ...overrides,
  };
}

function createLocalizationEntry(
  overrides: Partial<LocalizationData[string]> = {},
): LocalizationData[string] {
  return {
    name: "Localized Test Card",
    version: "",
    rulesText: "Carta localizzata.",
    text: "Carta localizzata.",
    flavorText: "",
    searchableKeywords: [],
    ...overrides,
  };
}

describe("buildEnglishI18nProperties", () => {
  it("derives english i18n from canonical card fields", () => {
    expect(
      buildEnglishI18nProperties(
        createCanonicalCard({
          name: "Dragon Fire",
          version: "Alt",
          rulesText: "Banish chosen character.",
        }),
      ),
    ).toEqual({
      name: "Dragon Fire",
      version: "Alt",
      text: "Banish chosen character.",
    });
  });
});

describe("embedI18nInCanonicalCards", () => {
  it("embeds locale data by direct shortId lookup", () => {
    const cards = {
      "set1-001": createCanonicalCard(),
    };

    const result = embedI18nInCanonicalCards(cards, createAuxKv(), {
      de: { abc: createLocalizationEntry({ name: "Direkt" }) },
      fr: { abc: createLocalizationEntry({ name: "Direct" }) },
      it: { abc: createLocalizationEntry({ name: "Diretto" }) },
    });

    expect(result["set1-001"]?.i18n.en).toEqual({
      name: "Test Card",
      text: "Draw a card.",
    });
    expect(result["set1-001"]?.i18n.de.name).toBe("Direkt");
    expect(result["set1-001"]?.i18n.fr.name).toBe("Direct");
    expect(result["set1-001"]?.i18n.it.name).toBe("Diretto");
  });

  it("falls back to representative shortId when a reprint has no direct locale entry", () => {
    const cards = {
      "set1-001": createCanonicalCard({ id: "xyz", canonicalId: "ci_shared" }),
    };

    const result = embedI18nInCanonicalCards(cards, createAuxKv(), {
      de: { abc: createLocalizationEntry({ name: "Vertreter" }) },
      fr: { abc: createLocalizationEntry({ name: "Representant" }) },
      it: { abc: createLocalizationEntry({ name: "Rappresentante" }) },
    });

    expect(result["set1-001"]?.i18n.de.name).toBe("Vertreter");
    expect(result["set1-001"]?.i18n.fr.name).toBe("Representant");
    expect(result["set1-001"]?.i18n.it.name).toBe("Rappresentante");
  });

  it("throws when a required locale cannot be resolved", () => {
    const cards = {
      "set1-001": createCanonicalCard({ id: "missing" }),
    };

    expect(() =>
      embedI18nInCanonicalCards(cards, createAuxKv(), {
        de: {},
        fr: {},
        it: {},
      }),
    ).toThrow("Missing de localization");
  });
});

describe("buildLocalizedI18nProperties", () => {
  it("splits flat string text into structured entries", () => {
    const result = buildLocalizedI18nProperties(
      {
        name: "Dingo",
        version: "Fantôme de Jacob Marley",
        text: "Boost 2 CONSÉQUENCE SÉPULCRALE Lorsque ce personnage est banni, chaque adversaire défausse une carte pour chaque carte sous ce personnage.",
      },
      "fr",
    );

    expect(result).toEqual({
      name: "Dingo",
      version: "Fantôme de Jacob Marley",
      text: [
        { title: "Boost 2" },
        {
          title: "CONSÉQUENCE SÉPULCRALE",
          description:
            "Lorsque ce personnage est banni, chaque adversaire défausse une carte pour chaque carte sous ce personnage.",
        },
      ],
    });
  });

  it("passes through already-structured text unchanged", () => {
    const structured = [
      { title: "Potenziamento 2", description: "(Paga 2 per mettere una carta sotto.)" },
    ];
    const result = buildLocalizedI18nProperties(
      {
        name: "Pippo",
        version: "Fantasma",
        text: structured,
      },
      "it",
    );

    expect(result.text).toEqual(structured);
  });
});

describe("splitKeywordAwareCardText", () => {
  it("splits EN text with leading Evasive keyword", () => {
    const result = splitKeywordAwareCardText(
      "Evasive SINISTER SLITHER Your characters named Flotsam gain Evasive.",
      "en",
    );

    expect(result).toEqual([
      { title: "Evasive" },
      {
        title: "SINISTER SLITHER",
        description: "Your characters named Flotsam gain Evasive.",
      },
    ]);
  });

  it("splits DE text with leading Wendig keyword", () => {
    const result = splitKeywordAwareCardText(
      "Wendig VERSCHWINDEN Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      "de",
    );

    expect(result).toEqual([
      { title: "Wendig" },
      {
        title: "VERSCHWINDEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      },
    ]);
  });

  it("splits FR text with leading Insaisissable keyword", () => {
    const result = splitKeywordAwareCardText(
      "Insaisissable TU DISPARAIS Lorsque vous jouez ce personnage, choisissez un personnage et renvoyez-le dans la main de son propriétaire.",
      "fr",
    );

    expect(result).toEqual([
      { title: "Insaisissable" },
      {
        title: "TU DISPARAIS",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage et renvoyez-le dans la main de son propriétaire.",
      },
    ]);
  });

  it("splits text with multiple leading keywords (Rush + Challenger + Evasive in DE)", () => {
    const result = splitKeywordAwareCardText("Rasant Herausfordern +3 Wendig", "de");

    expect(result).toEqual([
      { title: "Rasant" },
      { title: "Herausfordern +3" },
      { title: "Wendig" },
    ]);
  });

  it("splits text with Shift keyword and named ability in DE", () => {
    const result = splitKeywordAwareCardText(
      "Gestaltwandel 5 Wendig BÖSES LÄCHELN {E} — Ziehe 1 Karte und wirf dann 1 Karte ab.",
      "de",
    );

    expect(result).toEqual([
      { title: "Gestaltwandel 5" },
      { title: "Wendig" },
      {
        title: "BÖSES LÄCHELN",
        description: "{E} — Ziehe 1 Karte und wirf dann 1 Karte ab.",
      },
    ]);
  });

  it("returns plain string for text that is just a keyword", () => {
    expect(splitKeywordAwareCardText("Wendig", "de")).toBe("Wendig");
  });

  it("does not interfere with text that has no keywords", () => {
    const result = splitKeywordAwareCardText(
      "MAGICAL BLAST Deal 3 damage to chosen character.",
      "en",
    );

    expect(result).toEqual([
      {
        title: "MAGICAL BLAST",
        description: "Deal 3 damage to chosen character.",
      },
    ]);
  });

  it("splits DE text with trailing keyword (Singer)", () => {
    const result = splitKeywordAwareCardText(
      "UNDERDOG Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen. Singen 3",
      "de",
    );

    expect(result).toEqual([
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      { title: "Singen 3" },
    ]);
  });
});

describe("splitLocalizedCardText", () => {
  it("uses EN template to split DE text with leading keyword", () => {
    const enText = [
      { title: "Evasive" },
      {
        title: "DISAPPEAR",
        description:
          "When you play this character, you may return chosen character to their player's hand.",
      },
    ];

    const result = splitLocalizedCardText(
      "Wendig VERSCHWINDEN Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      "de",
      enText,
    );

    expect(result).toEqual([
      { title: "Wendig" },
      {
        title: "VERSCHWINDEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Charakter deiner Wahl zurück auf die zugehörige Hand schicken.",
      },
    ]);
  });

  it("fixes IT text that merged abilities into one entry using EN template", () => {
    const enText = [
      { title: "Evasive" },
      {
        title: "DISAPPEAR",
        description:
          "When you play this character, you may return chosen character to their player's hand.",
      },
    ];

    const itText = [
      {
        title: "Evasive",
        description:
          "DISAPPEAR When you play this character, you may return chosen character to their player's hand.",
      },
    ];

    const result = splitLocalizedCardText(itText, "it", enText);

    expect(result).toEqual([
      { title: "Evasive" },
      {
        title: "DISAPPEAR",
        description:
          "When you play this character, you may return chosen character to their player's hand.",
      },
    ]);
  });

  it("uses EN template to split FR text with three abilities", () => {
    const enText = [
      { title: "Shift 5" },
      { title: "Evasive" },
      {
        title: "WICKED SMILE",
        description: "{E} — Draw a card, then choose and discard a card.",
      },
    ];

    const result = splitLocalizedCardText(
      "Alter 5 Insaisissable SOURIRE MALICIEUX {E} — Piochez 1 carte, puis choisissez et défaussez 1 carte.",
      "fr",
      enText,
    );

    expect(result).toEqual([
      { title: "Alter 5" },
      { title: "Insaisissable" },
      {
        title: "SOURIRE MALICIEUX",
        description: "{E} — Piochez 1 carte, puis choisissez et défaussez 1 carte.",
      },
    ]);
  });

  it("leaves well-structured text unchanged when it matches EN entry count", () => {
    const enText = [{ title: "Evasive" }, { title: "PIXIE DUST", description: "Draw a card." }];

    const localizedText = [
      { title: "Wendig" },
      { title: "FEENGLANZ", description: "Ziehe 1 Karte." },
    ];

    const result = splitLocalizedCardText(localizedText, "de", enText);

    expect(result).toEqual(localizedText);
  });

  it("uses EN template to split DE text with trailing Singer keyword", () => {
    const enText = [
      {
        title: "UNDERDOG",
        description:
          "If this is your first turn and you're not the first player, you pay 1 less to play this character.",
      },
      { title: "Singer 3" },
    ];

    const result = splitLocalizedCardText(
      "UNDERDOG Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen. Singen 3 (Die Kosten dieses Charakters gelten als 3 für das Singen von Liedern.)",
      "de",
      enText,
    );

    expect(result).toEqual([
      {
        title: "UNDERDOG",
        description:
          "Falls dies dein erster Zug ist und du das Spiel nicht begonnen hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      { title: "Singen 3" },
    ]);
  });
});

describe("cardTextToRulesText", () => {
  it("serializes structured card text into rules text", () => {
    expect(
      cardTextToRulesText([
        {
          title: "SHIFT 5",
          description: "(You may pay 5 to play this on top of your characters.)",
        },
        { title: "TRIGGER", description: "Draw a card." },
      ]),
    ).toBe("SHIFT 5 (You may pay 5 to play this on top of your characters.) TRIGGER Draw a card.");
  });
});
