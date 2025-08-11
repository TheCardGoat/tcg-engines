import type { LorcanaEffect } from "../../effect-types";
import type { LorcanaTriggerTiming as TriggerTiming } from "../../triggered/triggered-ability";
import { AbilityBuilder } from "../ability-builder";
import { PATTERNS } from "./util";

export function parseTriggeredAbility(text: string) {
  const patterns: Array<{
    pattern: RegExp;
    timing: TriggerTiming;
    conditionType: string;
  }> = [
    {
      pattern: PATTERNS.ON_PLAY,
      timing: "onPlay",
      conditionType: "onEnterPlay",
    },
    { pattern: PATTERNS.ON_QUEST, timing: "onQuest", conditionType: "onQuest" },
    {
      pattern: PATTERNS.ON_BANISH,
      timing: "onBanish",
      conditionType: "onBanish",
    },
    {
      pattern: PATTERNS.ON_CHALLENGE,
      timing: "onChallenge",
      conditionType: "onChallenge",
    },
    {
      pattern: PATTERNS.AT_START,
      timing: "startOfTurn",
      conditionType: "activePlayerOnly",
    },
    {
      pattern: PATTERNS.AT_END,
      timing: "endOfTurn",
      conditionType: "activePlayerOnly",
    },
  ];

  for (const { pattern, timing, conditionType } of patterns) {
    const match = text.match(pattern);
    if (match) {
      const effectText = match[1];
      const { default: parseSimpleEffects } = require("./effects");
      const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
      const isOptional = effectText.includes("may");

      return AbilityBuilder.triggered(text, timing)
        .setCondition({ type: conditionType as any })
        .setEffects(effects)
        .setOptional(isOptional);
    }
  }
  return null;
}
