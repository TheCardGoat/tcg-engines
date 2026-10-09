import { describe } from "vitest";
import { curtainOfShadows } from "./curtain-of-shadows.ts";
import { proveTristanShadowSummon } from "../../../testing/tristan-shadow-summon.ts";
/**
 * @covers y7AFl2B1B3-a1
 * @covers y7AFl2B1B3-a2
 */
describe("curtain-of-shadows — Tristan summon", () =>
  proveTristanShadowSummon(curtainOfShadows, 10, true));
