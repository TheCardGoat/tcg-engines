import { describe } from "vitest";
import { heirloomOfLibra } from "./heirloom-of-libra.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers MRiM1fnOWC-a2 */
describe("heirloomOfLibra — banish to draw", () => {
  proveBanishItemDraw({
    card: heirloomOfLibra,
    abilityId: "MRiM1fnOWC-a2",
    cost: 3,
    destination: "memory",
  });
});
