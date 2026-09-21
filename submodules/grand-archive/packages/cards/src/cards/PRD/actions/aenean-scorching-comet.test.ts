import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { aeneanScorchingComet } from "./aenean-scorching-comet.ts";

/** @covers 50m1nBduUZ-a1 */
describe("Aenean Scorching Comet — fixed damage", () => {
  proveFixedDamageAction({
    card: aeneanScorchingComet,
    cost: 2,
    damage: 2,
    targetKind: "unit",
  });
});
