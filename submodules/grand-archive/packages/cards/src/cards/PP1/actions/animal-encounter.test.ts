import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { animalEncounter } from "./animal-encounter.ts";

/** @covers TULjDAgAQB-a1 */
describe("Animal Encounter — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: animalEncounter, discount: 1 });
});
