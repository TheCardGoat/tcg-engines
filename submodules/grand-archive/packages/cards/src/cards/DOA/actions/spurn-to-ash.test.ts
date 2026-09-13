import { proveDestroyObjectAction } from "../../../testing/destroy-object-action.ts";
import { describe } from "vitest";
import { spurnToAsh } from "./spurn-to-ash.ts";

/** @covers ErH0lIBq4z-a1 */
describe("Spurn to Ash \u2014 resolution", () => {
  proveDestroyObjectAction({ card: spurnToAsh, cost: 3, cheapRegalia: true });
});
