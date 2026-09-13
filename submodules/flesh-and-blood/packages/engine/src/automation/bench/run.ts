import { playFabMatch } from "./play-match.ts";
import type {
  FabBenchOptions,
  FabBenchReport,
  FabMatchReport,
  FabMatchTranscript,
} from "./types.ts";

export function runFabBench(options: FabBenchOptions): FabBenchReport {
  return summarizeFabBench(options, collectTranscripts(options));
}

export function runFabBenchWithTranscripts(options: FabBenchOptions): {
  readonly report: FabBenchReport;
  readonly transcripts: readonly FabMatchTranscript[];
} {
  const transcripts = collectTranscripts(options);
  return { report: summarizeFabBench(options, transcripts), transcripts };
}

function collectTranscripts(options: FabBenchOptions): readonly FabMatchTranscript[] {
  return Array.from({ length: options.matches }, (_, matchId) =>
    playFabMatch({
      cardLibrary: options.cardLibrary,
      seed: `${options.seedBase}-${matchId}`,
      p1Strategy: options.p1Strategy,
      p2Strategy: options.p2Strategy,
      p1Deck: options.p1Deck,
      p2Deck: options.p2Deck,
      maxActions: options.maxActions,
    }),
  );
}

function summarizeFabBench(
  options: FabBenchOptions,
  transcripts: readonly FabMatchTranscript[],
): FabBenchReport {
  const { cardLibrary: _cardLibrary, ...reportOptions } = options;
  const matches: FabMatchReport[] = [];
  const terminations: Record<string, number> = {};
  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;
  let turnSum = 0;
  let actionSum = 0;

  for (const [matchId, played] of transcripts.entries()) {
    const winner =
      played.winnerId === played.player1Id
        ? "p1"
        : played.winnerId === played.player2Id
          ? "p2"
          : null;
    if (winner === "p1") p1Wins += 1;
    else if (winner === "p2") p2Wins += 1;
    else draws += 1;
    turnSum += played.turnCount;
    actionSum += played.actionCount;
    terminations[played.termination] = (terminations[played.termination] ?? 0) + 1;
    matches.push({
      matchId,
      seed: played.seed,
      termination: played.termination,
      winner,
      winReason: played.winReason,
      turnCount: played.turnCount,
      actionCount: played.actionCount,
    });
  }

  return {
    version: 1,
    options: reportOptions,
    summary: {
      matches: options.matches,
      p1Wins,
      p2Wins,
      draws,
      p1WinRate: options.matches === 0 ? 0 : p1Wins / options.matches,
      avgTurns: options.matches === 0 ? 0 : turnSum / options.matches,
      avgActions: options.matches === 0 ? 0 : actionSum / options.matches,
      terminations,
    },
    matches,
    createdAt: new Date().toISOString(),
  };
}
