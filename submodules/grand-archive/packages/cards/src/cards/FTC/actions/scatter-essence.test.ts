import { describe } from "vitest";
import { scatterEssence } from "./scatter-essence.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers zi5h8asbie-a1 */
describe("Scatter Essence — destruction", () => {
  proveDestructionAction({ card: scatterEssence, kind: "phantasia", mode: "single" });
});
