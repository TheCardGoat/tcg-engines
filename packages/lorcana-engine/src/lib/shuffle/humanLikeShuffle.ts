const HUMAN_SHUFFLE_STEPS = 5;

export function humanShuffle<T extends { publicId: string }>(
  deck: T[],
  steps = HUMAN_SHUFFLE_STEPS,
): T[] {
  let shuffled = [...deck];

  // Simulate typical human shuffle patterns
  for (let i = 0; i < steps; i++) {
    // Alternate between different shuffle techniques
    if (i % 2 === 0) {
      shuffled = pileThenRiffle(shuffled);
    } else {
      shuffled = overhandShuffle(shuffled, 3);
    }
  }

  return shuffled;
}

// Common human technique: Split into piles then imperfect riffle
function pileThenRiffle<T extends { publicId: string }>(deck: T[]): T[] {
  // 1. Pile shuffle (split into random piles)
  const pileCount = Math.floor(3 + Math.random() * 3); // 3-5 piles
  const piles: T[][] = Array.from({ length: pileCount }, () => []);

  deck.forEach((card, index) => {
    const number = index % pileCount;
    if (piles[number] !== undefined) {
      piles[number].push(card);
    }
  });

  // 2. Combine piles in random order
  let combined: T[] = [];

  while (piles.length > 0) {
    const randomPileIndex = Math.floor(Math.random() * piles.length);
    const splice = piles.splice(randomPileIndex, 1);
    if (splice[0]) {
      combined = combined.concat(splice[0]);
    }
  }

  // 3. Imperfect riffle shuffle
  return imperfectRiffle(combined);
}

// Simulates imperfect human riffle shuffle
function imperfectRiffle<T extends { publicId: string }>(deck: T[]): T[] {
  const splitPoint = deck.length / 2 + (Math.random() - 0.5) * 10;
  const left = deck.slice(0, splitPoint);
  const right = deck.slice(splitPoint);

  const result: T[] = [];
  while (left.length > 0 || right.length > 0) {
    // Randomly take 1-3 cards from each half
    const takeLeft = Math.min(1 + Math.floor(Math.random() * 3), left.length);
    result.push(...left.splice(0, takeLeft));

    const takeRight = Math.min(1 + Math.floor(Math.random() * 3), right.length);
    result.push(...right.splice(0, takeRight));
  }

  return result;
}

// Simulates overhand shuffle (common casual technique)
function overhandShuffle<T extends { publicId: string }>(
  deck: T[],
  passes: number,
): T[] {
  let temp = [...deck];
  for (let pass = 0; pass < passes; pass++) {
    const newDeck: T[] = [];
    while (temp.length > 0) {
      // Grab 1-5 cards from the top
      const chunkSize = 1 + Math.floor(Math.random() * 5);
      const chunk = temp.splice(0, chunkSize);
      // Place chunk either on top or bottom (mostly top)
      Math.random() < 0.8 ? newDeck.unshift(...chunk) : newDeck.push(...chunk);
    }
    temp = newDeck;
  }
  return temp;
}
