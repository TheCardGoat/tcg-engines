import { describe } from "vitest";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { atmosArmorTypeHermes } from "./atmos-armor-type-hermes.ts";

/** @covers dlx7mdk0xh-a1 */
describe("Atmos Armor Type-Hermes — additional Powercell sacrifice", () => {
  proveAdditionalSacrifice(atmosArmorTypeHermes, 3, [powercell], undefined, true);
});
