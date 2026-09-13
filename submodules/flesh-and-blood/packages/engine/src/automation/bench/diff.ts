import type { FabBenchDiff, FabBenchReport } from "./types.ts";

export function diffFabBenchReports(
  baseline: FabBenchReport,
  candidate: FabBenchReport,
  seat: "p1" | "p2" = "p1",
): FabBenchDiff {
  if (baseline.options.seedBase !== candidate.options.seedBase) {
    throw new Error("Cannot diff reports with different seedBase values.");
  }
  if (baseline.options.matches !== candidate.options.matches) {
    throw new Error("Cannot diff reports with different match counts.");
  }

  let flipped = 0;
  let gained = 0;
  let lost = 0;
  for (let index = 0; index < baseline.matches.length; index++) {
    const before = baseline.matches[index]!;
    const after = candidate.matches[index]!;
    if (before.winner === after.winner) continue;
    flipped += 1;
    if (after.winner === seat) gained += 1;
    if (before.winner === seat) lost += 1;
  }

  const hang = (report: FabBenchReport) =>
    (report.summary.terminations["max-actions"] ?? 0) + (report.summary.terminations.stall ?? 0);
  const illegal = (report: FabBenchReport) =>
    (report.summary.terminations.illegal ?? 0) + (report.summary.terminations["engine-throw"] ?? 0);

  const hangDelta = hang(candidate) - hang(baseline);
  const illegalDelta = illegal(candidate) - illegal(baseline);
  const p1WinRateDelta = candidate.summary.p1WinRate - baseline.summary.p1WinRate;
  const seatDelta = seat === "p1" ? p1WinRateDelta : -p1WinRateDelta;

  let verdict: FabBenchDiff["verdict"] = "inconclusive";
  let reason = "Win-rate change is within noise or mixed with hangs.";
  if (illegalDelta > 0 || hangDelta > 0) {
    verdict = "reject";
    reason = "Candidate increased illegal moves or hangs.";
  } else if (seatDelta > 0 && flipped > 0 && lost === 0) {
    verdict = "keep";
    reason = "Candidate gained matches on the same seeds without new hangs.";
  } else if (seatDelta < 0 && flipped > 0) {
    verdict = "reject";
    reason = "Candidate lost matches on the same seeds.";
  } else if (flipped === 0 && hangDelta === 0 && illegalDelta === 0) {
    verdict = "inconclusive";
    reason = "Same winners; no strategy-driven flip on these seeds.";
  }

  return {
    version: 1,
    for: seat,
    baseline: baseline.options,
    candidate: candidate.options,
    flipped,
    gained,
    lost,
    hangDelta,
    illegalDelta,
    p1WinRateDelta,
    verdict,
    reason,
  };
}
