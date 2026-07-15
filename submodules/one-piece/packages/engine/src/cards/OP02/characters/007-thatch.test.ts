import { describe, test } from "vite-plus/test";
import { op02Thatch007 } from "../../../../../cards/src/cards/OP02/characters/007-thatch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-007 Thatch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Thatch007);
  });
});
