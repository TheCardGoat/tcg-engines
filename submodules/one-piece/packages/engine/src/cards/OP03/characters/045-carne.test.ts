import { describe, test } from "vite-plus/test";
import { op03Carne045 } from "../../../../../cards/src/cards/characters/op03-045-carne.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-045 Carne", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Carne045);
  });
});
