import { describe } from "vitest";
import { vantagePoint } from "./vantage-point.ts";
import { proveClassEphemerate } from "../../../testing/class-ephemerate.ts";
/** @covers U6krXc5283-a1 @covers U6krXc5283-a2 */
describe("vantagePoint — class Ephemerate", () => {
  proveClassEphemerate(vantagePoint, 2, "vantage");
});
