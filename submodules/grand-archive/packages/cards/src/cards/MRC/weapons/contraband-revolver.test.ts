import { describe } from "vitest";
import { contrabandRevolver } from "./contraband-revolver.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers 8iopvc8sug-a1 */
describe("Contraband Revolver — Gun", () => {
  proveGunMustBeLoaded(contrabandRevolver);
});
