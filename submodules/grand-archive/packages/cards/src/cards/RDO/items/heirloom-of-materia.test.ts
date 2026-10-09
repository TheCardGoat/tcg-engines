import { describe } from "vitest";
import { heirloomOfMateria } from "./heirloom-of-materia.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers sZlDgmVTD7-a2 */
describe("heirloomOfMateria — banish to draw", () => {
  proveBanishItemDraw({
    card: heirloomOfMateria,
    abilityId: "sZlDgmVTD7-a2",
    cost: 3,
    destination: "memory",
  });
});
