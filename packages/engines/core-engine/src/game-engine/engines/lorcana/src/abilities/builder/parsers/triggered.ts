import type { LorcanaEffect } from "../../effect-types";
import type { LorcanaTriggerTiming as TriggerTiming } from "../../triggered/triggered-ability";
import { AbilityBuilder } from "../ability-builder";
import { PATTERNS } from "./util";

export function parseTriggeredAbility(text: string) {
  return require("./triggered/index").parseTriggered(text);
}
