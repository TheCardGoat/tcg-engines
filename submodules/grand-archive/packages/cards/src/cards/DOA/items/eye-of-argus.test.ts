import { describe } from "vitest";
import { eyeOfArgus } from "./eye-of-argus.ts";
import { proveTrueSightItem } from "../../../testing/true-sight-item.ts";
/** @covers iiZtKTulPg-a1 */
describe("eye-of-argus temporary true sight", () => {
  proveTrueSightItem({
    card: eyeOfArgus,
    abilityId: "iiZtKTulPg-a1",
    powerBonus: 0,
    draw: true,
    animalOnly: false,
  });
});
