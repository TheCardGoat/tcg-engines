import type {
  BotConfidenceIntervalV1,
  BotEvaluationSpecV1,
  BotPromotionVerdict,
  BotTerminationReason,
} from "./types.js";
import { BOT_HARD_FAILURE_REASONS } from "./types.js";

export function createSeededBotRandom(seed: string): () => number {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function quantile(sorted: readonly number[], probability: number): number {
  if (sorted.length === 0) return 0;
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower] ?? 0;
  const weight = position - lower;
  return (sorted[lower] ?? 0) * (1 - weight) + (sorted[upper] ?? 0) * weight;
}

export function mean(values: readonly number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function pairedBootstrapConfidenceInterval(input: {
  readonly blockDeltas: readonly number[];
  readonly confidenceLevel?: number;
  readonly samples?: number;
  readonly seed?: string;
}): BotConfidenceIntervalV1 {
  const level = input.confidenceLevel ?? 0.95;
  const samples = input.samples ?? 4_000;
  if (input.blockDeltas.length === 0) return { level, lower: 0, upper: 0 };
  const rng = createSeededBotRandom(input.seed ?? "bot-core-bootstrap");
  const bootstrapped: number[] = [];
  for (let sample = 0; sample < samples; sample++) {
    let total = 0;
    for (let index = 0; index < input.blockDeltas.length; index++) {
      total += input.blockDeltas[Math.floor(rng() * input.blockDeltas.length)] ?? 0;
    }
    bootstrapped.push(total / input.blockDeltas.length);
  }
  bootstrapped.sort((left, right) => left - right);
  const tail = (1 - level) / 2;
  return {
    level,
    lower: quantile(bootstrapped, tail),
    upper: quantile(bootstrapped, 1 - tail),
  };
}

export function isHardBotFailure(reason: BotTerminationReason): boolean {
  return (BOT_HARD_FAILURE_REASONS as readonly string[]).includes(reason);
}

export interface PromotionGateInput {
  readonly spec: BotEvaluationSpecV1;
  readonly blocks: number;
  readonly meanPairedImprovement: number;
  readonly confidenceInterval: BotConfidenceIntervalV1;
  readonly hardFailureCount: number;
  readonly cellRegressions: Readonly<Record<string, number>>;
}

export function classifyPromotion(input: PromotionGateInput): {
  verdict: BotPromotionVerdict;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (input.hardFailureCount > 0) {
    reasons.push(`${input.hardFailureCount} hard automation failure(s)`);
  }
  for (const [cell, regression] of Object.entries(input.cellRegressions)) {
    if (regression <= -input.spec.maximumCellRegression) {
      reasons.push(
        `${cell} regressed by ${Math.abs(regression * 100).toFixed(1)} percentage points`,
      );
    }
  }
  if (reasons.length > 0) return { verdict: "reject", reasons };

  if (input.blocks < input.spec.minimumBlocks) {
    return { verdict: "inconclusive", reasons: ["minimum paired block count not reached"] };
  }
  if (input.confidenceInterval.upper < input.spec.minimumMeanImprovement) {
    return { verdict: "reject", reasons: ["confidence interval cannot reach the practical gain"] };
  }
  if (
    input.meanPairedImprovement >= input.spec.minimumMeanImprovement &&
    input.confidenceInterval.lower > 0
  ) {
    return { verdict: "promote", reasons: ["practical and statistical promotion gates passed"] };
  }
  if (input.blocks >= input.spec.maximumBlocks) {
    return { verdict: "reject", reasons: ["maximum paired block count reached without proof"] };
  }
  return { verdict: "inconclusive", reasons: ["additional paired blocks required"] };
}
