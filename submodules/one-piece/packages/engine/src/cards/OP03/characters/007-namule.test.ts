import { describe, test } from "vite-plus/test";
import { op03Namule007 } from "../../../../../cards/src/cards/OP03/characters/007-namule.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-007 Namule", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Namule007);
  });
});
