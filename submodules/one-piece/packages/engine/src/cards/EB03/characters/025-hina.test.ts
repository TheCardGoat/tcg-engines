import { describe, test } from "vite-plus/test";
import { eb03Hina025 } from "../../../../../cards/src/cards/characters/eb03-025-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-025 Hina", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Hina025);
  });
});
