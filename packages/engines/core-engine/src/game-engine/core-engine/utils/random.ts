import { createId as cuid, init } from "@paralleldrive/cuid2";
import {
  fisherYatesWithSeed,
  LinearCongruentialGenerator,
  shuffleCardZone,
} from "./shuffle-utils";

// Re-export shuffle functions for backward compatibility
export { fisherYatesWithSeed, LinearCongruentialGenerator, shuffleCardZone };

export const createShortAndUniqueIds = (size: number) => {
  const createId = init({
    // 1296 possibilities
    length: 2,
  });

  const ids = new Set<string>();

  do {
    ids.add(createId());
  } while (ids.size < size);

  return Array.from(ids);
};

export const createId = cuid;
