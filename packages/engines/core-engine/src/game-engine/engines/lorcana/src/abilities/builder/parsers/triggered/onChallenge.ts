import type { LorcanaEffect } from "../../../effect-types";
import { AbilityBuilder } from "../../ability-builder";
import { PATTERNS } from "../util";

export function parseOnChallenge(text: string) {
  const match = text.match(PATTERNS.ON_CHALLENGE);
  if (!match) return null;
  const effectText = match[1];
  const { default: parseSimpleEffects } = require("../effects");
  const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
  const isOptional = effectText.includes("may");

  return AbilityBuilder.triggered(text, "onChallenge")
    .setCondition({ type: "onChallenge" as any })
    .setEffects(effects)
    .setOptional(isOptional);
}
