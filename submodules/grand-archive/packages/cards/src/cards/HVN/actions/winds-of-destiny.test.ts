import { describe } from "vitest";
import { windsOfDestiny } from "./winds-of-destiny.ts";
import { proveSuppressTargets } from "../../../testing/suppress-targets.ts";

/** @covers nhk5d19n82-a2 */
describe("winds-of-destiny — suppression", () => {
  proveSuppressTargets(windsOfDestiny, "target-1", "object");
});
