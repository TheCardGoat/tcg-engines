import { describe, test } from "vite-plus/test";
import { op14eb04PentaChromaticString077 } from "../../../../../cards/src/cards/OP14EB04/events/077-penta-chromatic-string.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-077 Penta-Chromatic String", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PentaChromaticString077);
  });
});
