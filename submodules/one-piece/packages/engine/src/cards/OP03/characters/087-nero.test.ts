import { describe, test } from "vite-plus/test";
import { op03Nero087 } from "../../../../../cards/src/cards/OP03/characters/087-nero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-087 Nero", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Nero087);
  });
});
