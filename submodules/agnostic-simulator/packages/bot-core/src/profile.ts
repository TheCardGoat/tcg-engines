import type { BotCardHeuristicProfileV1 } from "./types.js";

export const BOT_CARD_AXIS_MIN = -100;
export const BOT_CARD_AXIS_MAX = 100;

export function validateCardHeuristicProfile(
  profile: BotCardHeuristicProfileV1,
): readonly string[] {
  const errors: string[] = [];
  if (!profile.cardId.trim()) errors.push("cardId is required");
  if (!profile.profileVersion.trim()) errors.push("profileVersion is required");
  for (const [axis, value] of Object.entries(profile.axes)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      errors.push(`${axis} must be a finite number`);
    } else if (value < BOT_CARD_AXIS_MIN || value > BOT_CARD_AXIS_MAX) {
      errors.push(`${axis} must be between ${BOT_CARD_AXIS_MIN} and ${BOT_CARD_AXIS_MAX}`);
    }
  }
  for (const matchup of profile.matchups ?? []) {
    for (const [axis, value] of Object.entries(matchup.adjustments)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        errors.push(`matchup ${axis} must be a finite number`);
      } else if (value < BOT_CARD_AXIS_MIN || value > BOT_CARD_AXIS_MAX) {
        errors.push(
          `matchup ${axis} must be between ${BOT_CARD_AXIS_MIN} and ${BOT_CARD_AXIS_MAX}`,
        );
      }
    }
  }
  return errors;
}

export function resolveCardAxisScore(input: {
  readonly profile: BotCardHeuristicProfileV1;
  readonly axis: string;
  readonly opponentTags?: readonly string[];
}): number {
  let score = input.profile.axes[input.axis] ?? 0;
  const opponentTags = new Set(input.opponentTags ?? []);
  for (const matchup of input.profile.matchups ?? []) {
    if (matchup.opponentTags.every((tag) => opponentTags.has(tag))) {
      score += matchup.adjustments[input.axis] ?? 0;
    }
  }
  return Math.max(BOT_CARD_AXIS_MIN, Math.min(BOT_CARD_AXIS_MAX, score));
}
