import { describe, expect, test } from "vitest";
import { officialCatalog } from "@tcg/alpha-clash-cards";
import {
  alphaClashPracticeDecks,
  resolveAlphaClashLabDeck,
} from "@tcg/alpha-clash-server-adapter/practice";
import { alphaClashOpening } from "../../opening-fixture";
import type { LiveBoardCard } from "../board-types";
import { alphaClashCardImageUrl, alphaClashProductImageUrl, cardArtwork } from "./card-artwork";

const shield: LiveBoardCard = {
  instanceId: "shield",
  definitionId: "ac-ac5-082",
  name: "Archaic Shield",
  zone: "hand",
  controller: "player-one",
  ready: true,
  faceDown: false,
  clashDamage: 0,
  phaseDamage: 0,
};
describe("Alpha Clash CDN artwork", () => {
  test("serves Archaic Shield from the pinned immutable CDN asset", () => {
    expect(cardArtwork(shield)).toBe(
      "https://cdn.tcg.online/public/alpha-clash/cards/full/554dbcbc89468795561c35866d3a08b67e1c930ef1f95122072714303911c634.webp",
    );
    expect(alphaClashProductImageUrl(623740)).toBe(cardArtwork(shield));
    expect(
      cardArtwork({
        ...shield,
        imageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/623740_400w.jpg",
      }),
    ).toBe(cardArtwork(shield));
  });
  test("has CDN artwork for every authored and admitted card and the supplemental publisher face", () => {
    const cardIds = new Set(
      alphaClashPracticeDecks.flatMap((deck) => {
        const resolved = resolveAlphaClashLabDeck(deck.id);
        return [resolved.contenderId, ...resolved.deckIds];
      }),
    );
    for (const card of officialCatalog) cardIds.add(card.id);
    expect(alphaClashPracticeDecks).toHaveLength(8);
    expect(cardIds.size).toBeGreaterThan(0);
    for (const id of cardIds)
      expect(alphaClashCardImageUrl(id), id).toMatch(
        /^https:\/\/cdn\.tcg\.online\/public\/alpha-clash\/cards\/full\/[a-f0-9]{64}\.webp$/,
      );
    expect(alphaClashCardImageUrl("ac-pg-003")).toBeDefined();
    expect(alphaClashCardImageUrl("ac-ks-ac1-121")).toBeDefined();
    expect(alphaClashCardImageUrl("ac-sotv-056")).toBeDefined();
  });
  test.each([
    "ac-ac4-001",
    "ac-ac5-012",
    "ac-ac5-133",
    "ac-ac7-072",
    "ac-ac7-205",
    "ac-ac8-181",
    "ac-cp-004",
  ])("renders newly published face %s without a viewer image fallback", (id) => {
    const image = cardArtwork({ ...shield, definitionId: id });
    expect(image).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/alpha-clash\/cards\/full\/[a-f0-9]{64}\.webp$/,
    );
    expect(alphaClashCardImageUrl(id)).toBe(image);
  });
  test("pins all opening fixture products to CDN images", () => {
    for (const card of [...alphaClashOpening.leaders, ...alphaClashOpening.cards])
      expect(card.imageUrl).toMatch(
        /^https:\/\/cdn\.tcg\.online\/public\/alpha-clash\/cards\/full\//,
      );
  });
  test("does not replace missing CD3 faces with another printing", () => {
    expect(alphaClashCardImageUrl("ac-cd3-002")).toBeUndefined();
    expect(
      cardArtwork({ ...shield, definitionId: "ac-cd3-002", imageUrl: "another-printing.webp" }),
    ).toBeUndefined();
  });
  test("does not disclose face-down artwork", () => {
    expect(cardArtwork({ ...shield, faceDown: true })).toBeUndefined();
  });
  test("keeps custom viewer-safe artwork for unknown fixture definitions", () => {
    expect(cardArtwork({ ...shield, definitionId: "custom", imageUrl: "fixture.webp" })).toBe(
      "fixture.webp",
    );
    expect(alphaClashCardImageUrl("unknown")).toBeUndefined();
    expect(alphaClashProductImageUrl(-1)).toBeUndefined();
  });
});
