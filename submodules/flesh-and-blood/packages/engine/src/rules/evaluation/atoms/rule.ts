import type { FabContinuousAtom } from "../../continuous/ir.ts";
import type { FabActiveContinuousAtom } from "../../rules-view.ts";
import type { MutableObject } from "../atom-support.ts";

/** Rule atoms are applied in evaluateRuleAtoms, not object stages. */
export function applyRuleAtom(
  _entry: FabActiveContinuousAtom,
  _subject: MutableObject,
  _atom: Extract<FabContinuousAtom, { kind: "rule" }>,
): void {
  return;
}
