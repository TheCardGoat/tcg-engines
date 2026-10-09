import { describe } from "vitest";
import { aethericCalibration } from "./aetheric-calibration.ts";
import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers 7l9th23niu-a2 */
describe("aetheric-calibration — optional Aetherwing loading", () => {
  proveOptionalAetherwingLoad(aethericCalibration);
});
