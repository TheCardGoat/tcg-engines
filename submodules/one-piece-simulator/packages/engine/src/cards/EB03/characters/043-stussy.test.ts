import { describe, test } from "vite-plus/test";
import { eb03Stussy043 } from "../../../../../cards/src/cards/EB03/characters/043-stussy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-043 Stussy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Stussy043);
  });
});
