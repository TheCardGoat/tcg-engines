import type { FabAmount } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import { FabRulesEvaluationError } from "../errors.ts";
import { heroObjectsForAmountPlayer, type MutableObject } from "../helpers.ts";

export function evaluateHeroProperty(
  amount: Exclude<FabAmount, number> & { type: "hero-property" },
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): number {
  const heroes = heroObjectsForAmountPlayer(amount.player, context, objects);
  if (heroes.length !== 1) {
    throw new FabRulesEvaluationError("hero-property requires exactly one hero");
  }
  const hero = heroes[0]!;
  if (amount.property === "life") {
    const heroController = hero.controllerId ?? context.controllerId;
    const playerLife = context.facts?.playerLife?.[heroController];
    if (playerLife !== undefined) return playerLife;
  }
  const value = hero.properties.numeric[amount.property];
  if (value === undefined) throw new FabRulesEvaluationError(`hero missing ${amount.property}`);
  return value;
}
