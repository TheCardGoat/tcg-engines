import type { FabGrantableProperty, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabObjectSubstage, FabRulesStage } from "../ir.ts";
import type {
  CompileCursor,
  FabContinuousCompileError,
  FabContinuousCompileResult,
} from "./types.ts";

export function failure(
  effectId: string,
  path: readonly (string | number)[],
  code: FabContinuousCompileError["code"],
  mechanic: string,
): FabContinuousCompileResult {
  return { ok: false, error: { code, effectId, path, mechanic } };
}

export function atomId(effectId: string, path: readonly (string | number)[]): string {
  return path.length === 0 ? `${effectId}:atom` : `${effectId}:atom:${path.join(".")}`;
}

export function highestStage(
  modificationStage: FabRulesStage,
  dependencies: readonly FabRulesStage[],
): FabRulesStage {
  return dependencies.reduce(
    (highest, stage) => (stage > highest ? stage : highest),
    modificationStage,
  );
}

export function atomBase(
  cursor: CompileCursor,
  target: FabTarget,
  dependencies: readonly FabRulesStage[],
  modificationStage: FabRulesStage,
) {
  const applicationStage = highestStage(modificationStage, dependencies);
  const substage: FabObjectSubstage =
    applicationStage > modificationStage ? "dependent" : "independent";
  return {
    atomId: atomId(cursor.effectId, cursor.path),
    target,
    condition: cursor.condition,
    subjectCondition: cursor.subjectCondition ?? null,
    dependencyStages: dependencies,
    applicationStage,
    substage,
  } as const;
}

export function propertyStage(property: FabGrantableProperty): 3 | 4 | 5 | 6 | null {
  switch (property.kind) {
    case "name":
    case "color":
      return 3;
    case "type":
    case "subtype":
      return 4;
    case "supertype":
      return 5;
    case "keyword":
    case "ability":
    case "abilities":
      return 6;
    case "status":
      return null;
  }
}
