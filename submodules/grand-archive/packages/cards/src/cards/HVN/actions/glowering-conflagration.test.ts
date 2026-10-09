import { describe } from "vitest";
import { gloweringConflagration } from "./glowering-conflagration.ts";
import { provePhantasiaCountDamage } from "../../../testing/phantasia-count-damage.ts";
/** @covers 1ym2py8u7q-a2 */
describe("gloweringConflagration damage", () => {
  provePhantasiaCountDamage({ card: gloweringConflagration, cost: 3, base: 1, championOnly: true });
});

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers 1ym2py8u7q-a1 */
describe("gloweringConflagration Class Bonus Kindle", () =>
  proveKindle(gloweringConflagration, 3, false, { classBonus: true, championDamage: 1 }));
