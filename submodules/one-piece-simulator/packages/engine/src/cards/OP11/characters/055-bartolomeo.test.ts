import { describe, test } from "vite-plus/test";
import { op11Bartolomeo055 } from "../../../../../cards/src/cards/OP11/characters/055-bartolomeo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-055 Bartolomeo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Bartolomeo055);
  });
});
