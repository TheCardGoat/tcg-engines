import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { searingTruth } from "./searing-truth.ts";

/** @covers pfstbz0i63-a1 */
describe("Searing Truth — fixed damage", () => {
  proveFixedDamageAction({
    card: searingTruth,
    cost: 2,
    damage: 2,
    targetKind: "unit",
  });
});
