import { describe, test } from "vite-plus/test";
import { op03Sanji102 } from "../../../../../cards/src/cards/OP03/characters/102-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-102 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Sanji102);
  });
});
