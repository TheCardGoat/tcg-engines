import {
  deriveGrandArchiveNumericProperty,
  grandArchiveObjectCurrentCharacteristics,
} from "../rules/state/continuous.ts";
import {
  evaluateGrandArchiveActiveKeywordAmount,
  grandArchiveObjectActiveKeywordInstances,
} from "../rules/abilities/intrinsic-keywords.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "./model.ts";

/**
 * Determines whether an ally currently obeys its controller.
 *
 * Allies obey by default. Pride replaces that default with the highest active
 * Pride threshold, measured against the current level of the ally's
 * controller's champion.
 */
export function grandArchiveObjectObeysController(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  object: GrandArchiveCardInstance,
): boolean {
  if (
    object.zone !== "field" ||
    !grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("ALLY")
  ) {
    return true;
  }
  const pride = grandArchiveObjectActiveKeywordInstances(program, state, object).reduce(
    (highest, instance) => {
      const keyword = instance.keyword;
      if (keyword.name !== "pride") return highest;
      const value = evaluateGrandArchiveActiveKeywordAmount(instance, keyword.value);
      return Math.max(highest, value);
    },
    0,
  );
  if (pride <= 0) return true;
  const champion = Object.values(state.objects).find(
    (candidate) =>
      candidate.zone === "field" &&
      candidate.controllerId === object.controllerId &&
      grandArchiveObjectCurrentCharacteristics(program, state, candidate).types.includes(
        "CHAMPION",
      ),
  );
  return Boolean(
    champion &&
    (deriveGrandArchiveNumericProperty(champion, "level", {
      program,
      state,
      controllerId: champion.controllerId,
      sourceId: champion.id,
      abilityBearerId: champion.id,
      bindings: {},
    }) ?? 0) >= pride,
  );
}
