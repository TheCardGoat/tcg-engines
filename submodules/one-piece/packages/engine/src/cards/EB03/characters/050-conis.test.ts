import { describe, test } from "vite-plus/test";
import { eb03Conis050 } from "../../../../../cards/src/cards/EB03/characters/050-conis.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-050 Conis", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Conis050);
  });
});
