import { describe } from "vitest";
import { disenchant } from "./disenchant.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers zd83net7x0-a1 */
describe("Disenchant — destruction", () => {
  proveDestructionAction({ card: disenchant, kind: "phantasia", mode: "single" });
});
