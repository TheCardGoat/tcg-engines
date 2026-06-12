import { describe, test } from "vite-plus/test";
import { op13Inazuma005 } from "../../../../../cards/src/cards/OP13/characters/005-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-005 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Inazuma005);
  });
});
