import { describe, test } from "vite-plus/test";
import { op03Streusen115 } from "../../../../../cards/src/cards/OP03/characters/115-streusen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-115 Streusen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Streusen115);
  });
});
