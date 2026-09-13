/**
 * Explicit integration surface for the local FAB simulator.
 *
 * The simulator is an engine client, not a privileged import of internal
 * modules. This facade is intentionally separate from the server runtime
 * boundary because local practice scenes need fixture builders and bot decks.
 */
export * from "./catalog-api.ts";
export * from "./automation/bot-strategies.ts";
export * from "./automation/legal-commands.ts";
export * from "./automation/auto-pass.ts";
export * from "./automation/heuristic/index.ts";
export * from "./automation/strategy-registry.ts";
export * from "./automation/catalog-test-cards.ts";
export * from "./automation/deck-text-fixtures.ts";
export type { FabPracticeMatch } from "./automation/practice-match.ts";
export { nextRandom, seedFromString, shuffleWith } from "./random.ts";
export * from "./runtime-api.ts";
export type { FabZoneKind } from "./game/zones.ts";
