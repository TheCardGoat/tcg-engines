import { describe } from "vitest";
import { devotedBloomweaver } from "./devoted-bloomweaver.ts";

import { proveEntryEmpower } from "../../../testing/entry-empower.ts";
/** @covers yqm3l6lbns-a2 */
describe("devotedBloomweaver class Empower", () => proveEntryEmpower(devotedBloomweaver));
