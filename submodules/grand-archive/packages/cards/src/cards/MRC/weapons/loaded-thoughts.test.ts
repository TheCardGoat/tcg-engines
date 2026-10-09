import { describe } from "vitest";
import { loadedThoughts } from "./loaded-thoughts.ts";
import { proveGunMustBeLoaded } from "../../../testing/gun-loaded.ts";
/** @covers hh88rx6p3p-a1 */
describe("Loaded Thoughts — Gun", () => {
  proveGunMustBeLoaded(loadedThoughts);
});
