import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01SGundam048 } from "./048-s-gundam.ts";

describe("S Gundam (EB01-048)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(eb01SGundam048);
  });
});
