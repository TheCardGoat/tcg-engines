import { describe, test } from "vite-plus/test";
import { op07Joseph092 } from "../../../../../cards/src/cards/OP07/characters/092-joseph.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-092 Joseph", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Joseph092);
  });
});
