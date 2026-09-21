import { describe, expect, test } from "vite-plus/test";

import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";
import {
  allDeckStrategyProfiles,
  authoredDeckStrategyProfiles,
  deckProfileFor,
} from "../src/deck-profiles.ts";

describe("authored deck strategy profiles (ai-runner re-export)", () => {
  test("covers every authored bot-lab deck exactly once", () => {
    expect(Object.keys(authoredDeckStrategyProfiles).sort()).toEqual(
      authoredBotLabDeckSpecs.map((spec) => spec.id).sort(),
    );
    expect(allDeckStrategyProfiles).toHaveLength(authoredBotLabDeckSpecs.length);
  });

  test("deckProfileFor resolves authored ids", () => {
    expect(deckProfileFor("authored-overwatch-recharge-control")?.deckId).toBe(
      "authored-overwatch-recharge-control",
    );
  });
});
