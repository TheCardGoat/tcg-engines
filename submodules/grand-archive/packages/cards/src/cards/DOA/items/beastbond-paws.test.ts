import { describe } from "vitest";
import { beastbondPaws } from "./beastbond-paws.ts";
import { proveTrueSightItem } from "../../../testing/true-sight-item.ts";
/** @covers F1t18omUlx-a1 */
describe("beastbond-paws temporary true sight", () => {
  proveTrueSightItem({
    card: beastbondPaws,
    abilityId: "F1t18omUlx-a1",
    powerBonus: 1,
    draw: false,
    animalOnly: true,
  });
});
