import { describe, test } from "vite-plus/test";
import { op08Guernica081 } from "../../../../../cards/src/cards/OP08/characters/081-guernica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-081 Guernica", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Guernica081);
  });
});
