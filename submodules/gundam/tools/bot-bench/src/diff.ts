/**
 * Compute a structured diff between a baseline and candidate bench report.
 *
 * Shape is deliberately optimised for Claude to read: deltas are signed
 * fractions (not stringified labels), and an `improvedFor` field names the
 * player whose perspective the diff is taken from. The skill convention is
 * "p1 = candidate, p2 = baseline opponent", so a positive `winRateDelta`
 * means the candidate strategy improved.
 */

import type { BenchReport, FamilyStats, PlayerStats, BenchSummary, MatchReport } from "./run.ts";
import type { GundamBotCandidateFamily, PlayMatchTermination } from "@tcg/gundam-engine";

export interface FamilyDelta {
  readonly attemptedDelta: number;
  readonly successRateBaseline: number;
  readonly successRateCandidate: number;
  readonly successRateDelta: number;
  readonly newErrorCodes: readonly string[];
}

export interface BenchDiff {
  readonly baseline: { readonly options: BenchReport["options"]; readonly summary: BenchSummary };
  readonly candidate: { readonly options: BenchReport["options"]; readonly summary: BenchSummary };
  readonly improvedFor: "p1" | "p2";
  readonly winRateDelta: number;
  readonly avgTurnsDelta: number;
  readonly avgActionsDelta: number;
  readonly drawRateDelta: number;
  readonly terminationDelta: Readonly<Record<PlayMatchTermination, number>>;
  readonly families: Readonly<Record<GundamBotCandidateFamily, FamilyDelta>>;
  /** Matches where the winner flipped vs baseline (same seed → different outcome). */
  readonly regressions: readonly {
    readonly seed: string;
    readonly from: string;
    readonly to: string;
  }[];
  readonly improvements: readonly {
    readonly seed: string;
    readonly from: string;
    readonly to: string;
  }[];
  /** Brief, human-readable verdict line. Useful for log output. */
  readonly verdict: string;
}

function familyDelta(baseline: FamilyStats, candidate: FamilyStats): FamilyDelta {
  const baselineRate = baseline.attempted === 0 ? 0 : baseline.succeeded / baseline.attempted;
  const candidateRate = candidate.attempted === 0 ? 0 : candidate.succeeded / candidate.attempted;
  const newCodes = Object.keys(candidate.errorCodes).filter((c) => !(c in baseline.errorCodes));
  return {
    attemptedDelta: candidate.attempted - baseline.attempted,
    successRateBaseline: baselineRate,
    successRateCandidate: candidateRate,
    successRateDelta: candidateRate - baselineRate,
    newErrorCodes: newCodes,
  };
}

function describeMatch(m: MatchReport): string {
  return `${m.winner ?? "draw"} (${m.winReason ?? "no-reason"})`;
}

export function diffReports(
  baseline: BenchReport,
  candidate: BenchReport,
  improvedFor: "p1" | "p2" = "p1",
): BenchDiff {
  const baselinePlayer: PlayerStats = improvedFor === "p1" ? baseline.p1 : baseline.p2;
  const candidatePlayer: PlayerStats = improvedFor === "p1" ? candidate.p1 : candidate.p2;

  const baselineWinRate =
    improvedFor === "p1" ? baseline.summary.p1WinRate : baseline.summary.p2WinRate;
  const candidateWinRate =
    improvedFor === "p1" ? candidate.summary.p1WinRate : candidate.summary.p2WinRate;

  const families = {} as Record<GundamBotCandidateFamily, FamilyDelta>;
  for (const family of Object.keys(baselinePlayer.familyStats) as GundamBotCandidateFamily[]) {
    families[family] = familyDelta(
      baselinePlayer.familyStats[family],
      candidatePlayer.familyStats[family],
    );
  }

  const terminationDelta = {} as Record<PlayMatchTermination, number>;
  for (const t of Object.keys(baseline.summary.terminationDistribution) as PlayMatchTermination[]) {
    terminationDelta[t] =
      (candidate.summary.terminationDistribution[t] ?? 0) -
      (baseline.summary.terminationDistribution[t] ?? 0);
  }

  // Per-seed delta — same seed means same shuffle, so a flipped winner is a
  // genuine strategy-driven change.
  const baselineBySeed = new Map(baseline.matches.map((m) => [m.seed, m]));
  const regressions: { seed: string; from: string; to: string }[] = [];
  const improvements: { seed: string; from: string; to: string }[] = [];
  for (const cand of candidate.matches) {
    const base = baselineBySeed.get(cand.seed);
    if (!base) continue;
    if (base.winner === cand.winner) continue;
    const from = describeMatch(base);
    const to = describeMatch(cand);
    const candWon = cand.winner === improvedFor;
    const baseWon = base.winner === improvedFor;
    if (candWon && !baseWon) improvements.push({ seed: cand.seed, from, to });
    else if (!candWon && baseWon) regressions.push({ seed: cand.seed, from, to });
  }

  const winRateDelta = candidateWinRate - baselineWinRate;
  const verdict = formatVerdict(winRateDelta, improvements.length, regressions.length);

  return {
    baseline: { options: baseline.options, summary: baseline.summary },
    candidate: { options: candidate.options, summary: candidate.summary },
    improvedFor,
    winRateDelta,
    avgTurnsDelta: candidate.summary.avgTurns - baseline.summary.avgTurns,
    avgActionsDelta: candidate.summary.avgActions - baseline.summary.avgActions,
    drawRateDelta: candidate.summary.drawRate - baseline.summary.drawRate,
    terminationDelta,
    families,
    regressions,
    improvements,
    verdict,
  };
}

function formatVerdict(winRateDelta: number, gained: number, lost: number): string {
  const pct = (winRateDelta * 100).toFixed(1);
  const dir = winRateDelta > 0 ? "+" : "";
  return `win-rate ${dir}${pct}pp, gained ${gained} flipped match${gained === 1 ? "" : "es"}, lost ${lost}`;
}
