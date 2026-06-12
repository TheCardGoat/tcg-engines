/**
 * Bot-bench public API — re-exports for scripts and any external consumer.
 */

export { buildBenchRuntime, REGISTERED_DECKS, type BenchDeckId } from "./runtime.ts";
export { REGISTERED_STRATEGIES, type BenchStrategyId, listStrategies } from "./strategies.ts";
export {
  runBench,
  loadReport,
  saveReport,
  type BenchOptions,
  type BenchReport,
  type MatchReport,
  type BenchSummary,
  type FamilyStats,
} from "./run.ts";
export { diffReports, type BenchDiff } from "./diff.ts";
export {
  buildReplay,
  loadReplay,
  saveReplay,
  verifyReplay,
  type BenchReplay,
  type ReplayVerification,
} from "./replay.ts";
export {
  classifyRegressions,
  parseFailOn,
  type FailOn,
  type RegressionFinding,
  type RegressionResult,
} from "./regression.ts";
