import { describe, test } from "vite-plus/test";
import { op08Shishilian025 } from "../../../../../cards/src/cards/characters/op08-025-shishilian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-025 Shishilian", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Shishilian025);
  });
});
