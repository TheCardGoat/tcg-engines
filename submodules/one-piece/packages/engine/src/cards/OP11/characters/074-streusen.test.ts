import { describe, test } from "vite-plus/test";
import { op11Streusen074 } from "../../../../../cards/src/cards/OP11/characters/074-streusen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-074 Streusen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Streusen074);
  });
});
