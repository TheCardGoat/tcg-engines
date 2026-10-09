import { describe } from "vitest";
import { prototypePistol } from "./prototype-pistol.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers frzrplywc0-a1 */
describe("Prototype Pistol — Gun", () => {
  proveGunMustBeLoaded(prototypePistol);
});
