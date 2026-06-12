import { describe, test } from "vite-plus/test";
import { eb03BoaHancock026 } from "../../../../../cards/src/cards/EB03/characters/026-boa-hancock.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-026 Boa Hancock", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03BoaHancock026);
  });
});
