import { describe, test } from "vite-plus/test";
import { op08Sweetpea048 } from "../../../../../cards/src/cards/OP08/characters/048-sweetpea.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-048 Sweetpea", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Sweetpea048);
  });
});
