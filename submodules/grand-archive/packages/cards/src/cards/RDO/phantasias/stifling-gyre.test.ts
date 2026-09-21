import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { stiflingGyre } from "./stifling-gyre.ts";

/** @covers OADTyAUBZt-a2 */
describe("Stifling Gyre — entry draw", () => {
  proveOnEnterDraw({
    card: stiflingGyre,
    abilityId: "OADTyAUBZt-a2",
    cost: { kind: "reserve", amount: 3 },
    asEntersChoice: "Woodland Squirrels",
    destination: "memory",
  });
});
