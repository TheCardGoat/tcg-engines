import { describe, test } from "vite-plus/test";
import { op13Lilith113 } from "../../../../../cards/src/cards/OP13/characters/113-lilith.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-113 Lilith", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Lilith113);
  });
});
