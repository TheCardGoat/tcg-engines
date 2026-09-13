import type { GrandArchiveBotStrategy } from "../bot-strategies.ts";
import type { GrandArchiveLegalCommand } from "../../commands/legal-commands.ts";
import { chooseGrandArchiveCompiledLineCommand, compileGrandArchiveLine } from "./line-compiler.ts";
import { buildGrandArchiveHeuristicSnapshot } from "./snapshot.ts";
import type { GrandArchiveHeuristicSnapshot, GrandArchiveLineRankingInput } from "./types.ts";

export type GrandArchiveLineRankingProvider =
  | GrandArchiveLineRankingInput
  | ((snapshot: GrandArchiveHeuristicSnapshot) => GrandArchiveLineRankingInput);

export function chooseGrandArchiveHeuristicAction(
  snapshot: GrandArchiveHeuristicSnapshot,
  legalCommands: readonly GrandArchiveLegalCommand[],
  ranking: GrandArchiveLineRankingInput = {},
): GrandArchiveLegalCommand | null {
  return chooseGrandArchiveCompiledLineCommand(
    compileGrandArchiveLine(snapshot, legalCommands, ranking),
    legalCommands,
  );
}

export function createGrandArchiveHeuristicStrategy(
  ranking: GrandArchiveLineRankingProvider = {},
): GrandArchiveBotStrategy {
  return ({ program, state, playerId, legalCommands }) => {
    const snapshot = buildGrandArchiveHeuristicSnapshot(program, state, playerId);
    const input = typeof ranking === "function" ? ranking(snapshot) : ranking;
    return chooseGrandArchiveHeuristicAction(snapshot, legalCommands, input);
  };
}

/**
 * Generic unknown-deck policy. It ranks the authoritative legal list and never
 * predicts, synthesizes, or relaxes a rules action.
 */
export const valueExtractGrandArchiveStrategy: GrandArchiveBotStrategy =
  createGrandArchiveHeuristicStrategy();
