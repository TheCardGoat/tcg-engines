import { describe, it } from "vite-plus/test";
import { expectSupportAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05AbyssGundam040 } from "./040-abyss-gundam.ts";

describe("Abyss Gundam (GD05-040)", () => {
  it("<Support 2> rests this Unit and gives another friendly Unit AP+2", () => {
    expectSupportAbility(gd05AbyssGundam040, 2);
  });
});
