import { describe, test } from "vite-plus/test";
import { op03Kingbaum100 } from "../../../../../cards/src/cards/OP03/characters/100-kingbaum.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-100 Kingbaum", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kingbaum100);
  });
});
