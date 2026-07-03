import { describe, test } from "vite-plus/test";
import { eb03Rebecca048 } from "../../../../../cards/src/cards/EB03/characters/048-rebecca.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-048 Rebecca", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Rebecca048);
  });
});
