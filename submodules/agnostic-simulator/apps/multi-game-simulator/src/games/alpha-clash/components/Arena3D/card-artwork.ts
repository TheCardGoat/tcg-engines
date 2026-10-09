import { getCard, hasCard } from "@tcg/alpha-clash-cards";
import type { LiveBoardCard } from "../board-types";

export function cardArtwork(card: LiveBoardCard): string | undefined {
  if (card.faceDown) return undefined;
  if (card.imageUrl) return card.imageUrl;
  if (!card.definitionId || !hasCard(card.definitionId)) return undefined;
  const product = getCard(card.definitionId)?.printings?.[0]?.productId;
  return product ? `https://tcgplayer-cdn.tcgplayer.com/product/${product}_400w.jpg` : undefined;
}
