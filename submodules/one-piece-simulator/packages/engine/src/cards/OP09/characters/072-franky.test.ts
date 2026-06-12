import { describe, test } from "vite-plus/test";
import { op09Franky072 } from "../../../../../cards/src/cards/OP09/characters/072-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-072 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Franky072);
  });
});
