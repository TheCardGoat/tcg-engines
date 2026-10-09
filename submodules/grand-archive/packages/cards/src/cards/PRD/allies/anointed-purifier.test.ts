import { describe } from "vitest";
import { anointedPurifier } from "./anointed-purifier.ts";

import { proveSelfEntryCounters } from "../../../testing/self-entry-counters.ts";

/** @covers mt1I9kfowQ-a1 */
describe("anointedPurifier — entry counters", () => {
  proveSelfEntryCounters(anointedPurifier, "buff", 2);
});
