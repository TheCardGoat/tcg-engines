import { describe } from "vitest";
import { waterfallVeiler } from "./waterfall-veiler.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers x6jo8zxhl9-a1 */
describe("waterfallVeiler — Class Bonus Stealth", () => {
  proveClassBonusStealth(waterfallVeiler);
});
