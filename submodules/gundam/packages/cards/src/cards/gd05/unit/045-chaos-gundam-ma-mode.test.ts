import { describe, it } from "vite-plus/test";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05ChaosGundamMaMode045 } from "./045-chaos-gundam-ma-mode.ts";

describe("Chaos Gundam (MA Mode) (GD05-045)", () => {
  it("<Breach 3> deals exactly 3 damage after destroying an enemy Unit in battle", () => {
    expectBreachAbility(gd05ChaosGundamMaMode045, 3);
  });
});
