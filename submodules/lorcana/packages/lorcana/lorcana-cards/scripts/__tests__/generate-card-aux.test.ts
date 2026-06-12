import { describe, expect, it } from "bun:test";
import { validateReprintSharedFields } from "../generate-card-aux";
import type { CanonicalCard, CardPrintingMetadata } from "../types";

const i18nText = (text: string) => ({
  en: { name: "Merida", version: "Formidable Archer", text },
  de: { name: "Merida", version: "Formidable Archer", text },
  fr: { name: "Merida", version: "Formidable Archer", text },
  it: { name: "Merida", version: "Formidable Archer", text },
});

const baseCard = {
  id: "aaa",
  canonicalId: "ci_merida",
  cardType: "character",
  name: "Merida",
  version: "Formidable Archer",
  inkType: ["steel"],
  franchise: "Brave",
  cost: 5,
  inkable: false,
  rulesText: "STEADY AIM\nWhenever one of your actions deals damage, deal 2 damage.",
  strength: 3,
  willpower: 5,
  lore: 2,
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "base-1",
      name: "STEADY AIM",
      type: "triggered",
      text: "STEADY AIM Whenever one of your actions deals damage, deal 2 damage.",
    },
  ],
  i18n: i18nText("STEADY AIM\nWhenever one of your actions deals damage, deal 2 damage."),
} satisfies CanonicalCard;

const baseMetadata = {
  "set12-191": {
    id: "set12-191",
    gameCardId: "aaa",
    set: "set12",
    cardNumber: 191,
    rarity: "legendary",
  },
  "set12-242-iconic": {
    id: "set12-242-iconic",
    gameCardId: "bbb",
    set: "set12",
    cardNumber: 242,
    rarity: "common",
    specialRarity: "iconic",
  },
} satisfies Record<string, CardPrintingMetadata>;

function validateWithIconic(iconicOverrides: Partial<CanonicalCard>) {
  return validateReprintSharedFields(
    {
      "set12-191": baseCard,
      "set12-242-iconic": {
        ...baseCard,
        id: "bbb",
        legalities: { core: "not_legal" },
        releasedAt: "2026-05-08",
        illustrators: ["Alternate Artist"],
        ...iconicOverrides,
      },
    },
    baseMetadata,
  );
}

describe("validateReprintSharedFields", () => {
  it("passes when a special printing differs only by printing metadata", () => {
    expect(validateWithIconic({}).status).toBe("pass");
  });

  it("fails when rulesText differs", () => {
    const report = validateWithIconic({ rulesText: "Different text" });

    expect(report.status).toBe("fail");
    expect(report.errors.some((error) => error.includes("at rulesText"))).toBe(true);
  });

  it("fails when gameplay stats differ", () => {
    const report = validateWithIconic({ strength: 4 });

    expect(report.status).toBe("fail");
    expect(report.errors.some((error) => error.includes("at strength"))).toBe(true);
  });

  it("fails when English i18n text differs", () => {
    const report = validateWithIconic({ i18n: i18nText("Different text") });

    expect(report.status).toBe("fail");
    expect(report.errors.some((error) => error.includes("at i18n"))).toBe(true);
  });

  it("passes when text differs only by line endings", () => {
    const report = validateWithIconic({
      rulesText: baseCard.rulesText?.replace(/\n/g, "\r\n"),
      i18n: i18nText("STEADY AIM\r\nWhenever one of your actions deals damage, deal 2 damage."),
    });

    expect(report.status).toBe("pass");
  });
});
