import { describe } from "vitest";
import { slimeCalling } from "./slime-calling.ts";

import { provePhaseRestrictedAction } from "../../../testing/phase-restricted-action.ts";
/** @covers dc8P58gmjR-a1 */
describe("slimeCalling activation phase", () => {
  provePhaseRestrictedAction(slimeCalling, "end", false, "none");
});
