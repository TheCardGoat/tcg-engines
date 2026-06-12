export { firstLegalStrategy } from "./first-legal.ts";
export { randomStrategy } from "./random.ts";
export { passOnlyStrategy, attackUnitOnlyStrategy, callLegendOnlyStrategy } from "./forced.ts";
export {
  defaultStrategy,
  greedyStrategy,
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  type GreedyWeights,
} from "./greedy.ts";
export { decisionFromMove } from "./move-args.ts";
export type { ArgPicker } from "./move-args.ts";
