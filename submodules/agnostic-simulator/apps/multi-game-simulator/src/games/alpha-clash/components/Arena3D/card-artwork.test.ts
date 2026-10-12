import { describe, expect, test } from "vitest";
import { officialCatalog } from "@tcg/alpha-clash-cards";
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
  test("has CDN artwork for every authored card and the supplemental publisher face", () => {
    for (const card of officialCatalog)
      expect(alphaClashCardImageUrl(card.id), card.id).toMatch(
        /^https:\/\/cdn\.tcg\.online\/public\/alpha-clash\/cards\/full\/[a-f0-9]{64}\.webp$/,
      );
    expect(alphaClashCardImageUrl("ac-pg-003")).toBeDefined();
    expect(alphaClashCardImageUrl("ac-ks-ac1-121")).toBeDefined();
    expect(alphaClashCardImageUrl("ac-sotv-056")).toBeDefined();
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
