import { describe, test } from "vite-plus/test";
import { op01Gordon011 } from "../../../../../cards/src/cards/OP01/characters/011-gordon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-011 Gordon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Gordon011);
  });
});
