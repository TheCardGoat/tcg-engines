import { describe } from "vitest";
import { squallsnare } from "./squallsnare.ts";
import { proveSuppressTargets } from "../../../testing/suppress-targets.ts";

/** @covers cQZgiYS0w4-a1 */
describe("squallsnare — suppression", () => {
  proveSuppressTargets(squallsnare, "target-allies", "same-cost-pair");
});
