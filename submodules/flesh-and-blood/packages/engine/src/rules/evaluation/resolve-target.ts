import type { FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../rules-view.ts";
import { assertNever } from "./assert-never.ts";
import { FabRulesEvaluationError } from "./errors.ts";
import type { MutableObject } from "./mutable.ts";
import { resolveSelf } from "./targets/self.ts";
import { resolveBinding } from "./targets/binding.ts";
import { resolveObjectSelector } from "./targets/object.ts";
import { resolveThisAttack } from "./targets/this-attack.ts";
import { resolveAttackFromSource } from "./targets/attack-from-source.ts";
import { resolveAttackingHero } from "./targets/attacking-hero.ts";
import { resolveDefendingHero } from "./targets/defending-hero.ts";
import { resolveAttackTarget } from "./targets/attack-target.ts";
import { resolveController } from "./targets/controller.ts";
import { resolveOpponent } from "./targets/opponent.ts";
import { resolveAnyHero } from "./targets/any-hero.ts";
import { resolveEachHero } from "./targets/each-hero.ts";
import { resolveEachOtherHero } from "./targets/each-other-hero.ts";
import { resolveWinner } from "./targets/winner.ts";
import { resolveHost } from "./targets/host.ts";
import { resolveSubCards } from "./targets/sub-cards.ts";
import { resolveLifeExtremaHero } from "./targets/life-extrema-hero.ts";
import { heroObjectsForPlayer, playerIdsForWho } from "./helpers.ts";

export function resolveTarget(
  target: FabTarget,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  switch (target.selector) {
    case "self":
      return resolveSelf(context, objects);
    case "binding":
      return resolveBinding(target, context, objects);
    case "object":
      return resolveObjectSelector(target, context, objects);
    case "this-attack":
      return resolveThisAttack(context, objects);
    case "attack-from-source":
      return resolveAttackFromSource(context, objects);
    case "attacking-hero":
      return resolveAttackingHero(context, objects);
    case "defending-hero":
      return resolveDefendingHero(context, objects);
    case "attack-target":
      return resolveAttackTarget(context, objects);
    case "hero":
      return playerIdsForWho(target.who, context).flatMap((playerId) =>
        heroObjectsForPlayer(playerId, context, objects),
      );
    case "controller":
      return resolveController(context, objects);
    case "opponent":
      return resolveOpponent(context, objects);
    case "any-hero":
      return resolveAnyHero(context, objects);
    case "each-hero":
      return resolveEachHero(context, objects);
    case "each-other-hero":
      return resolveEachOtherHero(context, objects);
    case "highest-life-hero":
      return resolveLifeExtremaHero("highest", context, objects);
    case "lowest-life-hero":
      return resolveLifeExtremaHero("lowest", context, objects);
    case "iteration-subject": {
      const subject = context.bindings?.strings?.["iteration-subject"];
      if (typeof subject !== "string") return [];
      return heroObjectsForPlayer(subject, context, objects);
    }
    case "winner":
      return resolveWinner();
    case "host":
      return resolveHost(context, objects);
    case "sub-cards":
      return resolveSubCards();
    default:
      return assertNever(target, "FabTarget.selector");
  }
}

export function requireSingleTarget(
  target: FabTarget,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
  mechanic: string,
): MutableObject {
  const candidates = resolveTarget(target, context, objects);
  if (candidates.length !== 1)
    throw new FabRulesEvaluationError(`${mechanic} requires exactly one object`);
  return candidates[0]!;
}
