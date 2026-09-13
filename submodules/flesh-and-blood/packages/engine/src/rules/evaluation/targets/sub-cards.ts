import { FabRulesEvaluationError } from "../errors.ts";

export function resolveSubCards(): never {
  throw new FabRulesEvaluationError("target selector sub-cards");
}
