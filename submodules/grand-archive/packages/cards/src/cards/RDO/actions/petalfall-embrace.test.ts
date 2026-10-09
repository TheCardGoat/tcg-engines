import { describe } from "vitest";
import { petalfallEmbrace } from "./petalfall-embrace.ts";

import { proveRecoveryActionBoundaries } from "../../../testing/recovery-action-boundaries.ts";
/** @covers uDWTjGarSL-a1 */

describe("petalfallEmbrace recovery boundaries", () => {
  proveRecoveryActionBoundaries(petalfallEmbrace, "petalfall");
});
