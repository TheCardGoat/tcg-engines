import { describe } from "vitest";
import { orbitingCosmos } from "./orbiting-cosmos.ts";
import { proveBanishItemDraw } from "../../../testing/banish-item-draw.ts";
/** @covers qM9yzxQbfF-a2 */
describe("orbitingCosmos — banish to draw", () => {
  proveBanishItemDraw({
    card: orbitingCosmos,
    abilityId: "qM9yzxQbfF-a2",
    cost: 3,
    destination: "memory",
  });
});
