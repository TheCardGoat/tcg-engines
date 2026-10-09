import { describe } from "vitest";
import { archonBroadsword } from "./archon-broadsword.ts";
import { proveTokenCountStats } from "../../../testing/token-count-stats.ts";
/** @covers pyx8bd7ozu-a1 */
/** @covers pyx8bd7ozu-a2 */
describe("Archon Broadsword — token power and attack payment", () =>
  proveTokenCountStats(archonBroadsword, true));
