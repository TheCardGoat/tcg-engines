import { describe } from "vitest";
import { heirloomOfSpectra } from "./heirloom-of-spectra.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers 0sVdvpQKXq-a2 */
describe("heirloomOfSpectra — banish to draw", () => {
  proveBanishItemDraw({
    card: heirloomOfSpectra,
    abilityId: "0sVdvpQKXq-a2",
    cost: 3,
    destination: "memory",
  });
});
