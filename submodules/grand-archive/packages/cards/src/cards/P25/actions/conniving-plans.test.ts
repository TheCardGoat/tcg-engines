import { describe } from "vitest";
import { connivingPlans } from "./conniving-plans.ts";
import { proveMillResolution } from "../../../testing/mill-resolution.ts";

/** @covers 2b2w1ydw5z-a1 */
describe("conniving-plans — mill", () => {
  proveMillResolution(connivingPlans, 2, "own");
});
