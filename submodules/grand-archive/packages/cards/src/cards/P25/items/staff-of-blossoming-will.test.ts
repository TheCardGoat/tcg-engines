import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { staffOfBlossomingWill } from "./staff-of-blossoming-will.ts";

/** @covers 4moumzcx9z-a1 */
describe("Staff of Blossoming Will — entry draw", () => {
  proveOnEnterDraw({
    card: staffOfBlossomingWill,
    abilityId: "4moumzcx9z-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
