import { describe } from "vitest";
import { viciousSlice } from "./vicious-slice.ts";
import { proveConditionalAttackTarget } from "../../../testing/conditional-attack-target.ts";
/** @covers n1uoy5ttka-a1 */
describe("Vicious Slice — attacked Human", () =>
  proveConditionalAttackTarget(viciousSlice, "human", 1, 1));
