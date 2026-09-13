import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe } from "vitest";
import { waterResonanceBauble } from "./water-resonance-bauble.ts";

/** @covers dSSRtNnPtw-a1 */
describe("Water Resonance Bauble \u2014 resolution", () => {
  proveBanishDrawItem({
    card: waterResonanceBauble,
    abilityId: "dSSRtNnPtw-a1",
    requiredOpponentElement: "WATER",
  });
});
