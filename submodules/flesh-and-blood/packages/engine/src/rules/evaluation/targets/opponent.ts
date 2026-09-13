import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { heroObjectsForPlayer } from "../helpers.ts";

export function resolveOpponent(
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  const opponent = Object.keys(context.facts?.heroRefs ?? {}).find(
    (playerId) => playerId !== context.controllerId,
  );
  return heroObjectsForPlayer(opponent, context, objects);
}
