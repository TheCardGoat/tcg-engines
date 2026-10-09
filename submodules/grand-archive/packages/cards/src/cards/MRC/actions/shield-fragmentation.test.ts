import { describe } from "vitest";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice.ts";
import { resplendentKiteShield } from "../../ALC/items/resplendent-kite-shield.ts";
import { rustedWarshield } from "../../ALC/items/rusted-warshield.ts";

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

/** @covers CHU96qWwaS-a1 */
describe("Shield Fragmentation — additional Shield sacrifice", () => {
  proveAdditionalSacrifice(shieldFragmentation, 2, [resplendentKiteShield, rustedWarshield]);
});
