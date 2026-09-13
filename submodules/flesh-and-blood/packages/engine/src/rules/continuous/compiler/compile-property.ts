import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { dependencyStages } from "./dependencies.ts";
import { atomBase, failure, propertyStage } from "./helpers.ts";
import type { CompileCursor, FabContinuousCompileResult } from "./types.ts";

export function compileProperty(
  effect: Extract<FabEffect, { readonly type: "grant-property" | "remove-property" }>,
  cursor: CompileCursor,
): FabContinuousCompileResult {
  const stage = propertyStage(effect.property);
  if (!stage) {
    return failure(
      cursor.effectId,
      cursor.path,
      "unsupported_mechanic",
      `property ${effect.property.kind} has no CR object stage`,
    );
  }
  const target =
    effect.target ?? (effect.appliesTo?.next ? ({ selector: "this-attack" } as const) : undefined);
  if (!target) {
    return failure(
      cursor.effectId,
      cursor.path,
      "unsupported_mechanic",
      "grant-property without target",
    );
  }
  const dependencies = dependencyStages({ condition: cursor.condition, target });
  if (!dependencies.ok)
    return failure(cursor.effectId, cursor.path, "unsupported_dependency", dependencies.mechanic);
  const base = atomBase(cursor, target, dependencies.stages, stage);
  const operation = effect.type === "grant-property" ? "grant" : "remove";
  switch (effect.property.kind) {
    case "name":
    case "color":
      return {
        ok: true,
        atoms: [{ ...base, kind: "identity", stage: 3, property: effect.property, operation }],
      };
    case "type":
    case "subtype":
      return {
        ok: true,
        atoms: [{ ...base, kind: "type", stage: 4, property: effect.property, operation }],
      };
    case "supertype":
      return {
        ok: true,
        atoms: [{ ...base, kind: "supertype", stage: 5, property: effect.property, operation }],
      };
    case "keyword":
    case "ability":
    case "abilities":
      return {
        ok: true,
        atoms: [{ ...base, kind: "ability", stage: 6, property: effect.property, operation }],
      };
    case "status":
      return failure(
        cursor.effectId,
        cursor.path,
        "unsupported_mechanic",
        "status is not a CR object property",
      );
  }
}
