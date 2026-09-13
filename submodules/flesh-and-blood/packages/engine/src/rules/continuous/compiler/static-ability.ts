import type { FabStaticAbility } from "@tcg/flesh-and-blood-types";
import { dependencyStages } from "./dependencies.ts";
import { atomId, failure, highestStage } from "./helpers.ts";
import type { FabContinuousCompileResult } from "./types.ts";

export function compileFabStaticPropertyAbility(input: {
  readonly effectId: string;
  readonly ability: FabStaticAbility;
}): FabContinuousCompileResult {
  const { ability, effectId } = input;
  if (ability.staticKind !== "property" || !ability.property || ability.value === undefined) {
    return failure(
      effectId,
      [],
      "unsupported_mechanic",
      "static ability is not a complete property ability",
    );
  }
  const dependencies = dependencyStages({
    condition: ability.condition ?? null,
    amount: ability.value,
    target: { selector: "self" },
  });
  if (!dependencies.ok)
    return failure(effectId, [], "unsupported_dependency", dependencies.mechanic);
  return {
    ok: true,
    atoms: [
      {
        atomId: atomId(effectId, ["property"]),
        kind: "base-numeric",
        stage: 7,
        target: { selector: "self" },
        condition: ability.condition ?? null,
        dependencyStages: dependencies.stages,
        applicationStage: highestStage(7, dependencies.stages),
        substage: dependencies.stages.some((stage) => stage >= 7) ? 7 : 2,
        property: ability.property,
        amount: ability.value,
        operation: "set",
      },
    ],
  };
}
