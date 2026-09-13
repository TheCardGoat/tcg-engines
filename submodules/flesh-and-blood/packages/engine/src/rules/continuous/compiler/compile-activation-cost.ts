import type { FabEffect } from "@tcg/flesh-and-blood-types";

import { dependencyStages } from "./dependencies.ts";
import { atomId, failure, highestStage } from "./helpers.ts";
import type { FabContinuousCompileResult, CompileCursor } from "./types.ts";

export function compileActivationCost(
  effect: Extract<FabEffect, { readonly type: "modify-activation-cost" }>,
  cursor: CompileCursor,
): FabContinuousCompileResult {
  const dependencies = dependencyStages({
    condition: cursor.condition,
    amount: effect.amount,
    target: effect.target,
  });
  if (!dependencies.ok) {
    return failure(cursor.effectId, cursor.path, "unsupported_dependency", dependencies.mechanic);
  }
  return {
    ok: true,
    atoms: [
      {
        atomId: atomId(cursor.effectId, cursor.path),
        kind: "activation-cost",
        stage: 8,
        target: effect.target,
        condition: cursor.condition,
        subjectCondition: cursor.subjectCondition ?? null,
        dependencyStages: dependencies.stages,
        applicationStage: highestStage(8, dependencies.stages),
        substage: dependencies.stages.some((stage) => stage >= 8) ? "dependent" : "independent",
        operation: effect.op,
        amount: effect.amount,
      },
    ],
  };
}
