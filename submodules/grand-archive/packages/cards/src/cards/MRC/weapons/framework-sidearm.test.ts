import { describe } from "vitest";
import { frameworkSidearm } from "./framework-sidearm.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers p4lgdlx7md-a1 */
describe("Framework Sidearm — Gun", () => {
  proveGunMustBeLoaded(frameworkSidearm);
});
