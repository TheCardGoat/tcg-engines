import type { ResourceCard } from "@tcg/gundam-types";

/**
 * Metadata-only shape assertions for resource cards.
 *
 * Resource cards are gameplay-trivial: they have no effects, just sit in the
 * resource area providing level/cost capacity. Responsibility is split across
 * three helpers:
 *
 * - `assertResourceShape` checks structural metadata (type, name, rarity,
 *   cost/level, traits, cardNumber).
 * - `assertResourceInert` verifies the card carries no `effects` or
 *   `keywordEffects` entries.
 * - `assertResourceReminderText` verifies the optional canonical reminder
 *   string on `card.effect`.
 *
 * NOTE: These helpers used to call `expect()` from `vite-plus/test` directly.
 * That worked in tests but ALSO bundled vitest internals into the engine's
 * production `dist/index.mjs` (because `gundam/index.ts` re-exports this
 * module). Vitest internals call `getWorkerState()` at top-of-module, which
 * crashes any non-test environment that tries to import the engine — most
 * notably, the simulator's SSR pipeline. We now use plain `Error` throws,
 * which test runners catch and report as failures the same way.
 */

function fail(actual: unknown, expected: unknown, field: string): never {
  throw new Error(
    `assertResourceShape: ${field} mismatch — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
  );
}

export const assertResourceShape = (card: ResourceCard, expected: { cardNumber: string }): void => {
  if (card.cardNumber !== expected.cardNumber)
    fail(card.cardNumber, expected.cardNumber, "cardNumber");
  if (card.type !== "resource") fail(card.type, "resource", "type");
  if (card.name !== "resource") fail(card.name, "resource", "name");
  if (card.rarity !== "common") fail(card.rarity, "common", "rarity");
  if (card.level !== 0) fail(card.level, 0, "level");
  if (card.cost !== 0) fail(card.cost, 0, "cost");
  const traits = card.traits ?? [];
  if (traits.length !== 1 || traits[0] !== "-") {
    fail(traits, ["-"], "traits");
  }
};

export const assertResourceInert = (card: ResourceCard): void => {
  const effects = card.effects ?? [];
  if (effects.length !== 0) {
    throw new Error(`assertResourceInert: expected no effects, got ${effects.length}`);
  }
  const keywordEffects = card.keywordEffects ?? [];
  if (keywordEffects.length !== 0) {
    throw new Error(
      `assertResourceInert: expected no keywordEffects, got ${keywordEffects.length}`,
    );
  }
};

/**
 * Resource cards share a common reminder string; it may be absent on older
 * definitions. When present it must match the canonical wording.
 */
export const assertResourceReminderText = (
  card: ResourceCard,
  expectedReminder = "(Rest a Resource when paying a cost.)<br>",
): void => {
  const text = card.effect;
  if (text !== undefined && text !== expectedReminder) {
    throw new Error(
      `assertResourceReminderText: expected ${JSON.stringify(expectedReminder)}, got ${JSON.stringify(text)}`,
    );
  }
};
