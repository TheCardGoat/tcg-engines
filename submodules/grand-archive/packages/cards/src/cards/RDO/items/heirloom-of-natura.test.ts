import { describe } from "vitest";
import { heirloomOfNatura } from "./heirloom-of-natura.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers drIdaGpPJ2-a2 */
describe("heirloomOfNatura — banish to draw", () => {
  proveBanishItemDraw({
    card: heirloomOfNatura,
    abilityId: "drIdaGpPJ2-a2",
    cost: 3,
    destination: "memory",
  });
});
