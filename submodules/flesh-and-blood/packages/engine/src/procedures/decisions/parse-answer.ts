import type { FabDecisionAnswer } from "../../rules/process.ts";
import { isRecord, stringArray } from "./helpers.ts";

export function parseFabDecisionAnswer(value: unknown): FabDecisionAnswer | null {
  if (!isRecord(value) || typeof value.kind !== "string") return null;
  switch (value.kind) {
    case "cancel":
      return { kind: "cancel" };
    case "boolean":
      return typeof value.value === "boolean" ? { kind: "boolean", value: value.value } : null;
    case "option": {
      const optionIds = stringArray(value.optionIds);
      return optionIds ? { kind: "option", optionIds } : null;
    }
    case "entity-target": {
      const instanceIds = stringArray(value.instanceIds);
      return instanceIds ? { kind: "entity-target", instanceIds } : null;
    }
    case "ordering": {
      const orderedIds = stringArray(value.orderedIds);
      return orderedIds ? { kind: "ordering", orderedIds } : null;
    }
    case "group-choice": {
      const selectedIds = stringArray(value.selectedIds);
      const orderedRemainderIds = stringArray(value.orderedRemainderIds);
      return selectedIds && orderedRemainderIds
        ? { kind: "group-choice", selectedIds, orderedRemainderIds }
        : null;
    }
    case "numeric":
      return typeof value.value === "number" && Number.isFinite(value.value)
        ? { kind: "numeric", value: value.value }
        : null;
    case "partition": {
      if (!isRecord(value.groups)) return null;
      const groups: Record<string, readonly string[]> = {};
      for (const [groupId, entries] of Object.entries(value.groups)) {
        const parsed = stringArray(entries);
        if (!parsed) return null;
        groups[groupId] = parsed;
      }
      return { kind: "partition", groups };
    }
    case "payment": {
      const instanceIds = stringArray(value.instanceIds);
      return instanceIds ? { kind: "payment", instanceIds } : null;
    }
    case "effect-resolution":
      return typeof value.optionId === "string"
        ? { kind: "effect-resolution", optionId: value.optionId }
        : null;
    default:
      return null;
  }
}
