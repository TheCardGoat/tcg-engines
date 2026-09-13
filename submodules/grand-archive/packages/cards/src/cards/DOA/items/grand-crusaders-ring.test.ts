import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe } from "vitest";
import { grandCrusadersRing } from "./grand-crusaders-ring.ts";

/** @covers 2gv7DC0KID-a2 */
describe("Grand Crusader's Ring \u2014 resolution", () => {
  proveBanishDrawItem({ card: grandCrusadersRing, abilityId: "2gv7DC0KID-a2" });
});
