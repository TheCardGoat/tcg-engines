import { describe, test } from "vite-plus/test";
import { op01Gordon011 } from "../../../../../cards/src/cards/characters/op01-011-gordon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-011 Gordon", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Gordon011);
  });
});
