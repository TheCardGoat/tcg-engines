import { describe, test } from "vite-plus/test";
import { op05TohToh009 } from "../../../../../cards/src/cards/OP05/characters/009-toh-toh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-009 Toh-Toh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05TohToh009);
  });
});
