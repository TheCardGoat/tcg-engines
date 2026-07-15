import { describe, test } from "vite-plus/test";
import { eb03Sugar005 } from "../../../../../cards/src/cards/EB03/characters/005-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-005 Sugar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Sugar005);
  });
});
