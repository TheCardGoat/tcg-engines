import { AbilityBuilder } from "../../ability-builder";
import type { LorcanaEffect } from "../../effect-types";
import { PATTERNS } from "../util";

export function parseOnQuest(text: string) {
  const match = text.match(PATTERNS.ON_QUEST);
  if (!match) return null;
  const effectText = match[1];
  const { default: parseSimpleEffects } = require("../effects");
  const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
  const isOptional = effectText.includes("may");

  return AbilityBuilder.triggered(text, "onQuest")
    .setCondition({ type: "onQuest" as any })
    .setEffects(effects)
    .setOptional(isOptional);
}
