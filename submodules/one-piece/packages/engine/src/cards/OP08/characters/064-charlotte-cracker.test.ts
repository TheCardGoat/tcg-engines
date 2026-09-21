import { describe, test } from "vite-plus/test";
import { op08CharlotteCracker064 } from "../../../../../cards/src/cards/characters/op08-064-charlotte-cracker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-064 Charlotte Cracker", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteCracker064);
  });
});
