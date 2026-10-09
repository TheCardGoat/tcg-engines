import { describe } from "vitest";
import { orchestratedSeizure } from "./orchestrated-seizure.ts";

import { provePhaseRestrictedAction } from "../../../testing/phase-restricted-action.ts";
/** @covers pwscn0esog-a1 */
describe("orchestratedSeizure activation phase", () => {
  provePhaseRestrictedAction(orchestratedSeizure, "end", false, "none");
});
