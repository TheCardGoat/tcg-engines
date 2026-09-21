import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { cinderGeyser } from "./cinder-geyser.ts";

/** @covers stiyh3pmk3-a2 */
describe("Cinder Geyser — fixed damage", () => {
  proveFixedDamageAction({
    card: cinderGeyser,
    cost: 4,
    damage: 4,
    targetKind: "unit",
  });
});
