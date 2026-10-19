import {
  getCard,
  hasCard,
  hasMissingArtwork,
  officialCardImageUrl,
  officialProductImageUrl,
} from "@tcg/alpha-clash-cards";
import type { LiveBoardCard } from "../board-types";

// Share the release admission map so newly published faces cannot diverge.
export const alphaClashCardImageUrl = officialCardImageUrl;
export const alphaClashProductImageUrl = officialProductImageUrl;

export function cardArtwork(card: LiveBoardCard): string | undefined {
  if (card.faceDown) return undefined;
  if (card.definitionId) {
    if (hasMissingArtwork(card.definitionId)) return undefined;
    const image = alphaClashCardImageUrl(card.definitionId);
    if (image) return image;
    if (hasCard(card.definitionId)) {
      const canonical = alphaClashCardImageUrl(getCard(card.definitionId).id);
      if (canonical) return canonical;
    }
  }
  return card.imageUrl;
}
