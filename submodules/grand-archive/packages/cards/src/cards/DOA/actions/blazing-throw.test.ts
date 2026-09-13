import { describe } from "vitest";
import { blazingThrow } from "./blazing-throw.ts";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice-action.ts";
/** @covers iohZMWh5v5-a1 @covers iohZMWh5v5-a2 */
describe("blazing-throw additional sacrifice", () => {
  proveAdditionalSacrifice({ card: blazingThrow, cost: 1, weapon: true });
});
