import { describe } from "vitest";
import { breakApart } from "./break-apart.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers 4ns2jbt4hq-a1
 * @covers 4ns2jbt4hq-a2
 */
describe("Break Apart — destruction", () => {
  proveDestructionAction({ card: breakApart, kind: "equipment", mode: "single", regaliaTax: true });
});
