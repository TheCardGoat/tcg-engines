import { describe, test } from "vite-plus/test";
import { op10VinsmokeSanji063 } from "../../../../../cards/src/cards/OP10/characters/063-vinsmoke-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-063 Vinsmoke Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10VinsmokeSanji063);
  });
});
