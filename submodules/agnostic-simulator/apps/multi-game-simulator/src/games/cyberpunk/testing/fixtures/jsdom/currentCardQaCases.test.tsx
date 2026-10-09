import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { listScenarios } from "../../../engine/fixtures/scenarios";
import {
  assertCurrentCardQaCatalog,
  CURRENT_CARD_QA_EXCLUDED_SET_CODES,
  currentCardQaCards,
  currentCardQaCases,
} from "../../../engine/fixtures/scenarios/current-card-qa";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";

describe("current-card QA cases", () => {
  test("map every current non-alpha, non-spoiler card to authored scenario cases", () => {
    assertCurrentCardQaCatalog();

    const scenarios = new Set(listScenarios().map((scenario) => scenario.id));
    const seen = new Map<string, string>();
    for (const entry of currentCardQaCases) {
      const cardKey = qaCardKey(entry.card);
      expect(
        CURRENT_CARD_QA_EXCLUDED_SET_CODES.includes(
          entry.card.set.code as (typeof CURRENT_CARD_QA_EXCLUDED_SET_CODES)[number],
        ),
        `${cardKey} uses an excluded set`,
      ).toBe(false);
      expect(seen.get(cardKey), `${cardKey} is mapped more than once`).toBeUndefined();
      expect(
        entry.scenarioIds.length,
        `${cardKey} has at least one authored scenario`,
      ).toBeGreaterThan(0);
      for (const scenarioId of entry.scenarioIds) {
        expect(
          scenarios.has(scenarioId),
          `${cardKey} references missing scenario ${scenarioId}`,
        ).toBe(true);
      }
      seen.set(cardKey, entry.note);
    }

    // Every current card must map to an authored scenario. A card whose QA
    // scenario has not been authored yet must be listed in
    // PENDING_QA_SCENARIO_SLUGS — anything else fails here, so new cards
    // cannot ship without either a scenario or an explicit, reviewable debt
    // entry.
    const uncoveredSlugs = currentCardQaCards
      .filter((card) => !seen.has(qaCardKey(card)))
      .map((card) => card.slug);
    const unexpected = uncoveredSlugs.filter((slug) => !PENDING_QA_SCENARIO_SLUGS.has(slug));
    expectEqual(
      "current cards without a QA case outside the pending list",
      unexpected.join(","),
      "",
    );
    for (const slug of PENDING_QA_SCENARIO_SLUGS) {
      expect(
        seen.has(`welcometonightcityretail:${slug}`),
        `welcometonightcityretail:${slug} now has an authored QA case; remove it from the pending list`,
      ).toBe(false);
    }
  });
});

// Tracked debt: retail cards that still need an authored per-card QA scenario
// (the retailNewCardAbilities review board does not count — it is a broad
// catalog). When you author a card's scenario, add its mapping above and
// delete it here.
const PENDING_QA_SCENARIO_SLUGS = new Set([
  "animals-wrecker",
  "appetite-for-destruction",
  "hacked-corpo",
  "hanako-arasaka-daughter-of-the-emperor",
  "japantown-jonin",
  "johnny-silverhand-never-stop-fighting",
  "les-elemens",
  "maxtac-heavy",
  "maxtac-squadron",
  "memory-relapse",
  "netwatch-netdriver",
  "pepe-najarro-working-doubles",
  "riot-shield",
  "rita-wheeler-no-stupid-questions",
  "rockn-rockerboy",
  "rogue-amendiares-queen-of-the-afterlife",
  "three-mouths-one-desire",
  "tyger-s-whisper",
  "unlikely-bond",
  "v-roamer-of-the-badlands",
  "valentino-street-racer",
  "westbrook-netrunner",
]);

function qaCardKey(card: { set: { code: string }; slug: string }): string {
  return `${card.set.code}:${card.slug}`;
}
