import type { FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabEvalContext } from "../../rules-view.ts";
import type { MutableObject } from "../mutable.ts";
import { isDefined, refKey } from "../helpers.ts";

export function resolveBinding(
  target: Extract<FabTarget, { selector: "binding" }>,
  context: FabEvalContext,
  objects: ReadonlyMap<string, MutableObject>,
): readonly MutableObject[] {
  return (context.bindings.objects[target.binding] ?? [])
    .filter(
      (ref) =>
        !target.exclude ||
        !(context.bindings.objects[target.exclude] ?? []).some(
          (excluded) => refKey(excluded) === refKey(ref),
        ),
    )
    .map((ref) => objects.get(refKey(ref)))
    .filter(isDefined);
}
