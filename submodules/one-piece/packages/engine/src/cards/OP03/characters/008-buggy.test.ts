import { describe, test } from "vite-plus/test";
import { op03Buggy008 } from "../../../../../cards/src/cards/OP03/characters/008-buggy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-008 Buggy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Buggy008);
  });
});
