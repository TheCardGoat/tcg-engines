/**
 * Demi-hero definition registry for the test harness.
 *
 * Same bridge pattern as {@link token-registry}: the engine never imports the
 * cards package, but match setup must register definitions that can appear at
 * runtime without being in a player's opening deck. HNT Agents of Chaos are
 * the primary case — arakni-marionette / web-of-deceit transform into a random
 * Agent of Chaos at end phase, so those six demi-heroes must be on
 * `state.cardDefinitions` before the transform reducer can swap the hero.
 */

import type { FabCardDefinitionInput } from "../cards.ts";
import { toFabCardDefinition } from "../cards.ts";

import { arakniBlackWidow } from "../../../cards/src/cards/demi-heroes/arakni-black-widow.ts";
import { arakniFunnelWeb } from "../../../cards/src/cards/demi-heroes/arakni-funnel-web.ts";
import { arakniOrbWeaver } from "../../../cards/src/cards/demi-heroes/arakni-orb-weaver.ts";
import { arakniRedback } from "../../../cards/src/cards/demi-heroes/arakni-redback.ts";
import { arakniTarantula } from "../../../cards/src/cards/demi-heroes/arakni-tarantula.ts";
import { arakniTrapDoor } from "../../../cards/src/cards/demi-heroes/arakni-trap-door.ts";
import { teklovossenTheMechropotent } from "../../../cards/src/cards/demi-heroes/teklovossen-the-mechropotent.ts";

/** Catalog Agents of Chaos demi-hero modules (HNT003–HNT008). */
const agentOfChaosModules = [
  arakniBlackWidow,
  arakniFunnelWeb,
  arakniOrbWeaver,
  arakniRedback,
  arakniTarantula,
  arakniTrapDoor,
] as const;

/**
 * Canonical ids of registered Agents of Chaos, sorted for deterministic RNG
 * indexing in the transform reducer (pool order must be stable).
 */
export const AGENT_OF_CHAOS_CANONICAL_IDS: readonly string[] = agentOfChaosModules
  .map((card) => card.canonicalId)
  .slice()
  .sort((a, b) => a.localeCompare(b));

export const agentOfChaosDefinitionsById: ReadonlyMap<string, FabCardDefinitionInput> = (() => {
  const map = new Map<string, FabCardDefinitionInput>();
  for (const card of agentOfChaosModules) {
    map.set(
      card.canonicalId,
      toFabCardDefinition(card as Parameters<typeof toFabCardDefinition>[0]),
    );
  }
  return map;
})();

/**
 * Pre-register Agents of Chaos demi-heroes onto match cardDefinitions so
 * `transform` into `agent-of-chaos` can resolve the chosen identity. Also
 * pre-register Teklovossen the Mechropotent so Singularity's `transform … into
 * teklovossen-the-mechropotent` can resolve it (the Mechropotent is created by
 * Singularity at runtime, not present in the opening deck). The Mechropotent is
 * NOT part of the Agents of Chaos RNG pool.
 */
export function registerDemiHeroDefinitions(
  cardDefinitions: Record<string, FabCardDefinitionInput>,
): void {
  for (const [canonicalId, definition] of agentOfChaosDefinitionsById) {
    cardDefinitions[canonicalId] ??= definition;
  }
  cardDefinitions[teklovossenTheMechropotent.canonicalId] ??= toFabCardDefinition(
    teklovossenTheMechropotent as Parameters<typeof toFabCardDefinition>[0],
  );
}
