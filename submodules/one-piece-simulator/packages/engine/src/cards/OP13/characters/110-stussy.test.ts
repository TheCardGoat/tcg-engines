import { describe, test } from "vite-plus/test";
import { op13Stussy110 } from "../../../../../cards/src/cards/OP13/characters/110-stussy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-110 Stussy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Stussy110);
  });
});
