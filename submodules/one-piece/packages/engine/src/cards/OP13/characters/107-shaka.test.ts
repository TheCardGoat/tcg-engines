import { describe, test } from "vite-plus/test";
import { op13Shaka107 } from "../../../../../cards/src/cards/OP13/characters/107-shaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-107 Shaka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Shaka107);
  });
});
