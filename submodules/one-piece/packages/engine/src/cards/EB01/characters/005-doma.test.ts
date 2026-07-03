import { describe, test } from "vite-plus/test";
import { eb01Doma005 } from "../../../../../cards/src/cards/EB01/characters/005-doma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-005 Doma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Doma005);
  });
});
