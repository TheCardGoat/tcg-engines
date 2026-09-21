import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { stockedOutpost } from "./stocked-outpost.ts";

/** @covers AOMXEGeSQk-a2 */
describe("Stocked Outpost — entry draw", () => {
  proveOnEnterDraw({
    card: stockedOutpost,
    abilityId: "AOMXEGeSQk-a2",
    cost: { kind: "reserve", amount: 2 },
    destination: "memory",
  });
});
