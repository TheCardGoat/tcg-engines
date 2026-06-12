import type { BenchReport } from "./run.ts";

export type FailOn = "non-game-won" | "max-actions" | "concede-failed" | "error-code";

export interface RegressionFinding {
  readonly kind: FailOn;
  readonly message: string;
}

export interface RegressionResult {
  readonly passed: boolean;
  readonly findings: readonly RegressionFinding[];
}

export function parseFailOn(raw: string | undefined): readonly FailOn[] {
  if (!raw) return [];
  const values = raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
  const allowed: readonly FailOn[] = [
    "non-game-won",
    "max-actions",
    "concede-failed",
    "error-code",
  ];
  for (const value of values) {
    if (!allowed.includes(value as FailOn)) {
      throw new Error(
        `Unknown --fail-on value "${value}". Use one or more of: ${allowed.join(", ")}.`,
      );
    }
  }
  return values as readonly FailOn[];
}

export function classifyRegressions(
  report: BenchReport,
  failOn: readonly FailOn[],
): RegressionResult {
  const enabled = new Set(failOn);
  const findings: RegressionFinding[] = [];

  const maxActions = report.summary.terminationDistribution["max-actions-exceeded"] ?? 0;
  if (enabled.has("max-actions") && maxActions > 0) {
    findings.push({
      kind: "max-actions",
      message: `${maxActions} match(es) exceeded maxActions`,
    });
  }

  const concedeFailed = report.summary.terminationDistribution["concede-failed"] ?? 0;
  if (enabled.has("concede-failed") && concedeFailed > 0) {
    findings.push({
      kind: "concede-failed",
      message: `${concedeFailed} match(es) ended with concede-failed`,
    });
  }

  const nonGameWon = report.matches.filter((m) => m.termination !== "game-won").length;
  if (enabled.has("non-game-won") && nonGameWon > 0) {
    findings.push({
      kind: "non-game-won",
      message: `${nonGameWon} match(es) did not terminate with game-won`,
    });
  }

  const errorCodes = collectErrorCodes(report);
  if (enabled.has("error-code") && errorCodes.length > 0) {
    findings.push({
      kind: "error-code",
      message: `planner reported error code(s): ${errorCodes.join(", ")}`,
    });
  }

  return { passed: findings.length === 0, findings };
}

function collectErrorCodes(report: BenchReport): string[] {
  const codes = new Set<string>();
  for (const player of [report.p1, report.p2]) {
    for (const stats of Object.values(player.familyStats)) {
      for (const [code, count] of Object.entries(stats.errorCodes)) {
        if (count > 0) codes.add(code);
      }
    }
  }
  return [...codes].sort();
}
