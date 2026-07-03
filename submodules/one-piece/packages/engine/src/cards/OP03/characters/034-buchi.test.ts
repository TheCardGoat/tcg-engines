import { describe, test } from "vite-plus/test";
import { op03Buchi034 } from "../../../../../cards/src/cards/OP03/characters/034-buchi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-034 Buchi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Buchi034);
  });
});
