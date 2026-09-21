import { describe, test } from "vite-plus/test";
import { op08Ulti078 } from "../../../../../cards/src/cards/characters/op08-078-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-078 Ulti", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Ulti078);
  });
});
