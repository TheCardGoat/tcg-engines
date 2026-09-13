import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";
import { beastbondEars } from "./beastbond-ears.ts";

/** @covers JPcFmCpdiF-a1 */
describe("Beastbond Ears \u2014 resolution", () => {
  proveAnimalBeastLevel(beastbondEars);
});
