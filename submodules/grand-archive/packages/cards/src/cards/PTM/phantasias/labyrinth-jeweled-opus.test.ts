import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { labyrinthJeweledOpus } from "./labyrinth-jeweled-opus.ts";

/** @covers A58xZJJMz6-a1 */
describe("Labyrinth, Jeweled Opus — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: labyrinthJeweledOpus, discount: 3 });
});
