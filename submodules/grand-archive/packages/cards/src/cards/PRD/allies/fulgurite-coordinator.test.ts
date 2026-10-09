import { describe } from "vitest";
import { fulguriteCoordinator } from "./fulgurite-coordinator.ts";

import { proveSelfEntryCounters } from "../../../testing/self-entry-counters.ts";

/** @covers 7aZwqrfbzO-a1 */
describe("fulguriteCoordinator — entry counters", () => {
  proveSelfEntryCounters(fulguriteCoordinator, "static", 1);
});
