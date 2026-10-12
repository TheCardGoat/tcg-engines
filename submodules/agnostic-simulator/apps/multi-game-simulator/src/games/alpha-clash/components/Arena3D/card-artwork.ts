import { getCard, hasCard } from "@tcg/alpha-clash-cards";
import type { LiveBoardCard } from "../board-types";
import artwork from "../../generated/card-artwork.json";

const baseUrl = "https://cdn.tcg.online/public/alpha-clash/cards/";
const cardPaths: Readonly<Record<string, string>> = artwork.cards;
const printingPaths: Readonly<Record<string, string>> = artwork.printings;
const missingPrintings = new Set<string>(artwork.missingPrintings);
const productPaths: Readonly<Record<string, string>> = artwork.products;

export function alphaClashCardImageUrl(definitionId: string): string | undefined {
  const path = printingPaths[definitionId] ?? cardPaths[definitionId];
  return path ? `${baseUrl}${path}` : undefined;
}

export function alphaClashProductImageUrl(productId: number): string | undefined {
  const path = productPaths[String(productId)];
  return path ? `${baseUrl}${path}` : undefined;
}

export function cardArtwork(card: LiveBoardCard): string | undefined {
  if (card.faceDown) return undefined;
  if (card.definitionId) {
    if (missingPrintings.has(card.definitionId)) return undefined;
    const image = alphaClashCardImageUrl(card.definitionId);
    if (image) return image;
    if (hasCard(card.definitionId)) {
      const canonical = alphaClashCardImageUrl(getCard(card.definitionId).id);
      if (canonical) return canonical;
    }
  }
  return card.imageUrl;
}
