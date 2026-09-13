import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { st10GrazeDuelType009 } from "./009-graze-duel-type.ts";

describe("Graze Duel Type (ST10-009)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(st10GrazeDuelType009);
  });
});
