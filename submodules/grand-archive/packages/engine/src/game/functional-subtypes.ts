import type { GrandArchiveDerivedCharacteristics } from "../rules/state/continuous.ts";

/**
 * Siegeable is a functional Domain subtype, not merely a printed reminder ability.
 * Keeping this predicate characteristic-only ensures Layer-D keyword changes cannot
 * accidentally remove rules granted by the current type line.
 */
export function grandArchiveCharacteristicsAreSiegeable(
  characteristics: Pick<GrandArchiveDerivedCharacteristics, "types" | "subtypes">,
): boolean {
  return characteristics.types.includes("DOMAIN") && characteristics.subtypes.includes("SIEGEABLE");
}
