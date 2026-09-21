import { describe, test } from "vite-plus/test";
import { op09HowlingGab006 } from "../../../../../cards/src/cards/characters/op09-006-howling-gab.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-006 Howling Gab", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09HowlingGab006);
  });
});
