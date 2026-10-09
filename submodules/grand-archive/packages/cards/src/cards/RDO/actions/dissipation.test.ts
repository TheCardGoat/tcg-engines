import { describe } from "vitest";
import { dissipation } from "./dissipation.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers Q9b0d7fkGv-a2 */
describe("Dissipation — destruction", () => {
  proveDestructionAction({ card: dissipation, kind: "phantasia", mode: "all" });
});
