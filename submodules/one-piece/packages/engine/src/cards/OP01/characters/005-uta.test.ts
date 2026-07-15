import { describe, test } from "vite-plus/test";
import { op01Uta005 } from "../../../../../cards/src/cards/OP01/characters/005-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-005 Uta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Uta005);
  });
});
