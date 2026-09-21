import { describe, test } from "vite-plus/test";
import { op01Penguin050 } from "../../../../../cards/src/cards/characters/op01-050-penguin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-050 Penguin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Penguin050);
  });
});
