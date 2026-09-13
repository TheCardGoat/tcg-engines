import { createFabGroupChoiceDecision } from "../../../kernel/decision-builders.ts";
import { publishFabDecision } from "../../../kernel/decision-state.ts";
import { scanAtResolutionObjectPool } from "../../proposals/shared.ts";
import type { LayerDecisionCtx } from "./context.ts";
import type { FabLayerResolutionResult } from "../result.ts";

function nameKey(names: readonly string[]): string {
  return names.map((name) => name.trim().toLocaleLowerCase("en-US")).join("\u0000");
}

export function handleGroupChoice(ctx: LayerDecisionCtx<"group-choice">): FabLayerResolutionResult {
  const { state, layer, process, decision } = ctx;
  const objects = scanAtResolutionObjectPool(state, layer, decision.effect.target);
  if (!objects || objects.length === 0) {
    return ctx.failure(
      state,
      "A same-name group choice requires at least one legal object.",
      "unsupported_group_choice",
    );
  }
  const byName = new Map<string, { label: string; entryIds: string[] }>();
  for (const object of objects) {
    const key = nameKey(object.current.names);
    const existing = byName.get(key);
    if (existing) existing.entryIds.push(object.instanceId);
    else {
      byName.set(key, {
        label: object.current.names.join(" // ") || object.canonicalId || object.instanceId,
        entryIds: [object.instanceId],
      });
    }
  }
  publishFabDecision(
    state,
    createFabGroupChoiceDecision(state, {
      actorId: layer.controllerId,
      label: `Choose one or more same-name cards, then order the rest for ${layer.source.current.names.join(" // ") || layer.layerId}.`,
      entries: objects.map((object) => ({
        id: object.instanceId,
        source: {
          instanceId: object.instanceId,
          ...(object.canonicalId ? { canonicalId: object.canonicalId } : {}),
          ownerId: object.ownerId,
        },
        label: object.current.names.join(" // ") || object.canonicalId || object.instanceId,
      })),
      cohorts: [...byName.values()].map((cohort, index) => ({
        id: `cohort-${index}`,
        label: cohort.label,
        entryIds: cohort.entryIds,
      })),
      continuation: {
        kind: "effect-resolution",
        processId: process.processId,
        layerId: layer.layerId,
        effectPath: decision.path,
      },
    }),
  );
  return { accepted: true, state };
}
