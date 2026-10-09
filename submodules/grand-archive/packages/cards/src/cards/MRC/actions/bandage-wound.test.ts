import { describe } from "vitest";
import { bandageWound } from "./bandage-wound.ts";

import { proveRecoveryActionBoundaries } from "../../../testing/recovery-action-boundaries.ts";
/** @covers 9q1vk8ao8b-a1 */

describe("bandageWound recovery boundaries", () => {
  proveRecoveryActionBoundaries(bandageWound, "bandage");
});
