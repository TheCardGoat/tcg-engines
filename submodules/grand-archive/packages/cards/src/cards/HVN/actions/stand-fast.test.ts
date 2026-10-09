import { describe } from "vitest";
import { standFast } from "./stand-fast.ts";

import { provePhaseRestrictedAction } from "../../../testing/phase-restricted-action.ts";
/** @covers ao1cfkhbp6-a1 */
describe("standFast activation phase", () => {
  provePhaseRestrictedAction(standFast, "end", true, "ally");
});
