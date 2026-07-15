import { BOT_CORE_SCHEMA_VERSION, type BotCardHeuristicProfileV1 } from "@tcg/bot-core";

import { BEST_AI_CARD_PROFILES } from "./cards";
import type { CardStrategyProfile } from "./types";
import type { StrategyAxis, AutomatedActionStrategyTag } from "../types";

function matchupTags(profile: CardStrategyProfile["rules"][number]): string[] {
  const { when } = profile;
  return [
    ...(when.opponentArchetypes ?? []).map((value) => `archetype:${value}`),
    ...(when.opponentColorPairs ?? []).map((value) => `color-pair:${value}`),
    ...(when.opponentDeckSignatures ?? []).map((value) => `deck:${value}`),
    ...(when.requiresAnyRoles ?? []).map((value) => `role:${value}`),
  ];
}

export function toSharedLorcanaCardProfile(
  profile: CardStrategyProfile,
): BotCardHeuristicProfileV1<StrategyAxis, AutomatedActionStrategyTag> {
  return {
    schemaVersion: BOT_CORE_SCHEMA_VERSION,
    cardId: profile.definitionId,
    profileVersion: "lorcana-best-ai-v1",
    source: "manual",
    axes: profile.baseAdjust ?? {},
    tags: profile.strategyTags,
    matchups: profile.rules.map((rule) => ({
      opponentTags: matchupTags(rule),
      adjustments: rule.adjust,
      rationale: rule.reason,
    })),
    rationale: [
      ...(profile.baseReason ? [profile.baseReason] : []),
      ...profile.rules.map((rule) => rule.reason),
    ],
  };
}

export const BEST_AI_SHARED_CARD_PROFILES = BEST_AI_CARD_PROFILES.map(toSharedLorcanaCardProfile);
