import { describe, test } from "vite-plus/test";
import { op14eb04PentaChromaticString077 } from "../../../../../cards/src/cards/events/op14-077-penta-chromatic-string.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-077 Penta-Chromatic String", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PentaChromaticString077);
  });
});
