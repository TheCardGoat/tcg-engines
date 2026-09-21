import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { transfusiveAura } from "./transfusive-aura.ts";

/** @covers 7qWYuRNoYI-a1 */
describe("Transfusive Aura — entry draw", () => {
  proveOnEnterDraw({
    card: transfusiveAura,
    abilityId: "7qWYuRNoYI-a1",
    cost: { kind: "reserve", amount: 2 },
    destination: "memory",
  });
});
