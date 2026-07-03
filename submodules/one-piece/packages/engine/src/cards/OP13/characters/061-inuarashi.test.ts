import { describe, test } from "vite-plus/test";
import { op13Inuarashi061 } from "../../../../../cards/src/cards/OP13/characters/061-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-061 Inuarashi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Inuarashi061);
  });
});
