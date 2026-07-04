import { describe, test } from "vite-plus/test";
import { op09Crocodile046 } from "../../../../../cards/src/cards/OP09/characters/046-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-046 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Crocodile046);
  });
});
