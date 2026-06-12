import { describe, test } from "vite-plus/test";
import { eb03Ulti039 } from "../../../../../cards/src/cards/EB03/characters/039-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-039 Ulti", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Ulti039);
  });
});
