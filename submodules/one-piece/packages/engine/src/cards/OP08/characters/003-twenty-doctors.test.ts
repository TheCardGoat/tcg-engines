import { describe, test } from "vite-plus/test";
import { op08TwentyDoctors003 } from "../../../../../cards/src/cards/characters/op08-003-twenty-doctors.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-003 Twenty Doctors", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TwentyDoctors003);
  });
});
