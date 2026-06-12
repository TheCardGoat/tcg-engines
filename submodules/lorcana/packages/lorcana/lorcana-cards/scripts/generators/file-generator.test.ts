import { describe, expect, it } from "bun:test";
import {
  buildPrintingIdsByCanonicalId,
  CARD_PROPERTY_ORDER,
  convertToLorcanaCard,
  generateCardFileContent,
  generateI18nFileContent,
} from "./file-generator";
import type { CanonicalCharacterCard, CanonicalCard, CardPrinting } from "../types";

function createMinimalCanonicalCharacter(
  overrides: Partial<CanonicalCharacterCard> = {},
): CanonicalCharacterCard {
  return {
    id: "abc",
    canonicalId: "ci_abc",
    cardType: "character",
    name: "Test Character",
    version: "",
    i18n: {
      en: { name: "Test Character", text: "Test rules." },
      de: { name: "Testfigur", text: "Testregeln." },
      fr: { name: "Personnage de test", text: "Texte de test." },
      it: { name: "Personaggio di prova", text: "Testo di prova." },
    },
    inkType: ["amber"],
    cost: 2,
    inkable: true,
    vanilla: false,
    strength: 2,
    willpower: 2,
    lore: 1,
    rulesText: "Test rules.",
    ...overrides,
  };
}

function createMinimalPrinting(overrides: Partial<CardPrinting> = {}): CardPrinting {
  return {
    id: "001-001",
    gameCardId: "abc",
    set: "001",
    cardNumber: 1,
    rarity: "common",
    variants: [{ type: "regular" }],
    ...overrides,
  };
}

describe("file-generator property order", () => {
  it("generated object has id first", () => {
    const card = createMinimalCanonicalCharacter();
    const result = convertToLorcanaCard(card, undefined, "001");
    const keys = Object.keys(result);
    expect(keys[0]).toBe("id");
  });

  it("generated object keeps i18n last when abilities are present", () => {
    const card = createMinimalCanonicalCharacter();
    const abilities = [{ type: "triggered" as const, text: "When you play this character..." }];
    const result = convertToLorcanaCard(card, undefined, "001", abilities);
    const keys = Object.keys(result);
    expect(keys[keys.length - 2]).toBe("abilities");
    expect(keys[keys.length - 1]).toBe("i18n");
  });

  it("all keys of generated object appear in CARD_PROPERTY_ORDER in the same order", () => {
    const card = createMinimalCanonicalCharacter({
      version: "Test Version",
      franchise: "Frozen",
      classifications: ["Storyborn"],
    });
    const printing = createMinimalPrinting();
    const abilities = [{ type: "static" as const, text: "Static." }];
    const result = convertToLorcanaCard(card, printing, "001", abilities, ["001-002", "002-001"]);
    const keys = Object.keys(result);
    const orderIndex = new Map(CARD_PROPERTY_ORDER.map((k, i) => [k, i]));
    for (let i = 1; i < keys.length; i++) {
      const prevIdx = orderIndex.get(keys[i - 1]) ?? -1;
      const currIdx = orderIndex.get(keys[i]) ?? -1;
      expect(prevIdx).toBeLessThan(currIdx);
    }
  });

  it("reprints appear in output when provided and non-empty", () => {
    const card = createMinimalCanonicalCharacter();
    const result = convertToLorcanaCard(card, undefined, "001", undefined, ["001-002"]);
    expect(result.reprints).toEqual(["001-002"]);
  });

  it("reprints omitted when not provided", () => {
    const card = createMinimalCanonicalCharacter();
    const result = convertToLorcanaCard(card, undefined, "001");
    expect("reprints" in result).toBe(false);
  });

  it("reprints omitted when empty array", () => {
    const card = createMinimalCanonicalCharacter();
    const result = convertToLorcanaCard(card, undefined, "001", undefined, []);
    expect("reprints" in result).toBe(false);
  });
});

describe("buildPrintingIdsByCanonicalId", () => {
  it("groups printing IDs by canonicalId so reprints get the same list", () => {
    // Record is keyed by printingId; card.id is 3-char (do not change format)
    const canonicalCards: Record<string, CanonicalCard> = {
      "set1-130": createMinimalCanonicalCharacter({
        id: "Jpc",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
      "set10-133": createMinimalCanonicalCharacter({
        id: "Jpc",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
    };
    const map = buildPrintingIdsByCanonicalId(canonicalCards);
    const reprints = map.get("ci_Jpc");
    expect(reprints).toBeDefined();
    expect(reprints!.sort()).toEqual(["set1-130", "set10-133"].sort());
    expect(map.get("ci_other")).toBeUndefined();
  });

  it("excludes -enchanted, -epic, -iconic, -promo, -challenge from reprints list", () => {
    const canonicalCards: Record<string, CanonicalCard> = {
      "set1-130": createMinimalCanonicalCharacter({
        id: "Jpc",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
      "set1-130-enchanted": createMinimalCanonicalCharacter({
        id: "xYz",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
      "set12-p3-053-challenge": createMinimalCanonicalCharacter({
        id: "p3c",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
      "set10-133": createMinimalCanonicalCharacter({
        id: "Jpc",
        canonicalId: "ci_Jpc",
        name: "Dragon Fire",
      }) as CanonicalCard,
    };
    const map = buildPrintingIdsByCanonicalId(canonicalCards);
    const reprints = map.get("ci_Jpc");
    expect(reprints).toBeDefined();
    expect(reprints!).toEqual(["set1-130", "set10-133"]);
    expect(reprints).not.toContain("set1-130-enchanted");
    expect(reprints).not.toContain("set12-p3-053-challenge");
  });
});

describe("generated i18n file output", () => {
  it("emits a sibling i18n module with the expected export", () => {
    const content = generateI18nFileContent(
      "testCharacter",
      createMinimalCanonicalCharacter().i18n,
    );

    expect(content).toContain(
      'import type { I18nProperties, Languages } from "@tcg/lorcana-types";',
    );
    expect(content).toContain(
      "export const testCharacterI18n: Record<Languages, I18nProperties> = {",
    );
  });
});

describe("generated card file output", () => {
  it("references the imported i18n value instead of serializing it as a string", () => {
    const content = generateCardFileContent(
      createMinimalCanonicalCharacter(),
      "testCharacter",
      2,
      "001-test-character",
      createMinimalPrinting(),
      "001",
    );

    expect(content).toContain('import { testCharacterI18n } from "./001-test-character.i18n";');
    expect(content).toContain("i18n: testCharacterI18n");
    expect(content).not.toContain('i18n: "testCharacterI18n"');
  });
});

describe("card copy limit generation", () => {
  it("derives a numeric card copy limit from rules text", () => {
    const result = convertToLorcanaCard(
      createMinimalCanonicalCharacter({
        rulesText:
          "WHERE DID THEY ALL COME FROM? You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.",
      }),
      createMinimalPrinting(),
      "001",
    );

    expect(result.cardCopyLimit).toBe(99);
  });

  it("derives no-limit from rules text", () => {
    const result = convertToLorcanaCard(
      createMinimalCanonicalCharacter({
        cardType: "item",
        rulesText:
          "LIMITLESS APPLICATIONS You may have any number of cards named Microbots in your deck.",
      }) as CanonicalCard,
      createMinimalPrinting(),
      "001",
    );

    expect(result.cardCopyLimit).toBe("no-limit");
  });
});
