import { proveSacrificeLevel } from "../../../testing/sacrifice-level.ts";
import { describe } from "vitest";
import { crystalOfEmpowerment } from "./crystal-of-empowerment.ts";

/** @covers dmfoA7jOjy-a1 */
describe("Crystal of Empowerment \u2014 resolution", () => {
  proveSacrificeLevel({ card: crystalOfEmpowerment, abilityId: "dmfoA7jOjy-a1", amount: 2 });
});
