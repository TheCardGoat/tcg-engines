import type { LorcanaEffect } from "../../../effect-types";
import { AbilityBuilder } from "../../ability-builder";
import { PATTERNS } from "../util";

export function parseStartOfTurn(text: string) {
  const match = text.match(PATTERNS.AT_START);
  if (!match) return null;
  const effectText = match[1];
  const { default: parseSimpleEffects } = require("../effects");
  const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
  const isOptional = effectText.includes("may");
  return AbilityBuilder.triggered(text, "startOfTurn")
    .setCondition({ type: "activePlayerOnly" as any })
    .setEffects(effects)
    .setOptional(isOptional);
}

export function parseEndOfTurn(text: string) {
  const match = text.match(PATTERNS.AT_END);
  if (!match) return null;
  const effectText = match[1];
  const { default: parseSimpleEffects } = require("../effects");
  const effects: LorcanaEffect[] = parseSimpleEffects(effectText);
  const isOptional = effectText.includes("may");
  return AbilityBuilder.triggered(text, "endOfTurn")
    .setCondition({ type: "activePlayerOnly" as any })
    .setEffects(effects)
    .setOptional(isOptional);
}
