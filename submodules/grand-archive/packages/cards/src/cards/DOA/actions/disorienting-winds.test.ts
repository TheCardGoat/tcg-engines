import { proveReturnAllyAction } from "../../../testing/return-ally-action.ts";
import { describe } from "vitest";
import { disorientingWinds } from "./disorienting-winds.ts";

/** @covers UfQh069mc3-a2 */
describe("Disorienting Winds \u2014 resolution", () => {
  proveReturnAllyAction({ card: disorientingWinds, cost: 5, draw: 1 });
});
