import { describe, test } from "vite-plus/test";
import { op03Jerry084 } from "../../../../../cards/src/cards/OP03/characters/084-jerry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-084 Jerry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Jerry084);
  });
});
