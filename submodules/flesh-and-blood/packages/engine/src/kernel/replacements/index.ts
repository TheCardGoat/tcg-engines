export { isAdmissibleCanonicalAmount } from "./amounts.ts";
export {
  supportedCanonicalReplacement,
  isPowerGainAmountReplacement,
  isOptionalDestroySelfRerollReplacement,
  isRollPlusOneIgnoreLowestReplacement,
  isClassShield,
  isAdmissiblePreventionAdditionalCreateToken,
} from "./admission.ts";
export {
  persistedReplacementApplicationPolicy,
  persistedReplacementCostTargetIds,
  persistedReplacementConsequenceTargetIds,
  replacementRequiresCommittedCostReceipt,
  replacementCostCommitKey,
  proposePersistedReplacementCostCommit,
  proposePersistedReclashMoveCommit,
} from "./persist.ts";
export {
  collectApplicableReplacementCandidates,
  collectPotentialReplacementCandidates,
  expiredReplacementEffectIds,
  affectedPlayerForReplacement,
  staticOptionalDestroyRerollCount,
  staticRollPlusOneIgnoreLowestExtraDice,
} from "./collect.ts";
export { type FabReplacementDestinationAllocator, kernelReplacementFor } from "./apply.ts";
