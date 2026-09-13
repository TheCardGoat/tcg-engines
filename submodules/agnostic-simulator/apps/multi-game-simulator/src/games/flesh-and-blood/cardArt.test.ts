import { testFabArt } from "./presentation-test-provider";
const {
  boardImageCandidatesForFabCard,
  boardImageUrlForFabCard,
  imageAspectRatioForFabCard,
  imageUrlForFabCard,
  resolveFabCardArt,
} = testFabArt;
import { describe, expect, it } from "vitest";
import { allFleshAndBloodCatalogCards as allFleshAndBloodCards } from "@tcg/flesh-and-blood-cards/catalog";
import { fabDefaultPrintingId } from "@tcg/flesh-and-blood-cards";
import { defineFleshAndBloodCardUnchecked } from "@tcg/flesh-and-blood-types";

import { FAB_CARD_IMAGE_ASPECT_RATIOS, definitionsForFabMatchPresentation } from "./cardArt";

const catalogPrintings = new Map(
  allFleshAndBloodCards.flatMap((card) =>
    card.printings.map((printing) => [printing.id, printing] as const),
  ),
);
const publishedBoardUrls = new Set(
  [...catalogPrintings.values()].map((printing) => printing.boardImageUrl).filter(Boolean),
);

function hasPublishedBoardArt(canonicalId: string): boolean {
  return allFleshAndBloodCards.some(
    (card) =>
      card.canonicalId === canonicalId && card.printings.some((printing) => printing.boardImageUrl),
  );
}

function catalogArt(printingId: string) {
  const printing = catalogPrintings.get(printingId);
  expect(printing, printingId).toBeDefined();
  return {
    board: printing!.boardImageUrl,
    full: printing!.imageUrl,
  };
}

describe("FAB simulator card art", () => {
  it("selects only definitions for cards that exist in the match", () => {
    const active = defineFleshAndBloodCardUnchecked({
      canonicalId: "active-card",
      slug: "active-card",
      types: ["Action"],
    });
    const registeredOnly = defineFleshAndBloodCardUnchecked({
      canonicalId: "registered-token",
      slug: "registered-token",
      types: ["Token"],
    });

    expect(
      definitionsForFabMatchPresentation({
        objects: { instance: { canonicalId: active.canonicalId } },
        cardDefinitions: {
          [active.canonicalId]: active,
          [registeredOnly.canonicalId]: registeredOnly,
        },
      }),
    ).toEqual([active]);
  });

  it("keeps a rules-stack source whose physical object has left play", () => {
    const active = defineFleshAndBloodCardUnchecked({
      canonicalId: "active-card",
      slug: "active-card",
      types: ["Action"],
    });
    const departedStackSource = defineFleshAndBloodCardUnchecked({
      canonicalId: "departed-flurry",
      slug: "departed-flurry",
      types: ["Token"],
    });

    expect(
      definitionsForFabMatchPresentation({
        objects: { instance: { canonicalId: active.canonicalId } },
        cardDefinitions: {
          [active.canonicalId]: active,
          [departedStackSource.canonicalId]: departedStackSource,
        },
        rulesStack: [{ source: { canonicalId: departedStackSource.canonicalId } }],
      }),
    ).toEqual([active, departedStackSource]);
  });

  it("resolves both formats for every current catalog default and exact printing", async () => {
    for (const card of allFleshAndBloodCards) {
      const defaultId = fabDefaultPrintingId(card);
      const expected = defaultId ? catalogArt(defaultId) : undefined;
      const actual = resolveFabCardArt({ canonicalId: card.canonicalId });
      expect(actual.boardImageUrl, card.slug).toBe(expected?.board || undefined);
      expect(actual.printedImageUrl, card.slug).toBe(expected?.full || undefined);
      for (const printing of card.printings) {
        const art = resolveFabCardArt({ canonicalId: card.canonicalId, printingId: printing.id });
        expect(art.boardImageUrl, printing.id).toBe(printing.boardImageUrl || undefined);
        expect(art.printedImageUrl, printing.id).toBe(printing.imageUrl || undefined);
      }
    }
  }, 30_000);

  it("resolves every card with published catalog assets", async () => {
    const catalogCardsWithPublishedArt = allFleshAndBloodCards.filter((card) =>
      hasPublishedBoardArt(card.canonicalId),
    );

    expect(catalogCardsWithPublishedArt.length).toBeGreaterThan(0);
    for (const card of catalogCardsWithPublishedArt) {
      expect(
        imageUrlForFabCard({
          canonicalId: card.canonicalId,
          slug: card.slug,
          name: card.name,
        }),
        card.canonicalId,
      ).toMatch(/^https:\/\//);
    }
  });

  it("emits only board-art URLs present in the current catalog", async () => {
    for (const card of allFleshAndBloodCards) {
      const actual = boardImageUrlForFabCard({
        canonicalId: card.canonicalId,
        slug: card.slug,
        name: card.name,
      });
      const hasPublishedArt = hasPublishedBoardArt(card.canonicalId);
      expect(Boolean(actual), card.canonicalId).toBe(hasPublishedArt);
      if (actual) expect(publishedBoardUrls.has(actual), card.canonicalId).toBe(true);
    }
  });

  it("retains printed ratios while using square board crops for horizontal cards", async () => {
    const horizontalIdentity = { canonicalId: "nnQpNFFKqfMwJbRQ6brJ6" };
    expect(imageAspectRatioForFabCard(horizontalIdentity)).toBe(1);
    expect(boardImageCandidatesForFabCard(horizontalIdentity)[0]?.imageAspectRatio).toBe(
      FAB_CARD_IMAGE_ASPECT_RATIOS.board,
    );
    expect(boardImageUrlForFabCard(horizontalIdentity)).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
    expect(
      boardImageUrlForFabCard({ canonicalId: "PHktCwKzLmBMwmCBwb7Cw", name: "Snatch" }),
    ).toMatch(/^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
  });

  it("uses no-text board art for published generated tokens and placeholders", async () => {
    const tokens = allFleshAndBloodCards.filter(
      (card) => card.typeText.includes("Token") && hasPublishedBoardArt(card.canonicalId),
    );
    const placeholders = allFleshAndBloodCards.filter(
      (card) =>
        card.typeText.includes("Placeholder Card") && hasPublishedBoardArt(card.canonicalId),
    );

    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      expect(
        boardImageUrlForFabCard({
          canonicalId: token.canonicalId,
          slug: token.slug,
          name: token.name,
        }),
        token.name,
      ).toMatch(/^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    }
    for (const placeholder of placeholders) {
      expect(
        boardImageUrlForFabCard({
          canonicalId: placeholder.canonicalId,
          slug: placeholder.slug,
          name: placeholder.name,
        }),
        placeholder.name,
      ).toMatch(/^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    }
  });

  it("uses the authoritative original crops for Death Dealer and Tectonic Plating", async () => {
    expect(
      boardImageUrlForFabCard({
        canonicalId: "Nnmtz6GrR6MWMcptb6wD7",
        name: "Death Dealer",
      }),
    ).toMatch(/\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
    expect(
      boardImageUrlForFabCard({
        canonicalId: "TN6DmN7GK9DtMKd9pnmwF",
        name: "Tectonic Plating",
      }),
    ).toMatch(/\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
  });

  it("does not silently pick a color when a name maps to multiple canonical cards", async () => {
    expect(boardImageUrlForFabCard("Sink Below")).toBeUndefined();
    expect(boardImageUrlForFabCard("Sink Below (red)")).toMatch(/\/fab\/assets\/board\//);
    expect(
      boardImageUrlForFabCard({
        canonicalId: "7RzTp9JnTprz6fjnhRJLM",
        name: "Sink Below",
      }),
    ).toMatch(/\/fab\/assets\/board\//);
    expect(
      boardImageUrlForFabCard({
        canonicalId: "bHRdHqLRCthfzcrffPNQH",
        name: "Sink Below",
      }),
    ).toMatch(/\/fab\/assets\/board\//);
  });

  it("aliases a runtime fixture id through its color-qualified slug", async () => {
    expect(
      boardImageUrlForFabCard({
        canonicalId: "fixture-searing-shot",
        slug: "searing-shot-red",
        name: "Searing Shot",
      }),
    ).toMatch(/\/fab\/assets\/board\//);
  });

  it("publishes board art for generated aura tokens", async () => {
    expect(
      boardImageUrlForFabCard({
        canonicalId: "Rf8CHpzmhJNppCtDDKWDm",
        name: "Seismic Surge",
      }),
    ).toMatch(/\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/);
  });
});

describe("resolveFabCardArt", () => {
  it("returns board art, printed art, and the no-text variant for a board-backed card", async () => {
    const boardBacked = allFleshAndBloodCards.find((card) =>
      card.printings.some((printing) => printing.boardImageUrl && printing.imageUrl),
    );
    expect(boardBacked).toBeDefined();

    const art = resolveFabCardArt({ canonicalId: boardBacked!.canonicalId });
    expect(art.boardImageUrl).toMatch(/^https:\/\/cdn\.tcg\.online\//);
    expect(art.printedImageUrl).toMatch(/\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/);
    expect(art.printedImageUrl).not.toBe(art.boardImageUrl);
    expect(art.artVariant).toBe("no-text");
    expect(art.imageAspectRatio).toBe(FAB_CARD_IMAGE_ASPECT_RATIOS.board);
    expect(art.printedImageAspectRatio).toBe(FAB_CARD_IMAGE_ASPECT_RATIOS.printed);
  });

  it("leaves both formats unavailable when the catalog has no source artwork", async () => {
    const withoutArt = allFleshAndBloodCards.find((card) =>
      card.printings.every((printing) => !printing.boardImageUrl && !printing.imageUrl),
    );
    expect(withoutArt).toBeDefined();
    const art = resolveFabCardArt({ canonicalId: withoutArt!.canonicalId });
    expect(art.boardImageUrl).toBeUndefined();
    expect(art.printedImageUrl).toBeUndefined();
    expect(art.artVariant).toBeNull();
    expect(art.imageAspectRatio).toBe(FAB_CARD_IMAGE_ASPECT_RATIOS.printed);
  });

  it("reports no art and the printed default aspect for unknown identities", () => {
    expect(resolveFabCardArt({ canonicalId: "no-such-card", name: "No Such Card" })).toEqual({
      imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed,
      printedImageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed,
      artVariant: null,
    });
  });

  it("uses only the published board crop and rejects a provider-hosted fallback", async () => {
    const canonicalId = "TN6DmN7GK9DtMKd9pnmwF";
    const art = resolveFabCardArt({ canonicalId });
    const entityFallback = "https://example.test/tectonic-plating.webp";

    expect(
      boardImageCandidatesForFabCard(
        { canonicalId },
        { imageUrl: entityFallback, imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed },
      ),
    ).toEqual([
      {
        imageUrl: art.boardImageUrl,
        imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.board,
        artVariant: "no-text",
      },
    ]);
  });

  it("exposes the canonical aspect-ratio constants", () => {
    expect(FAB_CARD_IMAGE_ASPECT_RATIOS.board).toBe(1);
    expect(FAB_CARD_IMAGE_ASPECT_RATIOS.horizontal).toBeCloseTo(2079 / 1488);
  });
});

describe("printing identity presentation", () => {
  it("resolves an identified printing to its canonical published board crop", async () => {
    const identity = {
      canonicalId: "tCkMg9kPCkhTDTbJkdHjB",
      printingId: "pzMPggLDLGfBLcqPzbH6R",
      name: "Buckwild",
    };
    expect(imageUrlForFabCard(identity)).toBe(catalogArt(identity.printingId).board);
    expect(boardImageUrlForFabCard(identity)).toBe(imageUrlForFabCard(identity));
    expect(resolveFabCardArt(identity).printedImageUrl).toBe(catalogArt(identity.printingId).full);
    expect(imageAspectRatioForFabCard(identity)).toBe(1);
  });

  it("does not mix assets when an exact printing is unavailable", async () => {
    const art = resolveFabCardArt({
      canonicalId: "PHktCwKzLmBMwmCBwb7Cw",
      printingId: "missing-printing-id",
      name: "Snatch",
    });
    expect(art.boardImageUrl).toBeUndefined();
    expect(art.printedImageUrl).toBeUndefined();
  });

  it("keeps distinct printings of the same card linked to their own full assets", async () => {
    const canonicalId = "PHktCwKzLmBMwmCBwb7Cw";
    const firstPrintingId = "dwt7wcDTPQFrjmz7jgQcT";
    const secondPrintingId = "P6QFTrNhHWF9WJ8PWKQQ9";
    const first = resolveFabCardArt({ canonicalId, printingId: firstPrintingId });
    const second = resolveFabCardArt({ canonicalId, printingId: secondPrintingId });

    expect(first.printedImageUrl).toBe(catalogArt(firstPrintingId).full);
    expect(second.printedImageUrl).toBe(catalogArt(secondPrintingId).full);
    expect(first.printedImageUrl).not.toBe(second.printedImageUrl);
  });

  it("canonical identities without a printing keep shard-default resolution", async () => {
    const identity = { canonicalId: "fixture-everbloom", name: "Everbloom Life" };
    const art = resolveFabCardArt(identity);
    expect(art.artVariant).not.toBeNull();
    // All browser-visible art comes from the assets repository's board-crop CDN.
    const url = art.boardImageUrl ?? art.printedImageUrl ?? "";
    expect(url.startsWith("https://cdn.tcg.online/")).toBe(true);
    expect(url).not.toMatch(/googleapis\.com|fabmaster/);
  });
});

it("uses a reviewed back-face default without borrowing front printing artwork", () => {
  const back = resolveFabCardArt({ canonicalId: "67zdgKFWD7qzcPppbRHNB:face:back" });
  const selected = resolveFabCardArt({
    canonicalId: "67zdgKFWD7qzcPppbRHNB:face:back",
    printingId: "j8rcMLgRNcGQ6tqRpPhGT",
  });
  expect(back.boardImageUrl).toBeDefined();
  expect(selected.boardImageUrl).toBe(back.boardImageUrl);
});
