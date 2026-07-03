import { describe, test } from "vite-plus/test";
import { op05LieutenantSpacey107 } from "../../../../../cards/src/cards/OP05/characters/107-lieutenant-spacey.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-107 Lieutenant Spacey", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05LieutenantSpacey107);
  });
});
