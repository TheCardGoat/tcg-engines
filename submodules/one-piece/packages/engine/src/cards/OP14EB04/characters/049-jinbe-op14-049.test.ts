import { describe, test } from "vite-plus/test";
import { op14eb04JinbeOp14049049 } from "../../../../../cards/src/cards/OP14EB04/characters/049-jinbe-op14-049.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-049 Jinbe - OP14-049", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04JinbeOp14049049);
  });
});
