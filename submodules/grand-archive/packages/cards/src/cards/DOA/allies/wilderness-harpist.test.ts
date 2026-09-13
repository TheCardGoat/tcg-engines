import { proveHarmonyMelodyTrigger } from "../../../testing/harmony-melody-trigger.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { describe } from "vitest";
import { wildernessHarpist } from "./wilderness-harpist.ts";

/** @covers aKgdkLSBza-a1 */
describe("Wilderness Harpist \u2014 resolution", () => {
  proveClassBonusStealth(wildernessHarpist);
});

/** @covers aKgdkLSBza-a2 */
describe("Wilderness Harpist \u2014 resolution", () => {
  proveHarmonyMelodyTrigger(wildernessHarpist, "level");
});
