import { describe } from "vitest";
import { shredToRibbons } from "./shred-to-ribbons.ts";
import { proveConditionalAttackTarget } from "../../../testing/conditional-attack-target.ts";
/** @covers 5j36gn1b2s-a1 */
describe("Shred to Ribbons — attacked ally's current life", () =>
  proveConditionalAttackTarget(shredToRibbons, "life", 3, 3));
