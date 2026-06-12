import { describe, test } from "vite-plus/test";
import { op03Haruta009 } from "../../../../../cards/src/cards/OP03/characters/009-haruta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-009 Haruta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Haruta009);
  });
});
