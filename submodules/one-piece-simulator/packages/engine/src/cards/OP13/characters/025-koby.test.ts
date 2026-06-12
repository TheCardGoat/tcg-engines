import { describe, test } from "vite-plus/test";
import { op13Koby025 } from "../../../../../cards/src/cards/OP13/characters/025-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-025 Koby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Koby025);
  });
});
