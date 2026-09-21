import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { forestCake } from "./forest-cake.ts";

/** @covers bjx6yo7mm5-a1 */
describe("Forest Cake — entry draw", () => {
  proveOnEnterDraw({
    card: forestCake,
    abilityId: "bjx6yo7mm5-a1",
    cost: { kind: "reserve", amount: 2 },
  });
});
