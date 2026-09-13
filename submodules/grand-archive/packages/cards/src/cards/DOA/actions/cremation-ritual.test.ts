import { describe } from "vitest";
import { cremationRitual } from "./cremation-ritual.ts";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice-action.ts";
/** @covers Pr48kXnasw-a1 @covers Pr48kXnasw-a2 */
describe("cremation-ritual additional sacrifice", () => {
  proveAdditionalSacrifice({ card: cremationRitual, cost: 3, weapon: false });
});
