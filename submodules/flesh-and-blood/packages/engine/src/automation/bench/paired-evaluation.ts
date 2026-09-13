import type { FabBotPolicy } from "../bot-strategies.ts";
import { playFabMatch, type PlayFabMatchInput } from "./play-match.ts";
import type { FabMatchTranscript } from "./types.ts";

export interface FabEvaluationPolicy {
  readonly id: string;
  readonly choose: FabBotPolicy;
}

export interface FabPairedEvaluationMatch {
  readonly seed: string;
  readonly decks: readonly [string, string];
  readonly candidateSeat: "p1" | "p2";
  readonly winner: "candidate" | "baseline" | null;
  readonly termination: FabMatchTranscript["termination"];
  readonly turns: number;
  readonly actions: number;
  readonly error?: string;
}

export interface FabPairedEvaluationInput {
  readonly cardLibrary: PlayFabMatchInput["cardLibrary"];
  readonly candidate: FabEvaluationPolicy;
  readonly baseline: FabEvaluationPolicy;
  readonly matchups: readonly (readonly [string, string])[];
  readonly seeds: readonly string[];
  readonly maxActions?: number;
  readonly recordFrames?: boolean;
  readonly onMatch?: (result: FabPairedEvaluationMatch, transcript: FabMatchTranscript) => void;
}

/**
 * Each deck/seed deal is played twice with the policies exchanged. Decks,
 * shuffles and the starting seat stay fixed, so each policy plays both sides
 * of the same matchup. Keep development seeds separate from evaluation seeds.
 * Both policies use the current engine; a frozen baseline must supply its
 * complete chooser, including candidate generation, through this boundary.
 */
export function runPairedFabEvaluation(input: FabPairedEvaluationInput) {
  if (input.candidate.id === input.baseline.id)
    throw new Error("Evaluation policy IDs must differ.");
  if (input.seeds.length === 0 || input.matchups.length === 0)
    throw new Error("Evaluation requires seeds and matchups.");
  const matches: FabPairedEvaluationMatch[] = [];
  for (const decks of input.matchups) {
    for (const seed of input.seeds) {
      for (const candidateSeat of ["p1", "p2"] as const) {
        const transcript = playFabMatch({
          cardLibrary: input.cardLibrary,
          seed,
          p1Strategy: "hero-profile",
          p2Strategy: "hero-profile",
          p1Policy: candidateSeat === "p1" ? input.candidate : input.baseline,
          p2Policy: candidateSeat === "p2" ? input.candidate : input.baseline,
          p1Deck: decks[0],
          p2Deck: decks[1],
          firstPlayer: "p1",
          maxActions: input.maxActions ?? 700,
          recordFrames: input.recordFrames ?? false,
          considerHeads: 6,
          snapshotValidation: true,
        });
        const completed = transcript.termination === "life" || transcript.termination === "concede";
        const candidateId = candidateSeat === "p1" ? transcript.player1Id : transcript.player2Id;
        const match: FabPairedEvaluationMatch = {
          seed,
          decks,
          candidateSeat,
          winner:
            completed && transcript.winnerId
              ? transcript.winnerId === candidateId
                ? "candidate"
                : "baseline"
              : null,
          termination: transcript.termination,
          turns: transcript.turnCount,
          actions: transcript.actionCount,
          ...(transcript.error ? { error: transcript.error } : {}),
        };
        matches.push(match);
        input.onMatch?.(match, transcript);
      }
    }
  }
  const wins = matches.filter((match) => match.winner === "candidate").length;
  const losses = matches.filter((match) => match.winner === "baseline").length;
  return {
    candidate: input.candidate.id,
    baseline: input.baseline.id,
    wins,
    losses,
    // Caps, stalls, and engine failures are not draws or wins.
    unfinished: matches.length - wins - losses,
    matches,
  };
}
