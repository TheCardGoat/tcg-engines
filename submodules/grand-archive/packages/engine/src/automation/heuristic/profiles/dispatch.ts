import type { GrandArchiveBotStrategy } from "../../bot-strategies.ts";
import { chooseGrandArchiveHeuristicAction } from "../goldfish.ts";
import { buildGrandArchiveHeuristicSnapshot } from "../snapshot.ts";
import {
  GRAND_ARCHIVE_CHAMPION_PROFILE_BINDINGS,
  resolveGrandArchiveChampionProfileBinding,
  type GrandArchiveChampionProfileBinding,
} from "./champion-profile-table.ts";

export function createGrandArchiveChampionProfileStrategy(
  bindings: readonly GrandArchiveChampionProfileBinding[] = GRAND_ARCHIVE_CHAMPION_PROFILE_BINDINGS,
  fallback?: GrandArchiveBotStrategy,
): GrandArchiveBotStrategy {
  return (context) => {
    const snapshot = buildGrandArchiveHeuristicSnapshot(
      context.program,
      context.state,
      context.playerId,
    );
    const champion = snapshot.champion;
    if (!champion) {
      return fallback
        ? fallback(context)
        : chooseGrandArchiveHeuristicAction(snapshot, context.legalCommands);
    }
    const binding = resolveGrandArchiveChampionProfileBinding(
      {
        canonicalId: champion.definitionId,
        name: champion.name,
        lineageName: champion.lineageName,
        level: champion.level,
      },
      bindings,
    );
    if (binding) return binding.strategy(context);
    return fallback
      ? fallback(context)
      : chooseGrandArchiveHeuristicAction(snapshot, context.legalCommands);
  };
}

/** Current champion-bound dispatcher; unknown lineages use generic value extraction. */
export const championProfileGrandArchiveStrategy = createGrandArchiveChampionProfileStrategy();
