import { describe } from "vitest";
import { recurringAethercharge } from "./recurring-aethercharge.ts";
import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers MG8QoeZBXY-a1 */
describe("recurring-aethercharge — optional Aetherwing loading", () => {
  proveOptionalAetherwingLoad(recurringAethercharge);
});
