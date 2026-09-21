import { describe, test } from "vite-plus/test";
import { op01King096 } from "../../../../../cards/src/cards/characters/op01-096-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-096 King", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01King096);
  });
});
