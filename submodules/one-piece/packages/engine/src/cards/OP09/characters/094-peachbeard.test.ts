import { describe, test } from "vite-plus/test";
import { op09Peachbeard094 } from "../../../../../cards/src/cards/characters/op09-094-peachbeard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-094 Peachbeard", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Peachbeard094);
  });
});
