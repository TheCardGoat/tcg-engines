import { describe } from "vitest";
import { singeingLeap } from "./singeing-leap.ts";
import { proveClassEphemerate } from "../../../testing/class-ephemerate.ts";
/** @covers YFCfIOwNQ5-a1 @covers YFCfIOwNQ5-a2 */
describe("singeingLeap — class Ephemerate", () => {
  proveClassEphemerate(singeingLeap, 2, "leap");
});
