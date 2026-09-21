import { describe, test } from "vite-plus/test";
import { op03Jerry084 } from "../../../../../cards/src/cards/characters/op03-084-jerry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-084 Jerry", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Jerry084);
  });
});
