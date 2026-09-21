import { describe, test } from "vite-plus/test";
import { op01Nekomamushi048 } from "../../../../../cards/src/cards/characters/op01-048-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-048 Nekomamushi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Nekomamushi048);
  });
});
