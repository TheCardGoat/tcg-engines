import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { hubOfInnovation } from "./hub-of-innovation.ts";

/** @covers aebjlwabip-a1 */
describe("Hub of Innovation — entry draw", () => {
  proveOnEnterDraw({
    card: hubOfInnovation,
    abilityId: "aebjlwabip-a1",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
  });
});
