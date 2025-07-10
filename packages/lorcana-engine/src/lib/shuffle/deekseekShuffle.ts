/**
 * Performs an unbiased Fisher-Yates (Knuth) shuffle on a copy of the input array.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  while (currentIndex) {
    const randomIndex = Math.floor(Math.random() * currentIndex--);
    // @ts-ignore
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

/**
 * Calculates a clumpiness score for the deck based on runs of identical cards.
 * Lower scores are better (fewer long runs).
 */
function calculateClumpinessScore(deck: Array<{ publicId: string }>): number {
  let score = 0;

  for (let i = 0; i < deck.length; i++) {
    // Check the next 3 positions (up to end of array)
    for (let j = 1; j <= 3; j++) {
      const compareIndex = i + j;
      if (compareIndex >= deck.length) break;

      if (deck[i]?.publicId === deck[compareIndex]?.publicId) {
        // Apply different weights based on distance
        switch (j) {
          case 1: // Direct neighbor (highest penalty)
            score += 4;
            break;
          case 2: // One card apart
            score += 2;
            break;
          case 3: // Two cards apart
            score += 1;
            break;
        }
      }
    }
  }

  return score;
}

/**
 * Optimized shuffle that performs multiple shuffles and returns the best one.
 */
export function optimizedShuffle<T extends { publicId: string }>(
  originalDeck: T[],
  maxAttempts = 7,
): T[] {
  if (originalDeck.length === 0) return [];

  let bestDeck = shuffle(originalDeck);
  let bestScore = calculateClumpinessScore(bestDeck);

  for (let i = 1; i < maxAttempts; i++) {
    const candidateDeck = shuffle(originalDeck);
    const candidateScore = calculateClumpinessScore(candidateDeck);

    if (candidateScore < bestScore) {
      bestDeck = candidateDeck;
      bestScore = candidateScore;
    }
  }

  return bestDeck;
}
