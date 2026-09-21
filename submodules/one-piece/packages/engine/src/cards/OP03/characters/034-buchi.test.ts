import { describe, test } from "vite-plus/test";
import { op03Buchi034 } from "../../../../../cards/src/cards/characters/op03-034-buchi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-034 Buchi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Buchi034);
  });
});
