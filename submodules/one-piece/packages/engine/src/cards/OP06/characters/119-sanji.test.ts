import { describe, test } from "vite-plus/test";
import { op06Sanji119 } from "../../../../../cards/src/cards/characters/op06-119-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-119 Sanji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sanji119);
  });
});
