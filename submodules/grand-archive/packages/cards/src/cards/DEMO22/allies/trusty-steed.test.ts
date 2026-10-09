import { describe } from "vitest";
import { trustySteed } from "./trusty-steed.ts";

import { proveEntryTargetStat } from "../../../testing/entry-target-stat.ts";
/** @covers FCbKYZcbNq-a1 */
describe("trustySteed entry stat effect", () => proveEntryTargetStat(trustySteed, "power"));
