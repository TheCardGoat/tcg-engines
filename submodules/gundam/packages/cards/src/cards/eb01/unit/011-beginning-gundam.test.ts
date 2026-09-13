import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01BeginningGundam011 } from "./011-beginning-gundam.ts";

describe("Beginning Gundam (EB01-011)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(eb01BeginningGundam011);
  });
});
