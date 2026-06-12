import { describe, test } from "vite-plus/test";
import { op13Shanks065 } from "../../../../../cards/src/cards/OP13/characters/065-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-065 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Shanks065);
  });
});
