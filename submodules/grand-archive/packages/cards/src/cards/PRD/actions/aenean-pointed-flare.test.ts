import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { aeneanPointedFlare } from "./aenean-pointed-flare.ts";

/** @covers BTapvu1Zvd-a2 */
describe("Aenean Pointed Flare — fixed damage", () => {
  proveFixedDamageAction({
    card: aeneanPointedFlare,
    cost: 4,
    damage: 4,
    targetKind: "champion",
  });
});
