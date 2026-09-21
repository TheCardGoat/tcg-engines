import { describe, test } from "vite-plus/test";
import { op08Namule050 } from "../../../../../cards/src/cards/characters/op08-050-namule.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-050 Namule", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Namule050);
  });
});
