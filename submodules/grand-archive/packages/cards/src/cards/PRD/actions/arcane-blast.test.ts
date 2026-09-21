import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { arcaneBlast } from "./arcane-blast.ts";

/** @covers pn9gQjV3Rb-a2 */
describe("Arcane Blast — fixed damage", () => {
  proveFixedDamageAction({
    card: arcaneBlast,
    cost: 11,
    damage: 11,
    targetKind: "champion",
  });
});
