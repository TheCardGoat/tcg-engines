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

import { proveAeneanDamageLevels } from "../../../testing/aenean-damage-levels.ts";
/** @covers 50m1nBduUZ-a2 @covers 50m1nBduUZ-a3 */
describe("Aenean Scorching Comet level replacements", () =>
  proveAeneanDamageLevels(aeneanScorchingComet));
