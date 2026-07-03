import { describe, test } from "vite-plus/test";
import { op13Makino015 } from "../../../../../cards/src/cards/OP13/characters/015-makino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-015 Makino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Makino015);
  });
});
