import type { FabObjectSnapshot } from "./events.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import { buildFabRulesView, matchesFabSnapshotFilter } from "./state-rules-view.ts";

/**
 * Printed "Hero abilities can't create cards" / "they can't create aura
 * tokens" (Preach Modesty, Renounce Grandeur). Restrict-create rules skip
 * the create event so the rest of the layer can still resolve.
 *
 * `subjectFilter` matches the creating layer source (Hero type-box for hero
 * abilities). Empty subjects with no subject filter are game-wide. `filter`
 * matches the object that would be created.
 */
export function createIsRestricted(
  state: FabRulesSnapshot,
  source: FabObjectSnapshot,
  created: FabObjectSnapshot,
): boolean {
  const view = buildFabRulesView(state);
  for (const rule of view.rules("create")) {
    if (rule.mode !== "restrict" || rule.parameters.kind !== "rule-modification") continue;
    const params = rule.parameters;
    if (params.subjectFilter) {
      if (
        !matchesFabSnapshotFilter(
          state,
          source,
          params.subjectFilter,
          undefined,
          rule.controllerId,
          source.ref,
        )
      ) {
        continue;
      }
    } else if (rule.scope.kind === "objects") {
      if (
        !rule.scope.subjects.some((subject) => {
          if (subject.instanceId === source.instanceId) return true;
          // Hero-latched "they can't create" applies to that player's creates,
          // not only creates whose source object is the hero card.
          const subjectObject = view.object(subject);
          return (
            subjectObject?.current.typeBox.types.includes("Hero") === true &&
            subjectObject.controllerId === source.controllerId
          );
        })
      ) {
        continue;
      }
    }
    if (rule.filter) {
      if (
        !matchesFabSnapshotFilter(
          state,
          created,
          rule.filter,
          undefined,
          rule.controllerId,
          source.ref,
        )
      ) {
        continue;
      }
    }
    return true;
  }
  return false;
}
