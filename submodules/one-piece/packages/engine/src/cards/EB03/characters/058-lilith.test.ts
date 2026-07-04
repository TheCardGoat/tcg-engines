import { describe, test } from "vite-plus/test";
import { eb03Lilith058 } from "../../../../../cards/src/cards/EB03/characters/058-lilith.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-058 Lilith", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Lilith058);
  });
});
