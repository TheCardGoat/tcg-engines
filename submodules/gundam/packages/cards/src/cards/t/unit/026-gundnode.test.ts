import { describe, it } from "vite-plus/test";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { tGundnode026 } from "./026-gundnode.ts";

describe("Gundnode (T-026)", () => {
  it("<Breach 1> deals exactly 1 damage after destroying an enemy Unit in battle", () => {
    expectBreachAbility(tGundnode026, 1);
  });
});
