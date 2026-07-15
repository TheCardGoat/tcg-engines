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
  currentCardQaCardsByType,
  currentCardQaCases,
} from "../../../engine/fixtures/scenarios/current-card-qa";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";

describe("current-card QA cases", () => {
  test("map every current non-alpha, non-spoiler card to authored scenario cases", () => {
    assertCurrentCardQaCatalog();

    expectEqual("current-card QA total", currentCardQaCards.length, 89);
    expectEqual("current-card QA legends", currentCardQaCardsByType.legend?.length ?? 0, 24);
    expectEqual("current-card QA units", currentCardQaCardsByType.unit?.length ?? 0, 42);
    expectEqual("current-card QA gear", currentCardQaCardsByType.gear?.length ?? 0, 9);
    expectEqual("current-card QA programs", currentCardQaCardsByType.program?.length ?? 0, 14);

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

    expectEqual("current-card QA case count", seen.size, currentCardQaCards.length);
  });
});

function qaCardKey(card: { set: { code: string }; slug: string }): string {
  return `${card.set.code}:${card.slug}`;
}
