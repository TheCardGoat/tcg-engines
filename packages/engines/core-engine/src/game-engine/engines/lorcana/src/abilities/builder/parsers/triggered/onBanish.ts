import { AbilityBuilder } from "../../ability-builder";
import type { LorcanaEffect } from "../../effect-types";
import { PATTERNS } from "../util";

export function parseOnBanish(text: string) {
  const match = text.match(PATTERNS.ON_BANISH);
  if (!match) return null;
  const effectText = match[1];
  const { default: parseSimpleEffects } = require("../effects");
  const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
  const isOptional = effectText.includes("may");

  return AbilityBuilder.triggered(text, "onBanish")
    .setCondition({ type: "onBanish" as any })
    .setEffects(effects)
    .setOptional(isOptional);
}
