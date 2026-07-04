import { describe, test } from "vite-plus/test";
import { op09Crocodile025 } from "../../../../../cards/src/cards/OP09/characters/025-crocodile.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-025 Crocodile", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Crocodile025);
  });
});
