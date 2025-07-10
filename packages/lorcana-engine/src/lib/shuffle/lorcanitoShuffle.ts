import { shuffle } from "@lorcanito/lorcana-engine/lib/shuffle/shuffle";

export function lorcanitoShuffle<T extends { publicId: string }>(
  originalDeck: T[],
  maxAttempts = 7,
): T[] {
  return shuffle([...originalDeck]);
}
