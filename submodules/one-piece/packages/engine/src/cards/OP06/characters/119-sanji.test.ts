import { describe, test } from "vite-plus/test";
import { op06Sanji119 } from "../../../../../cards/src/cards/OP06/characters/119-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-119 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sanji119);
  });
});
