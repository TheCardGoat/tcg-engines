import { describe, test } from "vite-plus/test";
import { op08Guernica081 } from "../../../../../cards/src/cards/characters/op08-081-guernica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-081 Guernica", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Guernica081);
  });
});
