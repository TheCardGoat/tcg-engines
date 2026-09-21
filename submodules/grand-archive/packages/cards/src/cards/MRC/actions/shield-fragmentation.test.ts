import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { shieldFragmentation } from "./shield-fragmentation.ts";

/** @covers CHU96qWwaS-a2 */
describe("Shield Fragmentation — fixed damage", () => {
  proveFixedDamageAction({
    card: shieldFragmentation,
    cost: 2,
    damage: 4,
    targetKind: "unit",
    sacrifice: "shield",
  });
});
