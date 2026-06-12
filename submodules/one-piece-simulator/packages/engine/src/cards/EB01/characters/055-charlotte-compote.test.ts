import { describe, test } from "vite-plus/test";
import { eb01CharlotteCompote055 } from "../../../../../cards/src/cards/EB01/characters/055-charlotte-compote.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-055 Charlotte Compote", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01CharlotteCompote055);
  });
});
