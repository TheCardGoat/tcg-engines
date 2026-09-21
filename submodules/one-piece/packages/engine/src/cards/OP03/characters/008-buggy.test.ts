import { describe, test } from "vite-plus/test";
import { op03Buggy008 } from "../../../../../cards/src/cards/characters/op03-008-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-008 Buggy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Buggy008);
  });
});
