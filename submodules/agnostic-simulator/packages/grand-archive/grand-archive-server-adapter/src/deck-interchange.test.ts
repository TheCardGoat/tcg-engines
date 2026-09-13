import { grandArchiveCards } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vite-plus/test";
import { grandArchiveDeckInterchangeAdapter } from "./deck-interchange.ts";

const face = (card: (typeof grandArchiveCards)[number]) =>
  card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
const levelZeroChampion = grandArchiveCards.find((card) => {
  const value = face(card);
  return value.typeLine.types.includes("CHAMPION") && value.stats.level === 0;
});
const higherLevelChampion = grandArchiveCards.find((card) => {
  const value = face(card);
  return value.typeLine.types.includes("CHAMPION") && (value.stats.level ?? 0) > 0;
});
if (!levelZeroChampion || !higherLevelChampion) {
  throw new Error("Grand Archive adapter tests require level-0 and higher-level Champions.");
}

describe("Grand Archive deck interchange", () => {
  it("rejects a declared starting Champion that is not level 0", () => {
    const document = grandArchiveDeckInterchangeAdapter.createDocument({
      formatId: "standard",
      sections: {
        main: [{ canonicalId: "test-main", quantity: 60 }],
        material: [{ canonicalId: higherLevelChampion.canonicalId, quantity: 1 }],
      },
      declarations: { startingChampionId: higherLevelChampion.canonicalId },
    });

    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(document, {
        validationMode: "registration",
      }),
    ).toContainEqual(expect.objectContaining({ path: "declarations.startingChampionId" }));
  });

  it("allows the Proxia-adjusted Pantheon material maximum only when that boon is declared", () => {
    const create = (greaterBoonId: string) => {
      const document = grandArchiveDeckInterchangeAdapter.createDocument({
        formatId: "pantheon",
        sections: {
          main: [{ canonicalId: "test-main", quantity: 60 }],
          material: [{ canonicalId: levelZeroChampion.canonicalId, quantity: 12 }],
        },
        declarations: {
          startingChampionId: levelZeroChampion.canonicalId,
          lesserBoonId: "test-lesser-boon",
          greaterBoonId,
        },
      });
      return {
        ...document,
        sections: {
          ...document.sections,
          material: [{ card: { canonicalId: levelZeroChampion.canonicalId, quantity: 13 } }],
        },
      };
    };

    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(create("WKA37tNxtw"), {
        validationMode: "registration",
      }),
    ).toEqual([]);
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(create("another-greater-boon"), {
        validationMode: "registration",
      }),
    ).toContainEqual(expect.objectContaining({ path: "sections.material" }));
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(create("WKA37tNxtw"), {
        validationMode: "draft",
      }),
    ).toEqual([]);
    expect(
      grandArchiveDeckInterchangeAdapter.validateDocument(create("another-greater-boon"), {
        validationMode: "draft",
      }),
    ).toContainEqual(expect.objectContaining({ path: "sections.material" }));
  });
});
