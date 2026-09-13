import type { FabContinuousCompileInput, FabContinuousCompileResult } from "./types.ts";
import { compileNode } from "./compile-node.ts";

export type {
  FabContinuousCompileError,
  FabContinuousCompileResult,
  FabContinuousCompileInput,
  CompileCursor,
} from "./types.ts";
export { compileFabStaticPropertyAbility } from "./static-ability.ts";
export { dependencyStages } from "./dependencies.ts";
export { compileNode } from "./compile-node.ts";

export function compileFabContinuousEffect(
  input: FabContinuousCompileInput,
): FabContinuousCompileResult {
  return compileNode(input.effect, {
    effectId: input.effectId,
    condition: input.condition ?? null,
    path: [],
  });
}
