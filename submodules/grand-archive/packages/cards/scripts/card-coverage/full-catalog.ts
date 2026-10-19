/** Full-catalog release policy; report freshness alone is not coverage. */
export function assertGrandArchiveFullCatalogCoverage(totals: {
  readonly abilities: number;
  readonly coveredAbilities: number;
  readonly blockedAbilities: number;
  readonly outOfScopeAbilities: number;
  readonly untestedAbilities: number;
  readonly cardsWithoutAbilities: number;
  readonly coveredCardsWithoutAbilities: number;
}): void {
  const uncoveredCards = totals.cardsWithoutAbilities - totals.coveredCardsWithoutAbilities;
  if (
    totals.coveredAbilities !== totals.abilities ||
    totals.blockedAbilities !== 0 ||
    totals.outOfScopeAbilities !== 0 ||
    totals.untestedAbilities !== 0 ||
    uncoveredCards !== 0
  ) {
    throw new Error(
      `Full-catalog coverage is incomplete: ${totals.untestedAbilities} untested abilities, ` +
        `${totals.blockedAbilities} blocked abilities, ${totals.outOfScopeAbilities} excluded abilities, ` +
        `${uncoveredCards} uncovered cards without abilities ` +
        `(${totals.coveredAbilities}/${totals.abilities} abilities covered).`,
    );
  }
}
