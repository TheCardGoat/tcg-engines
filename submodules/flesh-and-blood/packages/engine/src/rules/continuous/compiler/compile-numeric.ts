import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabNumericSubstage, FabRulesStage } from "../ir.ts";
import { dependencyStages } from "./dependencies.ts";
import { atomId, failure, highestStage } from "./helpers.ts";
import type { CompileCursor, FabContinuousCompileResult } from "./types.ts";

export function compileNumeric(
  effect: Extract<FabEffect, { readonly type: "modify-numeric" }>,
  cursor: CompileCursor,
): FabContinuousCompileResult {
  if (effect.property === "count") {
    return failure(
      cursor.effectId,
      cursor.path,
      "unsupported_mechanic",
      "event count is not an object property",
    );
  }
  const dependencies = dependencyStages({
    condition: cursor.condition,
    amount: effect.amount,
    target: effect.target ?? (effect.appliesTo?.next ? { selector: "this-attack" } : null),
  });
  if (!dependencies.ok)
    return failure(cursor.effectId, cursor.path, "unsupported_dependency", dependencies.mechanic);
  const isBase = effect.op === "set-base";
  const modificationStage: FabRulesStage = isBase ? 7 : 8;
  const operation = effect.op === "set-base" ? "set" : effect.op;
  const numericSubstage: FabNumericSubstage =
    operation === "set"
      ? 2
      : operation === "multiply"
        ? 3
        : operation === "divide"
          ? 4
          : operation === "add"
            ? 5
            : 6;
  const dependent = dependencies.stages.some((stage) => stage >= modificationStage);
  const substage: FabNumericSubstage = dependent ? 7 : numericSubstage;
  const base = {
    atomId: atomId(cursor.effectId, cursor.path),
    target: effect.target ?? (effect.appliesTo?.next ? { selector: "this-attack" } : null),
    condition: cursor.condition,
    subjectCondition: cursor.subjectCondition ?? null,
    dependencyStages: dependencies.stages,
    applicationStage: highestStage(modificationStage, dependencies.stages),
    substage,
    property: effect.property,
    amount: effect.amount,
  };
  if (isBase) {
    return {
      ok: true,
      atoms: [{ ...base, kind: "base-numeric", stage: 7, operation: "set" }],
    };
  }
  return {
    ok: true,
    atoms: [
      {
        ...base,
        kind: "numeric",
        stage: 8,
        operation,
        // Preserve divide rounding (Lyath "halved, rounded up") on the atom so
        // evaluation does not silently floor every division.
        ...(operation === "divide" && effect.rounding ? { rounding: effect.rounding } : {}),
      },
    ],
  };
}
