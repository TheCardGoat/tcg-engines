import { describe } from "vitest";
import { imperiousGalebind } from "./imperious-galebind.ts";
import { proveSuppressTargets } from "../../../testing/suppress-targets.ts";

/** @covers 2goaqn7ImP-a2 */
describe("imperious-galebind — suppression", () => {
  proveSuppressTargets(imperiousGalebind, "target-objects", "up-to-three");
});
