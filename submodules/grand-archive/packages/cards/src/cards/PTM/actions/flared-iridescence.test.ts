import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { flaredIridescence } from "./flared-iridescence.ts";

/** @covers t2lW0Q5KJS-a1 */
describe("Flared Iridescence — fixed damage", () => {
  proveFixedDamageAction({
    card: flaredIridescence,
    cost: 2,
    damage: 4,
    targetKind: "unit",
  });
});
