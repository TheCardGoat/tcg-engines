/**
 * MatchRuntime Random API Factories
 */

import type { Draft } from "mutative";
import seedrandom from "seedrandom";
import type { MatchState } from "./types";
import type { RandomAPI } from "./match-runtime.types";

export function createRandomAPIForDraft(draft: Draft<MatchState>): RandomAPI {
  const random = (): number => {
    draft.ctx.random.draws++;
    const seed = draft.ctx.random.seed;
    return seedrandom(`${seed}:${draft.ctx.random.draws}`)();
  };

  return {
    random,
    shuffle: <T>(array: T[]): T[] => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
  };
}
