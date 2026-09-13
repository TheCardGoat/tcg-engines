import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05GunEz013 } from "./013-gun-ez.ts";

describe("Gun EZ (GD05-013)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(gd05GunEz013);
  });
});
