import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { heroObjectsForPlayer } from "../helpers.ts";

/**
 * Resolve the unique strict life max/min hero as a hero object set.
 * Ties and missing life facts yield an empty set (effect no-op).
 */
export function resolveLifeExtremaHero(
  rank: "highest" | "lowest",
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const playerLife = context.facts?.playerLife;
  if (!playerLife) return [];
  const entries = Object.entries(playerLife);
  if (entries.length === 0) return [];
  const extreme =
    rank === "highest"
      ? Math.max(...entries.map(([, life]) => life))
      : Math.min(...entries.map(([, life]) => life));
  const winners = entries.filter(([, life]) => life === extreme).map(([playerId]) => playerId);
  if (winners.length !== 1) return [];
  return heroObjectsForPlayer(winners[0]!, context, objects);
}
