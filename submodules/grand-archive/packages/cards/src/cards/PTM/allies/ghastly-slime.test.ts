import { describe } from "vitest";
import { ghastlySlime } from "./ghastly-slime.ts";
import { proveClassEphemerate } from "../../../testing/class-ephemerate.ts";
/** @covers XFWU8KTVW9-a1 @covers XFWU8KTVW9-a2 */
describe("ghastlySlime — class Ephemerate", () => {
  proveClassEphemerate(ghastlySlime, 2, "slime");
});
