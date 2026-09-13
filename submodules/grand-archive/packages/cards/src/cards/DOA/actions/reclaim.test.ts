import { proveReturnAllyAction } from "../../../testing/return-ally-action.ts";
import { describe } from "vitest";
import { reclaim } from "./reclaim.ts";

/** @covers F2wp1v0Tyk-a1 */
describe("Reclaim \u2014 resolution", () => {
  proveReturnAllyAction({ card: reclaim, cost: 2, controlledOnly: true });
});
