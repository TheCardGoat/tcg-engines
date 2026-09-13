/** Discoverable real-deck QA matchups for the FAB fixture catalog. */

export interface FabPracticeMatchupCatalogFixture {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly group: "practice-matches";
  readonly tags: readonly string[];
  readonly playerDeckId: string;
  readonly botDeckId: string;
  /**
   * Strategy for the opponent seat. Matchups use the hero-profile dispatcher
   * so a seated hero receives its guide when one is registered, otherwise its
   * documented value-extract fallback.
   */
  readonly botStrategyId: string;
  readonly seed: string;
}

/** Curated real-deck fixtures. Add a named pairing here as QA coverage grows. */
export const FAB_PRACTICE_MATCHUP_FIXTURES: readonly FabPracticeMatchupCatalogFixture[] = [
  {
    id: "practice-matchup-malice-vs-viserai",
    label: "Malice vs Viserai",
    description:
      "The supplied Domina on my Corpse until I'm Dead and Shadow Sun Kissed Technique Classic Constructed lists, seeded for repeatable manual QA.",
    group: "practice-matches",
    tags: ["practice", "matchup", "real-deck", "malice", "viserai", "sideboard", "seeded"],
    playerDeckId: "cc-2026-09-12-domina-on-my-corpse-malice",
    botDeckId: "cc-2026-09-13-shadow-sun-kissed-technique-viserai",
    botStrategyId: "hero-profile",
    seed: "fixture:malice-vs-viserai:1",
  },
  {
    id: "practice-matchup-rhinar-vs-tuffnut",
    label: "Rhinar vs Tuffnut",
    description:
      "Real Classic Constructed practice decks with selected equipment and the remaining loadout in private inventory.",
    group: "practice-matches",
    tags: ["practice", "matchup", "real-deck", "rhinar", "tuffnut", "sideboard", "seeded"],
    playerDeckId: "cc-guilherme-coutinho-rhinar",
    botDeckId: "cc-edinburgh-3rd-tuffnut",
    botStrategyId: "hero-profile",
    seed: "fixture:rhinar-vs-tuffnut",
  },
];

export function getFabPracticeMatchupFixture(
  id: string | undefined,
): FabPracticeMatchupCatalogFixture | undefined {
  return FAB_PRACTICE_MATCHUP_FIXTURES.find((fixture) => fixture.id === id);
}
