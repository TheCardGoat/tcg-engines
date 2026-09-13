import type { FabCardFilter, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabRuleAction, FabRuleParameters } from "../ir.ts";
import { dependencyStages } from "./dependencies.ts";
import { atomId, failure } from "./helpers.ts";
import type { CompileCursor, FabContinuousCompileResult } from "./types.ts";

export function compileRule(
  cursor: CompileCursor,
  target: FabTarget | null,
  filter: FabCardFilter | null,
  mode: "restrict" | "require" | "allow" | "amplify",
  action: FabRuleAction,
  parameters: FabRuleParameters,
  limit?: { readonly count: number | import("@tcg/flesh-and-blood-types").FabAmount },
  suffix?: string,
): FabContinuousCompileResult {
  const dependencies = dependencyStages({ condition: cursor.condition, target, filter });
  if (!dependencies.ok)
    return failure(cursor.effectId, cursor.path, "unsupported_dependency", dependencies.mechanic);
  return {
    ok: true,
    atoms: [
      {
        atomId: atomId(cursor.effectId, [...cursor.path, ...(suffix ? [suffix] : [])]),
        kind: "rule",
        stage: "rule",
        applicationStage: "rule",
        substage: null,
        target,
        condition: cursor.condition,
        subjectCondition: cursor.subjectCondition ?? null,
        dependencyStages: dependencies.stages,
        mode,
        action,
        filter,
        parameters,
        limit,
      },
    ],
  };
}
