import { proveSuppressAction } from "../../../testing/suppress-action.ts";
import { describe } from "vitest";
import { zephyr } from "./zephyr.ts";

/** @covers idaRe7y3In-a1 */
describe("Zephyr \u2014 resolution", () => {
  proveSuppressAction({ card: zephyr, cost: 2, targetId: "target-1", regalia: true });
});
