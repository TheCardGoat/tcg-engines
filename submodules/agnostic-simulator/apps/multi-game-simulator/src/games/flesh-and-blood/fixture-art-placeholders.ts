/** Invented fixture objects have no printed card image. Never hide missing real-card art here. */
const FIXTURE_ART_PLACEHOLDERS: ReadonlySet<string> = new Set([
  "fab-test-filler",
  "fixture-animation-reveal-attack",
  "fixture-animation-shuffle-head",
  "fixture-clash-sequence-lab",
  "fixture-animation-prevention-instant",
  "fixture-trigger-decision-snatch",
  "fixture-trigger-target-aura",
  "fixture-trigger-target-aura-2",
  "fixture-multi-trigger-hero",
  "fixture-multi-trigger-hit-attack",
  "viz-blood-debt-6",
  "viz-combo",
  "viz-dagger",
  "viz-earth-pitch",
  "viz-evo",
  "viz-lightning-aura",
  "viz-suspense-aura",
  "viz-zombie",
]);

export function isFabFixtureArtPlaceholder(canonicalId: string | undefined): boolean {
  return canonicalId !== undefined && FIXTURE_ART_PLACEHOLDERS.has(canonicalId);
}
