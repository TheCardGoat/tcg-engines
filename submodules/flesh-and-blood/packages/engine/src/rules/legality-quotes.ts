export type {
  FabAttackTargetCandidate,
  FabAttackTargetQuote,
  FabAttackTargetRequest,
  FabDefenseDenialReason,
  FabDefenseOrigin,
  FabDefenseQuote,
  FabDefenseRequest,
  FabPlayDenialReason,
  FabPlayOrigin,
  FabPlayQuote,
  FabPlayRequest,
  FabPlayTiming,
} from "./legality/types.ts";
export { quoteFabAttackTargets } from "./legality/attack-targets.ts";
export { quoteFabDefense } from "./legality/defense.ts";
export { quoteFabPlay } from "./legality/play.ts";
