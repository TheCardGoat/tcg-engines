import { describe, expect, it } from "vitest";

import {
  FAB_PRACTICE_MATCHUP_FIXTURES,
  getFabPracticeMatchupFixture,
} from "./practice-matchup-fixtures";
import { createFabPracticeMatchup } from "./data/practice-matchup-fixture";

describe("FAB practice matchup fixture catalog", () => {
  it("publishes curated real-deck matchups in their own group", () => {
    expect(FAB_PRACTICE_MATCHUP_FIXTURES).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "practice-matchup-malice-vs-viserai",
          group: "practice-matches",
          playerDeckId: "cc-2026-09-12-domina-on-my-corpse-malice",
          botDeckId: "cc-2026-09-13-shadow-sun-kissed-technique-viserai",
          botStrategyId: "hero-profile",
          seed: "fixture:malice-vs-viserai:1",
        }),
        expect.objectContaining({
          id: "practice-matchup-rhinar-vs-tuffnut",
          group: "practice-matches",
          playerDeckId: "cc-guilherme-coutinho-rhinar",
          botDeckId: "cc-edinburgh-3rd-tuffnut",
          botStrategyId: "hero-profile",
          seed: "fixture:rhinar-vs-tuffnut",
        }),
      ]),
    );
    expect(getFabPracticeMatchupFixture("practice-matchup-malice-vs-viserai")).toBeDefined();
    expect(getFabPracticeMatchupFixture("practice-matchup-rhinar-vs-tuffnut")).toBeDefined();
  });

  it("keeps the equipped matchup card public in the viewer effect projection", () => {
    const match = createFabPracticeMatchup({
      player1DeckId: "cc-guilherme-coutinho-rhinar",
      player2DeckId: "cc-edinburgh-3rd-tuffnut",
      seed: "fixture:rhinar-vs-tuffnut",
      firstPlayerId: "player-1",
    });

    const rokEffects = match.runtime
      .viewer({ role: "player", actorId: "player-1" })
      .effects.filter((effect) => effect.source.canonicalId === "KrjrwRtnjcK7hNhcBdH9h");

    expect(rokEffects).toHaveLength(1);
    expect(rokEffects.every((effect) => effect.source.name === "Rok")).toBe(true);
    expect(rokEffects.every((effect) => effect.source.instanceId !== null)).toBe(true);
  });

  it("projects both seats independently in a Tuffnut mirror", () => {
    const match = createFabPracticeMatchup({
      player1DeckId: "cc-edinburgh-3rd-tuffnut",
      player2DeckId: "cc-edinburgh-3rd-tuffnut",
      seed: "fixture:tuffnut-mirror",
      firstPlayerId: "player-1",
    });

    const player1 = match.runtime.viewer({ role: "player", actorId: "player-1" });
    const player2 = match.runtime.viewer({ role: "player", actorId: "player-2" });
    const player1RokEffects = player1.effects.filter(
      (effect) => effect.source.canonicalId === "KrjrwRtnjcK7hNhcBdH9h",
    );
    const player2RokEffects = player2.effects.filter(
      (effect) => effect.source.canonicalId === "KrjrwRtnjcK7hNhcBdH9h",
    );

    expect(player1RokEffects).toHaveLength(2);
    expect(player2RokEffects).toHaveLength(2);
    expect(new Set(player1RokEffects.map((effect) => effect.source.instanceId)).size).toBe(2);
    expect(new Set(player2RokEffects.map((effect) => effect.source.instanceId)).size).toBe(2);
  });
});
