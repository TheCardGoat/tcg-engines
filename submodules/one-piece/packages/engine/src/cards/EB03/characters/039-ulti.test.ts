import { describe, test } from "vite-plus/test";
import { eb03Ulti039 } from "../../../../../cards/src/cards/characters/eb03-039-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-039 Ulti", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Ulti039);
  });
});
