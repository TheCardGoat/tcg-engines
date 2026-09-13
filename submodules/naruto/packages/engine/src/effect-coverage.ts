/**
 * Explicit accounting for every snapshot card with printed rules text or a
 * Support effect. This is an audit surface, not a rules oracle: an
 * `implemented` entry means the Preview engine has a named implementation
 * path against the unverified snapshot, never source-complete revealed
 * coverage. `partial` calls out behavior that still needs rulebook review.
 */

import { CARDS } from "@tcg-engines/naruto-cards";

export type EffectCoverageStatus = "implemented" | "partial" | "unsupported";

export interface EffectCoverageEntry {
  readonly cardId: string;
  readonly status: EffectCoverageStatus;
  /** Stable implementation owner(s), used during card and engine review. */
  readonly implementation: readonly string[];
  /** Why a partial or unsupported behavior remains unsafe to present as final. */
  readonly note?: string;
}

export const EFFECT_COVERAGE: readonly EffectCoverageEntry[] = [
  {
    cardId: "N-001",
    status: "implemented",
    implementation: ["LEADER_EFFECTS.N-001", "resolveChoice.leaderBoost"],
  },
  { cardId: "N-004", status: "implemented", implementation: ["runSupportEffect.koAll"] },
  {
    cardId: "N-005",
    status: "implemented",
    implementation: ["EX_REQUIREMENTS_BY_CARD_ID.N-005", "CHARACTER_EFFECTS.N-005"],
  },
  { cardId: "N-006", status: "implemented", implementation: ["runSupportEffect.koChosen"] },
  {
    cardId: "N-007",
    status: "implemented",
    implementation: ["CONDITIONAL_RUSH_POWER_BY_CARD_ID.N-007"],
  },
  {
    cardId: "N-008",
    status: "implemented",
    implementation: ["runSupportEffect.interrupt", "summonCardAsCharacter"],
  },
  {
    cardId: "N-010",
    status: "implemented",
    implementation: ["runSupportEffect.lifeGain", "summonCardAsCharacter"],
  },
  { cardId: "N-011", status: "implemented", implementation: ["CHARACTER_EFFECTS.N-011"] },
  { cardId: "N-012", status: "implemented", implementation: ["LEADER_EFFECTS.N-012", "drawCards"] },
  {
    cardId: "N-013",
    status: "implemented",
    implementation: ["CHARACTER_EFFECTS.N-013", "resolveChoice.freezeTarget"],
  },
  {
    cardId: "N-014",
    status: "implemented",
    implementation: [
      "EX_REQUIREMENTS_BY_CARD_ID.N-014",
      "NATIVE_RUSH_CARD_IDS.N-014",
      "CHARACTER_EFFECTS.N-014",
    ],
  },
  { cardId: "N-015", status: "implemented", implementation: ["runSupportEffect.koAll"] },
  {
    cardId: "N-016",
    status: "implemented",
    implementation: ["runSupportEffect.negate", "runSupportEffect.chakraLock"],
  },
  { cardId: "N-019", status: "implemented", implementation: ["CHARACTER_EFFECTS.N-019"] },
  {
    cardId: "N-021",
    status: "implemented",
    implementation: ["runSupportEffect.supportImmunity", "summonCardAsCharacter"],
  },
  {
    cardId: "N-022",
    status: "implemented",
    implementation: ["EX_REQUIREMENTS_BY_CARD_ID.N-022", "CHARACTER_EFFECTS.N-022"],
  },
  {
    cardId: "K-039",
    status: "implemented",
    implementation: ["runSupportEffect.negate", "runSupportEffect.lifeCost"],
  },
  {
    cardId: "N-naruto-ex",
    status: "partial",
    implementation: [
      "EX_REQUIREMENTS_BY_CARD_ID.N-naruto-ex",
      "NATIVE_RUSH_CARD_IDS.N-naruto-ex",
      "CHARACTER_EFFECTS.N-naruto-ex",
      "resolveChoice.searchSummon",
    ],
    note: "The current source does not establish whether its search wording can select an EX Character; retain Preview-only labeling until the official rulebook resolves the term.",
  },
  {
    cardId: "N-choji",
    status: "implemented",
    implementation: ["runSupportEffect.powerDoubled", "summonCardAsCharacter"],
  },
  { cardId: "N-hinata", status: "implemented", implementation: ["runSupportEffect.koChosen"] },
  { cardId: "N-orochimaru", status: "implemented", implementation: ["runSupportEffect.koChosen"] },
  { cardId: "N-sakura", status: "implemented", implementation: ["runSupportEffect.bounce"] },
  { cardId: "C-001", status: "implemented", implementation: ["payChakra", "ChakraInstance"] },
  { cardId: "CP-001", status: "implemented", implementation: ["payChakra", "ChakraInstance"] },
  { cardId: "S-001", status: "implemented", implementation: ["SUMMON", "PlayerState.summon"] },
] as const;

/** Card ids that have printed behavior rather than a blank vanilla rules box. */
export function nonVanillaCardIds(): readonly string[] {
  return CARDS.filter((card) => card.skills.length > 0 || card.support !== null).map(
    (card) => card.id,
  );
}

/** Machine-reviewable gaps: non-vanilla cards missing an explicit coverage row. */
export function unaccountedEffectCardIds(): readonly string[] {
  const covered = new Set(EFFECT_COVERAGE.map((entry) => entry.cardId));
  return nonVanillaCardIds().filter((cardId) => !covered.has(cardId));
}

/** Entries intentionally not represented as completed Preview behavior. */
export function incompleteEffectCoverage(): readonly EffectCoverageEntry[] {
  return EFFECT_COVERAGE.filter((entry) => entry.status !== "implemented");
}
