import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom } from "../../rules-view.ts";
import { record, resolvePlayer, type MutableObject } from "../atom-support.ts";

export function applyControllerAtom(
  entry: FabActiveContinuousAtom,
  subject: MutableObject,
  objects: ReadonlyMap<string, MutableObject>,
  atom: Extract<FabContinuousAtom, { kind: "controller" }>,
): void {
  subject.controllerId = resolvePlayer(atom.controller, entry.controllerId, objects);
  record(subject, entry, "controller", "set");
}
