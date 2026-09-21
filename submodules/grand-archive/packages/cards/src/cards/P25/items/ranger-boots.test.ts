import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { rangerBoots } from "./ranger-boots.ts";

/** @covers fbs9qzo3f6-a2 */
describe("Ranger Boots — entry draw", () => {
  proveOnEnterDraw({
    card: rangerBoots,
    abilityId: "fbs9qzo3f6-a2",
    cost: { kind: "memory", amount: 1 },
  });
});
