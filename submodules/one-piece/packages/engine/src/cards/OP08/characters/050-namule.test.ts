import { describe, test } from "vite-plus/test";
import { op08Namule050 } from "../../../../../cards/src/cards/OP08/characters/050-namule.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-050 Namule", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Namule050);
  });
});
