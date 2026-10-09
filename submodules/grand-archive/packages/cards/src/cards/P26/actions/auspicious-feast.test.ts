import { describe } from "vitest";
import { auspiciousFeast } from "./auspicious-feast.ts";

import { proveRecoveryActionBoundaries } from "../../../testing/recovery-action-boundaries.ts";
/** @covers k0sln8vnuo-a1 */

describe("auspiciousFeast recovery boundaries", () => {
  proveRecoveryActionBoundaries(auspiciousFeast, "feast");
});
