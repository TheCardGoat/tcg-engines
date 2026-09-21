import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { mirrorboundCovenant } from "./mirrorbound-covenant.ts";

/** @covers PKnOTdQJJ1-a1 */
describe("Mirrorbound Covenant — entry draw", () => {
  proveOnEnterDraw({
    card: mirrorboundCovenant,
    abilityId: "PKnOTdQJJ1-a1",
    cost: { kind: "reserve", amount: 2 },
    destination: "memory",
  });
});
