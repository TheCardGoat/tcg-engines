import { FabRulesEvaluationError } from "../errors.ts";

export function resolveWinner(): never {
  throw new FabRulesEvaluationError("target selector winner");
}
