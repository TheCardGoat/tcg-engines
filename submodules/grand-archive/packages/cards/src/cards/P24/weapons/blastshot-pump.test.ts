import { describe } from "vitest";
import { blastshotPump } from "./blastshot-pump.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers gmnmp5af09-a1 */
describe("Blastshot Pump — Gun", () => {
  proveGunMustBeLoaded(blastshotPump);
});
