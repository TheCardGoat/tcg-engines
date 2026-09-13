import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe } from "vitest";
import { fireResonanceBauble } from "./fire-resonance-bauble.ts";

/** @covers LROrzTmh55-a1 */
describe("Fire Resonance Bauble \u2014 resolution", () => {
  proveBanishDrawItem({
    card: fireResonanceBauble,
    abilityId: "LROrzTmh55-a1",
    requiredOpponentElement: "FIRE",
  });
});
