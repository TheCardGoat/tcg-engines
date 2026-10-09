import { describe } from "vitest";
import { dissuadingAether } from "./dissuading-aether.ts";

import { proveTargetAttackReduction } from "../../../testing/target-attack-reduction.ts";
/** @covers bx25s7kiln-a1 */
describe("dissuadingAether attack reduction", () => {
  proveTargetAttackReduction(dissuadingAether, "action", "bx25s7kiln-a1");
});

import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";
describe("Dissuading Aether optional loading", () => {
  proveOptionalAetherwingLoad(dissuadingAether, true);
});
