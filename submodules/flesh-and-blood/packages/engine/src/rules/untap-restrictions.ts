import type { FabObjectRef } from "./continuous/ir.ts";
import type { FabRulesView } from "./rules-view.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

/**
 * CR 1.0.2 / 8.5.56 — whether a permanent may change from tapped to
 * untapped. The canonical set-tapped reducer owns enforcement so every
 * producer, including future producers and restored event journals, is covered.
 *
 * Exact compiled subjects are preferred. Untargeted rules represent
 * controller-wide restrictions. Filter-only subjects are deliberately not
 * broadened into an exact target because doing so would lose a declared
 * target's identity.
 */
export function canUntapObject(
  state: FabRulesSnapshot,
  ref: FabObjectRef,
  view: FabRulesView = buildFabRulesView(state),
): boolean {
  const object = view.object(ref);
  if (!object) return false;

  for (const rule of view.rules("untap")) {
    if (rule.mode !== "restrict" || rule.parameters.kind !== "rule-modification") continue;

    const exactSubject =
      rule.scope.kind === "objects" &&
      rule.scope.subjects.some(
        (subject) =>
          subject.instanceId === ref.instanceId && subject.incarnation === ref.incarnation,
      );
    const controllerWide =
      rule.scope.kind === "game" &&
      rule.parameters.subjectFilter === null &&
      object.controllerId === rule.controllerId;
    if (!exactSubject && !controllerWide) continue;

    if (
      rule.filter &&
      !view.matchesFilter(object, rule.filter, {
        controllerId: rule.controllerId,
        source: null,
        subject: object.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      })
    ) {
      continue;
    }
    return false;
  }
  return true;
}
