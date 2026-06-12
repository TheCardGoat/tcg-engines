import { describe, test } from "vite-plus/test";
import { op09HowlingGab006 } from "../../../../../cards/src/cards/OP09/characters/006-howling-gab.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-006 Howling Gab", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09HowlingGab006);
  });
});
