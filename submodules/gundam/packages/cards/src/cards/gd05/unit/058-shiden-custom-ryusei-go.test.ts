import { describe, it } from "vite-plus/test";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05ShidenCustomRyuseiGo058 } from "./058-shiden-custom-ryusei-go.ts";

describe("Shiden Custom (Ryusei-Go) (GD05-058)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(gd05ShidenCustomRyuseiGo058);
  });
});
