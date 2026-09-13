import { describe } from "vitest";

import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { imperialAssassin } from "./imperial-assassin.ts";

/** @covers mwd3n9u8ej-a1 */
describe("Imperial Assassin — Class Bonus Stealth", () => {
  proveClassBonusStealth(imperialAssassin);
});
