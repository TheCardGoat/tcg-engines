import type { LorcanaAbilityCost } from "../../ability-types";
import { AbilityBuilder } from "../ability-builder";
import { PATTERNS } from "./util";

export function parseActivatedAbility(text: string) {
  const exertMatch = text.match(PATTERNS.EXERT_ABILITY);
  if (exertMatch) {
    const [, inkCost, effectText] = exertMatch;
    const cost: LorcanaAbilityCost = { exert: true };
    if (inkCost) cost.ink = Number.parseInt(inkCost, 10);

    const { default: parseSimpleEffects } = require("./effects");
    const effects = parseSimpleEffects(effectText);
    return AbilityBuilder.activated(text, cost).setEffects(effects);
  }

  const inkMatch = text.match(PATTERNS.INK_ABILITY);
  if (inkMatch) {
    const [, inkCost, , effectText] = inkMatch;
    const cost: LorcanaAbilityCost = { ink: Number.parseInt(inkCost, 10) };
    const { default: parseSimpleEffects } = require("./effects");
    const effects = parseSimpleEffects(effectText);
    return AbilityBuilder.activated(text, cost).setEffects(effects);
  }

  return null;
}
