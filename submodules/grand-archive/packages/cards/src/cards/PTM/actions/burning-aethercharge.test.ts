import { describe } from "vitest";
import { burningAethercharge } from "./burning-aethercharge.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers vrK16VZ2zU-a1 */
describe("burningAethercharge Class Bonus Kindle", () =>
  proveKindle(burningAethercharge, 2, false, { classBonus: true, championDamage: 2 }));

import { proveDamageAndOptionalAetherwingLoad } from "../../../testing/damage-aetherwing-load.ts";
/** @covers vrK16VZ2zU-a2 */
describe("Burning Aethercharge — damage and optional loading", () => {
  proveDamageAndOptionalAetherwingLoad(burningAethercharge, 2, false);
});
