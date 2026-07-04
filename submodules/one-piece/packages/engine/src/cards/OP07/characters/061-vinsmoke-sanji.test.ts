import { describe, test } from "vite-plus/test";
import { op07VinsmokeSanji061 } from "../../../../../cards/src/cards/OP07/characters/061-vinsmoke-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-061 Vinsmoke Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07VinsmokeSanji061);
  });
});
