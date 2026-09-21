import { describe, test } from "vite-plus/test";
import { op03Sogeking122 } from "../../../../../cards/src/cards/characters/op03-122-sogeking.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-122 Sogeking", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Sogeking122);
  });
});
