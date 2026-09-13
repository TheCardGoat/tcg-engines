import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe } from "vitest";
import { windResonanceBauble } from "./wind-resonance-bauble.ts";

/** @covers bHGUNMFLg9-a1 */
describe("Wind Resonance Bauble \u2014 resolution", () => {
  proveBanishDrawItem({
    card: windResonanceBauble,
    abilityId: "bHGUNMFLg9-a1",
    requiredOpponentElement: "WIND",
  });
});
