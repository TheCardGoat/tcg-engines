import { describe, test } from "vite-plus/test";
import { eb03CharlotteBrulee033 } from "../../../../../cards/src/cards/EB03/characters/033-charlotte-brulee.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-033 Charlotte Brulee", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlotteBrulee033);
  });
});
